<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH.'/helpers/RequestHeader.php';
require APPPATH.'/libraries/REST_Controller.php';

class Login extends REST_Controller {
	public function __construct() {
		parent::__construct();   
		$this->load->model('Login_model');
		/*cache control*/
		$this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
		$this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
		$this->output->set_header('Pragma: no-cache');
		$this->output->set_header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
	}

   public function verify_user_post(){
	    global $inputs;
		$this->load->helper('url');
		$result = $this->Login_model->login($inputs['email'], $inputs['password']);
		if($result){
			$tokenData = array();
			$tokenData['id'] = '{"id":'.$result['id'].',"user_name":'.$result['user_name'].', "user_type":'.$result['user_type'].'}';
			$tokenData['timestamp'] = now();
				
			$return['data'] = $result;
			$return['token'] = base64_encode(AUTHORIZATION::generateToken($tokenData));                         
            //Insert Token and expire time in Table
			$time_out = $this->config->item('token_timeout');
            $expired_at = date('Y-m-d H:i:s', strtotime('+'.$time_out.'minutes'));
            $created_at = date('Y-m-d H:i:s');
			
			$data = array(
			'dealer_id' =>  $result['id'],
			'token'     =>  $return['token'],
			'expired_at' => $expired_at,
			'created_at' => date('Y-m-d H:i:s'),
			'updated_at' => date('Y-m-d H:i:s')
		    ); 
			
			$tokenResult = $this->Login_model->addtoken($data);	

			
			$return['expired_at'] = $expired_at;
			$return['created_at'] = $created_at;
			$return['time_out'] = $time_out;
			$return['expire_seconds'] = $this->getDiffSeconds($created_at,$expired_at) * 1000;
			$return['expire_session'] = 0;
			$return['success'] = true;
			$return['msg'] = "Your logged in Successfully..!";
			$return['data']['tokenid'] = $tokenResult;
		
			return $this->set_response($return, REST_Controller::HTTP_OK);	
		}else{
			$return['success'] = false;
			$return['msg'] = "Login Failed.. Please check your details !!!";
		}			
		
		$this->set_response($return, REST_Controller::HTTP_UNAUTHORIZED);	
		
   }
   
	public function getDiffSeconds($start, $end){
		$timeFirst  = strtotime($start);
		$timeSecond = strtotime($end);
		return $timeSecond - $timeFirst;		
	}
   public function logout_post(){
		global $inputs;
		$id = $inputs['user'];
		$result = $this->Login_model->logout($id);
		$return['success'] = true;
		$return['msg'] = "Your logout in Successfully..!";
		$res = $this->Login_model->expire_token($inputs);
		echo json_encode($return);		
   }
  
   
   public function change_password_post(){
		global $inputs;
		$this->_validate();	
        $result = $this->Login_model->update($inputs['user_id'], $inputs['newpassword']);		
		if($result == true){
			$return['success'] = true;
			$return['msg'] = "Password updated successfully";
		}else{
			$return['success'] = false;
			$return['msg'] = "Please try again!";			
		}
		echo json_encode($return);		

   }
   
   public function expire_data_req_post(){ 
     global $inputs;
	 $user_data = $inputs[0]['exp_data']['user'];
	 $token = $inputs[0]['token'];
	 
	 $time_out = $this->config->item('token_timeout');
     $expired_at = date('Y-m-d H:i:s', strtotime('+'.$time_out.'minutes'));
	 
	 $data = array(
			'expired_at' => $expired_at,
			'created_at' => date('Y-m-d H:i:s'),
			'updated_at' => date('Y-m-d H:i:s')
		    ); 
	  
	  $result = $this->Login_model->update_token_time($user_data['tokenid'],$data);	
	  if($result == true) {
		  
	   $get_date = $this->Login_model->get_token_time($user_data['tokenid']);	   
       $return['success'] = true;			
       $return['expired_at'] = $get_date['expired_at'];			
       $return['created_at'] = $get_date['created_at'];	
	   $return['expire_seconds'] = $this->getDiffSeconds($get_date['created_at'],$get_date['expired_at']) * 1000;
	   $return['msg'] = "Time extends";	
	  } 		  
	 echo json_encode($return);					
   }
   
  
	private function _validate()
	{
		global $inputs;
		$return = array();
		$return['success'] = TRUE;
		$return['msg'] = 'All Field are mandatory!';
		$return['err'] = array();
		
		if($inputs['oldpassword'] == '')
		{
			$return['success'] = FALSE;
			$return['err']['oldpassword'] = 'Old Password is required';
		}

		if($inputs['oldpassword'] != '')
		{
			if($this->Login_model->oldpasswordVerify($inputs['user_id'], $inputs['oldpassword']) == false){
				$return['success'] = FALSE;
				$return['err']['oldpassword'] = 'The old password you have entered is incorrect!';
			}
		}		
		
		if($inputs['newpassword'] == '')
		{
			$return['success'] = FALSE;
			$return['err']['newpassword'] = 'New Password is required';
		}
		
		if($inputs['newpassword'] != '' && strlen($inputs['newpassword']) < 8){
	
			$return['success'] = FALSE;
			$return['err']['newpassword'] = 'New Password must contain at least eight characters!';				
						
		}

		if($return['success'] === FALSE)
		{
			echo json_encode($return);
			exit();
		}
		
	} 	
}

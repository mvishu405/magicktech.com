<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH.'/helpers/RequestHeader.php';
class Dealer extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('dealer_model');
		$this->load->model('login_model');
		$this->load->helper(array('form', 'url'));
	}

	public function lists()
	{		
		$this->login_model->checktoken();
		$result = $this->dealer_model->get_lists();
		if($result == false) {
			$return['success'] = false;
			$return['msg'] = "Failed to load a data!.";
		}else {
			$return['success'] = true;
			$return['msg'] = "Customers loaded successfully";
			$return['data'] = $result;
		}
		echo json_encode($return);		
	}

	public function add()
	{
		global $inputs;	
		$this->login_model->checktoken();
		$this->_validate();	
		$userType = 'D';
		if(!empty($inputs['user_type'])){
			$userType = $inputs['user_type'];
		}	
		$label = strtoupper(substr($inputs['city'], 0, 3).'_'.$inputs['label']);
		$data = array(
			'user_name' => $inputs['user_name'],
			'phone' => $inputs['phone'],
			'email' => $inputs['email'],
			'logo' => $inputs['logo'],
			'password' => $inputs['password'],
			'address' => $inputs['address'],
			'state' => $inputs['state'],
			'city' => $inputs['city'],
			'label' => $label,
			'user_type' => $userType
		);

		$result = $this->dealer_model->add($data);
		if($result == true){
			$return['success'] = true;
			$return['msg'] = "Dealer added successfully";
		}

		echo json_encode($return);        
	}

	public function get($id)
	{	
		$this->login_model->checktoken();
		$result = $this->dealer_model->get_by_id($id);
		if($result == false){
			$return['success'] = false;
			$return['msg'] = "Dealer not found!";				
		}else{
			$return['success'] = true;
			$return['msg'] = "Dealer found!";
			$return['data'] = $result;
		}		
		echo json_encode($return);
	}

	public function update()
	{
		global $inputs;	
		$this->login_model->checktoken();
         $config['upload_path']   = './upload'; 
         $config['allowed_types'] = 'gif|jpg|png'; 
         $config['max_size']      = 100; 
         $config['max_width']     = 1024; 
         $config['max_height']    = 768;  
         $this->load->library('upload', $config);
			
         if ( ! $this->upload->do_upload($inputs['logo'])) {
            $error = array('error' => $this->upload->display_errors());  
         } 	
		
		
		$this->_validate();
        $userType = 'D';
		if(!empty($inputs['user_type'])){
			$userType = $inputs['user_type'];
		}		
		$data = array(
			'user_name' => $inputs['user_name'],
			//'logo' => $inputs['logo'],
			'password' => $inputs['password'],
			'address' => $inputs['address'],
			'state' => $inputs['state'],
			'city' => $inputs['city'],			
			'user_type' => $userType
		);

		if($this->dealer_model->checkDuplicateEntry('id', $inputs['id']) == false){
			$result = $this->dealer_model->update(array('id' => $inputs['id']), $data);
			$return['success'] = true;
			$return['msg'] = "Dealer updated successfully";			
		}else{
			$return['success'] = false;
			$return['msg'] = "Dealer not exist!";			
		}
				
		echo json_encode($return);		
	}

	public function delete($id)
	{
		$this->login_model->checktoken();
		$result = $this->dealer_model->delete($id);
		if($result == true){
			$return['success'] = true;
			$return['msg'] = "Dealer deleted successfully";
		}else{
			$return['success'] = false;
			$return['msg'] = "Dealer not exist!";			
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

		if($inputs['user_name'] == '')
		{
			$return['success'] = FALSE;
			$return['err']['user_name'] = 'User Name is required';
		}

		if(isset($inputs['label'])){
			
			if($inputs['label'] == '')
			{
				$return['success'] = FALSE;
				$return['err']['label'] = 'Label is required';
			}else if (strlen($inputs['label']) != 3 || strlen($inputs['label']) > 3) 
			{
				$return['success'] = FALSE;
				$return['err']['label'] = 'Invalid label format(Only accepted 3 character!) ';
			}
		}
		if(isset($inputs['email'])){
			
			if($inputs['email'] == '')
			{
				$return['success'] = FALSE;
				$return['err']['email'] = 'Email is required';
			}else if (!filter_var($inputs['email'], FILTER_VALIDATE_EMAIL)) 
			{
				$return['success'] = FALSE;
				$return['err']['email'] = 'Invalid email format';
			}else if($this->dealer_model->checkDuplicateEntry('email', $inputs['email']) == '')
			{
				$return['success'] = FALSE;
				$return['err']['email'] = 'Email is exist';
			}
		}
		
		if(isset($inputs['phone'])){
			
			if($inputs['phone'] == '')
			{
				$return['success'] = FALSE;
				$return['err']['phone'] = 'Phone is required';		
			}else if($this->dealer_model->checkDuplicateEntry('phone', $inputs['phone']) == '')
			{
				$return['success'] = FALSE;
				$return['err']['phone'] = 'Phone number is exist';
			}
		}
		
		if($inputs['password'] == '')
		{
			$return['success'] = FALSE;
			$return['err']['password'] = 'Password is required';
		}

		if($return['success'] === FALSE)
		{
			echo json_encode($return);
			exit();
		}
		
	}

}

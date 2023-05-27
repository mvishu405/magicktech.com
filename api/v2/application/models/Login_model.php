<?php
class Login_model extends CI_Model{
	var $table = 'dealer_master';
	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}
	
	public function login($email,$password)
	{
		$this->db->select('*');
		$this->db->from($this->table);
		$this->db->where('email',$email);
		$this->db->where('password',$password);
		$this->db->where('status',1);
		$query=$this->db->get();

		$row_count=$query->num_rows();
		
			if($row_count>0){
				$userdata=$query->row();	
				$newdata = array(
					'id'  => $userdata->id,	
					'user_name' => $userdata->user_name,
					'email' => $userdata->email,
					'phone' => $userdata->phone,
					'password' => $userdata->password,
					'state'     => $userdata->state,
					'city'     => $userdata->city,
					'address'     => $userdata->address,
					'user_type'     => $userdata->user_type,
					'last_login'     => $userdata->last_login,
					'logged_in' => 1
					);
				$this->setLoginTime($userdata->id);
				return $newdata;		
			}
	}


	public function logout($id){
		$data['logged_in']= 0;
		$this->db->set('logged_in', 0);
		$this->db->where('id',$id);
		$this->db->update($this->table,$data);
		return $this->db->affected_rows();
	}

	public function setLoginTime($id){
		$data['last_login']=date("Y-m-d H:i:s");

		$data['logged_in']= 1;
		$this->db->where('id',$id);
		$this->db->update($this->table,$data);
	}
	public function oldpasswordVerify($id, $oldpassword){
		$this->db->where('id', $id);
		$this->db->where('password', $oldpassword);
		$query = $this->db->get($this->table);	
		$count_row = $query->num_rows();
		if ($count_row > 0) {
			return TRUE;
		 } else {
			return FALSE;
		 }		
	}

	public function update($where, $newpassword)
	{
		$this->db->set('password', $newpassword);
		$this->db->where('id', $where);
		$this->db->update($this->table);	
		return $this->db->affected_rows();	
		
	}

    public function addtoken($data) 
	{   
	    $table = 'token_authentication';
		$this->db->insert($table, $data);
		return $this->db->insert_id();
	}
	
	public function expire_token($inputs){
		$users_id  = $inputs['user'];
        $token     = $inputs['token'];
		$this->db->where('dealer_id',$users_id)->where('token',$token)->delete('token_authentication');
		return $this->db->affected_rows();
		
	}
	
	public function update_token_time($tokenid,$data) 
	{   
	    $table = 'token_authentication';
		$this->db->where('id', $tokenid);
		$this->db->update($table, $data);
		return $this->db->affected_rows();
	}
	
	public function get_token_time($tokenid) 
	{   
	    $table = 'token_authentication';
		$this->db->select('*');
		$this->db->from($table);
		$this->db->where('id',$tokenid);
		$query=$this->db->get();

		$row_count=$query->num_rows();
		
			if($row_count>0){
				$userdata=$query->row();	
				$newdata = array(
					'dealer_id'  => $userdata->dealer_id,	
					'token'  => $userdata->token,	
					'created_at'  => $userdata->created_at,	
					'expired_at'  => $userdata->expired_at,	
					'updated_at'  => $userdata->updated_at
					);
				return $newdata;		
			}
		
		
	}
	public function checktoken() {
		$authorization = '';
		if(isset($this->input->request_headers()['authorization'])){
			$authorization = $this->input->request_headers()['authorization'];
		}
		if(isset($this->input->request_headers()['Authorization'])){
			$authorization = $this->input->request_headers()['Authorization'];
		}
		
		$this->db->where('token', $authorization);
		$query = $this->db->get('token_authentication');	
		$expire_token = $query->row();
		$count_row = $query->num_rows();	
		$currentDate = strtotime(date("Y-m-d H:i:s"));
		$expiredDate = strtotime($expire_token->expired_at);
			
		if ($count_row > 0 && $currentDate < $expiredDate ) {
			return TRUE;
		 } else {
			$return['success'] = false;
			$return['msg'] = "Bad Request";
			echo json_encode($return);
			die;
		 }	
	
	}
	public function checktoken_download($authorization) {
		
		if($this->session->userdata('token')){
			$authorization = $this->session->userdata('token');
		}		
		
		$this->db->where('token', $authorization);
		$query = $this->db->get('token_authentication');	
		$expire_token = $query->row();
		$count_row = $query->num_rows();	
		$currentDate = strtotime(date("Y-m-d H:i:s"));
		$expiredDate = strtotime($expire_token->expired_at);
			
		if ($count_row > 0 && $currentDate < $expiredDate ) {
			return TRUE;
		 } else {
			$return['success'] = false;
			$return['msg'] = "Bad Request";
			echo json_encode($return);
			die;
		 }	
	
	}	
	
	

}
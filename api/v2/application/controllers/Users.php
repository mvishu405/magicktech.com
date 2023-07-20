<?php


require APPPATH.'/helpers/RequestHeader.php';
class Users extends CI_Controller{
    	public function __construct() {
		parent::__construct();   
		$this->load->model('Users_model');
		$this->load->model('Session_tokens_model');
	}
    
    
    	// Function to authenticate user and generate token
	public function login(){
		// Get the request body of the user containing email and password
		global $inputs;
		$return=array();
		// Check if proper data is received 
		if(isset($inputs['email']) && isset($inputs['password'])){
			// Decrypt the password
			$this->load->library('encryption');
			$password = $this->encryption->decrypt($inputs['password']);
		
			// Check if email and password is correct
			$user = $this->Users_model->login($inputs['email'], $password);
			if($user){
			// Store token in session tokens and return tokens
			$token = $this->Session_tokens_model->store_token($user->id);
			$return['success'] = true;
			$return['msg'] = "User logged in successfully";
			$return['data']['token'] = $token;	
			
			}else{
				$return['success'] = false;
				$return['msg'] = "No User Found";
				
			}

		}else{
			$return['success'] = false;
			$return['msg'] = "Please provide email and password";
		
		}
		
		echo json_encode($return);

	}
}



?>
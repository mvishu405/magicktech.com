<?php


defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH.'/helpers/RequestHeader.php';

class Customers extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('customers_model');
		$this->load->model('login_model');
		$this->load->helper('form');
		$this->load->library('session');
	}
	public function check_token_post(){
	   $return = $this->login_model->checktoken();
	   if($return == true){
			$return = true;
			echo json_encode($return);		   
	   }
	}
	public function lists()
	{		
        global $inputs;
		
		$this->login_model->checktoken();
		
		$result = $this->customers_model->get_lists();
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
		$data = array(
			'name' => $inputs['name'],
			'email' => $inputs['email'],			
			'phone' => $inputs['phone'],
			'alternate_phone' => $inputs['alternate_phone'],
			'state' => $inputs['state'],
			'city' => $inputs['city'],
			'address' => $inputs['address'],
			'comments' => $inputs['comments'],
			'lead_source' => $inputs['lead_source'],
			'dealer_id' => $inputs['dealer_id'],
		);

		$result = $this->customers_model->add($data);
		if($result == true){
			$return['success'] = true;
			$return['msg'] = "Customers added successfully";
		}

		echo json_encode($return);        
	}

	public function get($id)
	{
		global $inputs;
		$this->login_model->checktoken();
		$result = $this->customers_model->get_by_id($id);
		if($result == false){
			$return['success'] = false;
			$return['msg'] = "Customers not found!";				
		}else{
			$return['success'] = true;
			$return['msg'] = "Customers found!";
			$return['data'] = $result;
		}		
		echo json_encode($return);
	}

	public function update()
	{
		global $inputs;	
		$this->login_model->checktoken();
		$this->_validate();
		$data = array(
			'name' => $inputs['name'],
			'alternate_phone' => $inputs['alternate_phone'],
			'state' => $inputs['state'],
			'city' => $inputs['city'],
			'address' => $inputs['address'],
			'comments' => $inputs['comments'],
			'lead_source' => $inputs['lead_source']
		);

		if($this->customers_model->checkDuplicateEntry('id', $inputs['id']) == false){
			$result = $this->customers_model->update(array('id' => $inputs['id']), $data);
			$return['success'] = true;
			$return['msg'] = "Customers updated successfully";			
		}else{
			$return['success'] = false;
			$return['msg'] = "Customers not exist!";			
		}
				
		echo json_encode($return);		
	}

	public function delete($id)
	{
		global $inputs;
		$this->login_model->checktoken();
		$result = $this->customers_model->delete($id);
		if($result == true){
			$return['success'] = true;
			$return['msg'] = "Customers deleted successfully";
		}else{
			$return['success'] = false;
			$return['msg'] = "Customers not exist!";			
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

		if($inputs['name'] == '')
		{
			$return['success'] = FALSE;
			$return['err']['name'] = 'Name is required';
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
			}else if($this->customers_model->checkDuplicateEntry('email', $inputs['email']) == '')
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
			}else if($this->customers_model->checkDuplicateEntry('phone', $inputs['phone']) == '')
			{
				$return['success'] = FALSE;
				$return['err']['phone'] = 'Phone number is exist';
			}
		}
		
		if($return['success'] === FALSE)
		{
			echo json_encode($return);
			exit();
		}
		
	}	

	/* Public function to create customers  */

	public function create()
	{
		global $inputs;
		$this->login_model->checktoken();
		$this->_validate();		
		$data = array(
			'name' => $inputs['name'],
			'email' => $inputs['email'],			
			'phone' => $inputs['phone'],
			'alternate_phone' => $inputs['alternate_phone'],
			'state' => $inputs['state'],
			'city' => $inputs['city'],
			'address' => $inputs['address'],
			'comments' => $inputs['comments'],
			'lead_source' => $inputs['lead_source'],
			'dealer_id' => $inputs['dealer_id'],
			'api_json' =>json_encode(json_decode($inputs['api_json'],true)),
		);

		$result = $this->customers_model->add($data);
		$return = array();
		if($result){
			$return['success'] = true;
			$return['msg'] = "Customer added successfully";
		}

		echo json_encode($return);        
	}

}

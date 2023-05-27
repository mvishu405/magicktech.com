<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH.'/helpers/RequestHeader.php';

class Designer extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('designer_model');
		$this->load->model('login_model');
		$this->load->helper('form');
	}
	
	public function lists()
	{		
		$this->login_model->checktoken();
		$results = $this->designer_model->get_lists();
		foreach($results as $result) {
			$result['name'] = ucwords(strtolower($result['name']));
			$new[] = $result;
		}

		if($result == false) {
			$return['success'] = false;
			$return['msg'] = "Failed to load a data!.";
		}else {
			$return['success'] = true;
			$return['msg'] = "Designer loaded successfully";
			$return['data'] = $new;
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
			'phone' => $inputs['phone']
		);
		$result = $this->designer_model->add($data);

		if($result == true){
			$return['success'] = true;
			$return['msg'] = "Designer added successfully";
		}else{
			$return['success'] = false;
			$return['msg'] = "Designer added failed";
		}

		echo json_encode($return);        
	}

	public function get($id)
	{
		$this->login_model->checktoken();
		$result = $this->designer_model->get_by_id($id);
		if($result == false){
			$return['success'] = false;
			$return['msg'] = "Designer not found!";				
		}else{
			$return['success'] = true;
			$return['msg'] = "Designer found!";
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
			'email' => $inputs['email'],
			'phone' => $inputs['phone']
		);

		if($this->designer_model->checkDuplicateEntry('id', $inputs['id']) == false){
			$result = $this->designer_model->update(array('id' => $inputs['id']), $data);
			$return['success'] = true;
			$return['msg'] = "Designer updated successfully";			
		}else{
			$return['success'] = false;
			$return['msg'] = "Designer not exist!";			
		}
				
		echo json_encode($return);		
	}

	public function delete($id)
	{
		$this->login_model->checktoken();
		$result = $this->designer_model->delete($id);
		if($result == true){
			$return['success'] = true;
			$return['msg'] = "Designer deleted successfully";
		}else{
			$return['success'] = false;
			$return['msg'] = "Designer not exist!";			
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
		if($inputs['email'] == '')
		{
			$return['success'] = FALSE;
			$return['err']['email'] = 'Email is required';
		}
		if($inputs['phone'] == '')
		{
			$return['success'] = FALSE;
			$return['err']['phone'] = 'Phone is required';
		}		
				
		if($return['success'] === FALSE)
		{
			echo json_encode($return);
			exit();
		}
		
	}

}

<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH.'/helpers/RequestHeader.php';

class Accessories extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('accessories_model');
		$this->load->model('login_model');
		$this->load->helper('form');
	}
	
	public function lists()
	{		
		$this->login_model->checktoken();
		$results = $this->accessories_model->get_lists();
		foreach($results as $result) {
			$result['name'] = ucwords(strtolower($result['name']));
			$new[] = $result;
		}

		if($result == false) {
			$return['success'] = false;
			$return['msg'] = "Failed to load a data!.";
		}else {
			$return['success'] = true;
			$return['msg'] = "Accessories loaded successfully";
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
			'code' => $inputs['code'],
			'price' => $inputs['price']
		);
		$result = $this->accessories_model->add($data);

		if($result == true){
			$return['success'] = true;
			$return['msg'] = "Accessories added successfully";
		}else{
			$return['success'] = false;
			$return['msg'] = "Accessories added failed";
		}

		echo json_encode($return);        
	}

	public function get($id)
	{
		$this->login_model->checktoken();
		$result = $this->accessories_model->get_by_id($id);
		if($result == false){
			$return['success'] = false;
			$return['msg'] = "Accessories not found!";				
		}else{
			$return['success'] = true;
			$return['msg'] = "Accessories found!";
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
			'code' => $inputs['code'],
			'price' => $inputs['price']
		);

		if($this->accessories_model->checkDuplicateEntry('id', $inputs['id']) == false){
			$result = $this->accessories_model->update(array('id' => $inputs['id']), $data);
			$return['success'] = true;
			$return['msg'] = "Accessories updated successfully";			
		}else{
			$return['success'] = false;
			$return['msg'] = "Accessories not exist!";			
		}
				
		echo json_encode($return);		
	}

	public function delete($id)
	{
		$this->login_model->checktoken();
		$result = $this->accessories_model->delete($id);
		if($result == true){
			$return['success'] = true;
			$return['msg'] = "Accessories deleted successfully";
		}else{
			$return['success'] = false;
			$return['msg'] = "Accessories not exist!";			
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
		if($inputs['code'] == '')
		{
			$return['success'] = FALSE;
			$return['err']['code'] = 'Code is required';
		}
		if($inputs['price'] == '')
		{
			$return['success'] = FALSE;
			$return['err']['price'] = 'Price is required';
		}		
				
		if($return['success'] === FALSE)
		{
			echo json_encode($return);
			exit();
		}
		
	}

}

<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH.'/helpers/RequestHeader.php';

class Products extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('Products_model');
		$this->load->model('login_model');
		$this->load->helper('form');
	}
	
	public function lists()
	{		
		$this->login_model->checktoken();
		$results = $this->Products_model->get_lists();
		foreach($results as $result) {
			$new[] = $result;
		}

		if($result == false) {
			$return['success'] = false;
			$return['msg'] = "Failed to load a data!.";
		}else {
			$return['success'] = true;
			$return['msg'] = "Data loaded successfully";
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
			'category_id' => $inputs['category_id'],
		);

		$result = $this->Products_model->add($data);
		
		if($result == true){
			$return['success'] = true;
			$return['msg'] = "Data added successfully";
		}else{
			$return['success'] = false;
			$return['msg'] = "Data added failed";
		}

		echo json_encode($return);        
	}

	public function get($id)
	{
		$this->login_model->checktoken();
		$result = $this->Products_model->get_by_id($id);
		if($result == false){
			$return['success'] = false;
			$return['msg'] = "Data not found!";				
		}else{
			$return['success'] = true;
			$return['msg'] = "Data found!";
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
			'category_id' => $inputs['category_id'],
		);

		if($data){
			$result = $this->Products_model->update(array('id' => $inputs['id']), $data);
			$return['success'] = true;
			$return['msg'] = "Data updated successfully";			
		}else{
			$return['success'] = false;
			$return['msg'] = "Data not exist!";			
		}
				
		echo json_encode($return);		
	}

	public function delete($id)
	{
		//update the related category_id status to 0
		$this->login_model->checktoken();
		$result = $this->Products_model->delete($id);
		if($result == true){
			$return['success'] = true;
			$return['msg'] = "Data deleted successfully";
		}else{
			$return['success'] = false;
			$return['msg'] = "Data not exist!";			
		}
		echo json_encode($return);	
	}	

	private function _validate()
	{
		global $inputs;
		$this->login_model->checktoken();
		$return = array();
		$return['success'] = TRUE;
		$return['msg'] = 'All Field are mandatory!';
		$return['err'] = array();

		if($inputs['name'] == '')
		{
			$return['success'] = FALSE;
			$return['err']['name'] = 'Name is required';
		}

		if($inputs['category_id'] == '')
		{
			$return['success'] = FALSE;
			$return['err']['category_id'] = 'Parent Category is required';
		}
	}
}

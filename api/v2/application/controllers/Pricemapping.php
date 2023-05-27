<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH.'/helpers/RequestHeader.php';

class Pricemapping extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('price_mapping_model');
		$this->load->model('codes_model');
		$this->load->model('component_model');
		$this->load->model('login_model');
		$this->load->helper('form');
	}
	
	public function lists()
	{
		global $inputs;
		$param = array(
			'page'=>(int)$inputs['page'],
			'pageSize'=>(int)$inputs['pageSize'],
			'sorted'=>$inputs['sorted'],
			'filtered'=>$inputs['filtered']
		);
		$this->login_model->checktoken();
		$price_lists = $this->price_mapping_model->get_lists_obj($param);
	
		if(count($price_lists) == 0){
			$return['success'] = true;
			$return['msg'] = "No data found!";			
		}else if($price_lists == true) {
			$return['success'] = true;
			$return['msg'] = "Data loaded successfully";
			$return['data'] = $price_lists;
			$return['total_records'] = $this->price_mapping_model->get_total($param);
		}else {
			$return['success'] = false;
			$return['msg'] = "Failed to load a data!.";
		}
		echo json_encode($return);		
	}

	public function add()
	{
		global $inputs;		
		$this->login_model->checktoken();
		$this->_validate();		
		$data = array(
			'code_id' => $inputs['code_id'],
			'component_id' => $inputs['component_id'],
			'cost' => $inputs['cost']
		);
		$result = $this->price_mapping_model->add($data);

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
		$result = $this->price_mapping_model->get_by_id($id);
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
			'code_id' => $inputs['code_id'],
			'component_id' => $inputs['component_id'],
			'cost' => $inputs['cost']
		);

		if($data){
			$result = $this->price_mapping_model->update(array('id' => $inputs['id']), $data);
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
		$this->login_model->checktoken();
		$result = $this->price_mapping_model->delete($id);
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
		$return = array();
		$return['success'] = TRUE;
		$return['msg'] = 'All Field are mandatory!';
		$return['err'] = array();

		if($inputs['code_id'] == '')
		{
			$return['success'] = FALSE;
			$return['err']['code_id'] = 'Code is required';
		}
		if($inputs['component_id'] == '')
		{
			$return['success'] = FALSE;
			$return['err']['component_id'] = 'Component is required';
		}

		if($inputs['cost'] == '')
		{
			$return['success'] = FALSE;
			$return['err']['cost'] = 'Cost is required';
		}		
						
		if($return['success'] === FALSE)
		{
			echo json_encode($return);
			exit();
		}
		
	}

}

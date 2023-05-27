<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH.'/helpers/RequestHeader.php';

class Warranty_order_form extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('warranty_order_form_model');
		$this->load->model('login_model');
		$this->load->helper('form');
	}
	
	public function lists()
	{
		$this->login_model->checktoken();
		$results = $this->warranty_order_form_model->get_lists();
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

	public function sendMail($id)
	{
		if($_SERVER['SERVER_NAME'] == 'localhost'){
			return;
		}		
		$this->load->library('email');

		$config=array(
		'charset'=>'utf-8',
		'wordwrap'=> TRUE,
		'mailtype' => 'html'
		);
		$this->email->initialize($config);
		
		$this->email->set_newline("\r\n");
		$this->email->from('info@magickwoods.com', 'Magickwoods Warranty Order');
		$this->email->to('saravanann@magickwoods.com');
		$this->email->cc('josephr@magickwoods.com');
		$this->email->subject('Magickwoods Warranty Order Request');
		$data = $this->warranty_order_form_model->get_by_id($id);
		$data->cabinetRowData = $this->warranty_order_form_model->cabinet_rows_get_by_id($id);	
		$body = $this->load->view('email/warranty_order_form', $data, true);
		$this->email->message($body); 

		if($this->email->send())
		{
			$ret = 'Email sent.';
		}
		else{
			//show_error($this->email->print_debugger());
			$ret = 'Email not sent.';
		}
		return $ret;
	}

	public function add()
	{
		global $inputs;		
		$this->login_model->checktoken();
		$this->_validate();		
		$data = array(
			'customer_name' => $inputs['customer_name'],
			'customer_address' => $inputs['customer_address'],
			'customer_city' => $inputs['customer_city'],
			'customer_postalcode' => $inputs['customer_postalcode'],
			'customer_email' => $inputs['customer_email'],
			'customer_order' => $inputs['customer_order'],
			'customer_dateoforder' => $inputs['customer_dateoforder'],
			'customer_lowesstore' => $inputs['customer_lowesstore'],
			'customer_doorname' => $inputs['customer_doorname'],
			'customer_detail' => $inputs['customer_detail']
		);
		$result = $this->warranty_order_form_model->add($data);
		$this->insert_cabinet_rows($result);
		if($result == true){
			$return['success'] = true;
			$return['msg'] = "Data added successfully";
			$return['mail_status'] = $this->sendMail($result);
		}else{
			$return['success'] = false;
			$return['msg'] = "Data added failed";
		}

		echo json_encode($return);        
	}

	public function remove_deleted_cabinet_rows($deletelines){
	
		for($i=0;$i<count($deletelines);$i++){
			$id = $deletelines[$i];			
			$this->warranty_order_form_model->delete_by_id($id);
		}
			
	}
	
	public function insert_cabinet_rows($warranty_order_form_id){
		global $inputs;
		$input = $inputs['cabinetRowData'];
		
		for($x=0; $x<count($input); $x++) {
			$row_exist = false;
			if(isset($input[$x]['id'])){
				$row_exist = $this->warranty_order_form_model->checkDuplicateEntryWarrantyLines($input[$x]['id'], $warranty_order_form_id);
			}
			if($warranty_order_form_id != '' && $input[$x]['cabinet_qty'] != ''){
				if($row_exist == false){
					$rows = array(
						'warranty_order_form_id' =>$warranty_order_form_id,
						'cabinet_qty'	  		 =>$input[$x]['cabinet_qty'],					
						'type_of_item'	  		 =>$input[$x]['type_of_item'],					
						'which_item_required'	 =>$input[$x]['which_item_required'],					
						'item_position'	  		 =>$input[$x]['item_position'],					
						'office_use'	  		 =>$input[$x]['office_use']					
					);
					$result = $this->warranty_order_form_model->insert_cabinet_rows($rows);
				}else{
					$rows = array(
						'warranty_order_form_id' =>$warranty_order_form_id,
						'cabinet_qty'	  		 =>$input[$x]['cabinet_qty'],					
						'type_of_item'	  		 =>$input[$x]['type_of_item'],					
						'which_item_required'	 =>$input[$x]['which_item_required'],					
						'item_position'	  		 =>$input[$x]['item_position'],					
						'office_use'	  		 =>$input[$x]['office_use']					
					);
					$result = $this->warranty_order_form_model->update_cabinet_rows($input[$x]['id'], $rows);					
				}				
			}			
		}
		
	}

	public function get($id)
	{
		$this->login_model->checktoken();
		$result = $this->warranty_order_form_model->get_by_id($id);
		$result->cabinetRowData = $this->warranty_order_form_model->cabinet_rows_get_by_id($id);
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
			'customer_name' => $inputs['customer_name'],
			'customer_address' => $inputs['customer_address'],
			'customer_city' => $inputs['customer_city'],
			'customer_postalcode' => $inputs['customer_postalcode'],
			'customer_email' => $inputs['customer_email'],
			'customer_order' => $inputs['customer_order'],
			'customer_dateoforder' => $inputs['customer_dateoforder'],
			'customer_lowesstore' => $inputs['customer_lowesstore'],
			'customer_doorname' => $inputs['customer_doorname'],
			'customer_detail' => $inputs['customer_detail']
		);
		$this->remove_deleted_cabinet_rows($inputs['removedlines']);
		$this->insert_cabinet_rows($inputs['id']);
		if($data){
			$result = $this->warranty_order_form_model->update(array('id' => $inputs['id']), $data);
			$return['success'] = true;
			$return['msg'] = "Data updated successfully";		
			$return['mail_status'] = $this->sendMail($inputs['id']);
		}else{
			$return['success'] = false;
			$return['msg'] = "Data not exist!";			
		}
				
		echo json_encode($return);		
	}

	public function delete($id)
	{
		$this->login_model->checktoken();
		$result = $this->warranty_order_form_model->delete($id);
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

 		if($inputs['customer_name'] == '')
		{
			$return['success'] = FALSE;
			$return['err']['customer_name'] = 'Customer name type is required';
		}
		if($inputs['customer_order'] == '')
		{
			$return['success'] = FALSE;
			$return['err']['customer_order'] = 'Customer order name is required';
		}
						
		if($return['success'] === FALSE)
		{
			echo json_encode($return);
			exit();
		} 
		
	}

}

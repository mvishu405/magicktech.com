<?php
// error_reporting(E_ALL);
// ini_set('display_errors', 1);
defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH.'/helpers/RequestHeader.php';

class Quotes extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('quotes_model');
		$this->load->model('dealer_model');
		$this->load->model('customers_model');
		$this->load->model('login_model');
		$this->load->helper('form');
	}
	
	public function lists()
	{	
		$this->login_model->checktoken();
		$result = $this->quotes_model->get_lists();		
		if($result == false) {
			$return['success'] = false;
			$return['msg'] = "Failed to load a data!.";
		}else {
			$return['success'] = true;
			$return['msg'] = "Quotes loaded successfully";
			$return['data'] = $result;
		}
		echo json_encode($return);		
	}

	public function api_lists()
	{
		global $inputs;
		$this->login_model->checktoken();
		$discountforuserArr= array("D"=>"dealer", "B"=>"builder", "O"=>"oem", "H"=>"home");
		
		$results = $this->quotes_model->api_get_lists($inputs['dealer_id'], $inputs['user_type']);
		
		
		$new = array();
		foreach($results as $key => $result) {
			$dealer_details = $this->dealer_model->get_by_id($result['dealer_id']);
			$result['discounfortuser'] = '';
			$result['discount'] = '';
			if($result['status'] == 3){
				$tmp = json_decode($result['admin_discount'], true);	
				foreach($tmp as $type=>$discount){
					$result['discounfortuser'] = $type;
					$result['discount'] = $discount;
				}
			}
			
			$result['quote_number'] = $dealer_details['label'].'-'.sprintf('%0' . 4 . 's', $result['quote_id']);
			$year = $this->customers_model->get_by_id($result['customer_id']);
	
			$year = str_replace('/', '-', $year['date_created']);
			$year = date('Y', strtotime($year));
			
			$quote_folder = 'quotes/dealer_'.$result['dealer_id'].'/'.$year.'/customer_'.$result['customer_id'];
			$customer_path = $quote_folder.'/MagickWoodsQuote_customer_'.$result['quote_number'].'.pdf';
			$result['admin_download_excel'] = '';
			$result['admin_download_pdf'] = '';			
			if($result['admin_revision'] != 0){
				$userType = strtolower($discountforuserArr[$result['discounfortuser']]);
				$admin_download_path = $quote_folder.'/MagickWoodsQuote_'.$userType.'_'.$result['quote_number'].'-'.strtoupper($discountforuserArr[$result['discounfortuser']]);			
				if(file_exists($admin_download_path.'.xls')){
					$result['admin_download_excel'] = $admin_download_path.'.xls';
				}
				if(file_exists($admin_download_path.'.pdf')){
					$result['admin_download_pdf'] = $admin_download_path.'.pdf';
				}			
			}
			
			$result['quote_revision'] = $dealer_details['label'].'-'.sprintf('%0' . 4 . 's', $result['revision']);
			$result['customer_path'] = $customer_path;

			$result['uploadfiles'] = $this->get_quote_uploadfiles('quotes/dealer_'.$result['dealer_id'].'/'.$year.'/customer_'.$result['customer_id'].'/images/quote_'.$result['quote_id'].'/');
			if($result['uploadfiles'] == ''){$filecount = 'no';}else{$filecount = 'yes';}
			$result['uploadfilescount'] = $filecount;			
			
			$new[$key] = $result;			

			if(file_exists($customer_path)){
				$result['file_exist']=true;
			}else{
				$result['file_exist']=false;
			}
			$new[$key] = $result;
		}		
		if($new == false) {
			$return['success'] = false;
			$return['msg'] = "Failed to load a data!.";
		}else {
			$return['success'] = true;
			$return['msg'] = "Quotes loaded successfully";
			$return['data'] = $new;
		}
		echo json_encode($return);		
	}

	public function get_quote_uploadfiles($folder_path){
		if(!file_exists($folder_path)) {return '';}
		//$url = $_SERVER['DOCUMENT_ROOT'].'/dealerapplication/api/v2/';
		$images = scandir($folder_path,1);
		$images = array_diff($images, array('.', '..'));
		$url_cus = $images;
        $url_link = preg_filter('/^/', $folder_path, $url_cus);
		return $url_link;
	}	

	public function check_file_exist($path){
		if(file_exists($path)){
			$return = true;
		}else{
			$return = false;
		}
		return $return;
	}
	
	public function get($id)
	{
		$this->login_model->checktoken();
		$result = $this->quotes_model->get_by_id($id);
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

	public function quote_line_items($quote_id)
	{
		return $this->quotes_model->get_quote_line_items($quote_id);	
	}
	
	public function get_quote_line_items(){
		global $inputs;
		$this->login_model->checktoken();
		$result_quote_deatails = $this->quotes_model->get_quote_details($inputs);
		$result_quote_lines = $this->quotes_model->api_get_quote_line_items($inputs);
		$result_quote_lines_service = $this->quotes_model->api_get_quote_line_items_service($inputs);
		
		$dealer_details = $this->dealer_model->get_by_id($result_quote_deatails['dealer_id']);
	
		foreach($result_quote_lines as $key => $row) {
				$quote_lines['cabinets'][$key]['accessories'] = json_decode($row['accessories']);
				$quote_lines['cabinets'][$key]['cabinet_carcass_id'] = $row['cabinet_carcass_id'];
				$quote_lines['cabinets'][$key]['cabinet_shutter_id'] = $row['cabinet_shutter_id'];
				$quote_lines['cabinets'][$key]['cabinet_type_id'] = $row['cabinet_type_id'];
				$quote_lines['cabinets'][$key]['code_id'] = $row['code_id'];
				$quote_lines['cabinets'][$key]['drawers_id'] = $row['drawers_id'];
				$quote_lines['cabinets'][$key]['flap_up_id'] = $row['flap_up_id'];
				$quote_lines['cabinets'][$key]['handles_id'] = $row['handles_id'];
				$quote_lines['cabinets'][$key]['hinges_id'] = $row['hinges_id'];
				$quote_lines['cabinets'][$key]['quantity'] = $row['quantity'];
				$quote_lines['cabinets'][$key]['parent_category_id'] = $row['category_id'];
				$quote_lines['cabinets'][$key]['sub_category_id'] = $row['sub_category_id'];
				$quote_lines['cabinets'][$key]['mproduct_id'] = $row['product_id'];
				$quote_lines['cabinets'][$key]['id'] = $row['id'];				
		}
		foreach($result_quote_lines_service as $key => $row) {
				$quote_lines['other_services'][$key]['id'] = $row['id'];
				$quote_lines['other_services'][$key]['other_service_price'] = $row['other_service_price'];
				$quote_lines['other_services'][$key]['other_service_name'] = $row['other_service_name'];				
		}		
		
		$result['dealer_details'] = $dealer_details;
		$result['quote_deatails'] = $result_quote_deatails;
		$result['quote_lines'] = $quote_lines;

		if($quote_lines == false) {
			$return['success'] = false;
			$return['msg'] = "Failed to load a data!.";
		}else {
			$return['success'] = true;
			$return['msg'] = "Quotes loaded successfully";
			$return['data'] = $result;
		}
		echo json_encode($return);
	
	}
	public function get_numeric($val) { 
	  if (is_numeric($val)) { 
		return $val + 0; 
	  } 
	  return 0; 
	}
	
	public function remove_deleted_quote_line($deletelines){
		for($i=0;$i<count($deletelines);$i++){
			$id = $deletelines[$i];			
			$this->quotes_model->delete_by_id($id);
		}
			
	}
	
	function quote_line_items_clone($quote_id, $new_quote_id){
		$quote_line_arr = $this->quotes_model->api_clone_quote_line_items($quote_id);
		for($i=0;$i<count($quote_line_arr);$i++){
			$row_id = $quote_line_arr[$i]['id'];
			$new_quote_line[$row_id] = $this->DuplicateMySQLRecord('quote_line_items', 'id', $row_id);
			$data = array( 'quote_id'=>$new_quote_id);
			$this->quotes_model->update_quote_line_items($row_id, $data);
		}
		return $new_quote_line;
	}
	
	function quote_clone(){
		global $inputs;
		$this->login_model->checktoken();
		$new_quote_id = $this->DuplicateMySQLRecord('quotes', 'quote_id', $inputs['quote_id']);
		$new_quote_line = $this->quote_line_items_clone($inputs['quote_id'], $new_quote_id);
		$data = array( 
			'customer_id'=>$inputs['customer_id'],
			'status'=> 2			  
		);		
		$ret = $this->quotes_model->update_quotes($new_quote_id, $data);
		
		if($ret != true){
			$return['error'] = 'error';
		}
		
		if(isset($return['error'])) {
			$return['success'] = false;
			$return['msg'] = "Failed add a quote try again!.";
		}else {
			$return['success'] = true;
			$return['msg'] = "Quote generated successfully!";
			$return['data'] = $new_quote_id;
			$return['rowline'] = $new_quote_line;
		}
		echo json_encode($return);		
		
	}
	function quote_gen_admindiscount(){
		global $inputs;
		$table = 'quotes'; 
		$primary_key_field = 'quote_id'; 
		$primary_key_val = $inputs['quote_id'];
		$new_quote_id = $this->DuplicateMySQLRecord($table, $primary_key_field, $primary_key_val);
		$admin_discount = $inputs['admin_discount'];
		if($inputs['status'] != 3){
			$quote_data = array( 
				'admin_discount'=>$admin_discount, 
				'admin_revision'=>$inputs['quote_id'], 
				'admin_square_feet'=>$inputs['admin_square_feet'], 
				'status'=>3				  
			);
		}else{
			$quote_data = array( 
				'admin_discount'=>$admin_discount, 
				'admin_square_feet'=>$inputs['admin_square_feet'], 
				'status'=>3				  
			);			
		}
		
		$ret = $this->quotes_model->update_quotes($new_quote_id, $quote_data);
		if($ret != true){
			$return['error'] = 'error';
		}
		$tmp = json_decode($admin_discount, true);	
		foreach($tmp as $type=>$discount){
			$quote_data['discounfortuser'] = $type;
			$quote_data['discount'] = $discount;
		}
		if(isset($return['error'])) {
			$return['success'] = false;
			$return['msg'] = "Failed add a quote try again!.";
		}else {
			$return['success'] = true;
			$quote_data['quote_id'] = $new_quote_id;
			$return['msg'] = "Quote generated successfully!";
			$return['data'] = $quote_data;
		}
		echo json_encode($return);
	}

	public function other_services($quote_id,$other_services){
		if($other_services != null){
			for($i=0;$i<count($other_services);$i++){
				if($other_services[$i]['other_service_name'] != '' && $other_services[$i]['other_service_price']){
					$data = array(
						'quote_id'=>$quote_id,
						'other_service_name'=>$other_services[$i]['other_service_name'],
						'other_service_price'=>$other_services[$i]['other_service_price'],
						'type'=>'O'
					);
					$row_exist = $this->quotes_model->checkDuplicateEntryQuotelines($quote_id, $other_services[$i]['id']);
					if($row_exist == true && isset($other_services[$i]['id'])){
						$this->quotes_model->update_quote_line_items($other_services[$i]['id'], $data);
					}else{
						$this->quotes_model->insert_quote_line_items($data);
					}
				}
			}
		}
	}
	public function add_quote_line_item(){
		global $inputs;
		$this->login_model->checktoken();
		$data = $inputs;
		
		 if(isset($data['deleted']) && count($data['deleted']) > 0 ){
		     $delete_line=[];
				foreach($data['deleted'] as $id){
					if($this->get_numeric($id) != 0){
						$delete_line[] = $this->get_numeric($id);
					}
				}			
			 $this->remove_deleted_quote_line($delete_line);
		 }	
		
		$quote_data = array( 
			'dealer_id'=>$data['dealer_id'], 
			'customer_id'=>$data['customer_id'], 
			'revision'=>$data['revision'], 
			'status'=>$data['status'],
			'designer_id'=>$data['designer_id'],
			'cabinet_discount'=>$data['cabinet_discount'],
			'accessories_discount'=>$data['accessories_discount'],
			'square_feet'=>$data['square_feet'],				  
			'show_cabinetprice'=>$data['show_cabinetprice'],				  
			'quoteforname'=>$data['quoteforname']			  
		);	
		
		if(isset($data['quote_id']) && $this->quotes_model->checkDuplicateEntry('quotes', 'quote_id', $data['quote_id']) == true && $data['revision'] == 0){
			$this->quotes_model->update_quotes($data['quote_id'], $quote_data);
			$quote_id = $data['quote_id'];
		}else{
			$quote_id = $this->quotes_model->add_quote($quote_data);					  
		}
				
		$status = $this->quotes_model->get_quote_status($quote_id);
		
		/*Addservicelist*/
		$other_services = $this->other_services($quote_id,$data['other_services']);
		
		$input = $data['products'];
	
		for($x=0; $x<count($input); $x++) {
			
			$row_exist = $this->quotes_model->checkDuplicateEntryQuotelines($quote_id, $input[$x]['id']);
				if(!empty($input[$x]['cabinet_type_id']) && !empty($input[$x]['code_id']) && !empty($input[$x]['cabinet_carcass_id']) && !empty($input[$x]['cabinet_shutter_id']) && !empty($input[$x]['drawers_id']) && !empty($input[$x]['drawers_id']) && !empty($input[$x]['hinges_id']) && !empty($input[$x]['handles_id']) && !empty($input[$x]['flap_up_id'])  ){
				
					if($row_exist == true && $data['revision'] == 0){
						if(gettype($input[$x]['accessories']) == 'array'){
							$acc_input = json_encode($input[$x]['accessories']);
						}else{
							$acc_input = ltrim((rtrim($input[$x]['accessories'],'"')), '"');
						}					
						$input_quote_line_items = array(
							'id'			      =>$input[$x]['id'],
							'quote_id'			  =>$quote_id,
							'cabinet_type_id'	  =>$input[$x]['cabinet_type_id'],
							'code_id'            =>$input[$x]['code_id'],
							'cabinet_carcass_id' =>$input[$x]['cabinet_carcass_id'],
							'cabinet_shutter_id' =>$input[$x]['cabinet_shutter_id'],
							'drawers_id'    	  =>$input[$x]['drawers_id'],
							'hinges_id'          =>$input[$x]['hinges_id'],
							'handles_id'         =>$input[$x]['handles_id'],
							'flap_up_id'         =>$input[$x]['flap_up_id'],
							'quantity'         =>$input[$x]['quantity'],
							'accessories'        =>$acc_input,
							'category_id'        =>$input[$x]['parent_category_id'],
							'product_id'         =>$input[$x]['mproduct_id'],
							'sub_category_id'         =>$input[$x]['sub_category_id'],
							
						);
					
						$result = $this->quotes_model->update_quote_line_items($input[$x]['id'], $input_quote_line_items);
																	
					}else{
						if(gettype($input[$x]['accessories']) == 'array'){
							$acc_input = json_encode($input[$x]['accessories']);
						}else{
							$acc_input = ltrim((rtrim($input[$x]['accessories'],'"')), '"');
						}
						if($acc_input == ''){$acc_input = json_encode('{}');}
						$input_quote_line_items = array(
							'quote_id'			  =>$quote_id,
							'cabinet_type_id'	  =>$input[$x]['cabinet_type_id'],
							'code_id'            =>$input[$x]['code_id'],
							'cabinet_carcass_id' =>$input[$x]['cabinet_carcass_id'],
							'cabinet_shutter_id' =>$input[$x]['cabinet_shutter_id'],
							'drawers_id'    	  =>$input[$x]['drawers_id'],
							'hinges_id'          =>$input[$x]['hinges_id'],
							'handles_id'         =>$input[$x]['handles_id'],
							'flap_up_id'         =>$input[$x]['flap_up_id'],
							'quantity'         =>$input[$x]['quantity'],
							'accessories'        =>$acc_input,
							'category_id'        =>$input[$x]['parent_category_id'],
							'product_id'         =>$input[$x]['mproduct_id'],
							'sub_category_id'         =>$input[$x]['sub_category_id'],
						);
						$result = $this->quotes_model->insert_quote_line_items($input_quote_line_items);				
					}
				}else{
					$return['error'] = 'Empty row item not inserted';
				}

		}

		if(isset($return['error'])) {
			$return['success'] = false;
			$return['msg'] = "Failed add a quote line try again!.";
		}else {
			$return['success'] = true;
			$return['quote_id'] = $quote_id;
			$return['status'] = $status['status'];
			$return['msg'] = "Quote added successfully";
			$return['data'] = $result;
		}
		echo json_encode($return);
	}

/*end*/	


	function DuplicateMySQLRecord ($table, $primary_key_field, $primary_key_val) 
	{
	   $this->db->where($primary_key_field, $primary_key_val); 
	   $query = $this->db->get($table);
	  
		foreach ($query->result() as $row){   
		   foreach($row as $key=>$val){        
			  if($key != $primary_key_field){ 
			  $this->db->set($key, $val);               
			  }          
		   }
		}
		$this->db->insert($table); 
		return $this->db->insert_id();
	}
	public function clean($string) {
	   $string = str_replace(' ', '-', $string); 
	   return preg_replace('/[^A-Za-z0-9\-]/', '', $string);
	}
	
	public function UploadSignupFiles(){ 
	  global $inputs;
	  $this->login_model->checktoken();
	  $upload_data = $inputs[0]['pdfdata'];
	  $quote_id    = $inputs[0]['quote'];
	  $cus_id      = $inputs[0]['customer'];
	  $dealer_id   = $inputs[0]['dealer'];
	  
	  $url           = 'quotes/';
	  $dealer_folder = 'dealer_'.$dealer_id.'/';
	  $customer_deatials   = $this->customers_model->get_by_id($cus_id);
		$customer_year = str_replace('/', '-', $customer_deatials['date_created']);
		$customer_year = date('Y', strtotime($customer_year));	  
      $cus_folder    = '/customer_'.$cus_id.'/';
	  $img_folder    = 'images/'; 	  
	  $quote_folder  = 'quote_'.$quote_id.'/';  
	  
	  $folder_collect = $dealer_folder.$customer_year.$cus_folder.$img_folder.$quote_folder; 
		if (!file_exists($url.$folder_collect)) {
				mkdir($url.$folder_collect, 0777, true);
		}	  
	  $folder_path = $url.$folder_collect; 
	 
		$imageData = $upload_data;
		list($type, $imageData) = explode(';', $imageData);
		list(,$extension) = explode('/',$type);
		list(,$imageData)      = explode(',', $imageData);
		
		$cus_name = $this->clean($customer_deatials['name']);
        $cus_name = preg_replace('/\s\s+/', ' ', $cus_name);
		
		$set_file = $cus_name.'_'.$quote_id.'_'.date('m-d-Y_h-i-s');
		$fileName = $folder_path.$set_file.'.'.$extension;
		$imageData = base64_decode($imageData);
		
		$data = array( 
			'quote_id'=>$quote_id, 
			'file_name'=>$set_file.'.'.$extension			  
		);
		
	   $result = '';$url_link = '';	
       if($extension == "jpg" || $extension == "png" || $extension == "jpeg"
        || $extension == "pdf") {
          file_put_contents($fileName, $imageData);
		}
		
		$images = scandir($folder_path,1);
		$images = array_diff($images, array('.', '..'));  
        $url_link = preg_filter('/^/', 'quotes/'.$folder_collect, $images); 
				 		
		if($url_link != '') {
			$data = $result;
		    $return['success'] = true;
			$return['path_info'] = base_url().'quotes/'.$folder_collect;
			$return['uploadfiles'] = $url_link;
			$return['msg'] = "File Uploaded successfully";
		}
		elseif($url_link == '') {
			$return['success'] = false;
			$return['msg'] = "File is not supported";
		}
		echo json_encode($return);
	}	
	

}

<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Quotes_model extends CI_Model {

	var $table = 'quotes';
	
	public function __construct()
	{
		parent::__construct();
		$this->load->database();
		
	}

	function get_lists()
	{
		$this->db->select('quote_id, dealer_id, customer_id, revision, designer_id, cabinet_discount, accessories_discount, square_feet, quoteforname');
		$this->db->from($this->table);
		$this->db->where('status','1');
		$query = $this->db->get();
		return $query->result();
	}

	function api_get_lists($dealer_id, $type)
	{
		$this->db->select('quote_id, 
						quotes.dealer_id, 
						dealer_master.user_name, 
						quotes.customer_id, 
						customer_master.name, 
						customer_master.email, 
						customer_master.phone, 
						revision,
						quotes.admin_revision,
						quotes.admin_discount,
						quotes.admin_square_feet,
						quotes.quoteforname,
						quotes.date_created,
						quotes.status
						');
		$this->db->from($this->table);				
		$this->db->join('customer_master', 'quotes.customer_id = customer_master.id');
		$this->db->join('dealer_master', 'quotes.dealer_id = dealer_master.id');
		if($type != 'SA'){
			$this->db->where('quotes.dealer_id', $dealer_id);
		}else{
			$this->db->where('quotes.status','1');
			$this->db->or_where('quotes.status','3');
		}		
		$this->db->order_by("quotes.quote_id","desc");
		$query = $this->db->get();
		return $query->result_array();
	}	

	public function get_by_id($quote_id)
	{
		$discountforuserArr= array("D"=>"Dealer", "B"=>"Builder", "O"=>"OEM");
		
		$this->db->select('dealer_id, customer_id, quote_id, revision, designer_id, cabinet_discount, accessories_discount, admin_discount, admin_square_feet, admin_revision, square_feet, quoteforname, date_modified, show_cabinetprice');
		$this->db->where('quote_id',$quote_id);
		//$this->db->where_not_in('status', 0);
		//$this->db->or_where('status', 3);
		$this->db->from($this->table);
		$query = $this->db->get();
		$result = $query->row_array();
		$dealer_details = $this->dealer_model->get_by_id($result['dealer_id']);		
		$result['quote_number'] = $dealer_details['label'].'-'.sprintf('%0' . 4 . 's', $quote_id);
		$result['rules'] = json_decode($dealer_details['rules']);
		return $result;
	}


	public function get_quote_details($quote_id)
	{
		$this->db->select('dealer_id, customer_id, quote_id, revision, designer_id, cabinet_discount, admin_discount, admin_square_feet, accessories_discount, square_feet, quoteforname');
		$this->db->where('quote_id', $quote_id);
		$this->db->from($this->table);
		$query = $this->db->get();
		$result = $query->row_array();
		return $result;
	}	

	public function get_quote_line_items($quote_id)
	{	
		$this->db->select_sum('quantity', 'sum_quantity');
		$this->db->select('cabinet_type_id, quote_id, code_id, cabinet_carcass_id, cabinet_shutter_id, drawers_id, hinges_id, handles_id, flap_up_id, accessories, type, other_service_name, other_service_price');
		$this->db->group_by(array('code_id', 'cabinet_carcass_id', 'cabinet_shutter_id', 'drawers_id', 'hinges_id', 'handles_id', 'flap_up_id')); 
		$this->db->where('quote_id',$quote_id);
		$this->db->where('type','C');
		$this->db->where('status', 1);
		$this->db->from('quote_line_items');
		$this->db->order_by("id", "asc");
		$query = $this->db->get();
		return $query->result_array();
	}
	public function get_quote_line_items_services($quote_id)
	{	
		$this->db->select('quote_id, type, other_service_name, other_service_price');		 
		$this->db->where('quote_id',$quote_id);
		$this->db->where('type','O');
		$this->db->where('status', 1);
		$this->db->from('quote_line_items');
		$this->db->order_by("id", "asc");
		$query = $this->db->get();
		return $query->result_array();
	}	

	public function api_get_quote_line_items($quote_id)
	{	
		$this->db->select('*');
		$this->db->where('quote_id',$quote_id);
		$this->db->where('type','C');
		$this->db->from('quote_line_items');
		$query = $this->db->get();
		return $query->result_array();
	}
	public function api_get_quote_line_items_service($quote_id)
	{	
		$this->db->select('*');
		$this->db->where('quote_id',$quote_id);
		$this->db->where('type','O');
		$this->db->from('quote_line_items');
		$query = $this->db->get();
		return $query->result_array();
	}

	public function api_clone_quote_line_items($quote_id)
	{	
		$this->db->select('*');
		$this->db->where('quote_id',$quote_id);
		$this->db->from('quote_line_items');
		$query = $this->db->get();
		return $query->result_array();
	}	

	public function delete_by_id($id)
	{
		$this->db->where('id', $id);
		$this->db->delete('quote_line_items');
	}

	public function checkDuplicateEntry($table, $field, $value) 
	{
		$this->db->where($field, $value);
		$query = $this->db->get($table);
		$count_row = $query->num_rows();
		if ($count_row > 0) {
			return TRUE;
		 } else {
			return FALSE;
		 }
	}

	public function checkDuplicateEntryQuotelines($quote_id, $row_id) 
	{
		$this->db->where('id', $row_id);
		$this->db->where('quote_id', $quote_id);
		$query = $this->db->get('quote_line_items');
		$count_row = $query->num_rows();
		if ($count_row > 0) {
			return TRUE;
		 } else {
			return FALSE;
		 }
	}	
	
	public function update_quotes($where, $data)
	{
		$this->db->where('quote_id', $where);
		$this->db->update($this->table, $data);		
		return $this->db->affected_rows();		
	}
	
	public function update_quote_line_items($where, $data)
	{
		$this->db->where('id', $where);
		$this->db->update('quote_line_items', $data);		
		return $this->db->affected_rows();
	}	

	public function insert_quote_line_items($data)
	{
		$this->db->insert('quote_line_items', $data);
		return $this->db->insert_id();
	}	

	public function add_quote($data)
	{
		$this->db->insert($this->table, $data);
		return $this->db->insert_id();
	}	

	function get_quote_status($id)
	{
		$this->db->select('status');
		$this->db->from($this->table);
		$this->db->where('quote_id', $id);
		$query = $this->db->get();
		return $query->row_array();
	}	
		
}

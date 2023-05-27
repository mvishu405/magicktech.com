<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Customers_model extends CI_Model {

	var $table = 'customer_master';

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	function get_lists()
	{
		$this->db->select('customer_master.id, customer_master.name, customer_master.email, customer_master.phone, customer_master.alternate_phone, customer_master.state, customer_master.city, customer_master.address, customer_master.comments, customer_master.lead_source, customer_master.dealer_id, customer_master.date_created, dealer_master.user_name');
		$this->db->from($this->table);
		$this->db->join('dealer_master', 'dealer_master.id = customer_master.dealer_id');
		$this->db->where('customer_master.status','1');
		$this->db->order_by("customer_master.id", "DESC");
		$query = $this->db->get();
		return $query->result();
	}

	public function add($data)
	{
		$this->db->insert($this->table, $data);
		return $this->db->insert_id();
	}

	public function get_by_id($id)
	{
		$this->db->select('id, name, email, phone, alternate_phone, state, city, address, comments, lead_source, date_created');
		$this->db->from($this->table);
		$this->db->where('id',$id);
		$this->db->where('status', 1);
		$query = $this->db->get();
		$return = $query->row_array();
		$return['cid'] = 'CHN-MW-'.sprintf('%0' . 4 . 's', $id);
		return $return;

	}	
	
	public function update($where, $data)
	{
		$this->db->update($this->table, $data, $where);
		return $this->db->affected_rows();
	}

	public function delete($id)
	{
		$this->db->set('status', 0); 
		$this->db->where('id', $id);
		$this->db->update($this->table);
		return $this->db->affected_rows();		
	}

	public function checkDuplicateEntry($field, $value) 
	{
		$this->db->where($field, $value);
		$query = $this->db->get($this->table);
		$count_row = $query->num_rows();
		if ($count_row > 0) {
			return FALSE;
		 } else {
			return TRUE;
		 }
	}
	
	
}

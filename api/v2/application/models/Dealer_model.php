<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Dealer_model extends CI_Model {

	var $table = 'dealer_master';

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	function get_lists()
	{
		$this->db->from($this->table);
		$this->db->where_not_in('id', 14);
		$this->db->where('status','1');
		$this->db->order_by("id", "DESC");
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
		$this->db->select('id, user_name, email, phone, logo, password, address, state, city, label, user_type, last_login, date_created,rules');
		$this->db->from($this->table);
		$this->db->where('id',$id);
		$this->db->where('status', 1);
		$query = $this->db->get();
		return $query->row_array();
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

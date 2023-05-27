<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Designer_model extends CI_Model {

	var $table = 'designer_master';

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	function get_lists()
	{
		$this->db->from($this->table);
		$this->db->where('status','1');
		$query = $this->db->get();

		foreach ($query->result_array() as $rows)
		{
			$return[] = (array) $rows;
		}
		return $return;	
		
	}

	public function add($data)
	{
		$this->db->insert($this->table, $data);
		return $this->db->insert_id();
	}

	public function get_by_id($id)
	{
		$this->db->select('id, name, email, phone');
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

<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Products_model extends CI_Model {

	var $table = 'products';
    
    public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	function get_lists()
	{
		$this->db->select('id, name, category_id, status');
		$this->db->from($this->table);
		$this->db->group_start();
		$this->db->where('status', '1');
		$this->db->or_where('category_id IN (SELECT id FROM ' . $this->table . ' WHERE status = 1)');
		$this->db->group_end();
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
		$this->db->select('id, name, category_id, status');
		$this->db->from($this->table);
		$this->db->where('id',$id);
		$this->db->where('status', 1);
		$query = $this->db->get();
		return $query->row();
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
}

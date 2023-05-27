<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Warranty_order_form_model extends CI_Model {

	var $table = 'warranty_order_form';

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	function get_lists()
	{
		$this->db->select('*');
		$this->db->from($this->table);
		$this->db->where_not_in('status','0');
		$query = $this->db->get();

		foreach ($query->result_array() as $rows)
		{
			$status_text = 'Submitted';
			if($rows['status'] == 2){
				$status_text = 'Rejected';
			}else if($rows['status'] == 3){
				$status_text = 'In progress';
			}else if($rows['status'] == 4){
				$status_text = 'Completed';
			}else{
				$status_text = 'Submitted';
			}			
			
			$return[$rows['id']] = $rows;
			$return[$rows['id']]['status_text'] = $status_text;
		}
		return $return;	
		
	}

	public function add($data)
	{
		$this->db->insert($this->table, $data);
		return $this->db->insert_id();
	}

	public function insert_cabinet_rows($data)
	{
		$this->db->insert('warranty_order_form_row_item', $data);
		return $this->db->insert_id();
	}

	public function update($where, $data)
	{
		$this->db->update($this->table, $data, $where);
		return $this->db->affected_rows();
	}
	
	public function update_cabinet_rows($where, $data)
	{
		$this->db->where('id', $where);
		$this->db->update('warranty_order_form_row_item', $data);		
		return $this->db->affected_rows();
	}	

	public function get_by_id($id)
	{
		$this->db->select('*');
		$this->db->from($this->table);
		$this->db->where('id',$id);
		$this->db->where('status', 1);
		$query = $this->db->get();
		return $query->row();
	}

	public function cabinet_rows_get_by_id($id)
	{
		$this->db->select('id,cabinet_qty, type_of_item, which_item_required, item_position, office_use');
		$this->db->from('warranty_order_form_row_item');
		$this->db->where('warranty_order_form_id',$id);
		$this->db->where('status','1');
		$query = $this->db->get();

		foreach ($query->result_array() as $rows)
		{
			$return[] = $rows;
		}
		return $return;
	}

	public function checkDuplicateEntryWarrantyLines($id, $warranty_order_form_id) 
	{
		$this->db->where('id', $id);
		$this->db->where('warranty_order_form_id', $warranty_order_form_id);
		$query = $this->db->get('warranty_order_form_row_item');
		$count_row = $query->num_rows();
		if ($count_row > 0) {
			return TRUE;
		 } else {
			return FALSE;
		 }
	}	
	
	public function delete_by_id($id)
	{
		$this->db->where('id', $id);
		$this->db->delete('warranty_order_form_row_item');
	}
	
	public function delete($id)
	{
		$this->db->set('status', 0); 
		$this->db->where('id', $id);
		$this->db->update($this->table);
		delete_warranty_order_form_row_item($id);
		return $this->db->affected_rows();		
	}
	public function delete_warranty_order_form_row_item($id)
	{
		$this->db->set('status', 0); 
		$this->db->where('warranty_order_form_id', $id);
		$this->db->update('warranty_order_form_row_item');
		return $this->db->affected_rows();		
	}
	
}

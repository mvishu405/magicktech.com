<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Price_mapping_model extends CI_Model {

	var $table = 'price_mapping';

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	function get_lists()
	{
		$this->db->select('id, code_id, component_id, cost, date_created, date_modified');
		$this->db->from($this->table);
		$this->db->where('status','1');
		$query = $this->db->get();
		
		foreach ($query->result_array() as $rows)
		{
			$return[$rows['id']] = $rows;
		}
		return $return;	
		
	}

	function get_lists_obj($param)
	{	
		$this->db->select('price_mapping.id, code_id, codes.code, codes.description, component_id, component_master.component_type, component_master.component_name, cost, price_mapping.date_created, price_mapping.date_modified');
		$this->joinTablePricemapping();
		$this->db->limit($param['pageSize'], (int)($param['page'] * $param['pageSize']));
		if(isset($param['sorted'][0]['id'])){
			$sort = 'asc';
			if($param['sorted'][0]['desc'] == true){
				$sort = 'desc';
			}
			$this->db->order_by($param['sorted'][0]['id'], $sort);
		}
		if(isset($param['filtered'])){
			foreach($param['filtered'] as $val){
				if(isset($val['id'])){
					$this->db->like($val['id'], $val['value']);
				}
			}
		}		
		$query = $this->db->get();
		return $query->result_array();		
	}

	public function joinTablePricemapping(){
		$this->db->from($this->table);
		$this->db->where('price_mapping.status','1');
		$this->db->join('codes', 'codes.id = price_mapping.code_id');
		return $this->db->join('component_master', 'component_master.id = price_mapping.component_id');
	}

    public function get_total($param) 
    {	
		$this->joinTablePricemapping();
		foreach($param['filtered'] as $val){
			if(isset($val['id'])){
				$this->db->like($val['id'], $val['value']);
			}
		}		
        return $this->db->get()->num_rows();
    }	


	function price_mapping()
	{
		$this->db->select('id, code_id, component_id, cost');
		$this->db->from($this->table);
		$this->db->where('status','1');
		$query = $this->db->get();
		$results = $query->result_array();
		foreach($results as $result){
			$data[$result['code_id']][$result['component_id']] = $result['cost'];
		}		
		return $data;	
		
	}	

	public function add($data)
	{
		$this->db->insert($this->table, $data);
		return $this->db->insert_id();
	}

	public function get_by_id($id)
	{
		$this->db->select('id, code_id, component_id, cost, date_created, date_modified');
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

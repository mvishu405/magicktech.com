<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Categories_model extends CI_Model {

	var $table = 'categories';
    
    public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	public function getAllParentCategories() {
        // Fetch categories from the database
		$query = $this->db->select('id, name')
                  ->from('categories')
                  ->where('parent_id IS NULL')
                  ->get();
		foreach ($query->result_array() as $rows)
		{
			$return[] = (array) $rows;
		}
		return $return;
    }

    public function getCategorySubCategories($categoryId) {
        // Fetch subcategories based on the category ID from the database
        $this->db->where('parent_id', $categoryId);
        $query = $this->db->get('categories');
		foreach ($query->result_array() as $rows)
		{
			$return[] = (array) $rows;
		}
		return $return;
    }

	public function getCategoriesWithSubCategory() {
		$query = $this->db->select('c1.id AS category_id, c1.name AS category_name, c2.id AS sub_category_id, c2.name AS sub_category_name')
		->from('categories c1')
		->join('categories c2', 'c1.id = c2.parent_id', 'left')
		->where('c2.parent_id IS NOT NULL') // Fetch categories with non-null parent_id
		->order_by('c1.name', 'ASC') // Order by category name in ascending order
		->get();

		foreach ($query->result_array() as $rows)
		{
			$return[] = (array) $rows;
		}
		return $return;
	}

	function get_lists()
	{
		$this->db->select('id, name');
		$this->db->from($this->table);
		$this->db->where('status','1');
		$this->db->where('parent_id IS NULL');
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
		$this->db->select('id, name, date_created, data_modified');
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

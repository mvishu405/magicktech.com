<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Download_model extends CI_Model {

	var $table = 'quotes';

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	function get_lists()
	{		
		$this->db->select('quotes.quote_id, name, email, address, state, city, phone, alternate_phone, comments, lead_source, quotes.dealer_id, customer_id, quotes.date_created, quotes.status');
		$this->db->from($this->table);
		$this->db->join('customer_master', 'customer_master.id = quotes.customer_id');
		$this->db->where('quotes.status','1');
		$query = $this->db->get();
		return $query->result();
	}	
}

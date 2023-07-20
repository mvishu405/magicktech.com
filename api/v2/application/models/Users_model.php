<?php
class Users_model extends CI_Model{
	var $table = 'users';
	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}
	
    public function login($email,$password){
        // Check if email exists and password is correct
        $this->db->select('*');
        $this->db->from($this->table);
        $this->db->where('email',$email);
        $this->db->where('password',$password);
        $query=$this->db->get();
        $row_count=$query->num_rows();
        if ($row_count > 0) {
            $user = $query->row();    
            // Return users data
            return $user;
    }else{
        return false;
    }

}

private function generate_token(){
    // Generate a random string and encrypt it. 
    // You can do the same for any other sensitive information like user id, email, etc...
    $token = bin2hex(random_bytes(32));
    return $token;
}


}

?>
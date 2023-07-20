<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
class Session_tokens_model extends CI_Model{
	var $table = 'session_tokens';
	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

    public function store_token($user_id){
        $token = $this->generate_token();
        $data = array(
            'user_id' => $user_id,
            'token' => $token,
            'expired_at'=> date('Y-m-d H:i:s', time() + (24 * 60 * 60))
        );
        $this->db->insert($this->table, $data);
        return $token;
    }

    public  function  generate_token(){
        $token = bin2hex(random_bytes(32));
        return $token;
    }

}

?>
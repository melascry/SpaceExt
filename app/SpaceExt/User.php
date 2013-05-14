<?php
namespace SpaceExt;

class User{
	
	private $fbId;
	private $gold;
	
	public $publicData = "ok";
	
	private function __construct($fbId,$gold){
		$this->fbId = $fbId;
		$this->gold = $gold;
	}
	
	public function toJSON(){
		return json_encode(array(
			'fbId' => $this->fbId,
			'gold' => $this->gold
		));
	}
	
	public function addGold($goldToAdd){
		
		/* put here the code to know if you can add the gold obtained */
		
		$sum = $this->gold + $goldToAdd;
		
		$query = App::getDB()->prepare('UPDATE user SET gold=? WHERE idfb=?');
		if($query->execute(array($sum, $this->fbId )))
		{
			$query = App::getDB()->prepare('SELECT gold FROM user WHERE idfb=? LIMIT 1');
			if($query->execute(array($this->fbId)))
			{
				$res = $query->fetch();
				if($res)
				{
					$this->gold = $res->gold;
				}
			}
		}	
	}
	
	public function getGold(){
		return $this->gold;
	}

	public static function fbLogin($fbId){
		$query = App::getDB()->prepare('SELECT * FROM user WHERE idfb=?');
		
		if($query->execute( array($fbId) ))
		{
			$res = $query->fetch();
			if($res)
			{
				$_SESSION['user'] = new user($res->idfb,$res->gold);
				echo $_SESSION['user']->addGold(12);
			}
		}
		if(!isset($_SESSION['user']))
		{
			$userProfile = App::getFbApi()->api('/me');
			
			$query = App::getDB()->prepare('INSERT INTO user (idfb,gold) VALUES (?,0)');
			
			if($query->execute(array($this->fbId)))
			{
				return self::fbLogin($this->fbId);
			}else
			{
				return false;
			}
		}
		else
		{
			return true;
		}
	}
}
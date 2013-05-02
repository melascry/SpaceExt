<?php
namespace SpaceExt;

class User{
	
	private $fbId;
	
	public $publicData = "ok";
	
	private function __construct($fbId){
		$this->fbId = $fbId;
	}
	
	public function toJSON(){
		return json_encode(array(
			'fbId' => $this->fbId
		));
	}
	/*
	public function addXP($xpToAdd){
		$query = App::getDB()->prepare('UPDATE user SET xp=xp+? WHERE id=?');
		if($query->execute(array($xpToAdd, $this->id))){
			$query = App::getDB()->prepare('SELECT xp FROM user WHERE id=? LIMIT 1');
			if($query->execute(array($this->id))){
				$res = $query->fetch();
				if($res){
					$this->xp = $res->xp;
				}
			}
		}	
	}
	
	public function getXP(){
		return $this->xp;
	}
	*/
	/*
	public static function login($login, $password){
		$query = App::getDB()->prepare('SELECT * FROM user WHERE login=? LIMIT 1');
		if($query->execute(array($login))){
			$res = $query->fetch();
			if($res){
				if(\PasswordHashUtils::validate_password($password, $res->hash)){
					$_SESSION['user'] = new User($res->id, $res->login, $res->xp, $res->hp, $res->power);
					return true;
				}
			}
		}
		return false;
	}
	*/
	/**
	 * Test
	 * @param unknown $login
	 * @param unknown $password
	 */
	public static function register($login, $password){
		if(strlen($password) < 5){
			throw new \Exception('Password too short (3 char min)');
		}
		$query = App::getDB()->prepare('SELECT id FROM user WHERE login=? LIMIT 1');
		if($query->execute(array($login))){
			$res = $query->fetch();
			if($res){
				throw new \Exception('Login already exists');
			}else{
				$query = App::getDB()->prepare('INSERT INTO user (login,hash) VALUES (?,?)');
				if($query->execute(array($login, \PasswordHashUtils::create_hash($password)))){
					if(!self::login($login, $password)){
						throw new \Exception('Registration failed');
					}
				}
			}
			return true;
		}
		return false;
	}
	

	public static function fbLogin($fbId){
		$query = App::getDB()->prepare('SELECT * FROM user WHERE idfb=? LIMIT 1');
		if($query->execute(array($fbId))){
			$res = $query->fetch();
			if($res){
				$_SESSION['user'] = new User($res->fbId);
			}
		}
		if(!isset($_SESSION['user'])){
			$userProfile = App::getFbApi()->api('/me');
			$query = App::getDB()->prepare('INSERT INTO user (fbId) VALUES (?)');
			if($query->execute(array($fbId))){
				return self::fbLogin($fbId);
			}else{
				return false;
			}
		}else{
			return true;
		}
	}
}
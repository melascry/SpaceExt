<?php
namespace coursWeb;

class DataStore{
	private static $instance = false;
	
	public $config;
	
	public $constantList = array();

	public $ennemyList = array();
	public $publicEnnemyList = array();
	
	private function __construct(){
		@include APP_PATH.'cache/data.php';
	}
	
	public static function getInstance(){
		if(!self::$instance){
			self::$instance = new DataStore();
		}
		return self::$instance;
	}
	
	public function toJSON(){
		return json_encode(array(
			'ennemyList' => $this->publicEnnemyList,
			'cfg' => $this->config,
			'cst' => $this->constantList
		));
	}
	
	public static function generateConstants(){
		$output = '<?php'.NL;
		
		echo '**** Exporting constants ****<br/>';
		
		$query = App::getDB()->prepare('SHOW tables');
		if($query->execute()){
			while($res = $query->fetch(\PDO::FETCH_UNIQUE)){
				$t = $res[0];
				if($t{0} == 'E'){
					$t = substr($t, 1);
					$name = '';
					for($i = 0; $i < strlen($t); $i++){
						if(preg_match('/[A-Z]/', $t[$i]) && ($i == 0 || preg_match('/[a-z]/', $t[$i - 1]))){
							$name .= '_';
						}
						$name .= strtoupper($t[$i]);
					}
			
					echo $name;

					$dataQuery = App::getDB()->prepare('SELECT identifier, id FROM E'.$t.' ORDER BY id');
					if($dataQuery->execute()){
						while($dataRes = $dataQuery->fetch()){
							$output .= 'define(\''.$name.'_'.$dataRes->identifier.'\', '.$dataRes->id.');'.NL;
						}
					}
					echo ' [OK]<br/>';
				}
			}
		}
		echo '**** Constants [OK] ****<br/>';
		
		echo 'Writing file...';
		file_put_contents(APP_PATH.'cache/constants.php', $output);
		echo '[OK]<br/>';
	}
	
	public static function generate(){

		$output = '<?php'.NL;
		echo '<br/>/================ DATA GENERATION ================/<br/>';
		
		echo '**** Exporting constants ****<br/>';

		$query = App::getDB()->prepare('SHOW tables');
		if($query->execute()){
			while($res = $query->fetch(\PDO::FETCH_UNIQUE)){
				$t = $res[0];
				if($t{0} == 'E'){
					$t = substr($t, 1);
					$name = '';
					for($i = 0; $i < strlen($t); $i++){
						if(preg_match('/[A-Z]/', $t[$i]) && ($i == 0 || preg_match('/[a-z]/', $t[$i - 1]))){
							$name .= '_';
						}
						$name .= strtoupper($t[$i]);
					}
			
					echo $name;
					
					$dataQuery = App::getDB()->prepare('SELECT identifier, id FROM E'.$t.' ORDER BY id');
					if($dataQuery->execute()){
						$output .= '$this->constantList[\''.$name.'\'] = array();'.NL;
						while($dataRes = $dataQuery->fetch()){
							$output .= '$this->constantList[\''.$name.'\'][\''.$dataRes->identifier.'\'] = '.$dataRes->id.';'.NL;
						}
					}
					echo ' [OK]<br/>';
				}
			}
		}
		echo '**** Constants [OK] ****<br/>';
		
		echo 'Exporting ennemies...';
		$query = App::getDB()->prepare('SELECT * FROM ennemy');
		$ennemyList = array();
		$publicEnnemyList = array();
		if($query->execute()){
			while($res = $query->fetch(\PDO::FETCH_ASSOC)){
				$res['xp'] = (int)$res['xp'];
				$ennemyList[] = $res;
				$publicEnnemyList[] = array(
					'id' => $res['id'],
					'name' => $res['name']
				);
			}
		}
		$output .= '$this->ennemyList = '.var_export($ennemyList, true).';'.NL;
		$output .= '$this->publicEnnemyList = '.var_export($publicEnnemyList, true).';'.NL;
		echo '[OK]<br/>';
		
		echo 'Writing file...';
		file_put_contents(APP_PATH.'cache/data.php', $output);
		echo '[OK]';
	}
	
	public static function getDBMsgid($table, $col, $id){
		return $table.'-'.$col.'-'.$id;
	}
	
	public static function getTranslation($table, $col, $id){
		return newGettext(self::getDBMsgid($table, $col, $id));
	}
}
?>
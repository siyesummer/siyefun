<?php

class DAOMySQLi
{
	private $host;
	private $user;
	private $pwd;
	private $dbname;
	private $port;
	
	private $charset;
	
	
	//创建实例
	private $mySQLi;
	//唯一实例属性
	private static $instance;
	
	private function __clone()
	{}
	
	private function initOption(array $option = array())
	{
		$this->host = isset($option['host'])?$option['host']:'';
		$this->user = isset($option['user'])?$option['user']:'';
		$this->pwd = isset($option['pwd'])?$option['pwd']:'';
		$this->dbname = isset($option['dbname'])?$option['dbname']:'';
		$this->port = isset($option['port'])?$option['port']:'';
		$this->charset = isset($option['charset'])?$option['charset']:'';
		if($this->host==''||$this->user==''||$this->pwd==''||$this->dbname==''||$this->port==''||$this->charset=='')
		{
			die('你的输入有误,请重新输入');
		}
	}
	private function __construct(array $option=array())
	{
	
		$this->initOption($option);
		
		$this->mySQLi = new MySQLi($this->host,$this->user,$this->pwd,$this->dbname,$this->port);
		
		if($this->mySQLi->connect_errno)
		{
			die('连接失败' . $this->mySQLi->connect_error);
		}
		
		$this->mySQLi->set_charset($this->charset);
	}
	
	public static function getSingleton(array $option=array())
	{
		if(!(self::$instance instanceof self))
		{
			self::$instance = new self($option);
		}
		return self::$instance;
	}
	
	
	//对外提供一个select操作方法
	public function fetchAll($sql = '')
	{
		
		$arrs = array();
		$res = $this->mySQLi->query($sql);
		
		while($row = $res->fetch_assoc())
		{
			$arrs[] = $row;
		}
		
		$res->free();
		return $arrs;
	}
	//返回一条结果
	public function fetchRow($sql = '')
	{
		
		$arr = array();
		$res = $this->mySQLi->query($sql);
		
		if($row = $res->fetch_assoc())
		{
			$arr = $row;
		}
		
		$res->free();
		return $arr;
	}
	
	//返回结果个数
	public function fetchCou($sql = '')
	{
		$res = $this->mySQLi->query($sql);
		$total = mysqli_num_rows($res);
		
		return $total;
	}
	
	//对外提供一个增删改方法借口
	public function query($sql = '')
	{
		$res = $this->mySQLi->query($sql);
		if(!$res)
		{
			echo '<br>sql语句执行失败';
			echo '错误信息' . $this->mySQLi->error;
			exit;
		}
		return $res;
	}
	
	//转义字符串,并用引号包裹
	public function escapeString($str)
	{
		return " ' " . $this->mySQLi->real_escape_string($str) . " ' ";
	}
}
?>
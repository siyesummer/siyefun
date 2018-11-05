<?php
//此文件完成初始化工作

//定义网站的更目录
define('ROOT_PATH',dirname(__DIR__). '/');
//定义lib目录
define('LIB_PATH',ROOT_PATH . 'lib/');
//定义teample目录
define('TEP_PATH',ROOT_PATH . 'teample/');

define('CSS_PATH',ROOT_PATH . 'css/');


$option = array
	('host'=>'localhost',
	'user'=>'root',
	'pwd'=>'你的密码',
	'dbname'=>'table名称',
	'port'=>'3306',
	'charset'=>'utf8'
);

require LIB_PATH.'DAOMySQLi.class.php';
require LIB_PATH.'functions.php';

$dao_mysqli = DAOMySQLi::getSingleton($option);
session_start();

$_GET = deepEscape($_GET);
$_POST = deepEscape($_POST);
date_default_timezone_set('PRC');
?>

<?php
require 'lib/init.php';
$type = isset($_GET['type'])?$_GET['type']:'';
$page = isset($_GET['page'])?$_GET['page']:1;
$page = intval($page);
$audioType = isset($_GET['audioType'])?$_GET['audioType']:'music';
$mus_num = 1;
if($type=='')
{
	echo '我要加入你的车队';
	exit;
}

//echo '{mes:"通过了"}';
//exit;

//echo $type;
$page_size = 10;
if($audioType=='music')
{
	$sql_page_total = "select *from siyemus_info";
}
else if($audioType=='radio')
{
	$sql_page_total = "select *from siyeradio_info";
}

$total = $dao_mysqli->fetchCou($sql_page_total);
//echo $total;
$pagemax = ceil($total/$page_size);


	if($type=='before')
	{
		if($page<=1)
		{
			$page = 1;
		}
		else
		{
			$page -=1;
		}
		
	}
	else if($type=='next')
	{
		if($page>=$pagemax)
		{
			$page = $pagemax;
		}
		else
		{
			$page +=1;
		}
	}
	


$offset = ($page-1)*$page_size;
if($audioType=='music')
{
	$sql_page = "select *from siyemus_info order by id limit $offset,$page_size";
}
else if($audioType=='radio')
{
	$sql_page = "select *from siyeradio_info order by id desc limit $offset,$page_size";
}

//$sql_page = "select *from mes_info1 order by id desc";
$page_list = $dao_mysqli->fetchAll($sql_page);


if(!$page_list)
{
	if($audioType=='music')
	{
		$res['mes'] = "没有音频文件";
	}
	else if($audioType=='radio')
	{
		$res['mes'] = "没有电台文件";
	}
	
	$res['page'] = 1;
	$res['pagemax'] = 1;
	$res['mus_first'] = 0;
	$res['mus_list']   = array();
	echo json_encode($res);
	exit;
}
	if($audioType=='music')
	{
		$res['mes'] = "有音频文件";
	}
	else if($audioType=='radio')
	{
		$res['mes'] = "有电台文件";
	}
$res['page'] = $page;
$res['pagemax'] = $pagemax;
$res['mus_first'] = $offset;
$res['mus_list']   = array();


foreach($page_list as $page_meb):
$mus['id'] = $page_meb['id'];
if($audioType=='music')
{
	$mus['musname'] = $page_meb['musname'];
	$mus['lyric'] = $page_meb['muslyric'];
}
else if($audioType=='radio')
{
	$mus['musname'] = $page_meb['radioname'];
	$mus['lyric'] = $page_meb['radiolyric'];
}


array_push($res['mus_list'], $mus);
endforeach;

echo json_encode($res);
exit;
?>
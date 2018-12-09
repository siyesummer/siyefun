<?php
require 'lib/init.php';
$musID = isset($_POST['musID'])?$_POST['musID']:'';
$radioID = isset($_POST['radioID'])?$_POST['radioID']:'';
$audioID = isset($_POST['audioID'])?$_POST['audioID']:'';
$page = isset($_POST['page'])?$_POST['page']:'';
$type = isset($_POST['type'])?$_POST['type']:'';
$addtime = date("Y-m-d H:i:s");
$content = isset($_POST['mes'])?$_POST['mes']:'';
$audioType = null;
if($content==''&&$musID==''&&$radioID==''&&$audioID==''&&$page==''&&$type=='')
{
	//echo '86是真正的秋名山车神';
	//exit;
}

$content = str_replace(" ","&nbsp",str_replace("\n","<br/>",$content));
$mes     = '留言者想留言';
class Comment
{
	//发送留言
	function sendMes($audioType,$audioID,$content,$addtime,$dao)
	{
		if($audioType=='music')
		{
			$sql = "insert into muscmmt_info(musID,content,addtime) values('$audioID','$content','$addtime')";
		}
		else if($audioType=='radio')
		{
			$sql = "insert into radcmmt_info(radID,content,addtime) values('$audioID','$content','$addtime')";
		}
		
		$res = $dao->query($sql);
		
		//$res = true;


		if($res&&$audioType=='music')
		{
			$mes = '歌曲留言成功';
		}
		else if($res&&$audioType=='radio')
		{
			$mes = '电台留言成功';
		}
		else
		{
			$mes = '留言失败';
		}
		echo $mes;
	}
	
	//获取留言
	function getMes($audioType,$audioID,$page,$dao)
	{
		//$page = 2;
		//echo $audioType;
		//exit;
		$page_size = 6;
		$offset = ($page-1)*$page_size;

		if($audioType=='music')
		{
			$sql_page_total = "select *from muscmmt_info where musID='$audioID' ";
		}
		else if($audioType=='radio')
		{
			$sql_page_total = "select *from radcmmt_info where radID='$audioID' ";
		}
		
		$total = $dao->fetchCou($sql_page_total);
		//echo $total;
		$pagemax = ceil($total/$page_size);
		
		if($audioType=='music')
		{
			$sql_page = "select *from muscmmt_info where musID='$audioID' order by id desc limit $offset,$page_size";
		}
		else if($audioType=='radio')
		{
			$sql_page = "select *from radcmmt_info where radID='$audioID' order by id desc limit $offset,$page_size";
		}
		
		
		$page_list = $dao->fetchAll($sql_page);
		//$number = ($pagemax-$page)*$page_size+1;
		$number = $total-($page-1)*$page_size;
		$res['page'] = $page;
		$res['total']    = $total;
		$res['pagesize'] = $pagemax;
		$res['siye']     = '又一个夏末';
		$res['commet']   = array();
		foreach($page_list as $page_meb):
		$mes['number']   = $number;
 		$mes['content'] = $page_meb['content'];
		$mes['addtime'] = $page_meb['addtime'];
		$number --;
		array_push($res['commet'], $mes);
		endforeach;
		//echo '为啥';
		//exit;
		echo json_encode($res);

    }
}


$comment = new Comment();

if($musID)
{
	$audioType = 'music';
	$comment->sendMes($audioType,$musID,$content,$addtime,$dao_mysqli);
	exit;
}
else if($radioID)
{
	$audioType = 'radio';
	$comment->sendMes($audioType,$radioID,$content,$addtime,$dao_mysqli);
	exit;
}


if($page)
{
	$comment->getMes($type,$audioID,$page,$dao_mysqli);
}


?>
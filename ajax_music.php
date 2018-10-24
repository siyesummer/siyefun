<?php
require 'lib/init.php';
$type = isset($_POST['type'])?$_POST['type']:'';
$page = isset($_POST['page'])?$_POST['page']:1;
$page = intval($page);
$mus_num = 1;
if($type=='')
{
	echo '我要加入你的车队';
	exit;
}

//echo $type;
$page_size = 10;
$sql_page_total = "select *from siyemus_info";
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
$sql_page = "select *from siyemus_info order by id  limit $offset,$page_size";
//$sql_page = "select *from mes_info1 order by id desc";
$page_list = $dao_mysqli->fetchAll($sql_page);


if(!$page_list)
{
	echo '没有音频文件';
	exit;
}
?>
<table align="center" style="text-align: center;width: 500px">
<?php foreach($page_list as $page_meb):?>
	<tr style="text-align: center">
		<th>
		<a href="javascript:void(0)" onClick="select_mus('<?php echo $page_meb['id'];?>')" title="<?php echo $page_meb['musname'];?>">
		<span id="<?php echo 'mus'.$page_meb['id'];?>" name="music" style="color: silver"><?php echo $page_meb['musname'];?></span>
		</a>
		</th>
	</tr>
	<?php $mus_num +=1;?>	  
<?php endforeach;?>
</table>
<input type="hidden" value="<?php echo $page;?>" id="mus_hitnum">
<input type="hidden" value="<?php echo $offset;?>" id="mus_hitfir">
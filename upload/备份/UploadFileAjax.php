<?php
//header("Cache-Control:no-cache");
header("Content-Type:text/xml;charset=utf-8");
require '../lib/init.php';
$MaxPicsize   = 500000;//500K左右
$MaxMussize   = 50000000;//50M左右
$ajax_picfile = isset($_FILES["ajax_picfile"])?$_FILES['ajax_picfile']:'';
$ajax_musfile = isset($_FILES["ajax_musfile"])?$_FILES['ajax_musfile']:'';
$ajax_radiofile = isset($_FILES["ajax_radiofile"])?$_FILES['ajax_radiofile']:'';
$ajax_password = isset($_POST["password"])?$_POST["password"]:'';

$picfile_dir   = "../picture/";
$musfile_dir   = "../music/";
$radiofile_dir = "../radio/";
$is_file       = 'false';
$mesinfo       = "<meses>";
$mesinfo      .= "<hit_mes>";
$hit_mes       = "提示信息:";
$hit_mus       = "上传音乐提示";
$mus_type      = '音频类型';

$isTrue = 'false';


//echo "<hit_mes>厉害了</hit_mes>";
//exit;
//echo "<meses><isTrue>".$isTrue."</isTrue></meses>";
//echo "<meses><isTrue>你说啥</isTrue></meses>";
	//exit;
if($ajax_password)
{
	$sql = "select *from password_info where password='$ajax_password' ";
	
	$total = $dao_mysqli->fetchCou($sql);
	
	if($total>0)
	{
		$isTrue = 'true';
	}
	echo "<isTrue>".$isTrue."</isTrue>";
	exit;
}

//为带有中文名称的文件进行编码设置
function escape($str) {
	//str_replace("world","Shanghai","Hello world!");
  $a = str_replace('\\', '%', substr(json_encode($str), 1, -1));
  $b = str_replace('%','a',$a);
	return $b;
}
function unescape($str) {
  return json_decode('"'.str_replace('%', '\\', $str).'"');
}
if (($ajax_picfile=='')&&($ajax_musfile=='')&&($ajax_radiofile==''))
	{
		//echo "<script>location.href='index.php';
			//</script>";
		//exit();
	    
		$hit_mes = '没有选择文件';
	    $mesinfo.= $hit_mes."</hit_mes>";
	    $mesinfo .= "<file_name>"."no_file"."</file_name>";
	    $mesinfo .= "<is_file>".'no_file'."</is_file>";
		$mesinfo .= "<hit_mus>".$hit_mus."</hit_mus>";
		$mesinfo .= "<mus_id>".'无音乐ID'."</mus_id>";
		$mesinfo .= "<mus_type>".$mus_type."</mus_type>";
		
	    $mesinfo.= "</meses>";
	    echo $mesinfo;
	    //echo $hit_mes;
	    exit;
	}

if($ajax_picfile
	   &&(($ajax_picfile["type"]=="image/gif")
		||($ajax_picfile["type"]=="image/jpeg")
		||($ajax_picfile["type"]=="image/pjpeg")
		||($ajax_picfile["type"]=="image/png"))
	   &&($ajax_picfile["size"]<$MaxPicsize)
	  )
	{
		if($ajax_picfile["error"]>0)
		{
			$hit_mes .= "上传错误,错误类型为:".$ajax_picfile.["error"];
		}
			
		else
		{
			//$ajax_picfile["name"] = escape($ajax_picfile["name"]);
			//$hit_mes .= "上传文件类型:"."picture;";
			$hit_mes .= "图片名称:".$ajax_picfile["name"].";";
//			$hit_mes .= "图片类型:".$ajax_picfile["type"].";";
//			$hit_mes .= "图片大小:".sprintf("%.2f",($ajax_picfile["size"]/1024))."kb".";";
//			$hit_mes .= "临时存储名称:".$ajax_picfile["tmp_name"].";";
		}
	
		$ajax_picfile["name"] = escape($ajax_picfile["name"]);
		if(file_exists($picfile_dir.$ajax_picfile["name"]))
		{
			
			$is_file = 'true';
			move_uploaded_file($ajax_picfile["tmp_name"],$picfile_dir.$ajax_picfile["name"]);
			//$ajax_picfile["name"] = unescape($ajax_picfile["name"]);
			$hit_mes .= "原图片文件".$ajax_picfile["name"]."已重新上传";

		}
		else
		{
			//$ajax_picfile["name"] = escape($ajax_picfile["name"]);
			$is_file = 'true';
			move_uploaded_file($ajax_picfile["tmp_name"],$picfile_dir.$ajax_picfile["name"]);
			$hit_mes .= "图片文件已上传到".$picfile_dir."文件夹";
			
		}
	}
	else if($ajax_picfile)
	{
		$hit_mes .= "上传的图片文件不符合要求";
	}


//$MaxMussize = 500;
if($ajax_musfile
	   &&(($ajax_musfile['type']=='audio/mp3')
		  ||($ajax_musfile['type']=='audio/wav')
		  ||($ajax_musfile['type']=='audio/mpeg'))
	   &&($ajax_musfile['size']<($MaxMussize))
	  )
	{
		if($ajax_musfile['type']=='audio/wav')
		{
			$mus_type = '.wav';
			
		}
		else if($ajax_musfile['type']=='audio/mp3')
		{
			$mus_type = '.mp3';
		}
		else if($ajax_musfile['type']=='audio/mpeg')
		{
			$mus_type = '.mpeg';
		}
		if($ajax_musfile['error']>0)
		{
			$hit_mes .= "上传音频错误,错误类型为:".$ajax_musfile['error'];
		
		}
		else
		{
			
			//$hit_mes .="上传文件类型:".'music;';
			$hit_mes .="音乐名称:".$ajax_musfile["name"].';';
			$hit_mes .="音频类型:".$ajax_musfile["type"].';';
//			//sprintf("%.2f",$num);
			$hit_mes .="音频大小:".sprintf("%.2f",($ajax_musfile["size"]/1024000))."M".";";
		    //$hit_mes .="音频临时存储名称:".$ajax_musfile["tmp_name"].";";
		}
		
		//音乐id为该音乐在数据库中的排序位置
		$sql_page_total = "select *from siyemus_info";
        $total = $dao_mysqli->fetchCou($sql_page_total);
		$music_id = $total+1;
		if($total>50)
		{
			$hit_mes = '音乐列表已达设定上限，暂时无法继续上传';
			$mesinfo.= $hit_mes."</hit_mes>";
			$mesinfo .= "<file_name>"."no_file"."</file_name>";
			$mesinfo .= "<hit_mus>".$hit_mus."</hit_mus>";
			$mesinfo .= "<mus_id>".$music_id."</mus_id>";
			$mesinfo .= "<mus_type>".$mus_type."</mus_type>";
			$mesinfo .= "<is_file>".$is_file."</is_file>";
			$mesinfo.= "</meses>";
			echo $mesinfo;
			exit;
		}
		
		//$ajax_musfile["name"] = escape($ajax_musfile["name"]);
		//mb_convert_encoding($name,"gbk", "utf-8")
		//$music_id = mb_convert_encoding($music_id,"gbk","utf-8");
		//$music_id = escape($music_id);
		$ajax_musfile['name'] = str_replace(".mp3","",$ajax_musfile['name']);
		if($ajax_musfile['name']=="")
		{
			$ajax_musfile['name']=".mp3";
		}
		if(file_exists($musfile_dir.$ajax_musfile["name"]))
		{
			$is_file = 'true';
			move_uploaded_file($ajax_musfile["tmp_name"],$musfile_dir.$music_id.".mp3");
			
			$sql = "insert into siyemus_info(id,musname,mustype) values('{$music_id}','{$ajax_musfile['name']}','$mus_type')";
			
			$res = $dao_mysqli->query($sql);
			
			if($res)
			{
				$hit_mus = '音乐上传成功';
			}
			else
			{
				$hit_mus = '音乐上传失败';
			}
			
			$hit_mes .= "原音频文件".$ajax_musfile["name"]."已重新上传";
			//echo "<script>location.href='index.php?pic_file=re_upload';
			//</script>";
		}
		else
		{
			$is_file = 'true';
		  //mb_convert_encoding();
			move_uploaded_file($ajax_musfile["tmp_name"],$musfile_dir.$music_id.".mp3");
			$sql = "insert into siyemus_info(id,musname,mustype) values('{$music_id}','{$ajax_musfile['name']}','$mus_type')";
			
			$res = $dao_mysqli->query($sql);
			
			if($res)
			{
				$hit_mus = '音乐上传成功';
			}
			else
			{
				$hit_mus = '音乐上传失败';
			}
			//$hit_mes .= "音频文件已上传到".$musfile_dir."文件夹";
		}
	}
else if($ajax_musfile)
{
	echo "我来了";
	$hit_mes .= "上传的音频文件不符合要求";
	
			//$hit_mes .="上传文件类型:".'music;';
			$hit_mes .= "音乐名称:".$ajax_musfile["name"].';';
			$hit_mes .= "音频类型:".$ajax_musfile["type"].';';
			//sprintf("%.2f",$num);
			//$hit_mes .="音频大小:".sprintf("%.2f",($ajax_musfile["size"]/1024000))."M".";";
		    //$hit_mes .="音频临时存储名称:".$ajax_musfile["tmp_name"].";";
	        //$hit_mes .=$hit_mus;
}

if($ajax_radiofile
	   &&(($ajax_radiofile['type']=='audio/mp3')
		  ||($ajax_radiofile['type']=='audio/wav')
		  ||($ajax_radiofile['type']=='audio/mpeg'))
	   &&($ajax_radiofile['size']<($MaxMussize*6))
	  )
	{
		if($ajax_radiofile['type']=='audio/wav')
		{
			$mus_type = '.wav';
			
		}
		else if($ajax_radiofile['type']=='audio/mp3')
		{
			$mus_type = '.mp3';
		}
		else if($ajax_radiofile['type']=='audio/mpeg')
		{
			$mus_type = '.mpeg';
		}
		if($ajax_radiofile['error']>0)
		{
			$hit_mes .= "上传音频错误,错误类型为:".$ajax_radiofile['error'];
		
		}
		else
		{
			
			//$hit_mes .="上传文件类型:".'music;';
			$hit_mes .="音乐名称:".$ajax_radiofile["name"].';';
			$hit_mes .="音频类型:".$ajax_radiofile["type"].';';
//			//sprintf("%.2f",$num);
			$hit_mes .="音频大小:".sprintf("%.2f",($ajax_radiofile["size"]/1024000))."M".";";
		    //$hit_mes .="音频临时存储名称:".$ajax_musfile["tmp_name"].";";
		}
		
		//音乐id为该音乐在数据库中的排序位置
		$sql_page_total = "select *from siyeradio_info";
        $total = $dao_mysqli->fetchCou($sql_page_total);
		$music_id = $total+1;
		if($total>50)
		{
			$hit_mes = '电台列表已达设定上限，暂时无法继续上传';
			$mesinfo.= $hit_mes."</hit_mes>";
			$mesinfo .= "<file_name>"."no_file"."</file_name>";
			$mesinfo .= "<hit_mus>".$hit_mus."</hit_mus>";
			$mesinfo .= "<mus_id>".$music_id."</mus_id>";
			$mesinfo .= "<mus_type>".$mus_type."</mus_type>";
			$mesinfo .= "<is_file>".$is_file."</is_file>";
			$mesinfo.= "</meses>";
			echo $mesinfo;
			exit;
		}
		
		//$ajax_musfile["name"] = escape($ajax_musfile["name"]);
		//mb_convert_encoding($name,"gbk", "utf-8")
		//$music_id = mb_convert_encoding($music_id,"gbk","utf-8");
		//$music_id = escape($music_id);
		$ajax_radiofile['name'] = str_replace(".mp3","",$ajax_radiofile['name']);
		if($ajax_radiofile['name']=="")
		{
			$ajax_radiofile['name']=".mp3";
		}
		if(file_exists($radiofile_dir.$ajax_radiofile["name"]))
		{
			$is_file = 'true';
			move_uploaded_file($ajax_radiofile["tmp_name"],$radiofile_dir.$music_id.".mp3");
			
			$sql = "insert into siyeradio_info(id,radioname,radiotype) values('{$music_id}','{$ajax_radiofile['name']}','$mus_type')";
			
			$res = $dao_mysqli->query($sql);
			
			if($res)
			{
				$hit_mus = '电台上传成功';
			}
			else
			{
				$hit_mus = '电台上传失败';
			}
			
			$hit_mes .= "原音频文件".$ajax_radiofile["name"]."已重新上传";
			//echo "<script>location.href='index.php?pic_file=re_upload';
			//</script>";
		}
		else
		{
			$is_file = 'true';
		  //mb_convert_encoding();
			move_uploaded_file($ajax_radiofile["tmp_name"],$radiofile_dir.$music_id.".mp3");
			$sql = "insert into siyeradio_info(id,radioname,radiotype) values('{$music_id}','{$ajax_radiofile['name']}','$mus_type')";
			
			$res = $dao_mysqli->query($sql);
			
			if($res)
			{
				$hit_mus = '电台上传成功';
			}
			else
			{
				$hit_mus = '电台上传失败';
			}
			//$hit_mes .= "音频文件已上传到".$musfile_dir."文件夹";
		}
	}
else if($ajax_radiofile)
{
	//$hit_mes .= "上传的音频文件不符合要求";
	
			//$hit_mes .="上传文件类型:".'music;';
			$hit_mes .="音乐名称:".$ajax_radiofile["name"].';';
			$hit_mes .="音频类型:".$ajax_radiofile["type"].';';
			//sprintf("%.2f",$num);
			//$hit_mes .="音频大小:".sprintf("%.2f",($ajax_musfile["size"]/1024000))."M".";";
		    //$hit_mes .="音频临时存储名称:".$ajax_musfile["tmp_name"].";";
	        //$hit_mes .=$hit_mus;
}
//echo $_FILES['ajax_picfile']['type']."<br/>";
//<getter>{$row['getter']}</getter>
$mesinfo .= $hit_mes."</hit_mes>";
if($ajax_picfile)
{
	$mesinfo .= "<file_name>".$ajax_picfile['name']."</file_name>";
}
else if($ajax_musfile)
{
	$mesinfo .= "<file_name>".$ajax_musfile['name']."</file_name>";
}
else if($ajax_radiofile)
{
	$mesinfo .= "<file_name>".$ajax_radiofile['name']."</file_name>";
}
$mesinfo .= "<is_file>".$is_file."</is_file>";
$mesinfo .= "<hit_mus>".$hit_mus."</hit_mus>";
$mesinfo .= "<mus_id>".$music_id."</mus_id>";
$mesinfo .= "<mus_type>".$mus_type."</mus_type>";
$mesinfo .= "</meses>";

echo $mesinfo;
//echo $hit_mes;
?>
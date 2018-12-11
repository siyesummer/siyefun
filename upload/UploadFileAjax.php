<?php
//header("Content-Type:text/xml;charset=utf-8");
require '../lib/init.php';

$picfile = isset($_FILES["ajax_picfile"])?$_FILES['ajax_picfile']:'';
$musfile = isset($_FILES["ajax_musfile"])?$_FILES['ajax_musfile']:'';
$radiofile = isset($_FILES["ajax_radiofile"])?$_FILES['ajax_radiofile']:'';
$password = isset($_POST["password"])?$_POST["password"]:'';

$isRadio = false;//判断是否是电台文件

class Upload
{
	public $picfile_dir   = "../picture/";//图片文件存储路径
	public $musfile_dir   = "../music/";//音乐音频文件存储路径
	public $radiofile_dir = "../radio/";//电台音频文件存储路径
	public $isFile        = 'false';//是否有文件
	public $isUpload      = 'false';
	public $isTrue        = 'false';//判断口令是否正确
	public $fileType      = 'none';//文件类型
	public $fileDir       = '文件路径初始化';
	public $fileName      = '文件名初始化';
	public $MaxPicsize    = 500000;//500K左右
	public $MaxAudsize    = 50000000;//50M左右
	
	//为带有中文名称的文件进行编码设置
	function escape($str) 
	{
		//str_replace("world","Shanghai","Hello world!");
	    $a = str_replace('\\', '%', substr(json_encode($str), 1, -1));
	    $b = str_replace('%','a',$a);
		return $b;
	}
	function unescape($str) 
	{
	  return json_decode('"'.str_replace('%', '\\', $str).'"');
	}
	
	//判断是否是图片
	function isPicture($file)
	{
		if($file
			&&(($file["type"]=="image/gif")
			||($file["type"]=="image/jpeg")
			||($file["type"]=="image/pjpeg")
			||($file["type"]=="image/png"))
	  	)
			{
				return true;
			}
		
		return false;
	}
	
	//判断是否是音频
	function isAudio($file)
	{
		if($file
		   &&(($file['type']=='audio/mp3')
			  ||($file['type']=='audio/wav')
			  ||($file['type']=='audio/mpeg'))
		  )
		{
			return true;
		}
		
		return false;
	}
	
	//检测是否有信息
	function isBlank($pic,$mus,$rad,$pwd)
	{
		//echo $this->picfile_dir;
		
		if (($pic=='')&&($mus=='')&&($rad=='')&&($pwd==''))
			{
				$res['hit_mes']   = '没有选择文件';
				$res['is_file']   = $this->isFile;
				$res['is_upload'] = $this->isUpload;
				$res['file_type'] = $this->fileType;
				$res['file_dir']  = $this->fileDir;
				$res['file_name'] = $this->fileName;
				echo json_encode($res);
				exit;
			}
	}
	
	//检测口令
	function isPass($pwd,$dao)
	{
		$sql = "select *from password_info where password='$pwd' ";

		$total = $dao->fetchCou($sql);

		if($total>0)
		{
			//$this->isTrue = 'true';
			return true;
		}
		return false;
	}
	
	//上传文件
	function uploadFile($file,$dao,$radio)
	{
		$hit_mes = '提示信息:';
		if($this->isPicture($file))
		{
			
			$this->isFile = 'true';
			if($file["size"]<($this->MaxPicsize))
			{
				if($file["error"]>0)
				{
					$hit_mes .= "上传错误,错误类型为:".$file["error"].';';
				}
				else
				{
					//$file["name"] = $this->escape($file["name"]);
					
					$hit_mes .= "图片名称:".$file["name"].";";
					//$hit_mes .= "图片类型:".$file["type"].";";
					//$hit_mes .= "图片大小:".sprintf("%.2f",($file["size"]/1024))."kb".";";
					//$hit_mes .= "临时存储名称:".$file["tmp_name"].";";
				}
				
				$file["name"] = $this->escape($file["name"]);
			
				
				if(file_exists($this->picfile_dir.$file["name"]))
				{
					$hit_mes .= "该文件已存在;";
				}
				else
				{
					$this->fileName = $file["name"];
					$this->fileDir  = $this->picfile_dir;
					$this->fileType = 'picture';
					$this->isUpload = 'true';
					move_uploaded_file($file["tmp_name"],$this->picfile_dir.$file["name"]);
					//$hit_mes .= "图片文件已上传到".$this->picfile_dir."文件夹";
				}
			}
			else
			{
				$hit_mes .= '上传的图片文件不符合要求;';
			}
			
		}
		else if($this->isAudio($file))
		{
			
			$this->isFile = 'true';
			if($file["error"]>0)
				{
					$hit_mes .= "上传错误,错误类型为:".$file["error"].';';
				}
			else
				{
					//$file["name"] = $this->escape($file["name"]);
					
					$hit_mes .= "音频名称:".$file["name"].";";
					//$hit_mes .= "音频类型:".$file["type"].";";
					//$hit_mes .= "音频大小:".sprintf("%.2f",($file["size"]/1024))."kb".";";
					//$hit_mes .= "临时存储名称:".$file["tmp_name"].";";
				}
			
			if($file['type']=='audio/wav')
			{
				$mus_type = '.wav';

			}
			else if($file['type']=='audio/mp3')
			{
				$mus_type = '.mp3';
			}
			else if($file['type']=='audio/mpeg')
			{
				$mus_type = '.mpeg';
			}
			
				//音乐id为该音乐在数据库中的排序位置
			if($radio)
			{
				$this->fileType = 'radio';
				$sql_page_total = "select *from siyeradio_info";
			}
			else
			{
				$this->fileType = 'music';
				$sql_page_total = "select *from siyemus_info";
			}
				
				$total = $dao->fetchCou($sql_page_total);
				$music_id = $total+1;
				if($total>100)
				{
					$hit_mes .= "音频已达数目设定上限，暂时无法继续上传;";
					
					$res['hit_mes']   = $hit_mes;
					$res['is_file']   = $this->isFile;
					$res['is_upload'] = $this->isUpload;
					$res['file_type'] = $this->fileType;
					$res['file_dir']  = $this->fileDir;
					$res['file_name'] = $this->fileName;
					$res['isRadio']   = $radio;
					echo json_encode($res);
					exit;
				}
			
			$file['name'] = str_replace(".mp3","",$file['name']);
			if($file['name']=="")
			{
				$file['name']=".mp3";
			}
			
			if(file_exists($this->musfile_dir.$file["name"])&&(!$radio))
				{
					$hit_mes .= "该音乐文件已存在;";
				}
			else if(file_exists($this->radiofile_dir.$file["name"])&&$radio)
				{
					$hit_mes .= "该电台文件已存在;";
				}
			else
				{
					
					
					if($radio&&$file["size"]<($this->MaxAudsize*6))
					{
						move_uploaded_file($file["tmp_name"],$this->radiofile_dir.$music_id.".mp3");
						$hit_mes .= '电台文件上传成功;';
						$this->fileDir = $this->radiofile_dir;
						$this->isUpload = 'true';
						$this->fileName = $music_id;
			
						$sql = "insert into siyeradio_info(id,radioname,radiotype) values('{$music_id}','{$file['name']}','$mus_type')";
						
						$num = $dao->query($sql);

						if($num)
						{
							$hit_mes .= '数据库存储电台音频信息成功;';
						}
						else
						{
							$hit_mes .= '数据库存储电台音频信息失败;';
						}
					}
					else if($file["size"]<($this->MaxAudsize*1))
					{
						
						move_uploaded_file($file["tmp_name"],$this->musfile_dir.$music_id.".mp3");
						$hit_mes .= '音乐文件上传成功;';
						$this->fileDir = $this->musfile_dir;
						$this->isUpload = 'true';
						$this->fileName = $music_id;
						//$res['hit_mes'] .= "图片文件已上传到".$this->picfile_dir."文件夹";
						$sql = "insert into siyemus_info(id,musname,mustype) values('{$music_id}','{$file['name']}','$mus_type')";
						
						$num = $dao->query($sql);

						if($num)
						{
							$hit_mes .= '数据库存储音乐音频信息成功;';
						}
						else
						{
							$hit_mes .= '数据库存储音乐音频信息失败;';
						}
						
					}
					
			
				}
		}
		
		$res['hit_mes']   = $hit_mes;
		$res['is_file']   = $this->isFile;
		$res['is_upload'] = $this->isUpload;
		$res['file_type'] = $this->fileType;
		$res['file_dir']  = $this->fileDir;
		$res['file_name'] = $this->fileName;
		
		echo json_encode($res);
		exit;
	}
}



$upload = new Upload();
//$password = '石悦';
$upload->isBlank($picfile,$musfile,$radiofile,$password);
//$upload->isPicture($password);

if($password)
{
	if($upload->isPass($password,$dao_mysqli))
	{
		$res['hit_mes']   = 'true';
	}
	else
	{
		$res['hit_mes']   = 'false';
	}
	
	echo json_encode($res);
	exit;
}

//$fileObj = $picfile||$musfile||$radiofile;
//$fileObj = $musfile;

if($radiofile)
{
	$isRadio = true;
}

if($musfile)
{
	$upload->uploadFile($musfile,$dao_mysqli,$isRadio);
}
else if($radiofile)
{
	$upload->uploadFile($radiofile,$dao_mysqli,$isRadio);
}


?>

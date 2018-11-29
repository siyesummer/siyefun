// JavaScript Document
var fileType ='';//上传文件类型
var myxmlhttp="";
var type_hit ="";
function $(id)
{
	return document.getElementById(id);
}


function getXmlHttpObject()
{
	var xmlHttpRequest;
	if(window.ActiveXObject)
		{
			xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
			//alert('ie');
		}
	else 
		{
			xmlHttpRequest = new XMLHttpRequest();
			//alert('谷歌');
		}
	return xmlHttpRequest;
}

function send_ac()
{
//alert ("?");
	//0: 请求未初始化
//	1: 服务器连接已建立
//	2: 请求已接收
//	3: 请求处理中
//	4: 请求已完成，且响应已就绪
	$('hit_musfile').style.color = "green";
	if(myxmlhttp.readyState==1)
		{
			if(fileType=='music')
				{
					$('hit_musfile').innerText = "服务器连接已建立";
					console.log($('hit_musfile').innerText);
				}
			else if(fileType=='radio')
				{
					$('hit_radiofile').innerText = "服务器连接已建立";
					console.log($('hit_radiofile').innerText);
				}
		}
	if(myxmlhttp.readyState==2)
		{
			if(fileType=='music')
				{
					$('hit_musfile').innerText = "上传文件请求已接收";
					console.log($('hit_musfile').innerText);
				}
			else if(fileType=='radio')
				{
					$('hit_radiofile').innerText = "上传文件请求已接收";
					console.log($('hit_radiofile').innerText);
				}
		}
	if(myxmlhttp.readyState==3)
		{
			if(fileType=='music')
				{
					$('hit_musfile').innerText = "正在上传文件，请耐心等待";
					console.log($('hit_musfile').innerText);
				}
			else if(fileType=='radio')
				{
					$('hit_radiofile').innerText = "正在上传文件，请耐心等待";
					console.log($('hit_radiofile').innerText);
				}
		}
	if(myxmlhttp.readyState==4)
		{
			//alert ('?');
			//$('show_img').src = "../music/1.mp3";
			$('show_mus').src = "";
			if(myxmlhttp.status>=200&&myxmlhttp.status<300||myxmlhttp.status==304)
				{
				
					var mes = myxmlhttp.responseText;
					//console.log(mes);
					var mesRes_value = eval("("+mes+")");
					console.log(mesRes_value);
					var file_type = mesRes_value.file_type;
					var is_file = mesRes_value.is_file;
					var is_upload = mesRes_value.is_upload;
					var hit_mes = mesRes_value.hit_mes;
					var file_dir = mesRes_value.file_dir;
					var file_name = mesRes_value.file_name;
					
					if(hit_mes=='没有选择文件')
						{
							upfileHit(hit_mes);
							return;
						}
					
					if(is_file=='false')
						{
							var status1 = hit_mes+'文件上传失败';
							upfileHit(status1);
							return;
						}
					
					if(is_upload=='false')
						{
							var status2 = hit_mes+'文件上传失败';
							upfileHit(status2);
							return;
						}
						
				
					if(file_type=='picture')
						{
							
							$('hit_picfile').innerText = hit_mes;
							$('show_img').src = file_dir+file_name;
						}
					else if(type_hit=='music')
						{
							$('show_mus').controls = 'controls';
							$('show_mus').src = file_dir+file_name+'.mp3';
							
							$('hit_musfile').innerText = hit_mes;
	
						}
					else if(type_hit=='radio')
						{
							$('hit_radiofile').innerText = hit_mes;
						}
				}
			console.log($('hit_radiofile').innerText);
		}
}


function send_file(file_type)
{
	myxmlhttp = getXmlHttpObject();
	if(myxmlhttp)
		{
			type_hit = file_type;
			var url="uploadfileAjax.php";
			var formData = new FormData();
			if(file_type=='picture')
				{
					formData.append("ajax_picfile",$('pic_file').files[0]);
				}
			else if(file_type=='music')
				{
					formData.append("ajax_musfile",$('mus_file').files[0]);
				}
			else if(file_type=='radio')
				{
					formData.append("ajax_radiofile",$('radio_file').files[0]);
				}
			
			myxmlhttp.open("post",url,true);
			//myxmlhttp.setRequestHeader("Content-Type","multipart/form-data");//传递formdata中的东西，不需要设置header，否则会出错
			myxmlhttp.send(formData);
			myxmlhttp.onreadystatechange=send_ac;
		}
	
}


function ajax_fileup(file_type)
{
	fileType = file_type;
	send_file(file_type);
	//$('hit').innerText = file_type;
}

$('summer').onkeyup = function(event){
	var keycode = event.keyCode;
	//console.log(keycode);
	if(keycode==13&&this.value.length>0)
		{
			show_summer(this.value);
			$("hit_summer").innerText = "口令验证中";
		}
	else if(keycode==13&&this.value.length==0)
		{
			$("hit_summer").innerText = "口令不能为空";
		}
};

function send_pa(){
	
	if(myxmlhttp.readyState==4)
		{
			if(myxmlhttp.status>=200&&myxmlhttp.status<300||myxmlhttp.status==304)
				{
					var mes = myxmlhttp.responseText;
					var mesRes_value = eval("("+mes+")");
					var hit_mes = mesRes_value.hit_mes;
					//console.log(hit_mes,typeof hit_mes);
					//return;
					
					if(hit_mes=='true')
						{
							$("ajax_radio").style.display = "inline";
							$("hit_summer").innerText = "验证成功";
							$('summer').value = '';
						}
					else
						{
							$("hit_summer").innerText = "口令错误";
							$('summer').value = '';
							$("ajax_radio").style.display = "none";
						}
				}
			
		}

}

//口令验证
function show_summer(value){
	myxmlhttp = getXmlHttpObject();
	if(myxmlhttp)
		{
			var url="uploadfileAjax.php";
			var data = "password="+value;
			myxmlhttp.open("post",url,true);
			myxmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			myxmlhttp.onreadystatechange=send_pa;
			myxmlhttp.send(data);
			//console.log(value);
		}

}

//上传文件提示
function upfileHit(mes){
	if(fileType=='music')
	{
		$('hit_musfile').innerText = mes;
									
	}
	else if(fileType=='radio')
	{
		$('hit_radiofile').innerText = mes;
	}
	else if(fileType=='picture')
	{
		$('hit_picfile').innerText = mes;
	}						
}







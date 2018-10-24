// JavaScript Document
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
var myxmlhttp="";

function getmus_ac()
{
//alert ("???");
	if(myxmlhttp.readyState==4)
		{
			
			if(myxmlhttp.status==200)
				{
					//var mesRes = myxmlhttp.responseXML;
					var mesRes_value = myxmlhttp.responseText;
					
			
					//page_last = pagemax_value;
					//alert (page_last);
					
					mus_list.innerHTML = mesRes_value;
					pagecur();
					muscurfir();
					//setTimeout("pagecur()",300);
					//setTimeout("muscurfir()",300);
					//page_final.innerHTML = pagemax_value;
					//page_now.innerHTML =page_num;
				}
		}
}
var page = 1;

//当前页第一首歌的编号ID
var mus_first = 1;
function muscic_list(type)
{
	//alert("?");
	//创建对象
	myxmlhttp = getXmlHttpObject();
	var url="ajax_music.php";
	var data="type="+type+"&page="+page;
	//window.alert (data);
	myxmlhttp.open("post",url,true);
	myxmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	myxmlhttp.onreadystatechange=getmus_ac;
	myxmlhttp.send(data);
	
}

//记录当前页
var page_current = 1;
function pagecur(){
	page_current = document.getElementById('mus_hitnum').value;
	//console.log("page_current:");
	//console.log(page_current);

}

function muscurfir(){
	mus_first = parseInt(document.getElementById('mus_hitfir').value)+1;
	//console.log("mus_first");
	//console.log(mus_first);

}

function change_page(type)
{
	
	page = document.getElementById('mus_hitnum').value;
	//muscic_list(type);

	//setTimeout("pagecur()",300);
	//setTimeout("muscurfir()",300);
}
function mus_init()
{
	page = 1;
	muscic_list('get_mus');
	//setTimeout("pagecur()",300);
	//setTimeout("muscurfir()",300);
}
//setTimeout('mus_init()',300);

function t()
	{
		alert("情况");
	}

// JavaScript Document
var page = 1;
//当前页第一首歌的编号ID
var mus_first = 1;
//记录当前页
var page_current = 1;
//页数
var page_max = 1;

function createMusic(mus_mes)
{
	var spanid = "mus"+mus_mes.id;
	var $music_one = $(
	"<tr style='text-align: center'>"+
		"<th>"+
		"<a href='javascript:void(0)' onClick='select_mus("+mus_mes.id+")'>"+
		"<span id='"+spanid+"'"+" "+"name='music' style='color: silver'>"+
		mus_mes.musname+
		"</span>"+
		"</a>"+
		"</th>"+
	"</tr>"
	);

	return $music_one;

}
function Jsonmuscic_list(type)
{
	
	$.ajax({
		type:"get",
		url:"ajaxJson_music.php",
		data:"type="+type+"&page="+page,
		success:function(resText){
			var mesRes_value = eval("("+resText+")");
			//console.log(mesRes_value);
			var mes = mesRes_value.mes;
			$("#mus_list table").html("");
			if(mes=="没有音频文件")
				{
					$("#mus_list table").html("没有音频文件");
					return;
				}
			
			mus_first = mesRes_value.mus_first+1;
			page_current = mesRes_value.page;
			page_max = mesRes_value.pagemax;
			var mus_list = mesRes_value.mus_list;
			page = page_current;
			
			$(".music_page span").eq(0).html(page_current+"/"+page_max);
			//console.log("第一首"+mus_first);
			//console.log("当前页"+page_current);
			$.each(mus_list,function(key,val){
				//console.log(val);
				var music = createMusic(val);
				$("#mus_list table").append(music);

});

},
		error:function(xhr){
			console.log(xhr.status);
}
	});

}
function Jsonmus_init()
{
	page = 1;
	Jsonmuscic_list('get_mus');
}
setTimeout('Jsonmus_init()',300);

function Jsonchange_page(type)
{
	Jsonmuscic_list(type);
}
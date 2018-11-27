// JavaScript Document
//音乐列表处理
//"<a href='javascript:void(0)' onClick='select_mus("+mus_mes.id+")'>"+

(function(window){
	var MusList = function(){
		return new MusList.prototype.init();

	}
	MusList.prototype = {
		constructor:MusList,
		init:function(){

		},
		musFirst:0,
		pageCurrent:1,
		pageLast:1,
		musList:[],
		audioType:'music',
		//处理歌曲条目信息
		Jsonmuscic_list:function(type){
			var $this = this;
			$this.musList = [];
			$.ajax({
				type:"get",
				url:"ajaxJson_music.php",
				data:"type="+type+"&page="+$this.pageCurrent+"&audioType="+$this.audioType,
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
					else if(mes=="没有电台文件")
						{
							$("#mus_list table").html("没有电台文件");
							return;
						}

					$this.musFirst = mesRes_value.mus_first;
					$this.pageCurrent = mesRes_value.page;
					$this.pageLast = mesRes_value.pagemax;
					$this.musList = mesRes_value.mus_list;
					

					$(".music_page span").eq(0).html($this.pageCurrent+"/"+$this.pageLast);
					
					musplay.musicList = mesRes_value.mus_list;
					//console.log(musplay.musicList);
					$.each($this.musList,function(key,val){
						//console.log(val);
						var music = $this.createMusic(key,val);
						$("#mus_list table").append(music);

					});

				},
				error:function(xhr){
					console.log(xhr.status);
				}
			});

		},
		//创建歌曲条目
		createMusic:function(index,mus_mes){
			
			if(this.audioType=='music')
				{
					var $music_one = $(
					"<tr style='text-align: center' class='summer'>"+
						"<th>"+
						"<a href='javascript:void(0)' >"+
						"<span id='"+mus_mes.id+"'"+" "+"lyr='"+mus_mes.lyric+"'"+" "+"name='music' style='color: silver' >"+
						mus_mes.musname+
						"</span>"+
						"</a>"+
						"</th>"+
					"</tr>"
					);
				}
			else if(this.audioType=='radio')
				{
					var $music_one = $(`
						<tr style='text-align: center' class='winter'>
							<th>
							<a href='javascript:;' >
							<span id=${mus_mes.id} lyr=${mus_mes.lyric}  name='radio' style='color: silver' >
							${mus_mes.musname}
							</span>
							</a>
							</th>
						</tr>
					`);
				}
			
			$music_one.get(0).index = index;
			$music_one.get(0).mus_mes = mus_mes;
			//console.log($music_one.get(0).index);
			//console.log($music_one.get(0).mus_mes);

			return $music_one;
		},
		//歌区页面初始化
		Jsonmus_init:function(){
			$(".musiclist h3").html("音乐列表");
			$(".musiclist span").eq(0).html("首次加载歌曲需要10秒左右 &nbsp;5M音频上传需要30秒左右");
			this.pageCurrent = 1;
			this.audioType = 'music';
			this.Jsonmuscic_list('get_mus');
		},
		//歌曲翻页
		Jsonchange_page:function(type){
			this.Jsonmuscic_list(type);
		},
		//电台页面初始化
		radioInit:function(){
			$(".musiclist h3").html("电台频道");
			$(".musiclist span").eq(0).html("每周日66和你 不见不散");
			this.pageCurrent = 1;
			this.audioType = 'radio';
			this.Jsonmuscic_list('get_radio');
		},
		
	}
	
	MusList.prototype.init.prototype = MusList.prototype;
	window.MusList = MusList;
})(window);

//新建歌曲列表对象
var musList = new MusList();

setTimeout('musList.Jsonmus_init()',300);

$(".music_page input").eq(0).click(function(){
	musList.Jsonchange_page('before');
});
$(".music_page input").eq(1).click(function(){
	musList.Jsonchange_page('next');
});


// JavaScript Document

$audio = $("audio");
var musplay = new MusPlay($audio);//音乐对象

var $progressbar = $(".progressbar");
var $cur         = $(".cur");
var $btn         = $(".cur .btn");

var $curr_bg     = $(".curr_bg");
var $curr        = $(".curr");
var $btn_vol     = $(".curr .btn_vol");

var progress = new Progress($progressbar,$cur,$btn);//进度条对象
var volPro = new Progress($curr_bg,$curr,$btn_vol);//音量对象
var lyr;//歌词对象
var isLyr;//是否有歌词
var runindex = -2;//歌词滚动标记
var isFirstObj = true;
var p=0;
var q=0;

//点击改变进度
progress.proClick(function(value){
	q++;
	//console.log("点击",q);
	musplay.musSeekto(value);
});

//拖拽改变进度	
progress.proMousemove(function(value){
	p++;
	//console.log("移动",p);
	musplay.musSeekto(value);
});

//点击改变音量
volPro.volClick(function(value){
	musplay.volSeekto(value);
	//console.log(value);
});
//拖拽改变进度
volPro.volMousemove(function(value){
	musplay.volSeekto(value);
	//console.log(value);
});


//选择音乐
$("#mus_list").delegate("tr","click",function(){
	is_music = true;
	$(this).find("span").css({
		color:"black"
	});
	$(this).siblings().find("span").css({
		color:"silver"
	});
	//console.log($(this));
	$(".btns a").eq(1).addClass("pause");
	$(".lyc_album ul").eq(0).removeClass("album_pause");
	//mus_one.play();
	$(".curtime span").css("opacity",1);
	var index = $(this).get(0).index;
	var message = $(this).get(0).mus_mes;
	isLyr = message.lyric;
	$(".lyric ul").empty();
	//切换歌曲时必须停止动画，否则歌词无法立即同步
	$(".lyric ul").stop().animate({
			marginTop:0
				},10);
	if(isLyr=="not_file")
		{
			$(".lyric ul").html("<li>暂无歌词</li>");

		}
	else if(musList.audioType=='radio')
		{
			$(".lyric ul").html(isLyr);
		}
	else
		{
			lyr = new Lyric("Lyric/"+isLyr);
			lyr.loadLyric(function(){
			//console.log("来了");
			$.each(lyr.lyricText,function(index,ele){
				//console.log(ele);
				var $li = $("<li>"+ele+"</li>");
				$(".lyric ul").append($li);
			})

			});
			
		}
	//console.log(index);
	//console.log(message);
	//console.log(isLyr);
	musplay.selectMusic(index,message);
	musplay.musState();

});

//播放暂停按钮事件
$(".btns a").eq(1).click(function(){
	musplay.playToggle();

});

//下一首
$(".btns a").eq(2).click(function(){
	$("#mus_list tr").eq(musplay.nextIndex()).trigger("click");
	//console.log("下一首");
	//console.log(musplay.nextIndex(is_music));

});

//上一首
$(".btns a").eq(0).click(function(){
	$("#mus_list tr").eq(musplay.preIndex()).trigger("click");
	//console.log("上一首");
	//console.log(musplay.nextIndex(is_music));

});

//歌曲播放监听
musplay.updateTime(function(current,duration,strTime){
	$(".curtime span").eq(0).text(strTime);
	//console.log("isMove",progress.isMove);
	//console.log(current);
	var porPer = current/duration;
	//console.log(porPer);
	progress.setProgress(porPer);
	
	if(current==duration)
		{
			//$(".btns a").eq(1).removeClass("pause");
			musplay.playModel();
		}
	
	if($audio.get(0).readyState==4)
		{
			$(".btn i").eq(0).removeClass("btn_load");
		}
	else
		{
			$(".btn i").eq(0).addClass("btn_load");
		}
	
	if(isLyr=="not_file"||musList.audioType=='radio')
			return;
		
		var lyrIndex = lyr.currentIndex(current)-1;
		//if(typeof (lyrIndex) == "undefined"||isNaN(lyrIndex))
		if(!lyrIndex)
			{
				return;
			}
			
		//console.log(lyrIndex);
		//lyr.currentIndex(mc);
		
		var $curli = $(".lyric ul li").eq(lyrIndex);
		$curli.addClass("lyccur");
		$curli.siblings().removeClass("lyccur");
		//console.log(lyr.reStart);
		//console.log(lyr.marginSize);
		//console.log(lyr.lineCenter);
		if(lyrIndex<=lyr.lineCenter&&(!lyr.reStart))
			return;
		if(runindex!=lyrIndex)
			{
				runindex = lyrIndex;
				$(".lyric ul").stop().animate({
					marginTop:(-lyrIndex+lyr.lineCenter)*lyr.marginSize
				},500);
			}

});

//音量控制板块显示设置
$(".control a").eq(0).click(function(){
	$(".control .barbg").toggle();

});

//定时器显示
$(".Countdown").click(function(){
	$(".countset").toggle();

});
$(".Countdown a").eq(0).mouseenter(function(){
	//console.log("来了");
	$(this).attr("title","输入分钟数定时，输入0取消定时");

});

//播放模式切换
$(".control a").eq(1).click(function(){
	
	musplay.playModchange($(this));
	//$(this).addClass("icn_shuffle");
});

//设置定时
$(".counttext").keydown(function(event){
	musplay.setCountdown($(this),$(".Countdown span").eq(0),event);
});

//音乐频道
$(".topmenulist a").eq(1).click(function(){
	musList.pageCurrent = 1;
	musList.Jsonmus_init();
	console.log("音乐频道首页");
});

//电台频道
$(".topmenulist a").eq(2).click(function(){
	musList.radioInit();
	console.log("心灵砒霜首页");
});



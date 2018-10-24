// JavaScript Document
var is_music = false;//是否选中了音乐
var musicrun_count = 0;//滚动条
var event_count = 0;//音乐加载完毕
var is_move = false;//是否按住了进度条按钮
var music_model = 'loop';//初始化播放模式

//进度条滚动 未选中歌曲进度条不滚动
var mus_cur;
var mus_start;

var munite = 0;
var second = 0;
var mus_mun = 0;
var mus_sec = 0;
var musicTime  = 0; 
var muscurTime = 0;
//Math.round(num / total * 10000) / 100.00
var timePercent = 0;
var upWidth = 0;


//
$(".musiclist").hover(function(){
	$(".music_page").stop();
	//$(".music_page").slideDown();
	//$(".music_page").slideUp();

},function(){
	$(".music_page").stop();
	//$(".music_page").slideDown();
	//$(".music_page").slideUp();

});
//下一页
$(".music_page a").eq(0).click(function(){
	//change_page('before');
	Jsonchange_page('before');

});

//上一页
$(".music_page a").eq(1).click(function(){
	//change_page('next');
	Jsonchange_page('next');

});

//设置滚动条样式
(function($){
        $(window).on("load",function(){
            $(".mus_comune").mCustomScrollbar();
        });
    })(jQuery);

$(function(){
	$(".mus_comune").mCustomScrollbar();

});

//播放暂停按钮事件
$(".btns a").eq(1).click(function(){
		//alert (is_music);
		//切换暂停与播放图标
		$(this).toggleClass("pause");
		if(is_music)
			{
				play_mus();
			}
});

//下一首
var mus_number = 0;
var mus_total = 0;
var mus_final = 1;
function next_mus()
{
	if(is_music)
		{
			mus_final = parseInt(mus_first)+parseInt(mus_total)-1;
			
			if((mus_first<=mus_number)&&(mus_number<mus_final))
				{
					//console.log("在里面")
				}
			else
				{
					console.log("不在里面");
					mus_number = mus_first;
					//console.log("mus_number");
					//console.log(mus_number);
					select_mus(mus_number);
					return;
				}
		
					mus_number = parseInt(mus_number)+1;
					select_mus(mus_number);
					
		}

}
$(".btns a").eq(2).click(function(){
	next_mus();
});

//上一首

function before_mus(){
	if(is_music)
		{
			mus_final = parseInt(mus_first)+parseInt(mus_total)-1;
			if(mus_number>mus_first&&mus_number<=mus_final)
				{
					mus_number =parseInt(mus_number)-1;
					select_mus(mus_number);
					return;
				}
			
			//翻页时，按上一首，默认跳转到该页第一首歌
			if(mus_number>mus_final||mus_number<mus_first)
				{
					console.log("不在里面");
					select_mus(mus_first);
					return ;
				}
					//mus_number = parseInt(0);
					select_mus(mus_final);
		}
}
$(".btns a").eq(0).click(function(){
	before_mus();
});

//定时器显示
$(".Countdown").click(function(){
	$(".countset").toggle();

});
$(".Countdown a").eq(0).mouseenter(function(){
	//console.log("来了");
	$(this).attr("title","输入分钟数定时，输入0取消定时");

});

$(".counttext").keydown(function(event){
	var keycode = event.keyCode;
	//console.log(keycode);
	if(keycode==13)
		{
			var settime = $(this).val();
			if(isNaN(settime)||settime=="")
				{
					//console.log("来了");
					return;
				}
			//console.log("去了");
			settime = parseInt(settime);
			if(settime>1440)
				{
					$(".Countdown span").eq(0).html("时间过长");
					return;
				}
			else if(settime==0)
				{
					$(this).val("");
					$(".Countdown span").eq(0).html("分钟定时");
					is_countdown = false;
					last_second = 0;
					clearInterval(countdown_stop);
					return;
				}
			//console.log("设置定时器");
			//console.log(settime);
			$(this).val("");
			//$(".Countdown span").eq(0).html(settime);
			stopPlay_mus(settime);
		}

});

//音量控制板块显示设置
$(".control a").eq(0).click(function(){
	$(".control .barbg").toggle();

});


//播放模式控制
$(".control a").eq(1).click(function(){
	
	if($(this).attr("class").indexOf("icn_shuffle")!=-1)
		{
			music_model = 'one';
			$(this).removeClass("icn_shuffle");
			$(this).addClass("icn_one");
			//console.log("存在");
		}
	else
		{
			music_model = 'shuffle';
			$(this).addClass("icn_shuffle");
			//console.log("不存在");
			if($(this).attr("class").indexOf("icn_one")!=-1)
				{
					music_model = 'loop';
					$(this).removeClass("icn_one");
					$(this).removeClass("icn_shuffle");
				}
		}
	//$(this).addClass("icn_shuffle");
});



//点击改变进度条
function btnclick(){
	
	$(".progressbar").click(function(event){
	var cnormalLeft = $(this).offset().left;
	var ceventLeft   = event.pageX;
	var cwidth       = ceventLeft-cnormalLeft;
		
		
		if(cwidth<0)
			{
				cwidth = 0;
			}
		else if(cwidth>493)
			{
				cwidth = 493;
			}
	$(".cur").css("width",cwidth);
	$(".cur .btn").css("left",cwidth-12);
	//alert($(".cur .btn").css("left"));
	
	var cperc = cwidth/$(this).width();
		//console.log(cperc);
		if(isNaN(cperc))
		{
			return;
		}
		mus_one.currentTime = mus_one.duration*cperc;
		//$("audio").eq(0).currentTime = $("audio").eq(0).duration*cperc;
		//console.log(mus_one.duration);
		

});
	
	return false;

}
btnclick();


//点击改变音量进度条
function currclick(){	
	var vol_width;
	
	$(".curr_bg").click(function(event){
	var cnormalLeft  = $(".curr_bg").offset().top;
	var ceventLeft   = event.pageY;
	var cwidth       = ceventLeft-cnormalLeft;
	//console.log(cwidth);

		if(cwidth<0)
			{
				cwidth = 0;
			}
		else if(cwidth>93)
			{
				cwidth = 93;
			}
	var vwidth = 93-cwidth;
	vol_width  = vwidth;
		if(vol_width>85)
			{
				vol_width = 85;
			}
		
	$(".curr").css("height",vwidth);
	$(".curr .btn_vol").css("bottom",vol_width-10);
	//alert($(".curr .btn_vol").css("bottom"));
	
	var cperc = vwidth/$(this).height();
		
		if(isNaN(cperc))
			{
				return;
			}
		//console.log(cperc);
		
		mus_one.volume = cperc;
		//console.log(mus_one.volume);
		
		
		//切换音量图标
		if(mus_one.volume==0)
			{
				//if($(".control a").eq(0).attr("class").indexOf("tt") !=-1)
				$(".control a").eq(0).addClass("icn_novol");
					
			}
		else
			{
				$(".control a").eq(0).removeClass("icn_novol");
			}
});
}
currclick();


//按住改变进度条
function btnmove(){
	var width;
	
	$(".cur .btn").mousedown(function(){
		
		is_move = true;
	
	var normalLeft = $(".progressbar").offset().left;
	
	$(document).mousemove(function(event){
		
		var eventLeft = event.pageX;
		
		width = eventLeft-normalLeft;
		
		if(width<0)
			{
				width = 0;
			}
		else if(width>493)
			{
				width = 493;
			}
		$(".cur").css("width",width);
		$(".cur .btn").css("left",width-12);
		//$(".btn").off("mousemove");
});
		
});

$(document).mouseup(function(){
	$(document).off("mousemove");
	
	var perc = width/$(".progressbar").width();
	
    //console.log(perc);
	$("audio").currentTime =$("audio").duration*perc;
	//$("audio").eq(0).currentTime = $("audio").eq(0).duration*perc;
	//mus_one.currentTime =mus_one.duration*perc;
	//console.log($("audio").currentTime);
	//console.log(mus_one.duration*perc);
	is_move = false;
});
	
}
btnmove();


//按住改变音量进度条
function currbtnmove(){
	
	var width;
	var vol_width;
	$(".btn_vol").mousedown(function(){
	var cnormalLeft = $(".curr_bg").offset().top;
	
	$(document).mousemove(function(){
		
		var ceventLeft   = event.pageY;
		var cwidth       = ceventLeft-cnormalLeft;
		if(cwidth<0)
			{
				cwidth = 0;
			}
		else if(cwidth>93)
			{
				cwidth = 93;
			}
		var vwidth = 93-cwidth;
		vol_width  = vwidth;
		if(vol_width>85)
			{
				vol_width = 85;
			}
		
		$(".curr").css("height",vwidth);
		$(".curr .btn_vol").css("bottom",vol_width-10);
		//alert($(".curr .btn_vol").css("bottom"));

		var cperc = vwidth/$(this).height();
		if(isNaN(cperc))
			{
				return;
			}
		//console.log(cperc);
		
		mus_one.volume = cperc;
		//console.log(mus_one.volume);
		//音量图标切换
		if(mus_one.volume==0)
			{
				//if($(".control a").eq(0).attr("class").indexOf("tt") !=-1)
				$(".control a").eq(0).addClass("icn_novol");
					
			}
		else
			{
				$(".control a").eq(0).removeClass("icn_novol");
			}
});

});

$(document).mouseup(function(){
	$(document).off("mousemove");
	//console.log(cperc);
	
});

}
currbtnmove();


//ID选择函数
	function siye(id)
{
	return document.getElementById(id);
}

//测试函数
function tk()
	{
		alert(document.cookie);
	    alert("?");
	}
//setTimeout("tk()",1000);

//播放模式
function play_model(model){
	
	//mus_total = 3;
	
	if(model=="loop")
		{
			next_mus();
			//console.log("歌单循环");
			
		}
	else if(model=="one")
		{
			select_mus(mus_number);
			//console.log("单曲循环");
		}
	else if(model=="shuffle")
		{
			var Range = mus_final - mus_first;
      		var Rand = Math.random();
      		var num = mus_first + Math.round(Rand * Range); //四舍五入
			//var num = Math.random()*mus_total;
			num = Math.round(num);
			if(num==0)
				{
					num=mus_first;
				}		
			mus_number = num;
			select_mus(mus_number);
			//console.log("随机模式");
			//console.log(mus_number);
		}
}

//setInterval("play_model('shuffle')",1000);


//播放音乐
function play_mus()
{
	
	if(!is_countdown)
			{
				$(".Countdown span").eq(0).html("分钟定时");
			}
	if(musicrun_count==0)
			{
				$(".lyc_pic img").eq(0).removeClass("img_pause");
				$(".lyc_album ul").eq(0).removeClass("album_pause");
				mus_one.play();
				$(".curtime span").css("opacity",1);
				//alert ("播放");
			}
		else if(musicrun_count==1)
			{
				$(".lyc_pic img").eq(0).addClass("img_pause");
				$(".lyc_album ul").eq(0).addClass("album_pause");
				$(".curtime span").css("opacity",0.5);
				mus_one.pause();
			}
		musicrun_count +=1;
		if(musicrun_count>1)
			{
				musicrun_count=0;
			}
}


//定时停止播放音乐
var is_countdown;
var last_second;
var countdown_stop;
function stopPlay_mus(settime)
{
	is_countdown = true;
	clearInterval(countdown_stop);
	$(".Countdown span").eq(0).html("00:00:00");
	var houor  = parseInt(settime/60);
	var munite = parseInt(settime%60);
	var second = 0;
	//console.log("?");
	
	last_second = 0;
	if(second<10)
		{
			second = "0"+second;
		}
	if(munite<10)
		{
			munite = "0"+munite;
		}
	if(houor<10)
		{
			houor = "0"+houor;
		}
	var time = houor+":"+munite+":"+second;
	$(".Countdown span").eq(0).html(time);
	
	last_second = houor*3600+munite*60;
	//last_second = 5;
	
	countdown_stop = setInterval(function(){
		//console.log(last_second);
		if(last_second>0)
			{
				last_second -=1;
			}
		else
			{
				is_countdown = false;
				last_second = 0;
				clearInterval(countdown_stop);
				$(".btns a").eq(1).removeClass("pause");
				musicrun_count = 1;
				play_mus();
				$(".Countdown span").eq(0).html("停止播放");
				return;
			}
		
		//console.log(last_second);
		houor = parseInt(last_second/3600);
		munite = parseInt(last_second%3600/60);
		second = parseInt(last_second%3600%60);
		
		if(second<10)
		{
			second = "0"+second;
		}
		if(munite<10)
		{
			munite = "0"+munite;
		}
		if(houor<10)
		{
			houor = "0"+houor;
		}
		
		time = houor+":"+munite+":"+second;
		$(".Countdown span").eq(0).html(time);

},1000);

}


//音乐缓存进度条
function musload_time(){
	if(is_music)
		{
			var buffer = mus_one.buffered;
			var timebuffer = buffer.end(buffer.length-1);
			var bufferper = timebuffer/mus_one.duration*100;
			//console.log(timebuffer);
	
			$(".rdy").css({
			width: bufferper+"%"
			
		});
		}
}
setInterval("musload_time()",1000);


var mus_minute = 0;
var mus_second = 0;

//歌曲时长
function mytime_current(duration,currentTime)
{
	var d_mun = parseInt(duration/60);
	var d_sec = parseInt(duration%60);
	
	var c_mun = parseInt(currentTime/60);
	var c_sec = parseInt(currentTime%60);
	
	if(currentTime==duration)
		{
			$(".btns a").eq(1).removeClass("pause");
			musicrun_count = 0;
			play_model(music_model);
		}
	
	if(d_mun<10)
		{
			d_mun = "0"+d_mun;
		}
	
	if(d_sec<10)
		{
			d_sec = "0"+d_sec;
		}
	
	if(c_mun<10)
		{
			c_mun = "0"+c_mun;
		}
	
	if(c_sec<10)
		{
			c_sec = "0"+c_sec;
		}
	
	
	if(isNaN(d_mun)||isNaN(c_mun))
		{
			return;
		}
	
	
	return c_mun+":"+c_sec+" / "+d_mun+":"+d_sec;
}


function mus_size()
{
	var curd = parseInt(mus_one.duration);
	
	//音乐播放监听
	$("#mus_one").on("timeupdate",function(){
		
		var md = mus_one.duration;
		var mc = mus_one.currentTime;
		var show_time = mytime_current(md,mc);
		//$("#ajax_hit").text(show_time);
		
		$(".curtime span").eq(0).text(show_time);
		//audio.readyState银屏缓存状态;
		
		if(mus_one.readyState==4)
			{
				$(".btn i").eq(0).removeClass("btn_load");
			}
		else
			{
				$(".btn i").eq(0).addClass("btn_load");
			}
		
		var curc = parseInt(mc);
		
		var perc = curc/curd*100;
		var percl = curc/curd*493-12;
		
		//perc = parseInt(perc);
		//console.log(perc);
		if(is_move)
			return;
		if(perc<0||perc>100)
			return;
			//$(".cur .btn").css("left",width-12);
		$(".cur .btn").css({
			left: percl
		});
		$(".cur").css({
			width: perc+"%"
		});
			
		
	});

	mus_time.style.color = 'black';
	musicTime = munite*60+second;
	//mus_time.innerText  = '完整歌曲加载完成';

	timePercent = Math.round(1 / musicTime * 450);
	upWidth = Math.round(timePercent*493/450);
	muscurTime = 0;
	mus_sec    = 0;
	mus_mun    = 0;
	$(".progressbar .cur").css("width",0);
	musicrun_count = 0;
	//$(".btn i").eq(0).removeClass("btn_load");
	play_mus();
	//setTimeout("play_mus()",300);
}


//歌曲加载状态
function mus_state()
{
	siye('mus_one').addEventListener("loadstart", function()
  {
  	mus_time.innerText  = '正在加载歌曲';
	$(".btn i").eq(0).addClass("btn_load");
  });
		
	siye('mus_one').addEventListener("loadedmetadata", function()
  {
		mus_size();
		mus_time.innerText  = '歌曲开始播放';
  });
	
	siye('mus_one').addEventListener("canplaythrough", function()
  {
		mus_time.innerText  = '歌曲加载完成';
  });
}


//初始化audio的src
var mus_src = '';

//选择歌曲
function select_mus(number)
{
	console.log("page_current:");
	console.log(page_current);
	console.log("mus_first");
	console.log(mus_first);
	
	//$(".btn i").eq(0).addClass("btn_load");
	mus_number = number;

	var mus_num = document.getElementsByName('music');
	mus_total = mus_num.length;
	//当前页最后一首歌曲的编号ID
	mus_final = parseInt(mus_first)+parseInt(mus_total)-1;
	console.log("mus_final");
	console.log(mus_final);
	console.log("mus_play");
	console.log(mus_number);
	
	for(var i=0;i<mus_num.length;i++)
		{
			
			var mus_tag = mus_num[i];
			
			if(mus_tag==siye('mus'+number))
				{
					is_music = true;
					
					mus_tag.style.color = 'black';
					mus_one.src = "music/"+number+".mp3";
					
					siye("siyemus_name").innerHTML = mus_tag.innerHTML;
			
					mus_state();
					$(".btns a").eq(1).addClass("pause");	
				}
			else
				{
					mus_tag.style.color = 'silver';
					
				}
	
		}

}




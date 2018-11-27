// JavaScript Document
//音乐播放相关处理
(function(window){
	var MusPlay = function($audio){
		return new MusPlay.prototype.init($audio);

	}
	MusPlay.prototype = {
		constructor:MusPlay,
		init:function($audio){
			this.$audio = $audio;
			this.audio = $audio.get(0);

		},
		musicList:[],//存放歌曲
		currentIndex:-1,//当前播放音乐索引
		isMusic:false,//是否选中了音乐
		musModel:'loop',//播放模式
		isCountdown:false,//是否定时
		lastSecond:0,//定时倒计时
		countDownstop:"",//定时计时器
		loadTimeinterval:'',
		seekTO:0,
		currentAudio:'music',
		//选择歌曲
		selectMusic:function(index,mus_mes){
			//console.log(this.musicList);
			this.isMusic = true;
			//console.log(mus_mes);
			//console.log(this.currentIndex,index);
			//if(this.currentIndex!=index||this.currentAudio!=musList.audioType)
				{
					this.currentIndex = index;
					//console.log(musList.audioType);
					if(musList.audioType=='music')
						{
							this.currentAudio = musList.audioType;
							this.$audio.attr("src","music/"+mus_mes.id+".mp3");
						}
					else if(musList.audioType=='radio')
						{
							this.currentAudio = musList.audioType;
							this.$audio.attr("src","radio/"+mus_mes.id+".mp3");
						}
					
				}	
			$("#siyemus_name").html(mus_mes.musname);
			$("title").text(mus_mes.musname);
					this.audio.currentTime = 0;
					this.audio.play();
			$(".rdy").css({
					width: 0
					});
			this.musloadPro();
		},
		//歌曲状态
		musState:function(){
//			this.audio.addEventListener("loadstart", function()
//			  {
//				$("#mus_time").innerText  = '正在加载歌曲';
//				$(".btn i").eq(0).addClass("btn_load");
//			  });
//
//			this.audio.addEventListener("loadedmetadata", function()
//			  {
//
//				$("#mus_time").innerText  = '歌曲开始播放';
//			  });
//
//			this.audio.addEventListener("canplaythrough", function()
//			  {
//				$("#mus_time").innerText  = '歌曲加载完成';
//			  });
			MusPlay.addEvent(this.audio,"loadstart",function(){
				$("#mus_time").css("color","black");
				$("#mus_time").html("开始加载音频");
				$(".btn i").eq(0).addClass("btn_load");
				//console.log("loadstart");
			});
			
			MusPlay.addEvent(this.audio,"loadedmetadata",function(){
				$("#mus_time").html("音频开始播放");
				//console.log("loadedmetadata");
			});
			
			MusPlay.addEvent(this.audio,"canplaythrough",function(){
				$("#mus_time").html("音频加载完成");
				//console.log("canplaythrough");
			});

		},
		//播放暂停切换
		playToggle:function(){
			var $playbtn = $(".btns a").eq(1);
			$playbtn.toggleClass("pause");
			if(this.isMusic)
				{
					if(!this.audio.paused)
						{
							$playbtn.removeClass("pause");
							$(".lyc_album ul").eq(0).addClass("album_pause");
							$(".curtime span").css("opacity",0.5);
							this.audio.pause();
							//console.log("暂停");

						}
					else
						{
							$playbtn.addClass("pause");
							$(".lyc_album ul").eq(0).removeClass("album_pause");
							$(".curtime span").css("opacity",1);
							this.audio.play();
							//console.log("播放");
						}
				}
		},
		//下一曲
		nextIndex:function(){
			if(this.isMusic)
				{
					var index = this.currentIndex+1;
					if(index>this.musicList.length-1)
						{
							index = 0;
						}
					return index;
				}
		},
		//上一曲
		preIndex:function(){
			if(this.isMusic)
				{
					var index = this.currentIndex-1;
					if(index<0||index>this.musicList.length-1)
						{
							index = this.musicList.length-1;
						}
					return index;
				}
		},
		//歌曲时长
		musTime:function(duration,currentTime){
			var d_mun = parseInt(duration/60);
			var d_sec = parseInt(duration%60);

			var c_mun = parseInt(currentTime/60);
			var c_sec = parseInt(currentTime%60);

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


			return d_mun+":"+d_sec+" / "+c_mun+":"+c_sec;

		},
		//歌曲播放时长更新
		updateTime:function(callBack){
			
			var $this = this;
			
			this.$audio.on("timeupdate",function(){
				var current = $this.audio.currentTime;
				var duration = $this.audio.duration;
				var strTime = $this.musTime(current,duration);
				callBack(current,duration,strTime);
				});
		},
		//歌曲缓存进度条
		musloadPro:function(){
			var $this = this;
			
			if(this.isMusic)
			{
				clearInterval($this.loadTimeinterval);
				this.loadTimeinterval = setInterval(function(){
					var buffer = $this.audio.buffered;
					var timebuffer = buffer.end(buffer.length-1);
					var bufferper = timebuffer/ $this.audio.duration*100;
				

					$(".rdy").css({
					width: bufferper+"%"

					});
					
					if(bufferper>99.9)
						{
							clearInterval($this.loadTimeinterval);
						}
					//console.log(bufferper);

					},1000);
			}

		},
		//歌曲进度调节
		musSeekto:function(value){
			this.seekTO++;
			//console.log("musSeekto",this.seekTO);
			//console.log(this);
			this.audio.currentTime = this.audio.duration*value;
		},
		//歌曲音量调节
		volSeekto:function(value){
			
			this.audio.volume = value;
			if(this.audio.volume==0)
				{
					//if($(".control a").eq(0).attr("class").indexOf("tt") !=-1)
					$(".control a").eq(0).addClass("icn_novol");

				}
			else
				{
					$(".control a").eq(0).removeClass("icn_novol");
				}

		},
		//改变播放模式
		playModchange:function(obj){
			if(obj.attr("class").indexOf("icn_shuffle")!=-1)
				{
					this.musModel = 'one';
					obj.removeClass("icn_shuffle");
					obj.addClass("icn_one");
					//console.log("存在");
				}
			else
				{
					this.musModel = 'shuffle';
					obj.addClass("icn_shuffle");
					//console.log("不存在");
					if(obj.attr("class").indexOf("icn_one")!=-1)
						{
							this.musModel = 'loop';
							obj.removeClass("icn_one");
							obj.removeClass("icn_shuffle");
						}
				}

		},
		//播放模式设定
		playModel:function(modelType){
			
	
			if(this.musModel=="loop")
				{
					//console.log("歌单循环");
					$(".btns a").eq(2).trigger("click");

				}
			else if(this.musModel=="one")
				{
					//单曲循环
					$("#mus_list tr").eq(this.currentIndex).trigger("click");
				}
			else if(this.musModel=="shuffle")
				{
					var Range = this.musicList.length - 1;
					var Rand = Math.random();
					var index = 0 + Math.round(Rand * Range); //四舍五入
					//var num = Math.random()*mus_total;
					index = Math.round(index);
					

					//console.log("随机模式");
					//console.log(index);
					$("#mus_list tr").eq(index).trigger("click");
				}
		},
		//设置定时
		setCountdown:function(setObj,showObj,event){
			var keycode = event.keyCode;
			//console.log(keycode);
			if(keycode==13)
				{
					var settime = setObj.val();
					if(isNaN(settime)||settime=="")
						{
							//console.log("来了");
							return;
						}
					//console.log("去了");
					settime = parseInt(settime);
					if(settime>1440)
						{
							showObj.html("时间过长");
							return;
						}
					else if(settime==0)
						{
							setObj.val("");
							showObj.html("分钟定时");
							this.isCountdown = false;
							this.lastSecond = 0;
							clearInterval(this.countDownstop);
							return;
						}
					//console.log("设置定时器");
					//console.log(settime);
					setObj.val("");
					//$(".Countdown span").eq(0).html(settime);
					this.stopCountdown(showObj,settime);
				}

		},
		//定时倒计时
		stopCountdown:function(showObj,settime){
			
			var $this = this;
			this.isCountdown = true;
			clearInterval(this.countDownstop);
			showObj.html("00:00:00");
			var houor  = parseInt(settime/60);
			var munite = parseInt(settime%60);
			var second = 0;
			//console.log("?");

			this.lastSecond = 0;
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
			showObj.html(time);

			this.lastSecond = houor*3600+munite*60;
			//this.lastSecond = 5;

			this.countDownstop = setInterval(function(){
				//console.log(last_second);
				if($this.lastSecond>0)
					{
						$this.lastSecond -=1;
					}
				else
					{
						$this.isCountdown = false;
						$this.lastSecond = 0;
						clearInterval($this.countDownstop);
						$(".btns a").eq(1).removeClass("pause");
						$(".lyc_album ul").eq(0).addClass("album_pause");
						$(".curtime span").css("opacity",0.5);
						$this.audio.pause();
						showObj.html("停止播放");
						return;
					}

				//console.log(last_second);
				houor = parseInt($this.lastSecond/3600);
				munite = parseInt($this.lastSecond%3600/60);
				second = parseInt($this.lastSecond%3600%60);

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
				showObj.html(time);

		},1000);


		},
		
	}
	
	//添加事件
	MusPlay.addEvent = function(obj,evetype,fn){
			if(obj.addEventListener)
				{
					obj.addEventListener(evetype,fn);
				}
			else
				{
					obj.attachEvent('on'+evetype,fn);
				}

		}
	
	MusPlay.prototype.init.prototype = MusPlay.prototype;
	window.MusPlay = MusPlay;
})(window);
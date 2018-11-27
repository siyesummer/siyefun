// JavaScript Document
//处理歌词
(function(window){
	var Lyric = function(path){
		return new Lyric.prototype.init(path);
	}
	Lyric.prototype = {
		constructor:Lyric,
		init:function(path){
		this.path = path;

		},
		lyricText:[],//存储歌词文件歌词内容
		lyricTime:[],//存储歌词文件歌词时间戳
		lyricIndex:-1,//标记歌词当前行
		first:true,//标记当前歌词是否第一次加载
		curTime:-1,//记录歌词的当前时间,当歌曲回退时，与此时间作比较
		reStart:false,//标记歌词是否有回退
		marginSize:25,//歌词行高，双语歌词行高加倍
		lineCenter:3,//标记歌词中间行
		mixIndex:0,
		mixPerc:0,
		//加载歌词
		loadLyric:function(callBack){
		var $this = this;
			
			$.ajax({
				url:$this.path,
				dataType:"text",
				success:function(data){
					//console.log(data);
					$this.parseLyric(data);
					callBack();

				},
				error:function(err){
					console.log(err);

				}
			});

		},
		//处理歌词
		parseLyric:function(data){
			$(".lyric ul").css({
				marginTop:0
			});
			var $this = this;
			this.lyricTime = [];
			this.lyricText = [];
			this.marginSize = 25;
			this.lineCenter = 3;
			this.mixIndex = 0;
			this.mixPerc = 0;
			this.lyricIndex=-1;
			this.first=true;
			this.reStart=false;
			this.curTime=-1;
			
			var str = data.split("\n");
			//console.log(str);
			$.each(str,function(index,ele){
				//console.log(ele);
				//如果为空行，跳过
				if(ele==null||!ele||ele.trim().length==0) return true;
				
				var regTime = /\[(\d*:\d*\.\d*)\]/;
				var time = regTime.exec(ele);
				
				//如果没有时间戳跳过
				if(!time||time==null||typeof time=='undefined') return true;
	
				
				var text = ele.split("]")[1];
				
				//console.log(text);
				//console.log(text.length);
				if(text.indexOf("/")!=-1)
					{
						//处理双语歌词
						//$this.lineCenter = 2;
						$this.marginSize=50;
						$this.mixIndex++;
						text = text.replace(/\//g,"<br/>");
					}
				if(Lyric.trim(text).length==0&&$this.marginSize==25)
					{
						text = "</br>";
					}
				else if(Lyric.trim(text).length==0)
					{
						return true;
					}
				
				$this.lyricText.push(text);
				
				
				//if(time==null)
					//return true;
				var timeStr = time[1].split(":");
				var min = parseInt(timeStr[0]);
				var sec = parseFloat(timeStr[1]);
				var t = parseFloat(Number(min*60 +sec).toFixed(2));
				$this.lyricTime.push(t);
				//console.log(time);

			});
			
			$this.mixPerc = ($this.mixIndex/$this.lyricText.length).toFixed(2);
			$this.mixPerc = parseFloat($this.mixPerc);
			if($this.mixPerc>=0.5)
				{
					$this.marginSize = 50;
				}
			else
				{
					$this.marginSize = 25;
				}
			console.log("歌词/占行比",$this.mixPerc);
			//console.log($this.lyricText);
			//console.log($this.lyricTime);
			
			
		},
		//歌词当前行处理
		currentIndex:function(current){
			//console.log(current);
			if(current>=this.lyricTime[0])
				{
					if(this.reStart)
						{
							if(this.lyricIndex>3)
								{
									this.reStart = false;
								}
						}
					if(this.first)
						{
							this.lyricIndex = 0;
							this.first = false;
							this.curTime = current;
							return this.lyricIndex;
						}
					//this.lyricIndex++;
					//this.lyricTime.shift();
					//console.log(this.lyricTime[this.lyricIndex]);
					if(this.curTime>current)
						{
							this.lyricIndex = 0;
						}
						
							for(var i=this.lyricIndex;i<this.lyricTime.length;i++)
							{
							//console.log(this.lyricTime[i]);
							if(current>=this.lyricTime[i])
								{
									this.lyricIndex = i+1;
									this.curTime = current;
									return this.lyricIndex;
								}
							}
						

				}
			else
				{
					if(!this.first)
						{
							this.reStart = true;
							return 0;
						}
					return 0;
				}
	
		},
	}
	Lyric.extend = Lyric.prototype.extend = function(obj){
		
		for(var key in obj)
			{
				this[key] = obj[key];
			}	
	}
	
	Lyric.extend({
		//去除字符串两端空格
		trim:function(str){
			if(str.trim)
				{
					return str.trim();
				}
			else
				{
					return str.replace(/^\s+|\s+$/g,"");
				}
		},
		//判断字符串是否是NaN
		isNaN:function(str){
			return str !== str;
		},
		//时间函数
		getTime:function(){
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth();
			var day = date.getDate();
			var hour = date.getHours();
			var munite = date.getMinutes();
			var second = date.getSeconds();
			if(arguments.length==0)
				{
					if(hour<10)
						{
							hour = "0"+hour;
						}
					if(munite<10)
						{
							munite = "0"+munite;
						}
					if(second<10)
						{
							second = "0"+second;
						}
					return year+"年"+month+"月"+day+"日"+" "+hour+":"+munite+":"+second;
				}
			else if(arguments.length==1)
				{
					if(arguments[0]=="year"||arguments[0]=="年")
						{
							return year;
						}
					else if(arguments[0]=="month"||arguments[0]=="月")
						{
							return month;
						}
					else if(arguments[0]=="day"||arguments[0]=="日")
						{
							return day;
						}
					else if(arguments[0]=="hour"||arguments[0]=="时")
						{
							return hour;
						}
					else if(arguments[0]=="munite"||arguments[0]=="分")
						{
							return munite;
						}
					else if(arguments[0]=="second"||arguments[0]=="秒")
						{
							return second;
						}
					else if(arguments[0]=="clock"||arguments[0]=="时钟")
						{
							if(hour<10)
								{
									hour = "0"+hour;
								}
							if(munite<10)
								{
									munite = "0"+munite;
								}
							if(second<10)
								{
									second = "0"+second;
								}
							return hour+":"+munite+":"+second;
						}
					else if(arguments[0]=="week"||arguments[0]=="星期")
						{
							var days = ['日','一','二','三','四','五','六'];
							return "星期"+days[date.getDay()];
						}

				}
			else
				{
					return "参数过多";
				}

		},
		//添加事件
		addEvent:function(obj,evetype,fn){
			if(obj.addEventListener)
				{
					obj.addEventListener(evetype,fn);
				}
			else
				{
					obj.attachEvent('on'+evetype,fn);
				}

		}

		})
	
	
	
	Lyric.test = function(){
		return "测试函数";
	}
	Lyric.prototype.init.prototype = Lyric.prototype;
	window.Lyric = Lyric;
})(window);


// JavaScript Document
//进度条处理
(function(window){
	var Progress = function(pro,cur,btn){
		return new Progress.prototype.init(pro,cur,btn);
	}
	Progress.prototype = {
		constructor:Progress,
		init:function(pro,cur,btn){
			this.pro = pro;
			this.cur = cur;
			this.btn = btn;
			
		},
		isMove:false,
		proMoveindex:0,
		proClick:function(callBack){
			var $this = this;
			
			this.pro.click(function(event){
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
			$this.cur.css("width",cwidth);
			$this.btn.css("left",cwidth-12);
			//alert($(".cur .btn").css("left"));

			var cperc = cwidth/$(this).width();
			callBack(cperc);
				//console.log(cperc);
				if(isNaN(cperc))
				{
					return;
				}
				//mus_one.currentTime = mus_one.duration*cperc;
				
			});
			return false;
			

		},
		proMousemove:function(callBack){
			var $this = this;
			var width;
			var btn_width;
			this.proMoveindex++;
			//console.log("proMoveindex",this.proMoveindex);
	
			this.btn.mousedown(function(event){

			$this.isMove = true;

			var normalLeft = $this.pro.offset().left;
			event.stopPropagation();

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
				btn_width = width;
				
				$this.cur.css("width",width);
				$this.btn.css("left",btn_width-12);
				//$(".btn").off("mousemove");
				event.stopPropagation();
		});

		});
			
		$(document).mouseup(function(){
			$this.isMove = false;

		});



		$this.pro.mouseup(function(event){
			$(document).off("mousedown");
			
			$this.isMove = false;

			var perc = width/$this.pro.width();
			//event.stopPropagation();
			callBack(perc);

			//$("audio").currentTime =$("audio").duration*perc;
			
		});
		//$this.btn.off("mousedown");

		},
		volClick:function(callBack){
			var $this = this;
			
			var vol_width;
	
			$this.pro.click(function(event){
			var cnormalLeft  = $this.pro.offset().top;
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

			$this.cur.css("height",vwidth);
			$this.btn.css("bottom",vol_width-10);
		

			var cperc = vwidth/$(this).height();

				if(isNaN(cperc))
					{
						return;
					}
			callBack(cperc);
		});

		},
		volMousemove:function(callBack){
			var $this = this;
			var width;
			var vol_width;
			$this.btn.mousedown(function(){
			var cnormalLeft = $this.pro.offset().top;

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

				$this.cur.css("height",vwidth);
				$this.btn.css("bottom",vol_width-10);
				

				var cperc = vwidth/$(this).height();
				if(isNaN(cperc))
					{
						return;
					}
				callBack(cperc*10);
				//console.log(cperc);

				//mus_one.volume = cperc;
				
		});

		});

		$(document).mouseup(function(){
			$(document).off("mousemove");
			//console.log(cperc);

		});

		},
		setProgress:function(value){
			
			var perc = value*100;
			var percl = value*493-12;
			if(this.isMove) return;
			
			if(value<0||value>100) return;
				this.btn.css({
				left: percl
			});
			this.cur.css({
				width: perc+"%"
			});

		},
	}

	Progress.prototype.init.prototype = Progress.prototype;
	window.Progress = Progress;
})(window);


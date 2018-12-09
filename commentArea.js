// JavaScript Document
//评论区功能封装
(function(window){
	
	var Comment = function(){
		return new Comment.prototype.init();

	};
	
	Comment.prototype = {
		constructor:Comment,
		init:function(){
		},
		audioType:'music',
		musID:'',
		radioID:'',
		page:1,//评论当前页
		pageLast:1,//尾页
		//显示留言框
		commtToggle:function(obj,hit){
			
			
			if(obj.css("display")=='none')
				{
					hit.html("收起留言");
				}
			else if(obj.css("display")=='block')
				{
					hit.html("查看留言");
					
				}
			obj.toggle();
			
		},
			//留言字数
		cmmtNum:function(text,hit){
			//console.log(text,text.length);
			var max_num = 140;
			var wei_num = text.length;
			hit.text(max_num-wei_num);
		},
		//发送留言状态处理
		sendStatus:function(text,hit){
			//console.log("来了啊小老弟",text);
			hit.text('');
			if(text.length==0)
				{
					hit.text('留言内容不能为空');
				}
			else if(Lyric.trim(text).length==0)
				{
					hit.text('留言内容不能全为空格');
				}
			else if(text.length>140)
				{
					hit.text('留言内容不能超过140个字符');
				}
			else if(this.musID==''&&this.radioID=='')
				{
					hit.text('没有正在播放的音频文件，无法评论');
				}
			else
				{
					this.sendCmmt(text,hit);
				}

		},
		//发送信息
		sendCmmt:function(mes,hit){
			$this = this;
			console.log('发送到后台');
			hit.text('信息正在发向服务器');
			$.ajax({
				type:"post",
				url:"cmmtAjax.php",
				data:"mes="+mes+"&musID="+$this.musID+'&radioID='+$this.radioID,
				success:function(resText){
					console.log($this.musID);
					hit.text(resText);
					$("#wri_mes").get(0).value = '';

				},
				error:function(xhr){
					console.log(xhr.status);
				}
			});
			//留言后刷新评论
			this.changePage('top');

		},
		//创建评论
		createCmmt:function(mes){
			
			var item = $(`
				<div class='commet_messagelist'>
					<div class='commet_picture'>
						<a href='javascript:void(0)'><img src='picture/1.jpg'></a>
			  		</div>

					<div class='commet_text'>
						<div class='commet_textValue'>
							${mes.content}
						</div>

						<div class='commet_textDate'>
							#${mes.number} 日期 ${mes.addtime}
						</div>
					</div>
	             
	          </div>
			`);
			
			return item;

		},
		//查看评论
		lookCmmt:function(type,audioID){
			$this = this;
			

			$.ajax({
				type:"post",
				url:"cmmtAjax.php",
				data:"audioID="+audioID+"&type="+type+"&page="+$this.page,
				success:function(resText){
					$("#total_commet").html('');
					var mesRes_value = eval("("+resText+")");
					console.log(mesRes_value);
					//return;
					var commet = mesRes_value.commet;
					var lastpage = mesRes_value.pagesize;
					var total = mesRes_value.total;
					var page = mesRes_value.page;
					$this.pageLast = lastpage;
					if(total==0)
						{
							$("#total_commet").html('<div style="text-align:center">暂无评论</div>');
							$("#page_final").text('');
							$("#page_now").text('');
							return;
						}
					$("#page_final").text(lastpage);
					$("#page_now").text($this.page);
					$.each(commet,function(key,ele){
						//$("#total_commet").get(0).innerHTML += ele;
						var item = $this.createCmmt(ele);
						$("#total_commet").append(item);
						

					});
					
				},
				error:function(xhr){
					console.log(xhr.status);
				}

			});
		},
		//翻页
		changePage:function(page){
			
			if(page=='top')
				{
					this.page = 1;
				}
			else if(page=='final')

				{
					this.page = this.pageLast;
					//alert (page_num);
				}
			else if(page=='before')
				{
					if(this.page>1)
						{
							this.page -=1;
						}
				}
			else if(page=='next')
				{
					//alert ('?');
					if(this.page<this.pageLast)
						{
							//alert('??');
							this.page +=1;
						}
				}
			
			if(this.audioType=='music')
				{
					this.lookCmmt(this.audioType,this.musID);
				}
			else if(this.audioType=='radio')
				{
					this.lookCmmt(this.audioType,this.radioID);
				}

		},
		//Enter跳页
		jumpPage:function(keycode,obj,hit,click){
			if(keycode==13||click=='jump')
			{
				if(obj.value!='')
				{
					var page = obj.value;
						//将字符串数字转成整形数字
					page = parseInt(page);
					if(page>=1&&page<=this.pageLast)
						{
							this.page = page;

							obj.value = '';
							hit.text('√');
							
							if(this.audioType=='music')
							{
								this.lookCmmt(this.audioType,this.musID);
							}
							else if(this.audioType=='radio')
							{
								this.lookCmmt(this.audioType,this.radioID);
							}	
						}
					else
						{
							obj.value = '';
							hit.text('×');
						}
				}
				else
					{
						hit.text("");
					}
			
			}

		}
	
	};
	
	Comment.prototype.init.prototype = Comment.prototype;
	window.Comment = Comment;

})(window);
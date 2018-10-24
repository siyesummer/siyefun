<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>四叶音乐</title>
<link rel="stylesheet" href="siyeMusic.css" type="text/css">

</head>

<div class="topbar">
	<div class="topmenu">
		<h1>
			<a href="#"><img src="picture/4.jpg">四叶音乐</a>
		</h1>
		<ul class="topmenulist">
			<li><a href="upload/UploadFile.php" target="_blank">上传音乐</a></li>
		</ul>
	</div>
</div>
<div class="music_area">
	<div class="bg_66"></div>
	<div class="musiclist">
		<audio src="" id="mus_one"></audio>
		<h3 style="text-align: center">音乐列表</h3>
		首次加载歌曲需要10秒左右 &nbsp;5M音频上传需要30秒左右
		<hr/>
			
		<div id="mus_list" style="text-align: center" class="mus_comune" data-mcs-theme="dark">
			<table align="center" style="text-align: center;width: 500px">
			</table>
		</div>
		
		<div class="music_musproject">
			<span id="mus_time" style="color: silver">歌曲加载状态</span>
				
			<span id="ajax_hit"></span>
		</div>
		
		<div class="music_page">
			<input type="button" class="music_button" value="上一页" onClick="Jsonchange_page('before')">
			<span> &nbsp;/&nbsp;</span>
			<input type="button" class="music_button" value="下一页" onClick="Jsonchange_page('next')">
		</div>
	</div>
	<div class="musiclyc">
		<div class="lyc_pic">
			<img src="picture/1.jpg" id="lyc_picone" rot_ang=0 class="img_pause">
		</div>
		<div class="lyc_album">
			<ul class="album_pause">
				<li><img src="picture/album/1.jpg"></li>
				<li><img src="picture/album/2.jpg"></li>
				<li><img src="picture/album/3.jpg"></li>
				<li><img src="picture/album/4.jpg"></li>
				<li><img src="picture/album/5.jpg"></li>
				<li><img src="picture/album/6.png"></li>
			</ul>
		</div>
	</div>
	<div class="playbar">
		<div class="btns">
			<a href="javascript:;" class="prv" ></a>
			<a href="javascript:;" class="player"></a>
			<a href="javascript:;" class="nxt"></a>
		</div>
		<div class="play">
			<div class="musician">
				<a href="javascript:;" class="" ><span id="siyemus_name">二珂-病变</span></a>
			</div>
			<div class="progressbar">
				<div class="rdy">
					
				</div>
				<div class="cur">
					<div class="btn">
						<i class=""></i>
					</div>
				</div>
			</div>
			<div class="curtime">
				<span>
					00:00 / 00:00
				</span>
			</div>
			
		</div>
		<div class="control">
			<div class="barbg">
			    <div class="curr_bg">
			    	<div class="curr">
						<div class="btn_vol">

						</div>

					</div>
			    </div>
			</div>
			<a href="javascript:;" class="icn_vol" ></a>
			<a href="javascript:;" class="icn_loop"></a>
		</div>
		<div class="Countdown">
		<a href="javascript:;"><span>点击定时</span></a>
			
		</div>
		<div class="countset">
			<input type="text" class="counttext" style="outline: none;" placeholder="Enter" onkeyup="(this.v=function(){this.value=this.value.replace(/[^0-9-]+/,'');}).call(this)" onblur="this.v();">
		</div>
	</div>
</div>

<div class=""></div>

<script src="js/jquery-1.7.2/jquery.js"></script>
<script src="musicJsonList.js"></script>
<script src="siyeMusic.js"></script>
</body>
</html>

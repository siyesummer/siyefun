<?php

?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>文件上传</title>
	<style>
		.filepos
		{
			width: 1180px;
			margin: 0 auto;
		}
		#ajax_radio
		{
			display: none;
		}
	</style>
</head>

<body>
	<div class="filepos" style="text-align: center;">
         <div>
			<h3 style="color: mediumturquoise">上传文件须知</h3>
				由于服务器性能受限，请不要重复点击上传按钮<br/>
				音乐频道请上传小于50M的音频文件<br/>
				电台频道需要口令开启上传按钮 电台频道上限为300M<br/>
			</div>
			<br/>
		<form action="" method="post" enctype="multipart/form-data">
			&nbsp;<label for="mus_file">上传音乐</label>
			<input type="file" id="mus_file" name="mus_one" value="选择音频">
		<!--	<input type="submit" value="提交音频">-->
			<input type="button" value="ajax音乐上传" id="ajax_mus" onClick="ajax_fileup('music')">
			<span id="hit_musfile"></span><br/>
		</form>
		<br/>
		<form>
			<label for="radio_file">上传电台</label>
			<input type="file" id="radio_file" name="radio_one" value="选择音频">
		<!--	<input type="submit" value="提交音频">-->
			<input type="button" value="ajax电台上传" id="ajax_radio" onClick="ajax_fileup('radio')">
			<span id="hit_radiofile"></span>
		</form>
		<br/>
		<input type="text" width="200px" placeholder="Enter电台上传口令" id="summer"><span id='hit_summer'></span>
		<audio  src="" id="show_mus"></audio>
	</div>
<script src="UploadFile.js" type="text/javascript"></script>
</body>
</html>

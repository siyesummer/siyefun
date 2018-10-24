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
	</style>
</head>

<body>
	<div class="filepos" style="text-align: center;">
         <div>
	<h3 style="color: mediumturquoise">上传文件须知</h3>
		由于服务器性能受限，请不要重复点击上传按钮<br/>
		文件上传完毕后，点击'翻页'按钮或者刷新页面可以更新音乐列表<br/>
		请上传小于50M的音频文件
		
	</div>
	<form action="" method="post" enctype="multipart/form-data">
		<label for="mus_file">上传音乐</label>
		<input type="file" id="mus_file" name="mus_one" value="选择音频">
	<!--	<input type="submit" value="提交音频">-->
		<input type="button" value="ajax音频上传" id="ajax_mus" onClick="ajax_fileup('music')">
		<span id="hit_musfile"></span><br/>
	</form>
	<audio  src="" id="show_mus"></audio>
	</div>

	<script src="UploadFile.js" type="text/javascript"></script>
</body>
</html>

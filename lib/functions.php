<?php

//对输入的$_post和$_get等数据进行转义
function deepEscape($input)
{
	foreach($input as $key=>$value)
	{
		if(is_array($value))
		{
			$input[$key] = deepEscape($value);
		}
		else
		{
			$input[$key] = addslashes($value);
		}
	}
	
	return $input;
}

?>
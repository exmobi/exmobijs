/*
*	ExMobi4.0 JS 框架之 微博类weibo.js(依赖app.js)
*	Version	:	1.1.0
*/
var $wb = {
	init:function(type){
		var weiboInfo = new WeiboInfo();

		type = $wb.allType[type]?type:"sina";

		weiboInfo.type = type;
		$wb.type = type;

		$wb.weibo = weiboInfo;

		return $wb;
	},
	type:"sina",
	allType:{"sina":"新浪微博","tencent":"腾讯微博"},
	weibo:null,
	go:function(c, f){
		if(!c){
			$a.toast("请选择要发送的内容！");
			return;
		}

		if(!$wb.weibo) $wb.init($wb.type);

		if(c) $wb.weibo.content = c;
		if(f) $wb.weibo.file = f;
				
		$wb.weibo.sendcallback = $wb.sendcallback;
				
		if(!$wb.weibo.isbind()){
			$wb.weibo.bindcallback = $wb.bindcallback;
			$wb.weibo.bind();
			return $wb;
		}

		$wb.weibo.send();
				
		return $wb;
	},
	sendcallback:function(data){
		var msg = $wb.allType[$wb.type];
		if(data.result == 0){
			$a.toast(msg+"发送成功！");
		}else{
			$a.toast(msg+"发送失败！");
		}
	},
	bindcallback:function(data){
		var msg = $wb.allType[$wb.type];
		if(data.result == 0){
			$a.toast(msg+"绑定成功！");
			$wb.weibo.send();
		}else{
			$a.toast(msg+"绑定失败！");
		}
	},
	clear:function(){
		$wb.weibo.clearbind();
		return $wb;
	}
};
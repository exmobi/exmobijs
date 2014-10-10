/*
*	ExMobi4.0 JS 框架之 webview桥接类bridge.js(依赖app.js)
*	Version	:	1.1.0
*/
var $native = {};

$native.close = function(){
	ExMobiWindow.close();
};

$native.exit = function(msg){
	if(msg){
		ClientUtil.exit(msg);
	}else{
		ClientUtil.exitNoAsk();
	}

};

$native.openExMobiPage = function(href, el){
	if(!href) return;
	
	var _this = $(el);
	var isNew = _this.attr('target')!="_self";
	
	if(href.indexOf("#")==0){
		href = "res:page/"+href.replace("#","")+".xhtml";
	}
	
	if(href.indexOf("res")==0){	    			    	
    	
    	var urlOpt = $util.parseResURL(href);

    	var opt = {
    			url:urlOpt.href,
    			id:urlOpt.fileName,
    			isNew:isNew,
    			query:urlOpt.query
    	};
    	
    	ExMobiWindow.open(opt.url,isNew,false,'',opt.query);
	}else{
		ExMobiWindow.open(href,isNew);
	}
};

$native.openWebView = function(href, el){
	if(!href) return;
	var _this = $(el);
	var isNew = _this.attr('target')!="_self";
    var transition = _this.data('transition'); 
	
	if(href.indexOf("#")==0){
		href = 'res:page/html/'+href.replace("#","")+'.html';
	}else if(href.indexOf('res')<0){
		href = 'res:page/html/'+href;
	}
	var urlOpt = $util.parseResURL(href);

	var opt = {
			url:urlOpt.href,
			id:urlOpt.fileName,
			isNew:isNew,
			query:urlOpt.query,
			transition:transition
	};

	$native.open(opt);
};

$native.open = function(opt){//opt={url:'',id:''}
	var html = $util.htmlTemplate(opt);	
	ExMobiWindow.openData(html, opt.isNew, false, '', opt.query);
};

$native.toast = function(msg){
	if(typeof nativePage=='undefined'){
		A.toast(msg);
		return;
	}
	nativePage.executeScript("$a.toast('"+msg+"')");
};

$native.alert = function(msg,callback){
	var funStr = "alert('"+msg+"')";	
	nativePage.executeScript(funStr);
};


$native.getRealPath = function(res){   
	if(!$util.isLocalFile(res)){
		return res;
	}
	try{
		return nativePage.getAdapterUrlPath(res);
	}catch(e){
		return res;
	}
    
};

$native.getAdapterHTML = function(html){
	if(!html) return "";
	return html.replace(/res:[^"']*/g,function(str){
		return $native.getRealPath(str);
	});
};

$native._bridgeActivity = function(eventName,base64Str){
	
	var ps = new $util.Base64().decode(base64Str);
	$(document).trigger(eventName, ps);
	
	//var func = App.page._getEventMap(eventName);
	//func&&func(base64Str);

};

$native.showMask = function(){
	var funStr = "$a.showMask()";	
	nativePage.executeScript(funStr);
};
$native.hideMask = function(){
	var funStr = "$a.hideMask()";	
	nativePage.executeScript(funStr);
};

$native.getParameter = function(k){
	return ExMobiWindow.getParameter(k);
};

$native.getParameters = function(){
	return ExMobiWindow.getParameters();
};

$native.cacheMap = {};
$native.cacheMap._handle_ = function(str){
	var cb = this.callback;
	cb&&cb(str);
	delete this.callback;
};

$native.cacheMap._OPEN_FILE_SELECTOR_ = {
	handle : function(str){
		var cb = $native.cacheMap._OPEN_FILE_SELECTOR_['callback'];
		cb&&cb(str);
		delete $native.cacheMap._OPEN_FILE_SELECTOR_['callback'];
	}
};
$native.openFileSelector = function(callback){
	
	$native.cacheMap._OPEN_FILE_SELECTOR_['callback'] = callback;
	
	A.Popup.actionsheet(
			[
			 	{
					text : '拍照/摄像',
					handler : function(){
						var funcStr = "$browser.openCameraWindow()";
						nativePage.executeScript(funcStr);
					}
				},
			 	{
			 		text : '选择相册',
	     	        handler : function(){	                	
	     	        	NativeUtil.selectCameraPhoto($native.cacheMap._OPEN_FILE_SELECTOR_.handle);
	     	        }
			 	},
	         	{
	     	        text : '清除内容',
	     	        color : '#3498db',
	     	        handler : function(){	                	
	     	        	$native.cacheMap._OPEN_FILE_SELECTOR_.handle('');
	     	        }
	         	}
	        ]);
};

$native.cacheMap._OPEN_DATE_TIME_SELECTOR_ = {
	handle : $native.cacheMap._handle_
};
$native.openDateTimeSelector = function(mode,initialvalue,callback){	
	$native.cacheMap._OPEN_DATE_TIME_SELECTOR_['callback'] = callback;	
	var funcStr = "$browser.openDateTimeSelector('"+mode+"','"+initialvalue+"')";	
	nativePage.executeScript(funcStr);
};

$native.app = {};

$native.app.getAppSetting = function(){
	try{
		var obj = {};	
		if(typeof ClientUtil=='undefined'){
			var protocol = location.protocol;			
			var port = location.port;
			var ip = location.host.replace(':'+port,'');
			var domain = protocol+'//'+ip+':'+port;
			obj.ip = ip;
			obj.port = port;
			obj.domain = domain;
		}else{
			obj = ClientUtil.getSetting();
			var domain = 'http://'+obj.ip+':'+obj.port;
			obj.domain = domain;
		}
		return obj;
	}catch(e){
		return {};
	}
	
};


var $util = {};

$util._cacheMap = {
		index : 0
};


$util.htmlTemplate = function(opt){//opt={url:'',id:''}
	
	var id = opt.id?opt.id:$util.randomMix();
	var url = opt.url;
	
	var transition = opt.transition;

	var transitionObj = {
		none:true, slideright:"slideleft", slideleft:"slideright", slidedown:"slideup", slideup:"slidedown", zoom:true, fade:true,curlup:true
	};

	var style = (transitionObj[transition]?"openanimation:"+transition+";closeanimation:"+(transitionObj[transition]==true?transition:transitionObj[transition])+";":"");

	var html = [];
	html.push('<html id="'+id+'" isbridge="true" style="'+style+'">');
	html.push('<head>');
	html.push('<meta charset="UTF-8"/>');
	html.push('<title show="false">webapp</title>');
	html.push('<script type="text/javascript" src="res:script/exmobijs/base.js"></script>');
	html.push('<script type="text/javascript" src="res:script/exmobijs/app.js"></script>');
	html.push('<script type="text/javascript" src="res:script/exmobijs/utility.js"></script>');
	html.push('<script type="text/javascript" src="res:script/exmobijs/browser.js"></script>');
	html.push('<script type="text/javascript" src="res:script/agile/js/lib/template-native.js"></script>');
	
	html.push('<script>');
	html.push('<![CDATA[');
	html.push(']]>');
	html.push('</script>');
	html.push('</head>');
	//html.push('<body style="margin:0px;padding:0px;" onload="$browser.bridgeLoad(&apos;'+url+'&apos;)" onstart="$browser.bridgeStart()" onstop="$browser.bridgeStop()" ondestroy="$browser.bridgeDestroy()">');
	html.push('<body style="margin:0px;padding:0px;" onload="$browser.bridgeLoad()" onstart="$browser.bridgeStart()" onstop="$browser.bridgeStop()" ondestroy="$browser.bridgeDestroy()">');
	html.push('<webview id="browser" url="'+url+'" backmonitor="true"/>');// backMonitor="true"
	//html.push('<browser id="browser" url="'+url+'" action="true" adapter="false"/>');
	html.push('</body>');
	html.push('</html>');
	
	return html.join('');
};

$util.formatBrowserUrl = function(encode){
	var decode = "";
	try{
		return (new $util.Base64()).decode(encode.split("'")[1]);
	}catch(e){
		return encode;
	}
};

$util.isLocalFile = function(url){//opt={url:'',id:''}
	if(!url){
		return false;
	}
	return (url.indexOf("res:")==0);
};

$util.parseResURL = function(str){
	if(!str||str.indexOf("res:")!=0){
		return {};
	}
	var opt = {
			url:"",
			href:"",
			query:"",
			fileName:"",
			suffix:""
	};
	
	opt.url = str;

	var ps = str.split("?");
	if(ps.length==1){
		opt.href = str;
	}else if(ps.length==2){
		opt.href = ps[0];
		opt.query = ps[1];
	}
	
	var fs = opt.href.substring(3,opt.href.length).split("/");
	var tempFile = fs[fs.length-1];
	var tempFileArr = tempFile.split(".");
	if(ps.length==1){
		opt.fileName = tempFileArr[0];
		opt.suffix = "";
	}else{
		opt.fileName = tempFileArr[0];
		opt.suffix = tempFileArr[1];
	}
	
	return opt;	

};

$native.decode = function(callback){
	var decode = new Decode();
	decode.onCallback = function (){
		callback&&callback(decode.isSuccess()?decode:null);

    };
    decode.startDecode(); 
}


/**
 * JS base64 加解密函数
 */
 
$util.Base64 = function () {
 
	// private property
	_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
 
	// public method for encoding
	this.encode = function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = _utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
			_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
			_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}
		return output;
	}
 
	// public method for decoding
	this.decode = function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = _keyStr.indexOf(input.charAt(i++));
			enc2 = _keyStr.indexOf(input.charAt(i++));
			enc3 = _keyStr.indexOf(input.charAt(i++));
			enc4 = _keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = _utf8_decode(output);
		return output;
	}
 
	// private method for UTF-8 encoding
	_utf8_encode = function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
		return utftext;
	}
 
	// private method for UTF-8 decoding
	_utf8_decode = function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while ( i < utftext.length ) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
};

$util.randomString = function(len){	
	
	len = len?len:8;
	
	var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";	
	
	var rs = [];
	for(var i=0;i<len;i++){
		var id = Math.ceil(Math.random()*51);
		rs.push(letters.charAt(id));
	}
	
	return rs.join('');
};

$util.randomNumber = function(len){
	len = len?len:8;
	var numbers = "0123456789876543210";
    var rs = [];
    for(var i=0;i<len;i++){
        var id = Math.ceil(Math.random()*18);
        rs.push(numbers.charAt(id));
    }

    return rs.join('');
};

$util.randomMix = function(len){
	len = len?len:8;
	var mix = "abcdefghijklmnopqrstuvwxyz0123456789";
    var rs = [];
    for(var i=0;i<len;i++){
        var id = Math.ceil(Math.random()*35);
        rs.push(mix.charAt(id));
    }

    return rs.join('');
};

$util.queryJSON = function(query){
	if(!query){
		return {};
	}
	try{
		var properties = query.replace(/&/g, "',").replace(/=/g, ":'") + "'";  
	    var obj = null;  
	    var template = "var obj = {p}";  
	    eval(template.replace(/p/g, properties));
	}catch(e){
		return {};
	}
    
    return obj==null?{}:obj;
};

$util.loadLocalData = function(url){
	var html = FileUtil.readFile(url);
	html = html?$native.getAdapterHTML(html):"";

	return html;
};


$util.sendMail = function(opts){
	var funcStr = "$a.sendMail('"+opts.to+"','"+opts.subject+"','"+opts.content+"')";
	nativePage.executeScript(funcStr);
};

$util.go = function(opts, handler){
	if(!opts||!opts.url) return;
	opts.url = A.Util.script(opts.url);
	var ajaxData = {};
	ajaxData.url = opts.url;
	ajaxData.method = opts.type = opts.type&&opts.type.toLowerCase()=='post'?'post':'get';
	if(opts.data) ajaxData.data = opts.data;
	ajaxData.successFunction = '$util._ajax_successFunction';
	ajaxData.failFunction = '$util._ajax_errorFunction';
	if(opts.headers) ajaxData.requestHeader = opts.headers;
	ajaxData.isBlock = opts.isBlock = opts.isBlock==true?true:false;
	ajaxData.timeout = opts.timeout?(opts.timeout/1000):20;
	
	var ajax = new handler(ajaxData);
	
	var index = $util._cacheMap.index++;
	
	$util._cacheMap['_ajax_opts_key_'+index] = opts;
	
	ajax.setStringData('_ajax_opts_key_', index);
	
	ajax.send();
	
};

$util._ajax_successFunction = function(data){
	var opts = $util._ajax_getFunction(data);
	if(typeof opts.result=='undefined'){
		opts.error&&opts.error(data, '500');
	}else{
		opts.success&&opts.success(opts.result);
	}
};

$util._ajax_errorFunction = function(data){
	var opts = $util._ajax_getFunction(data);
	opts.error&&opts.error(data, data.status);
};

$util._ajax_getFunction = function(ajax){
	var index = ajax.getStringData('_ajax_opts_key_');
	var opts = $util._cacheMap['_ajax_opts_key_'+index];
	opts.dataType = opts.dataType&&opts.dataType.toLowerCase()=='json'?'json':'text';
	if(opts.dataType=='json'){
		try{
			opts.result = eval('('+ajax.responseText+')');
		}catch(e){
			delete opts.result;
		}
	}else{
		opts.result = ajax.responseText;
	}
	delete $util._cacheMap['_ajax_opts_key_'+index];
	return opts;
};

//对应ExMobi的Ajax
$util.server = function(opts){
	$util.go(opts, Ajax);
};
//对应ExMobi的DirectAjax
$util.ajax = function(opts){
	$util.go(opts, DirectAjax);
};
//对应ExMobi的DirectFormSubmit 
$util.form = function(opts){
	if(!opts||!opts.url) return;
	opts.type = opts.type||'post';
	if(opts.data){
		var dataArr = $util.paramsToJSON(opts.data);
		var fileElementId = typeof opts.fileElementId=='object'?opts.fileElementId.join():fileElementId;
		fileElementId = ','+(fileElementId?fileElementId:'')+',';
		
		for(var i=0;i<dataArr.length;i++){
			var obj = {};
			for(var k in dataArr[i]){
				obj.name = k;
				obj.value = dataArr[i][k];
			}
			obj.type = fileElementId.indexOf(','+obj.name+',')==-1?0:1;
			dataArr[i] = obj;
		};
		opts.data = dataArr;
	}
	
	$util.go(opts, DirectFormSubmit);
};

$util.paramsToJSON = function(data){
	var arr = [];
	if(!data||(typeof data!='string')) return [];

	data.replace(/(\w+)=(\w+)/ig, function(a, b, c){ 
		var obj = {};
	    obj[b] = unescape(c); 
	    arr.push(obj);
	});  
		
	return arr;
};

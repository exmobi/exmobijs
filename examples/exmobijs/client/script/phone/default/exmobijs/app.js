/*
*	ExMobi4.0 JS 框架之 应用场景类app.js(依赖utility.js)
*	Version	:	1.2.0
*/
var $a = {
	//拨打电话t为号码，n为名称
	tel:function(t,n){
		if(arguments.length==0&&$a["$telcache"]){
			Util.tel($a["$telcache"]);
		}else if(!t){
			alert("您所拨打的号码不存在！");
		}else{
			var str = n?"您确认拨打"+n+"的电话"+t+"吗？":"您确认拨打电话"+t+"吗？";
			$a["$telcache"] = t;
			confirm(str,$a.tel,null);
		}
	},
	//通过toast提示信息
	toast:function(t, d, s){
		if(!t) return;
		var toast= new Toast();
		toast.setText(t); /*设置Toast显示信息*/
		toast.setDuration(d?d:1000);/* 设置Toast显示时间*/
		if(s) toast.setStyle(s);/*设置弹出toast弹出位置*/		
		toast.show(true);/*展现Toast框*/
		
	},
	
	//判断是否有网络连接
	isNetConnected:function(){
		return Util.getConnectState();
	},
	
	//判断是否连接超时
	isTimeOut:function(str){
		//4.3.0及以后版本超时进错误回调函数，此判断可去掉
		if(str.indexOf("script:reloadapp")!=-1){
			window.openData(str, false);
			return true;
		}

		return false;
	},
	
	//初始化参数
	init:{
		netUnconnectedMsg:"",//网络未连接提示语，默认不提示
		isRefreshData: false,//ajax请求是否刷新数据，默认不刷新
	},
	
	//封装新的ajax，直接send，只有当successFunction为null的时候不自动发送，这时候设置一些变量后再发送
	go:function(url, method, data, successFuntion, failFunction, requestHeader, isShowProgress, cacheFlag, callbackParams){

		var key = cacheFlag?(cacheFlag==true?url:cacheFlag):"";
		
		requestHeader = requestHeader?requestHeader:'{"Content-Type":"application/x-www-form-urlencode"}';
		
		var a = new Ajax(url, method, data, $a._globalSuccess, failFunction?failFunction:$a._globalError, requestHeader, isShowProgress);

		callbackParams = callbackParams?((typeof callbackParams) == "string"?callbackParams.toJSON():callbackParams):{};
		for(var k in callbackParams){
			a.setStringData(k, callbackParams[k]);
		}
		
		successFuntion = (typeof successFuntion)=="function"?successFuntion.name:successFuntion;
		
		if($u.icache(key)){
			$a._cacheHandle(successFuntion, key, callbackParams);
		}
		
		a.setStringData("_cahceFlagKey", key);
		
		a.setStringData("_successFuntion", successFuntion);			
		
		if($a.isNetConnected()){
			a.send();
		}else{
			$a.toast(this.init.netUnconnectedMsg);
		}
		
		return a;
	},
	
	//缓存数据的默认处理
	_cacheHandle:function(fn, key, cp){
		var data = {
						getStringData: function(pm){
							return this._allData[pm];			
						},
						_allData: {},
						isCache: true,
						responseText: $u.icache(key)
				};
		
		for(var k in cp){
			data._allData[k] = cp[k];
		}

		eval(fn+"(data)");
		
	},
	
	//缓存数据
	_cacheSuccess:function(data){
		
		var isRefreshData = $a.init.isRefreshData;
		
		if(!$u.icache(data.getStringData("_cahceFlagKey"))){
			isRefreshData = true;
		}		
		
		var str = data.responseText.trim()
		if($u.icache(data.getStringData("_cahceFlagKey"))==str){
			isRefreshData = false;
		}else{
			$u.icache(data.getStringData("_cahceFlagKey"), str);
		}
		
		return isRefreshData;
	},
	
	//通用全局成功处理
	_globalSuccess:function(data){
		
		
		var isRefreshData = true;
		
		if(data.getStringData("_cahceFlagKey")){
			isRefreshData = $a._cacheSuccess(data);	
		}
		
		if(!isRefreshData){
			return;
		}
		
		var str = data.responseText.trim();
		
		data.isCache = false;
		
		if(!$a.isTimeOut(str)&&data.getStringData("_successFuntion")!=""){
			eval(data.getStringData("_successFuntion")+"(data)");
		}
		if(data.getStringData("_cahceFlagKey")){
			$u.icache(data.getStringData("_cahceFlagKey"), str);
		}
	},
	
	//通用全局错误处理
	_globalError:function(data){
		var str = data.responseText.trim();
		var msg = "请求错误！";
		var nextaction = "script:close";
		str.replace(/<faultstring>(.*)<\/faultstring>/g, function(s, s1){
			if(s1!="") msg = s1;
			if(s1.indexOf("超时")>-1) nextaction = "script:reloadapp";
		});
		str.replace(/<faultactor>(.*)<\/faultactor>/g, function(s, s1){
			if(s1!="") nextaction = s1;
		});
		window.openData('<html type="alert"><body><alert title="提示" icontype="info"><msg>'+msg+'</msg><nextaction href="'+nextaction+'"></nextaction></alert></body></html>');
	},
	
	//base.js中provide方法里ajax成功后的处理，也可单独使用，temp为可选参数，为显示的模板，该函数不直接暴露
	provide:function(data,temp){
		var obj = document.getElementById(data.$id?data.$id:data.getStringData("$id"));
		$a["$"+obj.id+"template"] = temp?temp:$a["$"+obj.id+"template"].trim();
		var json = data.responseText;
		$a["$"+obj.id+"jsonData"] = json;
		if(obj.objName=="list"){
			$a._listProvide(obj, json);
		}else if($a["$"+obj.id+"template"]==""){//如果没有模板的情况则整个响应数据注入
			$a._noTempProvide(obj, json);
		}else{
			$a._commProvide(obj, json);
		}
		$a["$"+obj.id+"isClear"] = false;
		if($a["$"+obj.id+"callback"]){
			eval($a["$"+obj.id+"callback"]+"(data)");
		}
	},
	
	_commProvide:function(obj, json){
		if($a["$"+obj.id+"isClear"]=="top"){
			obj.innerHTML = $a["$"+obj.id+"template"].tjt(json) +　obj.innerHTML;
		}else if($a["$"+obj.id+"isClear"]==true){
			
			obj.innerHTML = $a["$"+obj.id+"template"].tjt(json);//.htmlDecode();
		}else if(obj.append){
			obj.append($a["$"+obj.id+"template"].tjt(json));
		}else{
			obj.innerHTML += $a["$"+obj.id+"template"].tjt(json);//.htmlDecode();
		}
	},
	
	_noTempProvide:function(obj, json){
		if($a["$"+obj.id+"isClear"]=="top"){
			obj.innerHTML = json +　obj.innerHTML;
		}else if($a["$"+obj.id+"isClear"]==true){
			obj.innerHTML = json;
		}else{
			obj.innerHTML += json;
		}
	},
	
	_listProvide:function(obj, json){
		var dp = obj.getDataProvider();
		if(json==null||json.length==0){
			dp.refreshData();
			return;
		};
		json = $u.transObj(typeof json=="string"?json.toJSON():json).trim();
		var index = dp.getCount();
		if($a["$"+obj.id+"isClear"]=="top"){
			index = 0;
		}else if($a["$"+obj.id+"isClear"]==true){
			dp.clear();
		}
		json = json.indexOf("{")==0?"["+json+"]":json;
		dp.addItems(json, index);
	
		dp.refreshData();
	},
		
	compareProvide:function(str,json){
		var type = "";
		var compareValue = "";
		var trueValue = "";
		str.replace(/([^\.]*)\.([^=]*)=(.*)/g,function(s, s1, s2, s3){
			type = s1;
			if(json[s2]){
				compareValue = json[s2];
			}
			//compareValue = json[s2]?json[s2]:"";
			if(s3.replace(/'|"/g,"").length!=s3.length){
				trueValue = s3.replace(/'|"/g,"");
			}else if(json[s3]){
				trueValue = json[s3];
			}							
			//trueValue = s3.replace(/'|"/g,"").length==s3.length?(json[s3]?json[s3]:""):s3.replace(/'|"/g,"");
			for(var j=0;j<compareValue.split(",").length;j++){
				if(compareValue.split(",")[j]==trueValue){
					trueValue =  trueValue+"\" "+type+"=\"true";
					break;
				}
			}
			return "";
		});
		return trueValue;
	},
	getAppInfo:function(){
		var fileContent = FileUtil.readFile('res:config.xml');
		var obj = {
				appid:'',
				appname:'',
				version:''
		};
		for(var k in obj){
			var regex = new RegExp('<'+k+'>([^<]*)<\/'+k+'>');
			fileContent.replace(regex,function(str,s1){
				obj[k] = s1;
			});
		}
		return obj;
	},
	
	isShowIntroductoryPages:function(){
		var version = $a.getAppInfo().version;
		var key = 'IntroductoryPages-'+version;
		var rs = document.cache.getCache(key)?false:true;
		document.cache.setCache(key,version);
		return rs;

	},
	_progressbar : null,
	showMask:function(isBlock){
		$a._progressbar = $a._progressbar?$a._progressbar:new ProgressBar();
		$a._progressbar.show(isBlock?true:false);
	},
	hideMask:function(){
		$a._progressbar&&$a._progressbar.cancel();
	},
	sendMail : function(to,subject,content){
		if(!to){
			$a.toast('请填写收件人');
			return;
		}
		
	    var mail = new MailObject();
	    mail.to = to;
	    mail.subject = subject?subject:'';
	    mail.body = content?content:'';
	    mail.show();
	}

};
/*
*	ExMobi4.0 JS 框架之 控件对象类base.js(依赖app.js)
*	Version	:	1.1.2
*/
function $(x){
	
	var obj = null;
	
	//获取对象
	if(x==null){
		return x;
	}else if((typeof x)=="string"){
		obj = document.getElementById(x);
		obj = obj==null&&document.getElementsByName(x.toString()).length>0?document.getElementsByName(x.toString())[0]:obj;
	}else{
		obj = x;
	}
	//给不为空的对象添加函数
	if(!obj) return null;
	//设置对象隐藏
	if(!obj.hide){
		obj.hide = function(){
			obj.style.display = "none";
			return obj;
		};
	}
	
		
	//设置对象显示
	if(!obj.show){
		obj.show = function(){			
			obj.style.display = "block";
		};
	}
	
		
	//设置对象显隐反转
	obj.toggle = function(){	
		obj.style.display = obj.style.display=="none"?"block":"none";
		return obj;
	};
		
	//获取或者设置的value
	obj.val = function(){//0:设置value值,无:返回值
		if(arguments.length>0){
			obj.value = arguments[0];
			return obj;
		}else{				
			return obj.value;
		}
	};
		
	//追加控件的value
	obj.addVal = function(){
		obj.value += arguments[0];
		return obj;
	};
		
	//获取或者设置对象的innerHTML
	obj.html = function(){//0:设置HTML值,无:返回值
		if(arguments.length>0){
			obj.innerHTML = arguments[0];
			return obj;
		}else{
			return obj.innerHTML;
		}		
	};		
		
	//追加对象的innerHTML
	obj.addHtml = function(){			
		if(obj.append){
			obj.append(arguments[0]);
		}else{
			obj.innerHTML += arguments[0];
		}		
		return obj;
	};
	
	//获取设置属性
	obj.attr = function(){			
		if(arguments.length>1){
			obj[arguments[0]] = arguments[1];
			return obj;
		}else{
			return obj[arguments[0]];
		}
	};
		
	//设置获取对象的样式
	obj.css = function(){ //0:样式名,1:样式值
		if(arguments.length>1){
			obj.style[arguments[0]] = arguments[1];
			return obj;
		}else{
			return obj.style[arguments[0]];
		}
	};
		
	obj.tagName = function(){
		return obj.objName?obj.objName:"";
	};
		
	//获取cache,存储规则为k=cache-id
	obj.getCache = function(){
		var k = "cache-" + (obj.id?obj.id:obj.name);
		if(obj.type!="checkbox"&&obj.tagName()!="switch"){
			obj.value = document.cache.getCache(k);
			
		}		
		if(document.cache.getCache(k)!=""){
			obj.checked = document.cache.getCache(k);
		}
		return document.cache.getCache(k);
	};
		
	//设置cache,存储规则为k=cache-id
	obj.setCache = function(){
		var k = "cache-" + (obj.id?obj.id:obj.name);
		if(arguments.length>0){
			document.cache.setCache(k,arguments[0]);
			return;
		}
		if(obj.type=="checkbox"||obj.tagName()=="switch"){
			document.cache.setCache(k,obj.checked);
		}else{
			var o = obj.value?obj.value:obj.innerHTML;
			document.cache.setCache(k,o);
		}				
	};

	//注入数据
	obj.provide = function(){
		try{ $a; }catch(e){ alert("请先导入app.js"); return; }
		var url, method, data, requestHeader, isShowProgress;
		if(!$a["$"+obj.id+"template"]){
			if(obj.innerHTML){
				$a["$"+obj.id+"template"] = obj.innerHTML;
				obj.innerHTML = "";
			}else{
				$a["$"+obj.id+"template"] = "";
			}
		}

		//2个参数以内，认为第一个参数即为要注入的json数据，第二个参数即为显示的模板，不存在则读id里的内容
		if(arguments.length<3){
			var data = {};
			data.responseText = arguments[0];
			data.$id = obj.id;
			$a.provide(data, arguments[1]);
		}else if(arguments.length>4){//有5个参数则认为是要发起请求获取json数据
			var cahceFlag = arguments.length>5?arguments[5]:false;
			//var ajax = 
			$a.go(arguments[0], arguments[1], arguments[2], "$a.provide", null, arguments[3], arguments[4], cahceFlag, {"$id":obj.id});
			//ajax.setStringData("$id", obj.id);
			//ajax.send();
		}
			
		return obj;
	};
	//设置注入后的回调函数
	obj.callBack = function(){
		$a["$"+obj.id+"callback"] = arguments[0];
		return obj;
	};
	//获取provide方法注入的JSON数据;
	obj.getJData = function(){
		return $a["$"+obj.id+"jsonData"];
	};
	//设置provide方法被注入数据的模板内容;
	obj.setTemplate = function(){
		return $a["$"+obj.id+"template"] = arguments[0];
	};
	//获取provide方法被注入数据的模板内容;
	obj.getTemplate = function(){
		return $a["$"+obj.id+"template"];
	};
	//清空provide方法被注入数据的模板内容;
	obj.clearTemplate = function(){
		if(obj.innerHTML!=undefined){
			$a["$"+obj.id+"template"] = "";
		}
		return obj;
	};
	//清空注入容器的所有内容
	obj.clear = function(){
		$a["$"+obj.id+"isClear"] = true;
		return obj;
	};
	//在原有内容的顶部加载数据
	obj.top = function(){
		$a["$"+obj.id+"isClear"] = "top";
		return obj;
	};
	//设置select、radio和checkbox的选中值
	obj.setSelected = function(){
		if(obj.tagName()=="select"){
			obj.value = arguments[0];
		}else if(obj.type=="radio"){
			var radios = document.getElementsByName(obj.name);
			for(var i=0;i<radios.length;i++){
				radios.checked = radios[i].value==arguments[0]?true:false;
			}
		}else if(obj.type=="checkbox"){
			var checkboxs = document.getElementsByName(obj.name);
			for(var i=0;i<checkboxs.length;i++){					
				var str = ","+arguments[0]+",";
				checkboxs[i].checked = str.indexOf(","+checkboxs[i].value+",")>-1?true:false;
			}
		}
	};
	
	return obj;

}


//String类原生扩展
//去掉string两边的空格
String.prototype.trim = function(){
	return this.replace(/(^\s*)|(\s*$)/g,"");
}

//将string进行urlencode
String.prototype.encode = function(){
	return encodeURIComponent(this);
}

//将string进行urldecode
String.prototype.decode = function(){
	return decodeURIComponent(this);
}

//将String中符合s1要求的字符串替换成s2
String.prototype.replaceAll = function(s1,s2){
	s1 = (typeof s1) == "string"?new RegExp(s1, "gm"):s1;
	return this.replace(s1, s2);
}

//将html特有标签进行编码包括:单引号、双引号
String.prototype.htmlEncode = function(){
    return this.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/\'/g,"&apos;");
}

//将html特有标签进行解码
String.prototype.htmlDecode = function(){
    return this.replace(/\&amp\;/g, '\&').replace(/\&gt\;/g, '\>').replace(/\&lt\;/g, '\<').replace(/\&quot\;/g, '\'').replace(/\&\apos\;/g, '\'');
}

//转换为json格式
String.prototype.toJSON = function(){
	try{
		return eval("("+this+")");
	}catch(e){
		return {};
	}
}

//转换为数字格式
String.prototype.toInt = function(){
	return Number(this);
}

//转换为XML格式
String.prototype.toXML = function(){	
    var v = new XMLDocument();
	v.parseXmlText(this);
    return v.getRootElement();
}

//转换为ascii格式
String.prototype.toAscii = function(){ 
	var a = []; 
	for (var i = 0;i < this.length;i++){
		a[i] = ("00" + this.charCodeAt(i).toString(16)).slice( - 4);
	}
	return "\\u" + a.join("\\u");
}

String.prototype.unAscii = function(){
	return unescape(this.replace(/\\/g, "%")); 
}

//设置session
String.prototype.session = function(){
	if(arguments.length==0){	
		return window.getStringSession(this)||window.getArraySession(this)[0];		
	}
	if((typeof arguments[0])=="string"){
		window.setStringSession(this,arguments[0]);
	}else{
		window.setArraySession(this,arguments[0]);
	}
}

//搜索此字符串是否以某个字符串开头
//Strng.indexOf(arguments[0],arguments[1]) == 0
//搜索此字符串是否以某个字符串结尾
//Strng.lastIndexOf(arguments[0],arguments[1]) == 0

//返回截取给定字符串之前的数值
String.prototype.substrBefore = function(){
	return arguments.length > 0 && arguments[0]?this.substring(0,this.indexOf(arguments[0],arguments[1])):"";
}


//返回截取给定字符串之后的数值
String.prototype.substrAfter = function(){
	return arguments.length > 0 && arguments[0]?this.substring(this.indexOf(arguments[0],arguments[1]) + arguments[0].length,this.length):"";
}

//将为String模板注入JSON数据，模板中需要注入的内容通过${json对象}申明，在JSON数据中如果有这个对象则注入该对象的值，否则为空串
String.prototype.tjt = function(){//tjt=Template and JSON Transformations
	if(this==null) return "";
	var json = arguments.length==0?[]:(typeof arguments[0]=="string"?arguments[0].toJSON():arguments[0]);
	json = (json instanceof Array)?json:[json];
	var sb = [];
	for(var i=0;i<json.length;i++){		
		var str = this.replace(/\$\{([^\}]*)\}/g, function(s, s1){
			//如果不是选择类型，如select，checbox、radio、switch等直接替换
			if(s1.indexOf("=")==-1){
				var arr = s1.split('.');
				var v = json[i];
				for(var j=0;j<arr.length;j++){
					if(!v){
						v = "";
						break;
					}
					v = v[arr[j]];
				}
				return v?v:"";
			}else{
				return $a.compareProvide(s1,json[i]);
			}			
			
		});		
		sb.push(str);
	}
	return sb.join("");
}


//数组类
/*
 * 数组本身自带常用方法
concat()	连接两个或更多的数组，并返回结果。	
join()	把数组的所有元素放入一个字符串。元素通过指定的分隔符进行分隔。
pop()	删除并返回数组的最后一个元素	
push()	向数组的末尾添加一个或更多元素，并返回新的长度。	
reverse()	颠倒数组中元素的顺序。	
shift()	删除并返回数组的第一个元素	
slice()	从某个已有的数组返回选定的元素	
sort()	对数组的元素进行排序	
splice()	删除元素，并向数组添加新元素。
toSource()	代表对象的源代码
toString()	把数组转换为字符串，并返回结果。	
toLocaleString()	把数组转换为本地数组，并返回结果。
unshift()	向数组的开头添加一个或更多元素，并返回新的长度。
valueOf()	返回数组对象的原始值
*/
Array.prototype.append = function(){//可以加无限个参数，也可以连续append
	for(var i=0;i<arguments.length;i++){
		this.push(arguments[i]);
	}
	return this;
}

//将arr转换为String 
Array.prototype.toString = function(){
	return this.join(arguments[0]||"");
}

//将数组清空
Array.prototype.clear = function(){
	this.length = 0;
	return this;
}

//判断参数是否在数组内
Array.prototype.indexOf = function(){
	for (i=0;i<this.length; i++){
		if (this[i]==arguments[0]){
			return i;
		}
	}
	return -1;
}

//删除数组元素，默认只需要传s  
Array.prototype.remove = function(s,n){
	for(var i=n?n:this.length-1;i>-1; i--){
		if(this[i]==arguments[0]){
			return this.del(i).remove(s,i);
		}else if(i==0){
			return this;
		}
	}
}

//通过索引删除数组元素，从0开始    
Array.prototype.del = function(n){
	if(n<0){//如果n<0，则不进行任何操作。
		return this;
	}else{
		return this.slice(0,n).concat(this.slice(n+1,this.length));
	}
}

//统计某个数组中包含对象的个数
Array.prototype.total = function(o){
	var t = 0;
	for(var i=0;i<this.length;i++){
		if(this[i]==o){
			t++;
		}
	}
	return t;
}
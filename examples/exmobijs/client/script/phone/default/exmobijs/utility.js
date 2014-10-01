/*
*	ExMobi4.0 JS 框架之 通用操作类utility.js(依赖base.js)
*	Version	:	1.1.0
*/
var $u = {
	//批处理
	batch:function(){		
		var obj = {};
		
		//开启批处理
		obj.start = function(){
			beignPreferenceChange();
			return obj;
		};
		
		//结束批处理
		obj.end = function(){
			endPreferenceChange();
			return obj;
		};
		
		//通过id or name显示控件，可有无限个参数
		obj.show = function(){
			for(var i=0;i<arguments.length;i++){
				$(arguments[i]).show();
			}
			return obj;
		};
		
		//通过id or name隐藏控件，可有无限个参数
		obj.hide = function(){
			for(var i=0;i<arguments.length;i++){
				$(arguments[i]).hide();
			}
			return obj;
		};
		
		//通过id or name隐藏控件，可有无限个参数
		obj.toggle = function(){
			for(var i=0;i<arguments.length;i++){
				$(arguments[i]).toggle();
			}
			return obj;
		};
		
		//根据id or name修改value
		obj.val = function(k,v){
			$(k).val(v);
			return obj;
		};
		
		//根据id or name追加value
		obj.addVal = function(k,v){
			$(k).addVal(v);
			return obj;
		};
		
		//根据id or name修改innerHTML
		obj.html = function(k,v){
			$(k).html(v);
			return obj;
		};
		
		//根据id or name追加innerHTML
		obj.addHtml = function(k,v){
			$(k).addHtml(v);
			return obj;
		};
		
		//根据id or name修改宽度
		obj.width = function(k,v){
			$(k).css("width", v);
			return obj;
		};
		
		//根据id or name修改高度
		obj.height = function(k,v){
			$(k).css("height", v);
			return obj;
		};
		
		//根据id or name修改src值
		obj.src = function(k,v){
			$(k).src = v;
			return obj;
		};
		
		return obj.start();
	},
	
	//obj转json字符串
	obj2str:function(o){
		return this.transObj(o);
	},
	transObj:function(o){
		var r = [];   
		if(typeof o =="string") return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\"";   
	    if(typeof o =="undefined") return "";
		if(typeof o != "object") return o.toString();
		if(o===null) return null;
        if(o instanceof Array){
        	for(var i =0;i<o.length;i++){
            	r.push(this.transObj(o[i]));
            }
            r="["+r.join()+"]"; 
        }else{              
            for(var i in o){
            	r.push('"'+i+'":'+this.transObj(o[i]));
            }
            r="{"+r.join()+"}";
        }   
        return r; 
	},
	
	//批量缓存
	cache:{
		//设置缓存，参数为控件的id或者name，支持无限个
		set:function(){
			for(var i=0;i<arguments.length;i++){
				var n = arguments[i];
				var obj = document.getElementById(n)||document.getElementsByName(n)[0];
				if(!obj) continue;
				var k = "cache-" + (obj.id?obj.id:obj.name);
				document.cache.setCache(k,(obj.type=="checkbox"||obj.objName=="switch")?obj.checked:obj.value);
			}
		},
		
		//设置缓存，参数为控件的id或者name，支持无限个
		get:function(){
			for(var i=0;i<arguments.length;i++){
				var n = arguments[i];
				var obj = document.getElementById(n)||document.getElementsByName(n)[0];
				if(!obj) continue;
				var k = "cache-" + (obj.id?obj.id:obj.name);
				if(obj.type!="checkbox"&&obj.objName!="switch"){
					obj.value = document.cache.getCache(k);
					continue;
				}
				if(document.cache.getCache(k)!=""){
					obj.checked = document.cache.getCache(k);
				}
			}
		},
		
		//设置缓存，参数为控件的id或者name，支持无限个
		clear:function(){
			for(var i=0;i<arguments.length;i++){
				var n = arguments[i];
				var obj = document.getElementById(n)||document.getElementsByName(n)[0];
				if(!obj) continue;
				var k = "cache-" + (obj.id?obj.id:obj.name);
				document.cache.setCache(k,"");	
			}
		}
	},
	
	//设置和读取自定义缓存，一个参数时为读取，两个参数时为设置
	icache:function(){
		if(arguments.length==1){
			return document.cache.getCache(arguments[0]);
		}else if(arguments.length==2){
			return document.cache.setCache(arguments[0], arguments[1]);
		}else{
			return null;
		}
	},
	
	//转换文本中的特殊字符，特别换行，主要是为了保证文本在JS中能解析
	escape:function(str){
		var escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
		var meta = {'\b': '\\b','\t': '\\t','\n': '\\n','\f': '\\f','\r': '\\r','"' : '\\"','\\': '\\\\'}; 
		if(!str.match(escapeable)) return str;
		return str = '"' + str.replace(escapeable, function(a){
				var c = meta[a];  
				if(typeof c === 'string' ) return c; 
				c = a.charCodeAt();  
				return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);  
			}) + '"';
	}
	
};
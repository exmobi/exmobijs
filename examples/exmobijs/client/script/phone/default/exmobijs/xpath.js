/*
*	ExMobi4.0 JS 框架之 XML操作类xpath.js
*	Version	:	1.1.0
*/
function $x(s){
	var obj = {};
	
	var ele = null;

	if((typeof s)=="string"){
		var v = new XMLDocument();		
		v = new XMLDocument();
		if(s.indexOf("res:")==0){
			v.parseXmlFile(s);
		}else{
			v.parseXmlText(s);
		}
		if(v==null) return null;
		ele = v.getRootElement();
	}else if((typeof s)=="object"){
		ele = s;
	}else{
		return null;
	}
	
	//通过tagName/tagName/tagName或者#id的方式查找响应的element
	obj.find = function(n){
		if(n.indexOf("#")==0){
			return $x(ele.getElementById(n.substring(1,n.length)));
		}else{
			var ns = n.split("/");
			return obj.findByName(ele.getElementsByName(ns[0]),ns,1);
		}
	};
	
	obj.findByName = function(es,ns,index){		
		if(es==null) return $x([]);
		if(index==ns.length) return $x(es);
		var arr = [];	
		for(var i=0;i<es.length;i++){
			var e = es[i].getElementsByName(ns[index]);
			for(var j=0;j<e.length;j++){
				if(e[j]!=null) arr.push(e[j]);
			}
			//arr.concat(es[i].getElementsByName(ns[index])); //用不了。。。
		}		
		return obj.findByName(arr, ns, index+1);	
	};
	
	//查找指定element的全部子节点
	obj.children = function(){
		return $x(ele.childNodes);
	}
	
	//返回obj数组的前n个数组组成的新element数组
	obj.eq = function(n){
		if(ele.length==0) return [];
		if(n==1){
			ele = ele[0];
		}else{
			ele.length = n;
		}
		return $x(ele);
	};
	
	//获得obj数组的第n个element
	obj.get = function(n){
		if(n>ele.length-1) return null;		
		return $x(ele[n]);
	};
	
	//将obj的element中符合正则表达式的去掉组成新的element数组
	obj.filter = function(re){// 暂时只支持正则	
		var arr = [];			
		re = (typeof re)=="string"?new RegExp(re,"gm"):re;
		for(var i=0;i<ele.length;i++){
			if(!re.test(ele[i].toXml())) arr.push(ele[i]);		
		}
		
		return $x(arr);
	};
	
	//将obj的element中符合正则表达式组成新的element数组
	obj.match = function(re){// 暂时只支持正则
		var arr = [];	
		re = (typeof re)=="string"?new RegExp(re,"gm"):re;
		for(var i=0;i<ele.length;i++){
			if(re.test(ele[i].toXml())) arr.push(ele[i]);		
		}
		return $x(arr);
	}
	
	//返回原生element对象，但是不能通过$x方法操作，除非继续使用$x(obj.ele())才行
	obj.ele = function(){// 还原为客户端原生xmlelement		
		return ele;
	}
	
	//获取element指定属性的属性值
	obj.attr = function(n){
		return ele.getAttribute(n);
	};
	
	//获取element的tagName
	obj.tagName = function(){
		return ele.name;
	};
	
	//获取element的text值
	obj.val = function(){
		return ele.text;
	};
	
	//获取element的length值
	obj.length = function(){
		return ele.length?ele.length:0;
	};
	
	//将element转换成string
	obj.toString = function(){
		return ele.toXml();
	}

	return obj;
	
}


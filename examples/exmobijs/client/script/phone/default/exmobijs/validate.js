/*
*	ExMobi4.0 JS 框架之 表单验证类validate.js(依赖base.js)
*	Version	:	1.1.0
*/
var $v = {
	//正则判断
	Require:/.+/,   //必填项，对radio、checkbox、tree等数组型不生效，可通过可选个数达到必填要求
	Email:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, //Email地址格式
	Phone:/^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/, //电话号码格式
	Mobile:/^((\(\d{2,3}\))|(\d{3}\-))?1\d{10}$/,           //手机号码格式
	Url:/^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,  //基于HTTP协议的网址格式
	Currency:/^\d+(\.\d+)?$/,        //货币格式
	Number:/^\d+$/,       //数字
	Zip:/^[1-9]\d{5}$/,   //邮政编码
	Integer:/^[-\+]?\d+$/,    //整数
	Double:/^[-\+]?\d+(\.\d+)?$/,   //实数 	
	English:/^[A-Za-z]+$/,          //英文
	Chinese: /^[\u0391-\uFFE5]+$/, //中文
	Username:/^[a-z]\w{3,}$/i,  //用户名
	UnSafe:/^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/,                                                       //安全密码
	Date:/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})/,                //日期	                                
	//函数判断
	MaxLength:"$v.isLength(obj.val(), item.ps)",  //最大长度
	Ip:"$v.isIp(obj.val())",    //IP
	Accept:"$v.isAccept(obj.val(), item.ps)",                                  //设置过滤，用于限制文件上传
	Limit:"$v.isLimit(obj.val().length,item.ps)",              //限制输入长度
	LimitByte:"$v.isLimit($v.lenByte(obj.val()), item.ps)",          //限制输入的字节长度
	Custom:"$v.exec(obj.val(), item.ps)",       //自定义正则表达式验证,选择此项则表单元素的正则表达式在regexp属性里定义
	Checked:"$v.isChecked(obj.name, item.ps)",      //验证单/多选按钮组

	//表单验证
	validate:function(mode,on){//mode为提示模式，默认为0——alert提示，1——toast提示，2为页面提示，on为页面指定的对象的id
		mode = mode==null?0:mode;
		var ErrObj = null;
		var o = {};
		var vs = [];
		
		//添加验证项
		o.add = function(obj,msg,vtype,ps){	//{id/name,提示语,验证类型,参数|参数|参数}		
			vs.push({"obj":obj,"msg":msg,"vtype":vtype,"ps":ps});
			return o;
		};
		
		//清空vs
		o.clear = function(){
			vs = [];
			return o;
		};
		
		//单项验证
		o.match = function(obj,msg,vtype,ps){
			o.clear();
			o.add(obj,msg,vtype,ps);
			return o.start();
		};
		
		//开始进行验证
		o.start = function(){		
			o.clearError();
			for(var i=0;i<vs.length;i++){
				var item = vs[i];
				var obj = $(item.obj);
				if(!obj) continue;
				if(item.vtype!="Require"&&obj.val()==""){
					continue;
				}
				
				if(!o.compare(item, obj)) return false;
			}
			
			return true;
		};
		
		o.compare = function(item, obj){
			switch(item.vtype){   //在此处添加可用的验证类型
				case "MaxLength" :
				case "Ip" :
				case "Accept" :
				case "Limit" :
				case "LimitByte" :
				case "Custom" :
				case "Checked" : 
					if(!eval($v[item.vtype])){
						o.setError(obj);
						return o.showMsg(item.msg);							
					}
					break;
				default :
					if(!$v[item.vtype].test(obj.val())){
						o.setError(obj);
						return o.showMsg(item.msg);			
					}
					break;
			}
			return true;
		};
		
		o.showMsg = function(s){
			if(mode==1){
				var toast = new Toast();
		        toast.setText(s);
		        toast.setDuration(1000);
		        toast.show(true);
			}else if(mode==2&&on!=null){
				$(on).html(s);
			}else if(mode==3&&$(o.getError().name+"_m")){
				$(on).html(s);
			}else{
				alert(s);
			}
			return false;
		};
		
		o.setError = function(e){
			ErrObj = e;
		};
		
		o.getError = function(){
			return ErrObj;
		};
		
		o.clearError = function(){
			ErrObj = null;
		};
		
		return o;
	},
	
	//单项匹配，支持有正则的
	match:function(s,t){
		return this[t].test(s);
	},
	
	//执行正则验证
	exec:function(r,s){
		r = (typeof r)=="string"?new RegExp(r, "gm"):r;
		return r.test(s);
	},
	
	isLength:function(v,m){
		var t = 0;
  		for(var i=0;i<v.length;i++){
  			if(v.charCodeAt(i) > 128){
  				t += 2;
  			}else{
  				t += 1;
  			}
			if(t>m) return false;				
  		}
		return true;
	},
	
	isIp:function(s){
		var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g //匹配IP地址的正则表达式
		if(re.test(s)){
			if( RegExp.$1 <256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256) return true;
		}
		return false;
	},
	
	isSafe:function(s){
		return !this.UnSafe.test(s);
	},
	
	isAccept:function(s, f){
		return new RegExp("^.+\.(?=EXT)(EXT)$".replace(/EXT/g, f.split(/\s*,\s*/).join("|")), "gi").test(s);
	},
	
	isLimit:function(l,ps){//ps:min|max
		var min,max;
		if(!ps){
			min = 0;
			max = Number.MAX_VALUE;
		}else if(ps.indexOf("|")!=-1){
			min = ps.split("|")[0];
			max = ps.split("|")[1];
		}else{
			min = ps;
			max = Number.MAX_VALUE;
		}

		min = min || 0;
		max = max || Number.MAX_VALUE;
		return min <= l && l <= max;
	},
	
	lenByte:function(s){
		return s.replace(/[^\x00-\xff]/g,"**").length;
	},
	
	isChecked:function(name, ps){
		var groups = document.getElementsByName(name);
		var hasChecked = 0;
		var min,max;
		if(!ps){
			min = 1;
			max = 1;
		}else if(ps.indexOf("|")!=-1){
			min = ps.split("|")[0];
			max = ps.split("|")[1];
		}else{
			min = ps;
		}
		for(var i=groups.length-1;i>=0;i--){
			if(groups[i].checked) hasChecked++;
		}
		return min <= hasChecked && hasChecked <= max;
	}
		
};

String.prototype.is = function(t){
	return $v.match(this,t);
}
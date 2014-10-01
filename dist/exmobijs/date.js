/*
*	ExMobi4.0 JS 框架之 控件时间类date.js
*	Version	:	1.1.0
*/

//时间类
var $d = {
	
	//获取当前日期时间
	current:function(){
		var myDate = new Date();
		return myDate;
	},
	
	//获取当前日期，默认为yyyy-MM-dd
	getDate:function(){
		var date = this.current();
		var s = arguments.length>0?arguments[0]:"-";
		return date.getFullYear()+s+(date.getMonth()+1<10?"0":"")+(date.getMonth()+1)+s+(date.getDate()<10?"0":"")+date.getDate();
	},
	
	//获取当前时间，默认为hh:mm:ss,有参数的话为hh:mm
	getTime:function(){
		var date = this.current();
		var s = ":";
		if(arguments.length>0){
			return (date.getHours()<10?"0":"")+date.getHours()+s+(date.getMinutes()<10?"0":"")+date.getMinutes();
		}else{
			return (date.getHours()<10?"0":"")+date.getHours()+s+(date.getMinutes()<10?"0":"")+date.getMinutes()+s+(date.getSeconds()<10?"0":"")+date.getSeconds();
		}
	},
	
	//获取当前日期时间，默认为yyyy-MM-dd hh:mm:ss	
	getDateTime:function(){	
		return (arguments.length>0?this.getDate(arguments[0]):this.getDate())+" "+(arguments.length>1?this.getTime(arguments[1]):this.getTime());
	},
	
	//获得星期，返回数字1-7
	getDay:function(){
		return this.current().getDay()==0?7:this.current().getDay();
	},
	
	//比较s1和s2的大小，s2不写默认为当前日期
	compareDate:function(s1,s2){
		s2 = arguments.length>1?s2:this.getDate();
		s1 = s1.replace(/[^\d]+/g,"");
		s2 = s2.replace(/[^\d]+/g,"");
		if(s1.length!=8||s2.length!=8){
			return -1;
		}
		return s1>s2;
	},
	
	//比较s1和s2的大小，s2不写默认为当前时间
	compareTime:function(s1,s2){
		s2 = arguments.length>1?s2:this.getTime();
		s1 = s1.replace(/[^\d]+/g,"");
		s2 = s2.replace(/[^\d]+/g,"");
		if(s1.length!=6||s2.length!=6){
			return -1;
		}
		return s1>s2;
	},
	
	//比较s1和s2的大小，s2不写默认为当前日期时间
	compareDateTime:function(s1,s2){
		s2 = arguments.length>1?s2:this.getDateTime();
		s1 = this.formate(s1).getDateTime().replace(/[^\d]+/g,"");
		s2 = this.formate(s2).getDateTime().replace(/[^\d]+/g,"");
		
		if(s1.length!=14||s2.length!=14){
			return -1;
		}
		return s1>s2;
	},
	
	//格式化日期时间
	formate:function(s){		
		var obj = {};
		var s1,s2;
		
		//为小于10的树补零
		obj.zeroFill = function(a){
			for(var i=0;i<a.length;i++){
				if(a[i].length>1) continue;
				a[i] = a[i]<10?"0"+a[i]:a[i];
			}
			return a.join(arguments[1]||"");
		};		
		
		if(s.indexOf(" ")!=-1){
			s1 = obj.zeroFill(s.split(" ")[0].replace(/[^\d]+/g,"-").split("-"),"-");
			s2 = obj.zeroFill(s.split(" ")[1].replace(/[^\d]+/g,":").split(":"),":");
		}else if(s.indexOf(":")!=-1){
			s1 = $d.getDate();
			s2 = obj.zeroFill(s.replace(/[^\d]+/g,":").split(":"),":");
			s2 = s2.length==5?s2+":00":s2;
		}else{
			s1 = obj.zeroFill(s.replace(/[^\d]+/g,"-").split("-"),"-");
			s2 = "00:00:00";
		}

		//获得日期
		obj.getDate = function(){
			var s = arguments.length>0?arguments[0]:"-";
			return s1.replace(/-/g,s);
		};
		
		//获得时间
		obj.getTime = function(){
			if(arguments.length>0){
				return s2.substring(0,5);
			}else{
				return s2;
			}
		};
		
		//获得日期时间
		obj.getDateTime = function(){
			return (arguments.length>0?obj.getDate(arguments[0]):obj.getDate())+" "+(arguments.length>1?obj.getTime(arguments[1]):obj.getTime());
		};
		
		//获得星期
		obj.getDay = function(){
			var day = new Date(s1).getDay();
			
			return day==0?7:day;
		};

		return obj;
	}


};
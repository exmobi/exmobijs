/*
*	ExMobi4.0 JS 框架之 动态日程类calendar.js(依赖base.js和app.js和utility.js)
*	Version	:	1.0.0.6
*/




//两个参数，第一个是初始化数据为到某个div里面,第二个参数设置颜色
//divId,calendarColor,calendarClickColor,preyearHref,premonthHref,nextmonthHref,nextyearHref
function $calendar(divId,calendarColor,calendarClickColor,preyearHref,premonthHref,nextmonthHref,nextyearHref){
	var nowdate = new Date();
	var nowmonth = nowdate.getMonth();
	var nowyear = nowdate.getFullYear();
	itemData = {"year":nowyear, "month":nowmonth+1};
	
	
	
	try{ $(); }catch(e){ alert("请先导入base.js和app.js"); return; }
	try{ $u; }catch(e){ alert("请先导入utility.js"); return; }
	
	if(document.getElementById(divId) == null)
		{
		 alert("Id不存在");
		 return;
		}
	
	if(calendarColor == null)
		{
		calendarColor = "#90D5ED";
		}
	
	if(calendarClickColor == null)
	{
		calendarClickColor = "#ff8800";
	}
	
	
	var calendardiv = document.getElementById(divId);
	var calendarIntStr="<div  style=\"width:10%;text-align:center;height:42dp;background-color:"+calendarColor+";background-click-color:"+calendarClickColor+"; border-size:1dp;border-color:#dddddd;text-valign:middle;\"  href=\""+preyearHref+"()\">&lt;</div>"
							+"<div  style=\"width:20%;text-align:center;height:42dp;background-color:"+calendarColor+";background-click-color:"+calendarClickColor+";border-size:1dp;border-color:#dddddd;text-valign:middle;\" id=\"idCalendarPre\" href=\""+premonthHref+"()\">&lt;&lt;</div>"
							+"<div  style=\"width:40%;text-align:center;height:42dp;text-valign:middle;\" id=\"datetitle\">${year}年${month}月</div>" 
							+"<div  style=\"width:20%;text-align:center;height:42dp;background-color:"+calendarColor+";background-click-color:"+calendarClickColor+";border-size:1dp;border-color:#dddddd;text-valign:middle;\"  href=\""+nextmonthHref+"()\">&gt;&gt;</div>"
							+"<div  style=\"width:10%;text-align:center;height:42dp;background-color:"+calendarColor+";background-click-color:"+calendarClickColor+"; border-size:1dp;border-color:#dddddd;text-valign:middle;\"  href=\""+nextyearHref+"()\">&gt;</div>"
							+"<table cellspacing=\"0\" bordercolor=\""+calendarColor+"\"  style=\"cell-padding:0;width:100%\" id=\"mytable\"> "
							+"<tr > "
							+"<td style=\"background-color:"+calendarColor+"\"><font style=\"align:center;\">日</font></td> "
							+"<td style=\"background-color:"+calendarColor+"\"><font style=\"align:center;\">一</font></td> "
							+"<td style=\"background-color:"+calendarColor+"\"><font style=\"align:center;\">二</font></td> "
							+"<td style=\"background-color:"+calendarColor+"\"><font style=\"align:center;\">三</font></td> "
							+"<td style=\"background-color:"+calendarColor+"\"><font style=\"align:center;\">四</font></td> "
							+"<td style=\"background-color:"+calendarColor+"\"><font style=\"align:center;\">五</font></td> "
							+"<td style=\"background-color:"+calendarColor+"\"><font style=\"align:center;\">六</font></td> "
							+"</tr>"
							+"</table><br/><div style=\"display:none\" id=\"calendarlist\"><listitem  type=\"twoline\" caption=\"${title}\" sndcaption=\"日期:${date}  时间:${startTime}--${endTime}\" href=\"${href}\"/></div>";
	calendardiv.innerHTML = calendarIntStr;
	$("datetitle").clear().provide(itemData).show();
	
	var calendar = {};
	calendar.draw=function(){
		
		var data = {};
		if(arguments[0] != null)
		{
			data = (typeof arguments[0])=="string"?arguments[0].toJSON():arguments[0];
			data = (data instanceof Array)?data:[data];
		}
		else
		{
			data = "";
		}
						
		itemData = {"year":nowyear, "month":nowmonth+1};			               		
		$("datetitle").clear().provide(itemData).show(); 		
		var table = document.getElementById("mytable");
		var rows=table.rowSize;
		//重新绘制日历时清空table
		 window.beignPreferenceChange();
		for(i=1;i<rows;i++){
			table.deleteRow(1);
		}
		window.endPreferenceChange();	
		var arrmonth =new Array();
		var firstDayd = new Date();
		
		if(nowyear % 4 == 0 && (nowyear % 100 != 0 || nowyear % 400 == 0))
			{		
			//闰年
			 arrmonth = [31,29,31,30,31,30,31,31,30,31,30,31];		 
			}
		else
			{
			//非闰年
			 arrmonth = [31,28,31,30,31,30,31,31,30,31,30,31];		
			}	
		var arr=new Array();
		
		//用当月第一天在一周中的日期值作为当月离第一天的天数 			
		firstDayd.setFullYear(nowyear,nowmonth, 1);
		
		var firstDay = firstDayd.getDay();	
		//上个月的天数
		var premonth;
		if(nowmonth == 0)
			{
			premonth = arrmonth[11];
			}
		else
			{
			premonth = arrmonth[nowmonth-1];		
			}
		
		for(var i = premonth-firstDay+1; i <= premonth; i++){
			arr.push("<font style='align:center;color:#C4D1DE'>"+i+"</font>");
		}		
		//用当月最后一天在一个月中的日期值作为当月的天数 
		var dd = new Date();	
		
		for(var i = 1; i <= arrmonth[nowmonth]; i++){			
			var arrstr = "";	
			if(data.length == 0)
			{
				if(dd.getDate() == i && dd.getFullYear() == nowyear && dd.getMonth() == nowmonth)
				{
				//当前日期用颜色标注
				arrstr = "<font style='align:center;color:red'>"+i+"</font>";
				}
			  else
				{
				//其他日期				
				 arrstr = "<font style='align:center;color:#000000'>"+i+"</font>";
	
				}
				
			  }
			else
			{
				var arrstrjson = "[";
				var n=0;
				for(var k=0;k<data.length;k++){										
					var timearr = data[k].date.split("-");				
					if(nowyear == parseInt(timearr[0]) && nowmonth+1 == parseInt(timearr[1]) && i == parseInt(timearr[2]))
					{
						 //arr.push("<font style='align:center;color:red'>"+i+"</font>ss");
						arrstrjson = arrstrjson + $u.transObj(data[k])+",";
						n = n+1;
					}
				}
				arrstrjson = arrstrjson + "]";
				
				
				if(n == 0)
				{
					if(dd.getDate() == i && dd.getFullYear() == nowyear && dd.getMonth() == nowmonth)
					{
					  arrstr = "<font style='align:center;color:red'>"+i+"</font>";
					}
					else
					{
						arrstr = "<font style='align:center;color:#000000'>"+i+"</font>";
					}
				}
				 else
				 {
					 arrstrjson = arrstrjson.replace(/"/g,"&quot;");
					 if(dd.getDate() == i && dd.getFullYear() == nowyear && dd.getMonth() == nowmonth)
						{
						 arrstr = '<a style="align:center;color:red" href="calendar.getList(\''+arrstrjson+'\')">'+i+'</a>';							
						}
					 else
						 {
						 arrstr = '<a style="align:center;color:blue" href="calendar.getList(\''+arrstrjson+'\')">'+i+'</a>';							
						 }	 
				 }
				
			}
			arr.push(arrstr);
		 }
			
			
		//计算下个月还有多少天在当月视图显示，以7x6=42个日期展现
		var nextDay = 42-arr.length;			
	    for(var i = 1; i <= nextDay; i++){		
			arr.push("<font style='align:center;color:#C4D1DE'>"+i+"</font>");		
			} 
		
	    window.beignPreferenceChange();
		while(arr.length > 0){ 		
			var tab=document.getElementById("mytable");
		    var tr=new TableRow();
		    var cols=tab.colSize;
		     var rows=tab.rowSize;
			//每个星期有7天 
			for(var i = 1; i <= 7; i++){ 		
			 var td=new TableCell();
		       td.id="t"+rows+"c"+i;
		      // td.innerHTML="";
			if(arr.length > 0){
				//返回并删除数组的第一个元素
			var day = arr.shift();				 
	         td.innerHTML=day;
	         tr.insertCell(td);/*插入列*/		
			}		
		  }
			//每个星期插入一个tr 
			tab.insertRow(tr);
		}
		window.endPreferenceChange();
		
	};
	//上个月
	calendar.premonth = function()
	{
		$("calendarlist").hide();
		nowmonth = nowmonth -1;
		
		if(nowmonth < 0)
			{
			nowyear = nowyear -1;
			nowmonth = 11;
			}
		return calendar;
	};
	//上一年
	calendar.preyear = function()
	{	
		$("calendarlist").hide();
		nowyear = nowyear -1;
		return calendar;
	};
	//下一年
	calendar.nextyear = function()
	{		
		$("calendarlist").hide();
		nowyear = nowyear + 1;
		return calendar;
	};
	//下个月
	calendar.nextmonth = function()
	{
		$("calendarlist").hide();
		nowmonth = nowmonth + 1;	
		if(nowmonth > 11)
		{
		nowyear = nowyear + 1;
		nowmonth = 0;
		}
		return calendar;
	};
	calendar.getList = function(data)
	{
		//data = [{"date":"2013-01-27","startTime":"12:50","endTime":"14:34","title":"岁的发放"},{"date":"2013-01-24","startTime":"12:50","endTime":"14:34","title":"ss岁的发放"}];
		$("calendarlist").clear().provide(data.toJSON()).show();		
		
	};
	calendar.provide = function()
	{
		
		if(arguments.length == 1){
			var data = {};
			if(arguments[0] != null)
			{
				data = (typeof arguments[0])=="string"?arguments[0].toJSON():arguments[0];
				data = (data instanceof Array)?data:[data];
			}
			else
			{
				data = "";
			}			
			 calendar.draw(data);
			 
		}else if(arguments.length==5){//有5个参数则认为是要发起请求获取json数据
			var ajax = $a.go(arguments[0], arguments[1], arguments[2], "calendar.onSuccess", null, arguments[3], arguments[4]);
			ajax.send();
		}
		
		//return calendar;
		
	}
	
	calendar.onSuccess = function(data)
	{
		
		 calendar.draw(data.responseText.toJSON());
		 
		// return calendar;
	}
	
	
  return calendar;
}


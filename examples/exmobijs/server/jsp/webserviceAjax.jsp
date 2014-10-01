<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" contentType="application/uixml+xml; charset=UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<aa:http id="ws">
	<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
	<aa:header name="SOAPAction" value="\"\""/>
	<aa:content>
		<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://server.webservice.app.fh.com">
   			<soapenv:Header/>
   			<soapenv:Body>
      			<ser:checkUserIsExist soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
         			<username xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"><%=aa.getReqParameterValue("username") %></username>
         			<password xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"><%=aa.getReqParameterValue("password") %></password>
      			</ser:checkUserIsExist>
   			</soapenv:Body>
		</soapenv:Envelope>
	</aa:content>
</aa:http>
<%
String msg = aa.xpath("//checkUserIsExistReturn", "ws");
if(msg.indexOf("login success")>-1){
	msg = "登陆成功";
}else{
	msg = "登陆失败";
}
%>
{"status":"<%=msg%>"}
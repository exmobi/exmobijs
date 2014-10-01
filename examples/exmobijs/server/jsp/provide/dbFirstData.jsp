<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" contentType="text/json; charset=UTF-8"%>
<%@ include file="/client/adapt.jsp"%>

<%
String sql = "select * from tbl_task limit 1";
%>
<aa:sql-excute id="selectOne" dbId="postgresql" sql="<%=sql %>"/>
{
"title":"<%=aa.xpath("//datacol[@name='title']", "selectOne") %>", 
"begin_time":"<%=aa.xpath("//datacol[@name='begin_time']", "selectOne") %>", 
"end_time":"<%=aa.xpath("//datacol[@name='end_time']", "selectOne") %>", 
"executor":"<%=aa.xpath("//datacol[@name='executor']", "selectOne") %>",
"priority_level":"<%=aa.xpath("//datacol[@name='priority_level']", "selectOne") %>",
"cc":"工程,规划",
"remark":"<%=aa.xpath("//datacol[@name='remark']", "selectOne") %>"
}


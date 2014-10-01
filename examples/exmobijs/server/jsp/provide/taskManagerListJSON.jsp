<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" contentType="text/json; charset=UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<aa:http id="taskManagerListJSON" />
<%-- 返回的是形如
{"total":2,"totalPage":1,"rows":[{"id":"e08c9299-3f7b-4771-8dcd-cc35d2e6b4ae","priority_level":"鎬?,"title":"浠诲姟11","update_time":"2012-07-05 11:27:51","begin_time":"2012-07-05","days":1,"remark":"111","end_time":"2012-07-05","executor":"姊呯拠","create_time":"2012-07-05 11:27:51"},{"id":"061120e8-0f71-459b-821b-8883a80d3154","priority_level":"寰堟€?,"title":"浠诲姟21","update_time":"2012-07-05 11:30:19","begin_time":"2012-07-05","days":2,"remark":"111","end_time":"2012-07-05","executor":"榛勭倻","create_time":"2012-07-05 11:30:19"}]}
的数据，但是我们要取的是rows里面的，所以通过正则获取想要的部分
 --%>
<%
System.out.println(aa.regex("rows\":([^\\]]*\\])\\}", 1, "taskManagerListJSON"));
%>
<%=aa.regex("rows\":([^\\]]*\\])\\}", 1, "taskManagerListJSON") %>
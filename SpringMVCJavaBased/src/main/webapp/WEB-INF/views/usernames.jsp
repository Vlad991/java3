<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix = "c" uri = "http://java.sun.com/jsp/jstl/core"%>
<html>
<body>
<c:forEach var="user" items="${list}">
    <c:out value="${user}"/>
    <br>

</c:forEach>
</body>
</html>
<%--
  Created by IntelliJ IDEA.
  User: kuzmavladislavvladimirovic
  Date: 2019-06-05
  Time: 23:07
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Show Cart</title>
</head>
<body>
    <%@ page import="com.infopulse.Cart" %>

    <% Cart cart = (Cart) session.getAttribute("cart"); %>

    <p> Name: <%= cart.getName() %> </p>
    <p> Quantity: <%= cart.getQuantity() %> </p>
</body>
</html>

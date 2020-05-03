<%--
  Created by IntelliJ IDEA.
  User: kuzmavladislavvladimirovic
  Date: 2019-06-05
  Time: 12:58
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>First JSP</title>
  </head>
  <body>
    <h1>Testing JSP</h1>
    <p>
      <%@ page import="java.util.Date, com.infopulse.TestClass" %>

      <% TestClass testClass = new TestClass(); %>
      <%=
       testClass.getInfo()
      %>

      <%
        java.util.Date now = new java.util.Date();
        String someString = "<p>" + "Actual date : " + now + "</p>";
      %>

      <%= someString %>
      <%
        for (int i = 0; i < 10; i++) {
          out.println("<p>" + "Hello : " + i + "</p>");
        }
      %>

    </p>
  </body>
</html>

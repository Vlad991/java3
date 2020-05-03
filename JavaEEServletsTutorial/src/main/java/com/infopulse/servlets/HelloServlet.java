package com.infopulse.servlets;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.List;

public class HelloServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Enumeration<String> parameterNames = request.getParameterNames();
        while (parameterNames.hasMoreElements()) {
            String elementName = parameterNames.nextElement();
            response.getWriter().println(elementName + "=" + request.getParameter(elementName));
        }
        response.getWriter().println(request.getRequestURL());
        response.getWriter().println(request.getRequestURL());
        response.getWriter().println(request.getServletPath());
        response.getWriter().println(request.getRemoteHost());
        response.getWriter().println(request.getRequestURI());
        response.getWriter().println(request.getLocalPort());
        response.getWriter().println(request.getQueryString());
    }

    @Override
    public void destroy() {
        System.out.println("destroy");
    }
}

package com.ejemplo.controller;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebServlet("/auth/logout")
public class AuthLogoutController extends HttpServlet {

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) {
        AuthSupport.cors(response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        AuthSupport.cors(response);
        response.setContentType("application/json;charset=UTF-8");

        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        JsonObject json = Json.createObjectBuilder()
                .add("ok", true)
                .add("mensaje", "Sesion cerrada")
                .build();

        response.getWriter().print(json.toString());
    }
}

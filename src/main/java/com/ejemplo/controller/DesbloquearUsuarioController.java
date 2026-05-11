package com.ejemplo.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

import com.ejemplo.model.BloqueoUsuarioModel;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/admin/desbloquear")
public class DesbloquearUsuarioController extends HttpServlet {

    private void setCorsHeaders(HttpServletResponse response) {
        AuthSupport.cors(response);
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws IOException {
        setCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

        setCorsHeaders(response);

        if (!AuthSupport.requireAdmin(request.getSession(false), response)) {
            return;
        }

        BufferedReader reader = request.getReader();
        StringBuilder sb = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) sb.append(line);

        JsonObject obj = Json.createReader(new java.io.StringReader(sb.toString())).readObject();
        String email = obj.getString("email", "").trim().toLowerCase();

        try {
            boolean ok = BloqueoUsuarioModel.desbloquear(email);
            response.setContentType("application/json");
            PrintWriter out = response.getWriter();
            out.print(ok ? "{\"ok\": true}" : "{\"ok\": false, \"mensaje\": \"Correo electrónico no válido\"}");

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.getWriter().print("{\"ok\": false, \"mensaje\": \"No se pudo desbloquear el usuario\"}");
        }
    }
}

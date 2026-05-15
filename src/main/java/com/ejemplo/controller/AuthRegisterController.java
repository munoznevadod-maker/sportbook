package com.ejemplo.controller;

import com.ejemplo.model.UsuarioRegisterModel;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;

@WebServlet("/auth/register")
public class AuthRegisterController extends HttpServlet {

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) {
        AuthSupport.cors(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        AuthSupport.cors(request, response);
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        JsonObject obj;

        try {
            obj = readJson(request);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().print("{\"ok\":false,\"mensaje\":\"Solicitud no valida\"}");
            return;
        }

        String username = obj.getString("username", "").trim();
        String email = obj.getString("email", "").trim().toLowerCase();
        String password = obj.getString("password", "");

        if (username.isBlank()) {
            response.getWriter().print("{\"ok\":false,\"mensaje\":\"El nombre de usuario es obligatorio\"}");
            return;
        }

        if (!isValidEmail(email)) {
            response.getWriter().print("{\"ok\":false,\"mensaje\":\"Introduce un correo valido\"}");
            return;
        }

        if (password.isBlank()) {
            response.getWriter().print("{\"ok\":false,\"mensaje\":\"La contrasena es obligatoria\"}");
            return;
        }

        if (password.length() < 6) {
            response.getWriter().print("{\"ok\":false,\"mensaje\":\"La contrasena debe tener minimo 6 caracteres\"}");
            return;
        }

        UsuarioRegisterModel model = new UsuarioRegisterModel();
        boolean ok = model.registrar(username, email, password);

        if (ok) {
            response.getWriter().print("{\"ok\":true}");
        } else {
            response.getWriter().print("{\"ok\":false,\"mensaje\":\"El correo o usuario ya existe\"}");
        }
    }

    private JsonObject readJson(HttpServletRequest request) throws IOException {
        BufferedReader reader = request.getReader();
        StringBuilder sb = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }

        return Json.createReader(new StringReader(sb.toString())).readObject();
    }

    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");
    }
}

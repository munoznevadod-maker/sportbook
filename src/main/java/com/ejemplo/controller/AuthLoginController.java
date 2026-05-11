package com.ejemplo.controller;

import com.ejemplo.model.UsuarioLoginModel;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;

@WebServlet("/auth/login")
public class AuthLoginController extends HttpServlet {

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) {
        AuthSupport.cors(response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        AuthSupport.cors(response);
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        JsonObject obj;

        try {
            obj = readJson(request);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            writeJson(response, false, "Solicitud no valida");
            return;
        }

        String login = obj.getString("login", "").trim();
        String password = obj.getString("password", "");
        UsuarioLoginModel model = new UsuarioLoginModel();

        if (model.estaBloqueado(login)) {
            writeJson(response, false, "Cuenta bloqueada. Contacta con el administrador.");
            return;
        }

        if (!model.existeUsuario(login)) {
            writeJson(response, false, "La cuenta no existe. Registrate para poder acceder.");
            return;
        }

        int idUsuario = model.validar(login, password);

        if (idUsuario == -1) {
            writeJson(response, false, "Credenciales incorrectas");
            return;
        }

        String rol = model.obtenerRol(login);
        String username = model.obtenerUsername(login);
        String email = model.obtenerEmail(login);

        HttpSession sesion = request.getSession(true);
        sesion.setMaxInactiveInterval(30 * 60);
        sesion.setAttribute("idUsuario", idUsuario);
        sesion.setAttribute("rol", rol);
        sesion.setAttribute("username", username);
        sesion.setAttribute("email", email);

        JsonObject json = Json.createObjectBuilder()
                .add("ok", true)
                .add("rol", rol)
                .add("username", username)
                .add("email", email)
                .build();

        response.getWriter().print(json.toString());
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

    private void writeJson(HttpServletResponse response, boolean ok, String mensaje)
            throws IOException {

        JsonObject json = Json.createObjectBuilder()
                .add("ok", ok)
                .add("mensaje", mensaje)
                .build();

        response.getWriter().print(json.toString());
    }
}

package com.ejemplo.controller;

import com.ejemplo.model.UsuarioPerfilModel;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Map;

@WebServlet("/auth/profile-image")
public class AuthProfileController extends HttpServlet {

    private final Gson gson = new Gson();
    private final UsuarioPerfilModel model = new UsuarioPerfilModel();
    private final Type mapType = new TypeToken<Map<String, String>>() {}.getType();

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) {
        AuthSupport.cors(request, response);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        AuthSupport.cors(request, response);
        response.setContentType("application/json;charset=UTF-8");

        HttpSession session = request.getSession(false);
        if (!AuthSupport.requireLogin(session, response)) {
            return;
        }

        int usuarioId = Integer.parseInt(String.valueOf(session.getAttribute("idUsuario")));
        String profileImage = model.obtenerImagenPerfil(usuarioId);

        write(response, Map.of(
                "ok", true,
                "profileImage", profileImage
        ));
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        AuthSupport.cors(request, response);
        response.setContentType("application/json;charset=UTF-8");

        HttpSession session = request.getSession(false);
        if (!AuthSupport.requireLogin(session, response)) {
            return;
        }

        Map<String, String> data = gson.fromJson(request.getReader(), mapType);
        String profileImage = data == null ? "" : data.getOrDefault("profileImage", "");

        if (!profileImage.startsWith("data:image/")) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            write(response, Map.of(
                    "ok", false,
                    "mensaje", "La imagen no es valida."
            ));
            return;
        }

        int usuarioId = Integer.parseInt(String.valueOf(session.getAttribute("idUsuario")));
        boolean ok = model.guardarImagenPerfil(usuarioId, profileImage);

        write(response, Map.of(
                "ok", ok,
                "profileImage", ok ? profileImage : "",
                "mensaje", ok ? "Foto guardada." : "No se pudo guardar la foto."
        ));
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        AuthSupport.cors(request, response);
        response.setContentType("application/json;charset=UTF-8");

        HttpSession session = request.getSession(false);
        if (!AuthSupport.requireLogin(session, response)) {
            return;
        }

        int usuarioId = Integer.parseInt(String.valueOf(session.getAttribute("idUsuario")));
        boolean ok = model.quitarImagenPerfil(usuarioId);

        write(response, Map.of(
                "ok", ok,
                "mensaje", ok ? "Foto eliminada." : "No se pudo quitar la foto."
        ));
    }

    private void write(HttpServletResponse response, Object data)
            throws IOException {

        response.getWriter().print(gson.toJson(data));
    }
}

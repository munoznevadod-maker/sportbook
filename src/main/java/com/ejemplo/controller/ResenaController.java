package com.ejemplo.controller;

import com.ejemplo.model.AdminModel;
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

@WebServlet("/api/resenas")
public class ResenaController extends HttpServlet {

    private final Gson gson = new Gson();
    private final AdminModel model = new AdminModel();
    private final Type mapType = new TypeToken<Map<String, Object>>() {}.getType();

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) {
        AuthSupport.cors(request, response);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        AuthSupport.cors(request, response);
        response.setContentType("application/json;charset=UTF-8");

        try {
            write(response, Map.of(
                    "ok", true,
                    "resenas", model.listarResenas()));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            write(response, Map.of(
                    "ok", false,
                    "mensaje", "No se pudieron cargar las reseñas"));
        }
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

        try {
            Map<String, Object> body =
                    gson.fromJson(request.getReader(), mapType);

            if (body == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                write(response, Map.of(
                        "ok", false,
                        "mensaje", "Completa todos los campos de la reseña"));
                return;
            }

            String name =
                    String.valueOf(body.getOrDefault("name", "")).trim();

            if (name.isBlank() && session.getAttribute("username") != null) {
                name = String.valueOf(session.getAttribute("username"));
            }

            String sport =
                    String.valueOf(body.getOrDefault("sport", "")).trim();

            String comment =
                    String.valueOf(body.getOrDefault("comment", "")).trim();

            int rating =
                    body.get("rating") instanceof Number number
                            ? number.intValue()
                            : 0;

            if (name.isBlank() || sport.isBlank() || comment.isBlank() || rating < 1 || rating > 5) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                write(response, Map.of(
                        "ok", false,
                        "mensaje", "Completa la reseña y elige una valoración"));
                return;
            }

            boolean ok = model.crearResena(Map.of(
                    "name", name,
                    "sport", sport,
                    "rating", rating,
                    "comment", comment
            ));

            write(response, Map.of("ok", ok));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            write(response, Map.of(
                    "ok", false,
                    "mensaje", "No se pudo publicar la reseña"));
        }
    }

    private void write(HttpServletResponse response, Object data)
            throws IOException {

        response.getWriter().print(gson.toJson(data));
    }
}

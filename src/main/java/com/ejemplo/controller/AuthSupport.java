package com.ejemplo.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

public final class AuthSupport {

    private AuthSupport() {
    }

    public static boolean requireLogin(HttpSession session, HttpServletResponse response)
            throws IOException {

        if (session == null || session.getAttribute("idUsuario") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().print("{\"ok\":false,\"mensaje\":\"Debes iniciar sesion\"}");
            return false;
        }

        return true;
    }

    public static boolean requireAdmin(HttpSession session, HttpServletResponse response)
            throws IOException {

        if (!requireLogin(session, response)) {
            return false;
        }

        Object rol = session.getAttribute("rol");

        if (rol == null || !"ADMIN".equalsIgnoreCase(String.valueOf(rol))) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().print("{\"ok\":false,\"mensaje\":\"No tienes permisos de administrador\"}");
            return false;
        }

        return true;
    }

    public static String sessionEmail(HttpSession session) {
        Object email = session == null ? null : session.getAttribute("email");
        return email == null ? "" : String.valueOf(email);
    }

    public static boolean isAdmin(HttpSession session) {
        Object rol = session == null ? null : session.getAttribute("rol");
        return rol != null && "ADMIN".equalsIgnoreCase(String.valueOf(rol));
    }

    public static void cors(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}

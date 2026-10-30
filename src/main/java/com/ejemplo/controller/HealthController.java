package com.ejemplo.controller;

import com.ejemplo.model.ConexionBD;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/healthz")
public class HealthController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setHeader("Cache-Control", "no-store");
        try (var connection = ConexionBD.getConnection();
             var statement = connection.prepareStatement("SELECT 1");
             var result = statement.executeQuery()) {
            if (!result.next()) {
                throw new IllegalStateException("Database health check failed");
            }
            response.getWriter().write("{\"status\":\"ok\"}");
        } catch (Exception error) {
            response.setStatus(503);
            response.getWriter().write("{\"status\":\"unavailable\"}");
        }
    }
}

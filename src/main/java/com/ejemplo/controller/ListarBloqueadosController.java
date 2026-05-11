package com.ejemplo.controller;

import com.ejemplo.model.BloqueoUsuarioModel;
import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/admin/listarBloqueados")
public class ListarBloqueadosController extends HttpServlet {
    private final Gson gson = new Gson();

    private void setCorsHeaders(HttpServletResponse response) {
        AuthSupport.cors(response);
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws IOException {
        setCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

        setCorsHeaders(response);
        response.setContentType("application/json; charset=UTF-8");

        if (!AuthSupport.requireAdmin(request.getSession(false), response)) {
            return;
        }

        try {
            PrintWriter out = response.getWriter();
            out.print(gson.toJson(BloqueoUsuarioModel.listar()));

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().print("[]");
        }
    }
}

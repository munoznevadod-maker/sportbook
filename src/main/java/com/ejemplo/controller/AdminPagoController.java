package com.ejemplo.controller;

import com.ejemplo.model.ConexionBD;
import com.google.gson.Gson;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

import java.sql.Connection;
import java.sql.PreparedStatement;

import java.util.Map;

@WebServlet("/admin/pago")
public class AdminPagoController extends HttpServlet {

    private final Gson gson =
        new Gson();

    @Override
    protected void doOptions(
            HttpServletRequest request,
            HttpServletResponse response) {

        AuthSupport.cors(response);
    }

    @Override
    protected void doPut(
            HttpServletRequest request,
            HttpServletResponse response)
            throws IOException {

        response.setContentType(
            "application/json;charset=UTF-8"
        );

        AuthSupport.cors(response);

        if (!AuthSupport.requireAdmin(request.getSession(false), response)) {
            return;
        }

        try {

            Map<?, ?> data =
                gson.fromJson(
                    request.getReader(),
                    Map.class
                );

            int id =
                ((Double)data.get("id"))
                .intValue();

            Connection conn =
                ConexionBD.getConnection();

            String sql =
                "UPDATE reservas SET estado_pago = 'Pagado', estado = 'Confirmada' WHERE id = ?";

            PreparedStatement ps =
                conn.prepareStatement(sql);

            ps.setInt(1, id);

            ps.executeUpdate();

            ps.close();
            conn.close();

            response.getWriter().print(
                gson.toJson(
                    Map.of(
                        "ok", true
                    )
                )
            );

        } catch (Exception e) {

            e.printStackTrace();

            response.setStatus(500);

            response.getWriter().print(
                gson.toJson(
                    Map.of(
                        "ok", false
                    )
                )
            );
        }
    }
}

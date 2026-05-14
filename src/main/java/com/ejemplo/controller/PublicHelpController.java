package com.ejemplo.controller;

import com.ejemplo.model.ConexionBD;
import com.ejemplo.model.PublicHelpModel;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@WebServlet({"/public-help-list"})
public class PublicHelpController extends HttpServlet {
    private final Gson gson = new Gson();
    private final Type mapType = new TypeToken<Map<String, Object>>() {}.getType();

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");

        try {

            Map<String, Object> body =
                    gson.fromJson(request.getReader(), mapType);

            String nombre =
                    stringValue(body, "nombre");

            String gmail =
                    stringValue(body, "gmail");

            String motivo =
                    stringValue(body, "motivo");

            String mensaje =
                    stringValue(body, "mensaje");

            boolean ok =
                    new PublicHelpModel()
                            .guardar(nombre, gmail, motivo, mensaje);

            Map<String, Object> result =
                    new LinkedHashMap<>();

            result.put("ok", ok);

            response.getWriter().print(
                    gson.toJson(result)
            );

        } catch (Exception e) {

            e.printStackTrace();

            response.setStatus(500);

            Map<String, Object> result =
                    new LinkedHashMap<>();

            result.put("ok", false);

            response.getWriter().print(
                    gson.toJson(result)
            );
        }
    }

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        try {

            List<Map<String, Object>> ayudas =
                    new ArrayList<>();

            try (
                    Connection con =
                            ConexionBD.getConnection();

                    PreparedStatement ps =
                            con.prepareStatement(
                                    "SELECT id, nombre, gmail, motivo, mensaje FROM ayudas_publicas ORDER BY id DESC"
                            );

                    ResultSet rs =
                            ps.executeQuery()
            ) {
                while (rs.next()) {
                    Map<String, Object> item =
                            new LinkedHashMap<>();

                    item.put("id", rs.getInt("id"));
                    item.put("nombre", rs.getString("nombre"));
                    item.put("gmail", rs.getString("gmail"));
                    item.put("tema", rs.getString("motivo"));
                    item.put("mensaje", rs.getString("mensaje"));
                    ayudas.add(item);
                }
            }

            out.print(gson.toJson(ayudas));

        } catch (Exception e) {

            e.printStackTrace();

            out.print("[]");
        }
    }

    private String stringValue(
            Map<String, Object> data,
            String key) {

        if (data == null) {
            return "";
        }

        Object value =
                data.get(key);

        return value == null
                ? ""
                : String.valueOf(value).trim();
    }
}

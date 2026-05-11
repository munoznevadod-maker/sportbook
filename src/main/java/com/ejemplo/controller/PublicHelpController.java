package com.ejemplo.controller;

import com.ejemplo.model.ConexionBD;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@WebServlet({"/public-help-list"})
public class PublicHelpController extends HttpServlet {

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {

            String body =
                    request.getReader()
                            .lines()
                            .reduce("", String::concat);

            String nombre =
                    body.split("\"nombre\":\"")[1]
                            .split("\"")[0];

            String gmail =
                    body.split("\"gmail\":\"")[1]
                            .split("\"")[0];

            String motivo =
                    body.split("\"motivo\":\"")[1]
                            .split("\"")[0];

            String mensaje =
                    body.split("\"mensaje\":\"")[1]
                            .split("\"")[0];

            Connection con =
                    ConexionBD.getConnection();

            PreparedStatement ps =
                    con.prepareStatement(
                            "INSERT INTO ayudas_publicas(nombre,gmail,motivo,mensaje) VALUES(?,?,?,?)"
                    );

            ps.setString(1, nombre);
            ps.setString(2, gmail);
            ps.setString(3, motivo);
            ps.setString(4, mensaje);

            ps.executeUpdate();

            response.getWriter().print(
                    "{\"ok\":true}"
            );

        } catch (Exception e) {

            e.printStackTrace();

            response.setStatus(500);

            response.getWriter().print(
                    "{\"ok\":false}"
            );
        }
    }

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        try {

            Connection con =
                    ConexionBD.getConnection();

            PreparedStatement ps =
                    con.prepareStatement(
                            "SELECT * FROM ayudas_publicas ORDER BY id DESC"
                    );

            ResultSet rs = ps.executeQuery();

            StringBuilder json =
                    new StringBuilder("[");

            boolean first = true;

            while (rs.next()) {

                if (!first) {
                    json.append(",");
                }

                json.append("{")
                        .append("\"id\":")
                        .append(rs.getInt("id"))
                        .append(",")

                        .append("\"nombre\":\"")
                        .append(rs.getString("nombre"))
                        .append("\",")

                        .append("\"gmail\":\"")
                        .append(rs.getString("gmail"))
                        .append("\",")

                        .append("\"tema\":\"")
                        .append(rs.getString("motivo"))
                        .append("\",")

                        .append("\"mensaje\":\"")
                        .append(rs.getString("mensaje"))
                        .append("\"")
                        .append("}");

                first = false;
            }

            json.append("]");

            out.print(json.toString());

        } catch (Exception e) {

            e.printStackTrace();

            out.print("[]");
        }
    }
}
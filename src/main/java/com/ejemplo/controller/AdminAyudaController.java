package com.ejemplo.controller;

import com.ejemplo.model.AdminModel;

import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringReader;
import java.util.Map;

@WebServlet("/admin/ayuda")
public class AdminAyudaController extends HttpServlet {

    // =========================
    // OPTIONS
    // =========================

    @Override
    protected void doOptions(
            HttpServletRequest request,
            HttpServletResponse response) {

        response.setHeader(
            "Access-Control-Allow-Origin",
            "*"
        );

        response.setHeader(
            "Access-Control-Allow-Methods",
            "POST, GET, OPTIONS"
        );

        response.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type"
        );
    }

    // =========================
    // GET
    // =========================

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws IOException {

        response.setHeader(
            "Access-Control-Allow-Origin",
            "*"
        );

        HttpSession session =
            request.getSession(false);

        if (!AuthSupport.requireAdmin(session, response)) {
            return;
        }

        response.setContentType(
            "application/json"
        );

        PrintWriter out =
            response.getWriter();

        try {

            AdminModel model =
                new AdminModel();

            var ayudas =
                model.listarAyuda();

            JsonArrayBuilder array =
                Json.createArrayBuilder();

            for (Map<String, Object> item : ayudas) {

                array.add(

                    Json.createObjectBuilder()

                        .add(
                            "nombre",
                            String.valueOf(
                                item.get("nombre")
                            )
                        )

                        .add(
                            "gmail",
                            String.valueOf(
                                item.get("gmail")
                            )
                        )

                        .add(
                            "tema",
                            String.valueOf(
                                item.get("tema")
                            )
                        )

                        .add(
                            "mensaje",
                            String.valueOf(
                                item.get("mensaje")
                            )
                        )
                );
            }

            out.print(

                Json.createObjectBuilder()

                    .add("ayuda", array)

                    .build()

                    .toString()
            );

        } catch (Exception e) {

            e.printStackTrace();

            out.print("""
            {
              "ayuda": []
            }
            """);
        }
    }

    // =========================
    // POST
    // =========================

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response)
            throws IOException {

        response.setHeader(
            "Access-Control-Allow-Origin",
            "*"
        );

        response.setHeader(
            "Access-Control-Allow-Methods",
            "POST, GET, OPTIONS"
        );

        response.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type"
        );

        response.setContentType(
            "application/json"
        );

        HttpSession session =
            request.getSession(false);

        if (!AuthSupport.requireLogin(session, response)) {
            return;
        }

        request.setCharacterEncoding("UTF-8");

        PrintWriter out =
            response.getWriter();

        try {

            BufferedReader reader =
                request.getReader();

            StringBuilder sb =
                new StringBuilder();

            String line;

            while ((line = reader.readLine()) != null) {

                sb.append(line);

            }

            JsonObject obj =
                Json.createReader(
                    new StringReader(sb.toString())
                ).readObject();

            String sessionEmail =
                AuthSupport.sessionEmail(session);

            String nombre =
                obj.getString(
                    "nombre",
                    ""
                ).trim();

            if (
                nombre.isBlank() &&
                session.getAttribute("username") != null
            ) {

                nombre =
                    String.valueOf(
                        session.getAttribute("username")
                    );
            }

            AdminModel model =
                new AdminModel();

            boolean ok =
                model.crearAyuda(
                    Map.of(
                        "nombre",
                        nombre,

                        "gmail",
                        sessionEmail.isBlank()
                            ? obj.getString("gmail", "")
                            : sessionEmail,

                        "motivo",
                        obj.getString("motivo", ""),

                        "mensaje",
                        obj.getString("mensaje", "")
                    )
                );

            out.print(
                "{ \"ok\": " + ok + " }"
            );

        } catch (Exception e) {

            e.printStackTrace();

            out.print("""
            {
              "ok": false,
              "mensaje": "Error del servidor"
            }
            """);
        }
    }
}

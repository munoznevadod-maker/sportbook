package com.ejemplo.controller;


import com.ejemplo.model.PublicHelpModel;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringReader;

@WebServlet("/public-help")
public class PublicDataController
        extends HttpServlet {

    private void cors(
            HttpServletResponse response
    ) {

        response.setHeader(
            "Access-Control-Allow-Origin",
            "*"
        );

        response.setHeader(
            "Access-Control-Allow-Methods",
            "POST, OPTIONS"
        );

        response.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type"
        );

    }

    @Override
    protected void doOptions(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        cors(response);

        response.setStatus(
            HttpServletResponse.SC_OK
        );

    }

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        cors(response);

        BufferedReader reader =
            request.getReader();

        StringBuilder sb =
            new StringBuilder();

        String line;

        while (
            (line = reader.readLine()) != null
        ) {

            sb.append(line);

        }

        JsonObject obj =
            Json.createReader(
                new StringReader(
                    sb.toString()
                )
            ).readObject();

        String nombre =
            obj.getString("nombre");

        String gmail =
            obj.getString("gmail");

        String tema =
            obj.getString("tema");

        String mensaje =
            obj.getString("mensaje");

        PublicHelpModel model =
            new PublicHelpModel();

        boolean ok =
            model.guardar(
                nombre,
                gmail,
                tema,
                mensaje
            );

        response.setContentType(
            "application/json"
        );

        PrintWriter out =
            response.getWriter();

        out.print(
            "{ \"ok\": " + ok + " }"
        );

    }

}
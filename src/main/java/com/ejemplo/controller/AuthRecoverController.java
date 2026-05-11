package com.ejemplo.controller;

import com.ejemplo.model.BloqueoUsuarioModel;
import com.ejemplo.model.EmailService;
import com.ejemplo.model.UsuarioRecoveryModel;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringReader;

@WebServlet(urlPatterns = {"/auth/recover/check", "/auth/recover/reset"})
public class AuthRecoverController extends HttpServlet {

    private final UsuarioRecoveryModel model = new UsuarioRecoveryModel();

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) {
        setCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        setCorsHeaders(response);
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=UTF-8");

        JsonObject body;
        try {
            body = readJson(request);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            writeJson(response, Json.createObjectBuilder()
                    .add("ok", false)
                    .add("mensaje", "Solicitud no valida")
                    .build());
            return;
        }

        try {
            String path = request.getServletPath();

            if (path.endsWith("/check")) {
                checkAccount(body, response);
                return;
            }

            if (path.endsWith("/reset")) {
                resetPassword(body, response);
                return;
            }

            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            writeJson(response, Json.createObjectBuilder()
                    .add("ok", false)
                    .add("mensaje", "Ruta no encontrada")
                    .build());
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            writeJson(response, Json.createObjectBuilder()
                    .add("ok", false)
                    .add("mensaje", "No se pudo procesar la recuperacion")
                    .build());
        }
    }

    private void checkAccount(JsonObject body, HttpServletResponse response) throws Exception {
        String email = body.getString("email", "").trim().toLowerCase();

        if (!isValidEmail(email)) {
            writeJson(response, Json.createObjectBuilder()
                    .add("ok", false)
                    .add("mensaje", "Introduce un correo electronico valido")
                    .build());
            return;
        }

        if (BloqueoUsuarioModel.estaBloqueado(email)) {
            writeJson(response, Json.createObjectBuilder()
                    .add("ok", false)
                    .add("mensaje", "Cuenta bloqueada. Contacta con el administrador")
                    .build());
            return;
        }

        UsuarioRecoveryModel.RecoveryCode recoveryCode =
                model.crearCodigoRecuperacion(email);

        if (recoveryCode == null) {
            writeJson(response, Json.createObjectBuilder()
                    .add("ok", false)
                    .add("mensaje", "No existe una cuenta con ese correo")
                    .build());
            return;
        }

        try {
            EmailService.sendPasswordResetCode(
                    recoveryCode.email(),
                    recoveryCode.username(),
                    recoveryCode.code());
        } catch (IllegalStateException e) {
            writeJson(response, Json.createObjectBuilder()
                    .add("ok", false)
                    .add("mensaje", "El servicio de correo no esta disponible. Contacta con administracion")
                    .build());
            return;
        } catch (Exception e) {
            writeJson(response, Json.createObjectBuilder()
                    .add("ok", false)
                    .add("mensaje", "No se pudo enviar el codigo. Intentalo de nuevo mas tarde")
                    .build());
            return;
        }

        JsonObjectBuilder builder = Json.createObjectBuilder()
                .add("ok", true)
                .add("email", recoveryCode.email())
                .add("mensaje", "Te hemos enviado un codigo de verificacion");

        if (!recoveryCode.username().isBlank()) {
            builder.add("nombre", recoveryCode.username());
        }

        writeJson(response, builder.build());
    }

    private void resetPassword(JsonObject body, HttpServletResponse response) throws Exception {
        String email = body.getString("email", "").trim().toLowerCase();
        String password = body.getString("password", "").trim();
        String code = body.getString("code", "").trim();

        if (!isValidEmail(email)) {
            writeJson(response, Json.createObjectBuilder()
                    .add("ok", false)
                    .add("mensaje", "Introduce un correo electronico valido")
                    .build());
            return;
        }

        if (password.length() < 6) {
            writeJson(response, Json.createObjectBuilder()
                    .add("ok", false)
                    .add("mensaje", "La contrasena debe tener al menos 6 caracteres")
                    .build());
            return;
        }

        if (!code.matches("\\d{6}")) {
            writeJson(response, Json.createObjectBuilder()
                    .add("ok", false)
                    .add("mensaje", "Introduce el codigo de 6 digitos enviado por correo")
                    .build());
            return;
        }

        if (BloqueoUsuarioModel.estaBloqueado(email)) {
            writeJson(response, Json.createObjectBuilder()
                    .add("ok", false)
                    .add("mensaje", "Cuenta bloqueada. Contacta con el administrador")
                    .build());
            return;
        }

        boolean ok = model.cambiarPassword(email, password, code);
        writeJson(response, Json.createObjectBuilder()
                .add("ok", ok)
                .add("mensaje", ok
                        ? "Contrasena actualizada"
                        : "Codigo incorrecto o caducado")
                .build());
    }

    private JsonObject readJson(HttpServletRequest request) throws IOException {
        BufferedReader reader = request.getReader();
        StringBuilder sb = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }

        return Json.createReader(new StringReader(sb.toString())).readObject();
    }

    private void writeJson(HttpServletResponse response, JsonObject json) throws IOException {
        PrintWriter out = response.getWriter();
        out.print(json.toString());
    }

    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");
    }
}

package com.ejemplo.controller;

import com.ejemplo.model.AdminModel;
import com.ejemplo.model.ConexionBD;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.lang.reflect.Type;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@WebServlet("/api/reservas/*")
public class ReservaController extends HttpServlet {

    private final Gson gson = new Gson();
    private final AdminModel model = new AdminModel();
    private final Type mapType = new TypeToken<Map<String, Object>>() {}.getType();

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) {
        AuthSupport.cors(request, response);
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
            Map<String, Object> data = gson.fromJson(request.getReader(), mapType);
            data.put("email", AuthSupport.sessionEmail(session));
            data.put("usuarioId", session.getAttribute("idUsuario"));

            if (String.valueOf(data.get("client")).isBlank()) {
                data.put("client", String.valueOf(session.getAttribute("username")));
            }

            String fecha = String.valueOf(data.get("date"));
            String instalacion = String.valueOf(data.get("resource"));
            String hora = String.valueOf(data.get("time"));

            if (reservaExiste(fecha, instalacion, hora)) {
                write(response, Map.of(
                        "ok", false,
                        "mensaje", "Esta hora ya esta reservada."));
                return;
            }

            model.crearReserva(data);
            write(response, Map.of("ok", true));

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            write(response, Map.of(
                    "ok", false,
                    "mensaje", e.getMessage() == null ? "Error en el servidor" : e.getMessage()));
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        AuthSupport.cors(request, response);
        response.setContentType("application/json;charset=UTF-8");

        String path = request.getPathInfo();

        if ("/disponibilidad".equals(path)) {
            listarHorasOcupadas(request, response);
            return;
        }

        if ("/usuario".equals(path)) {
            HttpSession session = request.getSession(false);
            if (!AuthSupport.requireLogin(session, response)) {
                return;
            }

            listarReservasUsuario(response, AuthSupport.sessionEmail(session));
            return;
        }

        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        write(response, Map.of("ok", false, "mensaje", "Ruta no encontrada"));
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        AuthSupport.cors(request, response);
        response.setContentType("application/json;charset=UTF-8");

        HttpSession session = request.getSession(false);
        if (!AuthSupport.requireLogin(session, response)) {
            return;
        }

        try {
            String path = request.getPathInfo();
            int id = Integer.parseInt(path.substring(1));
            boolean ok = eliminarReserva(id, session);

            if (!ok) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            }

            write(response, Map.of("ok", ok));

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            write(response, Map.of(
                    "ok", false,
                    "mensaje", e.getMessage() == null ? "Error en el servidor" : e.getMessage()));
        }
    }

    private boolean reservaExiste(String fecha, String instalacion, String hora) throws Exception {
        String sql = "SELECT id FROM reservas WHERE fecha = ? AND instalacion = ? AND hora = ?";

        try (Connection conn = ConexionBD.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, fecha);
            ps.setString(2, instalacion);
            ps.setString(3, hora);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        }
    }

    private void listarHorasOcupadas(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        String date = request.getParameter("date");
        String resource = request.getParameter("resource");
        List<String> hours = new ArrayList<>();

        String sql = "SELECT hora FROM reservas WHERE fecha = ? AND instalacion = ?";

        try (Connection conn = ConexionBD.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, date);
            ps.setString(2, resource);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    hours.add(rs.getString("hora"));
                }
            }

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            write(response, Map.of("hours", hours, "mensaje", "No se pudo consultar disponibilidad"));
            return;
        }

        write(response, Map.of("hours", hours));
    }

    private void listarReservasUsuario(HttpServletResponse response, String email)
            throws IOException {

        List<Map<String, Object>> reservas = new ArrayList<>();

        try {
            model.asegurarColumnaMetodoPago();
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            write(response, Map.of(
                    "ok", false,
                    "mensaje", "No se pudo preparar la tabla de reservas"));
            return;
        }

        String sql =
                "SELECT id, actividad, instalacion, fecha, hora, personas, nombre_cliente, metodo_pago, estado_pago, creado_en " +
                "FROM reservas WHERE email_cliente = ? ORDER BY creado_en DESC";

        try (Connection conn = ConexionBD.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, email);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    reservas.add(Map.of(
                            "id", rs.getInt("id"),
                            "sport", rs.getString("actividad"),
                            "resource", rs.getString("instalacion"),
                            "date", rs.getString("fecha"),
                            "time", rs.getString("hora"),
                            "people", rs.getInt("personas"),
                            "client", rs.getString("nombre_cliente"),
                            "paymentMethod", rs.getString("metodo_pago"),
                            "paymentStatus", rs.getString("estado_pago"),
                            "createdAt", rs.getString("creado_en")));
                }
            }

            write(response, Map.of("ok", true, "reservas", reservas));

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            write(response, Map.of(
                    "ok", false,
                    "mensaje", e.getMessage() == null ? "Error en el servidor" : e.getMessage()));
        }
    }

    private boolean eliminarReserva(int id, HttpSession session) throws Exception {
        boolean admin = AuthSupport.isAdmin(session);
        String sql = admin
                ? "DELETE FROM reservas WHERE id = ?"
                : "DELETE FROM reservas WHERE id = ? AND email_cliente = ?";

        try (Connection conn = ConexionBD.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);

            if (!admin) {
                ps.setString(2, AuthSupport.sessionEmail(session));
            }

            return ps.executeUpdate() > 0;
        }
    }

    private void write(HttpServletResponse response, Object data) throws IOException {
        response.getWriter().print(gson.toJson(data));
    }
}

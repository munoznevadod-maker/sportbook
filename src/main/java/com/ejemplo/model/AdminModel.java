package com.ejemplo.model;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class AdminModel {

    // =========================
    // RESERVAS
    // =========================

    public List<Map<String, Object>> listarReservas()
            throws Exception {

        asegurarColumnaMetodoPago();

        String sql =
            "SELECT id, usuario_id, nombre_cliente, email_cliente, telefono, actividad, instalacion, fecha, hora, personas, precio, metodo_pago, estado, estado_pago, creado_en " +
            "FROM reservas " +
            "ORDER BY fecha DESC, hora DESC, id DESC";

        try (
            Connection con =
                ConexionBD.getConnection();

            PreparedStatement ps =
                con.prepareStatement(sql);

            ResultSet rs =
                ps.executeQuery()
        ) {

            List<Map<String, Object>>
                reservas =
                    new ArrayList<>();

            while (rs.next()) {

                Map<String, Object>
                    reserva =
                        new LinkedHashMap<>();

                reserva.put(
                    "id",
                    rs.getInt("id")
                );

                reserva.put(
                    "usuarioId",
                    rs.getObject("usuario_id")
                );

                reserva.put(
                    "client",
                    rs.getString("nombre_cliente")
                );

                reserva.put(
                    "email",
                    rs.getString("email_cliente")
                );

                reserva.put(
                    "phone",
                    rs.getString("telefono")
                );

                reserva.put(
                    "sport",
                    rs.getString("actividad")
                );

                reserva.put(
                    "resource",
                    rs.getString("instalacion")
                );

                Date fecha =
                    rs.getDate("fecha");

                Time hora =
                    rs.getTime("hora");

                Timestamp creado =
                    rs.getTimestamp("creado_en");

                reserva.put(
                    "date",
                    fecha != null
                        ? fecha.toString()
                        : null
                );

                reserva.put(
                    "time",
                    hora != null
                        ? hora.toString().substring(0, 5)
                        : null
                );

                reserva.put(
                    "people",
                    rs.getInt("personas")
                );

                reserva.put(
                    "price",
                    rs.getBigDecimal("precio")
                );

                reserva.put(
                    "paymentMethod",
                    rs.getString("metodo_pago")
                );

                reserva.put(
                    "status",
                    rs.getString("estado")
                );

                reserva.put(
                    "paymentStatus",
                    rs.getString("estado_pago")
                );

                reserva.put(
                    "createdAt",
                    creado != null
                        ? creado.toString()
                        : null
                );

                reservas.add(reserva);
            }

            return reservas;
        }
    }

    public Map<String, Object> crearReserva(
            Map<String, Object> data)
            throws Exception {

        asegurarColumnaMetodoPago();

        String email =
            stringValue(
                data,
                "email"
            ).toLowerCase();

        if (
            estaBloqueado(email)
        ) {

            throw new IllegalStateException(
                "Cuenta bloqueada"
            );
        }

        String sql =
            "INSERT INTO reservas " +
            "(" +
            "usuario_id," +
            "nombre_cliente," +
            "email_cliente," +
            "telefono," +
            "actividad," +
            "instalacion," +
            "fecha," +
            "hora," +
            "personas," +
            "precio," +
            "metodo_pago," +
            "estado," +
            "estado_pago" +
            ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmada', 'Pendiente')";

        Integer usuarioId =
            data.get("usuarioId") instanceof Number number
                ? number.intValue()
                : buscarUsuarioIdPorEmail(
                    email
                );

        try (
            Connection con =
                ConexionBD.getConnection();

            PreparedStatement ps =
                con.prepareStatement(
                    sql,
                    Statement.RETURN_GENERATED_KEYS
                )
        ) {

            ps.setInt(
                1,
                usuarioId
            );

            ps.setString(
                2,
                stringValue(
                    data,
                    "client"
                )
            );

            ps.setString(
                3,
                email
            );

            ps.setString(
                4,
                stringValue(
                    data,
                    "phone"
                )
            );

            ps.setString(
                5,
                stringValue(
                    data,
                    "sport"
                )
            );

            ps.setString(
                6,
                stringValue(
                    data,
                    "resource"
                )
            );

            ps.setDate(
                7,
                Date.valueOf(
                    stringValue(
                        data,
                        "date"
                    )
                )
            );

            ps.setTime(
                8,
                Time.valueOf(
                    stringValue(
                        data,
                        "time"
                    ) + ":00"
                )
            );

            ps.setInt(
                9,
                intValue(
                    data,
                    "people"
                )
            );

            ps.setBigDecimal(
                10,
                decimalValue(
                    data,
                    "price"
                )
            );

            ps.setString(
                11,
                paymentMethodValue(
                    data
                )
            );

            ps.executeUpdate();

            try (
                ResultSet keys =
                    ps.getGeneratedKeys()
            ) {

                Map<String, Object>
                    result =
                        new LinkedHashMap<>();

                if (
                    keys.next()
                ) {

                    result.put(
                        "id",
                        keys.getInt(1)
                    );
                }

                return result;
            }
        }
    }

    public boolean actualizarPago(
            int idReserva,
            String estadoPago)
            throws Exception {

        String sql =
            "UPDATE reservas " +
            "SET estado_pago = ? " +
            "WHERE id = ?";

        try (
            Connection con =
                ConexionBD.getConnection();

            PreparedStatement ps =
                con.prepareStatement(sql)
        ) {

            ps.setString(
                1,
                estadoPago
            );

            ps.setInt(
                2,
                idReserva
            );

            return
                ps.executeUpdate() > 0;
        }
    }

    public void asegurarColumnaMetodoPago()
            throws Exception {

        try (
            Connection con =
                ConexionBD.getConnection();

            ResultSet columns =
                con.getMetaData().getColumns(
                    con.getCatalog(),
                    null,
                    "reservas",
                    "metodo_pago"
                )
        ) {

            if (
                columns.next()
            ) {

                return;
            }
        }

        try (
            Connection con =
                ConexionBD.getConnection();

            Statement statement =
                con.createStatement()
        ) {

            statement.executeUpdate(
                "ALTER TABLE reservas " +
                "ADD COLUMN metodo_pago VARCHAR(40) NOT NULL DEFAULT 'Centro' " +
                "AFTER precio"
            );
        }
    }

    public boolean cancelarReserva(
            int idReserva)
            throws Exception {

        String sql =
            "UPDATE reservas " +
            "SET estado = 'Cancelada' " +
            "WHERE id = ?";

        try (
            Connection con =
                ConexionBD.getConnection();

            PreparedStatement ps =
                con.prepareStatement(sql)
        ) {

            ps.setInt(
                1,
                idReserva
            );

            return
                ps.executeUpdate() > 0;
        }
    }

    // =========================
    // AYUDA
    // =========================

    public List<Map<String, Object>> listarAyuda()
            throws Exception {

        String sql =
            "SELECT id, usuario_id, nombre, gmail, motivo, mensaje, estado, creado_en " +
            "FROM ayuda " +
            "ORDER BY creado_en DESC, id DESC";

        try (
            Connection con =
                ConexionBD.getConnection();

            PreparedStatement ps =
                con.prepareStatement(sql);

            ResultSet rs =
                ps.executeQuery()
        ) {

            List<Map<String, Object>>
                solicitudes =
                    new ArrayList<>();

            while (rs.next()) {

                Map<String, Object>
                    item =
                        new LinkedHashMap<>();

                item.put(
                    "id",
                    rs.getInt("id")
                );

                item.put(
                    "usuarioId",
                    rs.getObject("usuario_id")
                );

                item.put(
                    "nombre",
                    rs.getString("nombre")
                );

                item.put(
                    "gmail",
                    rs.getString("gmail")
                );

                item.put(
                    "tema",
                    rs.getString("motivo")
                );

                item.put(
                    "mensaje",
                    rs.getString("mensaje")
                );

                item.put(
                    "estado",
                    rs.getString("estado")
                );

                Timestamp creado =
                    rs.getTimestamp("creado_en");

                item.put(
                    "createdAt",
                    creado != null
                        ? creado.toString()
                        : null
                );

                solicitudes.add(item);
            }

            return solicitudes;
        }
    }

    public boolean crearAyuda(
            Map<String, Object> data)
            throws Exception {

        String gmail =
            stringValue(
                data,
                "gmail"
            ).toLowerCase();

        if (
            estaBloqueado(gmail)
        ) {

            throw new IllegalStateException(
                "Cuenta bloqueada"
            );
        }

        String sql =
            "INSERT INTO ayuda " +
            "(usuario_id, nombre, gmail, motivo, mensaje, estado) " +
            "VALUES (?, ?, ?, ?, ?, 'Nuevo')";

        Integer usuarioId =
            buscarUsuarioIdPorEmail(
                gmail
            );

        try (
            Connection con =
                ConexionBD.getConnection();

            PreparedStatement ps =
                con.prepareStatement(sql)
        ) {

            if (
                usuarioId == null
            ) {

                ps.setNull(
                    1,
                    java.sql.Types.INTEGER
                );

            } else {

                ps.setInt(
                    1,
                    usuarioId
                );
            }

            ps.setString(
                2,
                stringValue(
                    data,
                    "nombre"
                )
            );

            ps.setString(
                3,
                gmail
            );

            ps.setString(
                4,
                stringValue(
                    data,
                    "motivo"
                )
            );

            ps.setString(
                5,
                stringValue(
                    data,
                    "mensaje"
                )
            );

            return
                ps.executeUpdate() > 0;
        }
    }

    public boolean eliminarAyuda(
            int id)
            throws Exception {

        return eliminarPorId(
            "ayuda",
            id
        );
    }

    // =========================
    // RESEÑAS
    // =========================

    public List<Map<String, Object>> listarResenas()
            throws Exception {

        String sql =
            "SELECT * FROM resenas " +
            "ORDER BY creada_en DESC";

        try (
            Connection con =
                ConexionBD.getConnection();

            PreparedStatement ps =
                con.prepareStatement(sql);

            ResultSet rs =
                ps.executeQuery()
        ) {

            List<Map<String, Object>>
                lista =
                    new ArrayList<>();

            while (rs.next()) {

                Map<String, Object>
                    item =
                        new LinkedHashMap<>();

                item.put(
                    "id",
                    rs.getInt("id")
                );

                item.put(
                    "name",
                    rs.getString("nombre")
                );

                item.put(
                    "sport",
                    rs.getString("actividad")
                );

                item.put(
                    "rating",
                    rs.getInt("valoracion")
                );

                item.put(
                    "comment",
                    rs.getString("comentario")
                );

                lista.add(item);
            }

            return lista;
        }
    }

    public boolean crearResena(
            Map<String, Object> data)
            throws Exception {

        String sql =
            "INSERT INTO resenas " +
            "(usuario_id, nombre, actividad, valoracion, comentario) " +
            "VALUES (?, ?, ?, ?, ?)";

        try (
            Connection con =
                ConexionBD.getConnection();

            PreparedStatement ps =
                con.prepareStatement(sql)
        ) {

            ps.setNull(
                1,
                java.sql.Types.INTEGER
            );

            ps.setString(
                2,
                stringValue(data, "name")
            );

            ps.setString(
                3,
                stringValue(data, "sport")
            );

            ps.setInt(
                4,
                intValue(data, "rating")
            );

            ps.setString(
                5,
                stringValue(data, "comment")
            );

            return
                ps.executeUpdate() > 0;
        }
    }

    public boolean eliminarResena(
            int id)
            throws Exception {

        return eliminarPorId(
            "resenas",
            id
        );
    }

    // =========================
    // BLOQUEADOS
    // =========================

    public List<Map<String, Object>> listarBloqueados()
            throws Exception {

        return
            BloqueoUsuarioModel.listar();
    }

    public boolean bloquearEmail(
            String email,
            String motivo)
            throws Exception {

        return
            BloqueoUsuarioModel.bloquear(
                email,
                motivo
            );
    }

    public boolean desbloquearEmail(
            String email)
            throws Exception {

        return
            BloqueoUsuarioModel.desbloquear(
                email
            );
    }

    public boolean estaBloqueado(
            String email)
            throws Exception {

        return
            BloqueoUsuarioModel.estaBloqueado(
                email
            );
    }

    // =========================
    // UTILIDADES
    // =========================

    private boolean eliminarPorId(
            String tabla,
            int id)
            throws Exception {

        String sql =
            "DELETE FROM " +
            tabla +
            " WHERE id = ?";

        try (
            Connection con =
                ConexionBD.getConnection();

            PreparedStatement ps =
                con.prepareStatement(sql)
        ) {

            ps.setInt(
                1,
                id
            );

            return
                ps.executeUpdate() > 0;
        }
    }

    private Integer buscarUsuarioIdPorEmail(
            String gmail)
            throws Exception {

        try (
            Connection con =
                ConexionBD.getConnection();

            PreparedStatement ps =
                con.prepareStatement(
                    "SELECT id FROM usuarios WHERE email = ?"
                )
        ) {

            ps.setString(
                1,
                gmail
            );

            try (
                ResultSet rs =
                    ps.executeQuery()
            ) {

                if (
                    rs.next()
                ) {

                    return rs.getInt(
                        "id"
                    );
                }
            }
        }

        return null;
    }

    private String stringValue(
            Map<String, Object> data,
            String key) {

        Object value =
            data.get(key);

        return
            value == null
                ? ""
                : String.valueOf(value).trim();
    }

    private int intValue(
            Map<String, Object> data,
            String key) {

        Object value =
            data.get(key);

        if (
            value instanceof Number number
        ) {

            return number.intValue();
        }

        return Integer.parseInt(
            String.valueOf(value)
        );
    }

    private BigDecimal decimalValue(
            Map<String, Object> data,
            String key) {

        Object value =
            data.get(key);

        if (
            value instanceof Number number
        ) {

            return BigDecimal.valueOf(
                number.doubleValue()
            );
        }

        return new BigDecimal(
            String.valueOf(value)
        );
    }

    private String paymentMethodValue(
            Map<String, Object> data) {

        String value =
            stringValue(
                data,
                "paymentMethod"
            );

        return switch (value) {
            case "Transferencia" -> "Transferencia";
            default -> "Centro";
        };
    }
}

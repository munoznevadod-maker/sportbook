package com.ejemplo.model;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.security.SecureRandom;

public class UsuarioRecoveryModel {

    private static final SecureRandom RANDOM = new SecureRandom();

    public record RecoveryCode(String email, String username, String code) {
    }

    public String obtenerNombrePorEmail(String email) throws Exception {
        String cleanEmail = normalizarEmail(email);
        if (cleanEmail.isBlank()) {
            return null;
        }

        try (Connection con = ConexionBD.getConnection();
             PreparedStatement ps = con.prepareStatement(
                     "SELECT username FROM usuarios WHERE LOWER(email) = LOWER(?) LIMIT 1")) {

            ps.setString(1, cleanEmail);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getString("username");
                }
            }
        }

        return null;
    }

    public boolean cambiarPassword(String email, String password) throws Exception {
        return cambiarPassword(email, password, "");
    }

    public RecoveryCode crearCodigoRecuperacion(String email) throws Exception {
        asegurarTablaRecuperacion();

        String cleanEmail = normalizarEmail(email);
        String username = obtenerNombrePorEmail(cleanEmail);

        if (username == null || BloqueoUsuarioModel.estaBloqueado(cleanEmail)) {
            return null;
        }

        String code = String.format("%06d", RANDOM.nextInt(1_000_000));

        try (Connection con = ConexionBD.getConnection()) {
            try (PreparedStatement ps = con.prepareStatement(
                    "UPDATE password_reset_codes SET usado = TRUE WHERE LOWER(email) = LOWER(?) AND usado = FALSE")) {

                ps.setString(1, cleanEmail);
                ps.executeUpdate();
            }

            try (PreparedStatement ps = con.prepareStatement(
                    "INSERT INTO password_reset_codes (email, codigo_hash, expira_en) " +
                            "VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))")) {

                ps.setString(1, cleanEmail);
                ps.setString(2, PasswordUtil.hash(code));
                ps.executeUpdate();
            }
        }

        return new RecoveryCode(cleanEmail, username, code);
    }

    public boolean cambiarPassword(String email, String password, String code) throws Exception {
        asegurarTablaRecuperacion();

        String cleanEmail = normalizarEmail(email);
        String cleanPassword = password == null ? "" : password.trim();
        String cleanCode = code == null ? "" : code.trim();

        if (cleanEmail.isBlank() || cleanPassword.length() < 6 || !cleanCode.matches("\\d{6}")) {
            return false;
        }

        if (BloqueoUsuarioModel.estaBloqueado(cleanEmail)) {
            return false;
        }

        Integer codeId = buscarCodigoValido(cleanEmail, cleanCode);

        if (codeId == null) {
            return false;
        }

        try (Connection con = ConexionBD.getConnection()) {
            con.setAutoCommit(false);

            try (PreparedStatement ps = con.prepareStatement(
                    "UPDATE usuarios SET password = ? WHERE LOWER(email) = LOWER(?)")) {

                ps.setString(1, PasswordUtil.hash(cleanPassword));
                ps.setString(2, cleanEmail);

                if (ps.executeUpdate() <= 0) {
                    con.rollback();
                    return false;
                }
            }

            try (PreparedStatement ps = con.prepareStatement(
                    "UPDATE password_reset_codes SET usado = TRUE WHERE id = ?")) {

                ps.setInt(1, codeId);
                ps.executeUpdate();
            }

            con.commit();
            return true;
        }
    }

    public void asegurarTablaRecuperacion() throws Exception {
        try (Connection con = ConexionBD.getConnection();
             Statement statement = con.createStatement()) {

            statement.executeUpdate(
                    "CREATE TABLE IF NOT EXISTS password_reset_codes (" +
                            "id INT AUTO_INCREMENT PRIMARY KEY," +
                            "email VARCHAR(150) NOT NULL," +
                            "codigo_hash VARCHAR(255) NOT NULL," +
                            "usado BOOLEAN DEFAULT FALSE," +
                            "expira_en TIMESTAMP NOT NULL," +
                            "creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
                            "INDEX idx_reset_email (email)," +
                            "INDEX idx_reset_expira (expira_en)" +
                            ")"
            );
        }
    }

    private Integer buscarCodigoValido(String email, String code) throws Exception {
        String sql =
                "SELECT id, codigo_hash FROM password_reset_codes " +
                        "WHERE LOWER(email) = LOWER(?) " +
                        "AND usado = FALSE " +
                        "AND expira_en > NOW() " +
                        "ORDER BY creado_en DESC " +
                        "LIMIT 5";

        try (Connection con = ConexionBD.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, email);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    if (PasswordUtil.matches(code, rs.getString("codigo_hash"))) {
                        return rs.getInt("id");
                    }
                }
            }
        }

        return null;
    }

    private String normalizarEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }
}

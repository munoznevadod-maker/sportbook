package com.ejemplo.model;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class UsuarioLoginModel {

    public int validar(String login, String password) {
        String cleanLogin = normalizarLogin(login);

        try (Connection con = ConexionBD.getConnection();
             PreparedStatement ps = con.prepareStatement(
                     "SELECT id, password FROM usuarios WHERE LOWER(email) = LOWER(?) OR username = ?")) {

            ps.setString(1, cleanLogin);
            ps.setString(2, cleanLogin);

            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    return -1;
                }

                String storedPassword = rs.getString("password");
                if (!PasswordUtil.matches(password, storedPassword)) {
                    return -1;
                }

                int idUsuario = rs.getInt("id");

                if (PasswordUtil.needsRehash(storedPassword)) {
                    actualizarPasswordHash(idUsuario, password);
                }

                return idUsuario;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    public boolean existeUsuario(String login) {
        String cleanLogin = normalizarLogin(login);

        try (Connection con = ConexionBD.getConnection();
             PreparedStatement ps = con.prepareStatement(
                     "SELECT id FROM usuarios WHERE LOWER(email) = LOWER(?) OR username = ?")) {

            ps.setString(1, cleanLogin);
            ps.setString(2, cleanLogin);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean estaBloqueado(String login) {
        try {
            return BloqueoUsuarioModel.estaBloqueado(login);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public String obtenerRol(String login) {
        return obtenerCampo(login, "rol", "USER");
    }

    public String obtenerUsername(String login) {
        return obtenerCampo(login, "username", "Usuario");
    }

    public String obtenerEmail(String login) {
        return obtenerCampo(login, "email", "");
    }

    public void actualizarPasswordHash(int idUsuario, String password) {
        try (Connection con = ConexionBD.getConnection();
             PreparedStatement ps = con.prepareStatement(
                     "UPDATE usuarios SET password = ? WHERE id = ?")) {

            ps.setString(1, PasswordUtil.hash(password));
            ps.setInt(2, idUsuario);
            ps.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String obtenerCampo(String login, String campo, String valorPorDefecto) {
        String cleanLogin = normalizarLogin(login);
        String sql = "SELECT " + campo + " FROM usuarios WHERE LOWER(email) = LOWER(?) OR username = ?";

        try (Connection con = ConexionBD.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, cleanLogin);
            ps.setString(2, cleanLogin);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getString(campo);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return valorPorDefecto;
    }

    private String normalizarLogin(String login) {
        return login == null ? "" : login.trim();
    }
}

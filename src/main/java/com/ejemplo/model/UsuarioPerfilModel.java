package com.ejemplo.model;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

public class UsuarioPerfilModel {

    public static void ensureProfileImageColumn() {
        try (Connection con = ConexionBD.getConnection();
             Statement statement = con.createStatement()) {

            statement.executeUpdate(
                    "ALTER TABLE usuarios ADD COLUMN profile_image MEDIUMTEXT NULL"
            );

        } catch (Exception ignored) {
        }
    }

    public String obtenerImagenPerfil(int usuarioId) {
        ensureProfileImageColumn();

        try (Connection con = ConexionBD.getConnection();
             PreparedStatement ps = con.prepareStatement(
                     "SELECT profile_image FROM usuarios WHERE id = ?")) {

            ps.setInt(1, usuarioId);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    String image = rs.getString("profile_image");
                    return image == null ? "" : image;
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return "";
    }

    public boolean guardarImagenPerfil(int usuarioId, String profileImage) {
        ensureProfileImageColumn();

        try (Connection con = ConexionBD.getConnection();
             PreparedStatement ps = con.prepareStatement(
                     "UPDATE usuarios SET profile_image = ? WHERE id = ?")) {

            ps.setString(1, profileImage);
            ps.setInt(2, usuarioId);

            return ps.executeUpdate() > 0;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean quitarImagenPerfil(int usuarioId) {
        ensureProfileImageColumn();

        try (Connection con = ConexionBD.getConnection();
             PreparedStatement ps = con.prepareStatement(
                     "UPDATE usuarios SET profile_image = NULL WHERE id = ?")) {

            ps.setInt(1, usuarioId);

            return ps.executeUpdate() > 0;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}

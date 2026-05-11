package com.ejemplo.model;

import java.sql.Connection;
import java.sql.PreparedStatement;

public class UsuarioRegisterModel {

    public boolean registrar(String username,
                             String email,
                             String password) {

        try {

            Connection con =
                ConexionBD.getConnection();

            if (BloqueoUsuarioModel
                    .estaBloqueado(email)) {

                return false;
            }

            PreparedStatement ps =
                con.prepareStatement(

                    "INSERT INTO usuarios " +
                    "(username, email, password) " +
                    "VALUES (?, ?, ?)"

                );

            ps.setString(1, username);
            ps.setString(2, email);
            ps.setString(3, PasswordUtil.hash(password));

            int filas = ps.executeUpdate();

            return filas > 0;

        } catch (Exception e) {

            e.printStackTrace();

            return false;
        }
    }
}

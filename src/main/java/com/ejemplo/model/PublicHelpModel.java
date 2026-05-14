package com.ejemplo.model;

import java.sql.Connection;
import java.sql.PreparedStatement;

public class PublicHelpModel {

    public boolean guardar(
            String nombre,
            String gmail,
            String motivo,
            String mensaje) {

        try (
            Connection con =
                ConexionBD.getConnection()
        ) {

            try (
                PreparedStatement ps =
                    con.prepareStatement(

                        "INSERT INTO ayudas_publicas " +
                        "(nombre, gmail, motivo, mensaje) " +
                        "VALUES (?, ?, ?, ?)"

                    )
            ) {

                ps.setString(1, nombre);
                ps.setString(2, gmail);
                ps.setString(3, motivo);
                ps.setString(4, mensaje);

                return ps.executeUpdate() > 0;
            }

        } catch (Exception e) {

            e.printStackTrace();

            return false;
        }
    }
}

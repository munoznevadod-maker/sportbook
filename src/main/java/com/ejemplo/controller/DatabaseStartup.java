package com.ejemplo.controller;

import com.ejemplo.model.ConexionBD;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import java.nio.charset.StandardCharsets;

/** Creates missing tables only when explicitly enabled for a new hosted database. */
@WebListener
public class DatabaseStartup implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent event) {
        if (!"true".equalsIgnoreCase(System.getenv("DB_INIT_SCHEMA"))) {
            return;
        }
        try (var input = getClass().getResourceAsStream("/database/schema.sql")) {
            if (input == null) {
                throw new IllegalStateException("Missing database schema");
            }
            String schema = new String(input.readAllBytes(), StandardCharsets.UTF_8);
            try (var connection = ConexionBD.getConnection();
                 var statement = connection.createStatement()) {
                for (String sql : schema.split(";")) {
                    if (!sql.isBlank()) {
                        statement.execute(sql);
                    }
                }
            }
            event.getServletContext().log("Database schema initialized");
        } catch (Exception error) {
            throw new IllegalStateException("Database initialization failed", error);
        }
    }
}

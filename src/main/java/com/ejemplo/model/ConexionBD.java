package com.ejemplo.model;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConexionBD {

    private static final String DB_HOST = env("DB_HOST", env("MYSQLHOST", "mysql"));
    private static final String DB_PORT = env("DB_PORT", env("MYSQLPORT", "3306"));
    private static final String DB_NAME = env("DB_NAME", env("MYSQLDATABASE", "bd1"));
    private static final String DB_USER = env("DB_USER", env("MYSQLUSER", "root"));
    private static final String DB_PASSWORD = env("DB_PASSWORD", env("MYSQLPASSWORD", "root"));
    private static final String DB_URL = System.getenv("MYSQL_URL");

    private static final String URL = DB_URL != null && !DB_URL.isBlank()
            ? normalizeJdbcUrl(DB_URL)
            : "jdbc:mysql://" + DB_HOST + ":" + DB_PORT + "/" + DB_NAME
            + "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("No se pudo cargar el driver de MySQL", e);
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, DB_USER, DB_PASSWORD);
    }

    private static String env(String key, String fallback) {
        String value = System.getenv(key);
        return value == null || value.isBlank() ? fallback : value;
    }

    private static String normalizeJdbcUrl(String url) {
        if (url.startsWith("jdbc:mysql://")) {
            return withParams(url);
        }

        if (url.startsWith("mysql://")) {
            String cleanUrl = url.replaceFirst("^mysql://", "jdbc:mysql://");
            int atIndex = cleanUrl.indexOf('@');
            if (atIndex > -1) {
                cleanUrl = "jdbc:mysql://" + cleanUrl.substring(atIndex + 1);
            }
            return withParams(cleanUrl);
        }

        return withParams(url);
    }

    private static String withParams(String url) {
        String separator = url.contains("?") ? "&" : "?";
        return url + separator + "useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    }
}
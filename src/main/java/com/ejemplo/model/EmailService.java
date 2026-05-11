package com.ejemplo.model;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.io.UnsupportedEncodingException;
import java.util.Properties;

public final class EmailService {

    private static final String SMTP_HOST = env("SMTP_HOST", "");
    private static final String SMTP_PORT = env("SMTP_PORT", "587");
    private static final String SMTP_USER = env("SMTP_USER", "");
    private static final String SMTP_PASSWORD = env("SMTP_PASSWORD", "");
    private static final String SMTP_FROM = env("SMTP_FROM", SMTP_USER);
    private static final String SMTP_STARTTLS = env("SMTP_STARTTLS", "false");

    private EmailService() {
    }

    public static boolean isConfigured() {
        return !SMTP_HOST.isBlank()
                && !SMTP_FROM.isBlank();
    }

    public static void sendPasswordResetCode(
            String to,
            String username,
            String code)
            throws MessagingException, UnsupportedEncodingException {

        if (!isConfigured()) {
            throw new IllegalStateException("Servicio de correo no configurado");
        }

        Properties props = new Properties();
        boolean authEnabled =
                !SMTP_USER.isBlank() && !SMTP_PASSWORD.isBlank();

        props.put("mail.smtp.auth", String.valueOf(authEnabled));
        props.put("mail.smtp.starttls.enable", SMTP_STARTTLS);
        props.put("mail.smtp.host", SMTP_HOST);
        props.put("mail.smtp.port", SMTP_PORT);

        Session session = authEnabled
                ? Session.getInstance(
                        props,
                        new Authenticator() {
                            @Override
                            protected PasswordAuthentication getPasswordAuthentication() {
                                return new PasswordAuthentication(SMTP_USER, SMTP_PASSWORD);
                            }
                        }
                )
                : Session.getInstance(props);

        MimeMessage message = new MimeMessage(session);
        message.setFrom(new InternetAddress(SMTP_FROM, "SportBook"));
        message.setRecipients(
                Message.RecipientType.TO,
                InternetAddress.parse(to, false)
        );
        message.setSubject("Codigo de recuperacion SportBook", "UTF-8");
        message.setText(buildBody(username, code), "UTF-8");

        Transport.send(message);
    }

    private static String buildBody(String username, String code) {
        String greeting = username == null || username.isBlank()
                ? "Hola,"
                : "Hola " + username + ",";

        return greeting + "\n\n"
                + "Tu codigo de recuperacion de SportBook es: " + code + "\n\n"
                + "Caduca en 10 minutos. Si no has solicitado este cambio, ignora este correo.\n\n"
                + "SportBook";
    }

    private static String env(String key, String defaultValue) {
        return System.getenv().getOrDefault(key, defaultValue).trim();
    }
}

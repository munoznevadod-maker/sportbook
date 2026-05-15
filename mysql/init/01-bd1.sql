CREATE DATABASE IF NOT EXISTS bd1;
USE bd1;


CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('USER','ADMIN') DEFAULT 'USER',
    bloqueado BOOLEAN DEFAULT FALSE,
    profile_image MEDIUMTEXT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (username,email,password,rol)
VALUES ('admin','admin@gmail.com','1234','ADMIN')
ON DUPLICATE KEY UPDATE
rol = 'ADMIN';


CREATE TABLE IF NOT EXISTS reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL,
    nombre_cliente VARCHAR(100) NOT NULL,
    email_cliente VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    actividad VARCHAR(100) NOT NULL,
    instalacion VARCHAR(150) NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    personas INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(40) NOT NULL DEFAULT 'Centro',
    estado ENUM(
        'Confirmada',
        'Cancelada'
    ) DEFAULT 'Confirmada',
    estado_pago ENUM(
        'Pendiente',
        'Pagado'
    ) DEFAULT 'Pendiente',
    creado_en TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reserva_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS ayuda (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL,
    nombre VARCHAR(100) NOT NULL,
    gmail VARCHAR(150) NOT NULL,
    motivo VARCHAR(150) NOT NULL,
    mensaje TEXT NOT NULL,
    estado ENUM('Nuevo','En revision','Resuelto')
    DEFAULT 'Nuevo',
    creado_en TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ayuda_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS ayudas_publicas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    gmail VARCHAR(150) NOT NULL,
    motivo VARCHAR(120) NOT NULL,
    mensaje TEXT NOT NULL,
    creado_en TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS password_reset_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    codigo_hash VARCHAR(255) NOT NULL,
    usado BOOLEAN DEFAULT FALSE,
    expira_en TIMESTAMP NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reset_email (email),
    INDEX idx_reset_expira (expira_en)
);


CREATE TABLE IF NOT EXISTS resenas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL,
    nombre VARCHAR(100) NOT NULL,
    actividad VARCHAR(100) NOT NULL,
    valoracion INT NOT NULL,
    comentario TEXT NOT NULL,
    creada_en TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resena_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS usuarios_bloqueados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    motivo VARCHAR(255),
    creado_en TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP
);

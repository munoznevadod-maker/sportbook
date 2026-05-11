# SportBook - Jakarta EE + Docker Compose + MySQL

Aplicacion web de reservas deportivas con:

- Backend Jakarta Servlet sobre Tomcat 10.
- Frontend HTML, CSS y JavaScript.
- Base de datos MySQL 8.
- phpMyAdmin para administracion visual.
- Build Maven en imagen Docker multietapa.

## Requisitos

- Docker y Docker Compose.
- Maven solo si quieres compilar fuera de Docker.

## Configuracion

Copia el ejemplo de variables y cambia las claves si lo necesitas:

```bash
cp .env.example .env
```

Variables principales:

```env
DB_NAME=bd1
DB_USER=sportbook
DB_PASSWORD=change_me
MYSQL_ROOT_PASSWORD=change_root_me
```

## Puesta en marcha

```bash
docker compose up --build
```

URLs:

- Aplicacion web: `http://localhost:8085`
- phpMyAdmin: `http://localhost:8080`
- Buzon de correos de prueba: `http://localhost:8025`
- MySQL desde el host: `localhost:3307`

## Login inicial

La base de datos crea un usuario administrador:

- Usuario: `admin`
- Email: `admin@gmail.com`
- Contrasena inicial: `1234`

Al iniciar sesion correctamente, la aplicacion migra automaticamente esa contrasena antigua a BCrypt. Cambiala despues desde el flujo de recuperacion o directamente en la base de datos.

## Seguridad aplicada

- Las rutas `/admin/*` exigen sesion con rol `ADMIN`.
- Las reservas de usuario se consultan desde la sesion del servidor, no desde un email enviado por URL.
- Las contrasenas nuevas se guardan con BCrypt.
- Las contrasenas antiguas en texto plano se aceptan una vez y se actualizan automaticamente a hash.
- Las credenciales de Docker se configuran mediante variables de entorno.

## Comandos utiles

Compilar localmente:

```bash
mvn -q -DskipTests package
```

Validar Docker Compose:

```bash
docker compose config
```

## Estructura del proyecto

```text
.
├── Dockerfile                         Imagen multietapa: Maven + Tomcat
├── docker-compose.yml                 Servicios app, MySQL y phpMyAdmin
├── pom.xml                            Configuracion Maven del WAR
├── mysql/init/01-bd1.sql              Script inicial de base de datos
└── src/main
    ├── java/com/ejemplo/controller    Controladores Servlet
    ├── java/com/ejemplo/model         Acceso a datos y utilidades
    └── webapp                         HTML, CSS, JS y configuracion web
```

## Archivos generados o locales

Estos elementos no forman parte del codigo fuente y se pueden regenerar o recrear:

- `target/`: salida de Maven, incluye clases compiladas y el `.war`.
- `admin-cookies.txt`: archivo local de pruebas de sesion.
- `.github/java-upgrade/`: registros temporales de herramientas de actualizacion.
- `.vscode/`: configuracion local del editor.

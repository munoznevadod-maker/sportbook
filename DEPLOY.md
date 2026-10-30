# SportBook en Render y MySQL

El repositorio contiene una aplicacion Java con Tomcat. GitHub Pages no ejecuta el backend.

1. Crea un servicio MySQL Free en Aiven y copia los datos de conexion desde su consola.
2. Crea un Blueprint de Render desde este repositorio. `render.yaml` selecciona el plan Free.
3. Rellena DB_HOST, DB_PORT, DB_NAME (por ejemplo defaultdb), DB_USER y DB_PASSWORD con los datos de Aiven. Guarda los secretos solo en Render.
4. El primer arranque crea las tablas que falten, sin cuentas de demostracion ni contrasenas predeterminadas. No importa los datos antiguos de Railway.
5. Verifica `/healthz`, crea una cuenta e inicia sesion para probar las reservas. La URL publica la proporciona Render al crear el servicio.

Para dar permisos de administrador a tu cuenta registrada, ejecuta en tu base de datos una consulta parametrizada equivalente a `UPDATE usuarios SET rol = 'ADMIN' WHERE email = <tu email>;`.

La recuperacion por correo requiere configurar un proveedor SMTP real y las variables SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM y SMTP_STARTTLS. Mailpit del entorno local no esta desplegado en Render.

Render Free se suspende tras inactividad y tiene limites de uso. Los planes gratuitos pueden cambiar. Conserva copias de seguridad de MySQL.

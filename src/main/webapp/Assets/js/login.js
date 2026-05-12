// =========================
// API BASE
// =========================

const API_BASE =
  location.hostname.includes("railway.app")
    ? location.origin
    : "http://localhost:8085";

const PUBLIC_API =
  location.hostname.includes("railway.app")
    ? `${location.origin}/api`
    : "http://localhost:8085/api";



document.addEventListener("DOMContentLoaded", () => {

  const form =
    document.getElementById("loginForm");

  const error =
    document.getElementById("error");

  const params =
    new URLSearchParams(window.location.search);

  const redirect =
    params.get("redirect");

  const registerLink =
    document.querySelector(
      '.extra-links a[href="register.html"]'
    );

  const forgotPasswordLink =
    document.getElementById(
      "forgotPasswordLink"
    );

  if (registerLink && redirect === "ayuda") {

    registerLink.href =
      "register.html?redirect=ayuda";

  }

  if (forgotPasswordLink && redirect === "ayuda") {

    forgotPasswordLink.href =
      "forgot-password.html?redirect=ayuda";

  }

  form.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      const login =
        document.getElementById("login")
        .value
        .trim();

      const password =
        document.getElementById("password")
        .value
        .trim();

      try {

        const res =
          await fetch(
            `${API_BASE}/auth/login`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                login,
                password
              })
            }
          );

        const data =
          await res.json();

        if (!data.ok) {

          error.textContent =
            data.mensaje ||
            "Inicio de sesión incorrecto";

          return;

        }

        const role =
          String(
            data.rol ||
            data.usuario?.rol ||
            ""
          ).toLowerCase();

        // =========================
        // GUARDAR DATOS
        // =========================
        localStorage.setItem(
          "sportbook-authenticated",
          "true"
        );

        localStorage.setItem(
          "sportbook-username",
          data.username ||
          data.usuario?.username ||
          ""
        );

        localStorage.setItem(
          "sportbook-user-email",
          data.email ||
          data.usuario?.email ||
          login
        );

        localStorage.setItem(
          "sportbook-user-phone",
          data.phone ||
          data.usuario?.phone ||
          ""
        );

        localStorage.setItem(
          "sportbook-user-role",
          role
        );

        console.log(
          "EMAIL GUARDADO:",
          localStorage.getItem(
            "sportbook-user-email"
          )
        );

        // =========================
        // REDIRECCIÓN
        // =========================

        if (role === "admin") {

          window.location.href =
            "admin.html";

        } else {

          window.location.href =
            redirect === "ayuda"
              ? "dashboard.html#ayuda"
              : "dashboard.html";

        }

      } catch (err) {

        error.textContent =
          "Error en el servidor";

      }

    }
  );

});
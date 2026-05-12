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




const params = new URLSearchParams(window.location.search);

const redirect = params.get("redirect");

const loginLink =
    document.querySelector(
        '.extra-links a[href="login.html"]'
    );

if (loginLink && redirect === "ayuda") {

    loginLink.href ="login.html?redirect=ayuda";
    
}

// =========================
// MOSTRAR / OCULTAR PASSWORD
// =========================

function togglePassword(inputId, button) {

    const input =
        document.getElementById(inputId);

    if (input.type === "password") {

        input.type = "text";
        button.textContent = "🙈";

    } else {

        input.type = "password";
        button.textContent = "👁️";
    }
}

document
.getElementById("registroForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    const username =
        document.getElementById("nombre")
        .value
        .trim();
    const email =
        document.getElementById("email")
        .value
        .trim();
    const password =
        document.getElementById("password")
        .value
        .trim();
    const confirm =
        document.getElementById("confirm")
        .value
        .trim();
    if (password !== confirm) {
        document.getElementById("error")
        .textContent ="Las contraseñas no coinciden";
        return;
    }

    const datos = {
        username,
        email,
        password
    };

    fetch(fetch`${API_BASE}/auth/register`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(datos)
    })

    .then(res => res.json())

    .then(data => {

        if (data.ok) {
            window.location.href =
                redirect === "ayuda"
                ? "login.html?redirect=ayuda"
                : "login.html";
        } else {
            document.getElementById("error")
            .textContent = data.mensaje;
        }

    })

    .catch(() => {
        document.getElementById("error")
        .textContent ="Error en el servidor";
    });

});
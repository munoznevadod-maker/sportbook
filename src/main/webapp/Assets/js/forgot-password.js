// =========================
// API BASE
// =========================



document.addEventListener("DOMContentLoaded", () => {
  
  const API_BASE =
    window.location.protocol.startsWith("http")
      ? window.location.origin
      : "http://localhost:8085";

  const PUBLIC_API = `${API_BASE}/api`;
  
  const params =
    new URLSearchParams(
      window.location.search
    );

  const redirect =
    params.get("redirect");

  const checkForm =
    document.getElementById(
      "checkAccountForm"
    );

  const resetForm =
    document.getElementById(
      "resetPasswordForm"
    );

  const verifyCodeForm =
    document.getElementById(
      "verifyCodeForm"
    );

  const emailInput =
    document.getElementById(
      "recoverEmail"
    );

  const newPasswordInput =
    document.getElementById(
      "newPassword"
    );

  const verificationCodeInput =
    document.getElementById(
      "verificationCode"
    );

  const confirmPasswordInput =
    document.getElementById(
      "confirmPassword"
    );

  const accountFound =
    document.getElementById(
      "accountFound"
    );

  const message =
    document.getElementById(
      "recoverMessage"
    );

  const backToLoginLink =
    document.getElementById(
      "backToLoginLink"
    );

  let selectedEmail = "";
  let verifiedCode = "";

  // =========================
  // MOSTRAR / OCULTAR PASSWORD
  // =========================

  window.togglePassword =
    function(inputId, button) {

      const input =
        document.getElementById(
          inputId
        );

      if (input.type === "password") {

        input.type = "text";
        button.textContent = "🙈";

      } else {

        input.type = "password";
        button.textContent = "👁️";
      }
    };

  // =========================
  // REDIRECT AYUDA
  // =========================

  if (
    backToLoginLink &&
    redirect === "ayuda"
  ) {

    backToLoginLink.href =
      "login.html?redirect=ayuda";
  }

  // =========================
  // BUSCAR CUENTA
  // =========================

  checkForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      selectedEmail =
        emailInput.value.trim();

      setMessage("", "");

      if (!selectedEmail) {

        setMessage(
          "Introduce tu correo electrónico.",
          "error"
        );

        return;
      }

      try {

        const res =
          await fetch(
            `${API_BASE}/auth/recover/check`,
            {

              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify({
                  email:
                    selectedEmail
                })
            }
          );

        const data =
          await res.json();

        if (!data.ok) {

          setMessage(
            data.mensaje ||
            "No se pudo encontrar esa cuenta.",
            "error"
          );

          return;
        }

        selectedEmail =
          data.email ||
          selectedEmail;

        accountFound.innerHTML = `
          <strong>
            Revisa tu correo
          </strong>

          ${
            data.nombre
            ? `${escapeHtml(data.nombre)}<br>`
            : ""
          }

          Hemos enviado un código de 6 dígitos a ${escapeHtml(selectedEmail)}.
        `;

        checkForm.classList.add(
          "hidden"
        );

        verifyCodeForm.classList.remove(
          "hidden"
        );

        setMessage(
          "Introduce el código recibido para continuar.",
          "success"
        );

        verificationCodeInput.focus();

      } catch (error) {

        setMessage(
          "Error conectando con el servidor.",
          "error"
        );
      }
    }
  );

  // =========================
  // VERIFICAR CODIGO
  // =========================

  verifyCodeForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();

      const code =
        verificationCodeInput.value.trim();

      setMessage("", "");

      if (!/^\d{6}$/.test(code)) {

        setMessage(
          "Introduce el código de 6 dígitos enviado por correo.",
          "error"
        );

        return;
      }

      verifiedCode = code;

      verifyCodeForm.classList.add(
        "hidden"
      );

      resetForm.classList.remove(
        "hidden"
      );

      setMessage(
        "Código recibido. Ahora crea tu nueva contraseña.",
        "success"
      );

      newPasswordInput.focus();
    }
  );

  // =========================
  // CAMBIAR PASSWORD
  // =========================

  resetForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const password =
        newPasswordInput.value.trim();

      const confirm =
        confirmPasswordInput.value.trim();

      setMessage("", "");

      if (password.length < 6) {

        setMessage(
          "La contraseña debe tener al menos 6 caracteres.",
          "error"
        );

        return;
      }

      if (!/^\d{6}$/.test(verifiedCode)) {

        setMessage(
          "Verifica primero el código enviado por correo.",
          "error"
        );

        return;
      }

      if (password !== confirm) {

        setMessage(
          "Las contraseñas no coinciden.",
          "error"
        );

        return;
      }

      try {

        const res =
          await fetch(
            `${API_BASE}/auth/recover/reset`,
            {

              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify({
                  email:
                    selectedEmail,

                  code:
                    verifiedCode,

                  password
                })
            }
          );

        const data =
          await res.json();

        if (!data.ok) {

          setMessage(
            data.mensaje ||
            "No se pudo cambiar la contraseña.",
            "error"
          );

          return;
        }

        setMessage(
          "Contraseña cambiada. Ya puedes iniciar sesión.",
          "success"
        );

        resetForm.reset();

        setTimeout(() => {

          window.location.href =
            redirect === "ayuda"
            ? "login.html?redirect=ayuda"
            : "login.html";

        }, 1400);

      } catch (error) {

        setMessage(
          "Error conectando con el servidor.",
          "error"
        );
      }
    }
  );

  // =========================
  // MENSAJES
  // =========================

  function setMessage(text, type) {

    message.textContent =
      text;

    message.className =
      `recover-message ${type || ""}`
      .trim();
  }

  // =========================
  // SEGURIDAD HTML
  // =========================

  function escapeHtml(value) {

    return String(value)

      .replaceAll(
        "&",
        "&amp;"
      )

      .replaceAll(
        "<",
        "&lt;"
      )

      .replaceAll(
        ">",
        "&gt;"
      )

      .replaceAll(
        '"',
        "&quot;"
      )

      .replaceAll(
        "'",
        "&#039;"
      );
  }

});

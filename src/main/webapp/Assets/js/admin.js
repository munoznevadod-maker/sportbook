
const API_BASE =
  window.location.protocol.startsWith("http")
    ? window.location.origin
    : "http://localhost:8085";

const PUBLIC_API = `${API_BASE}/api`;

const elements = {

  navButtons:
    document.querySelectorAll(".nav button"),
  views:
    document.querySelectorAll(".view"),
  pageTitle:
    document.querySelector("#pageTitle"),
  paidIncome:
    document.querySelector("#paidIncome"),
  pendingIncome:
    document.querySelector("#pendingIncome"),
  bookingCount:
    document.querySelector("#bookingCount"),
  blockedCount:
    document.querySelector("#blockedCount"),
  summaryMessage:
    document.querySelector("#summaryMessage"),
  paymentFilter:
    document.querySelector("#paymentFilter"),
  bookingSearch:
    document.querySelector("#bookingSearch"),
  paymentsTable:
    document.querySelector("#paymentsTable"),
  helpTable:
    document.querySelector("#helpTable"),
  helpSearch:
    document.querySelector("#helpSearch"),
  publicHelpSearch:
    document.querySelector("#publicHelpSearch"),
  unregisteredHelpTable:
    document.querySelector("#unregisteredHelpTable"),
  reviewsTable:
    document.querySelector("#reviewsTable"),
  blockedTable:
    document.querySelector("#blockedTable"),
  blockForm:
    document.querySelector("#blockForm"),
  blockEmailInput:
    document.querySelector("#blockEmailInput"),
  refreshButton:
    document.querySelector("#refreshButton"),
  logoutButton:
    document.querySelector("#logoutButton"),
  toast:
    document.querySelector("#toast")
};

let reservations = [];
let helpRequests = [];
let publicHelpRequests = [];
let reviews = [];
let blockedUsers = [];
let authRedirecting = false;


function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeSearch(value) {

  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function formatCurrency(value) {

  return new Intl.NumberFormat(
    "es-ES",
    {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0
    }
  ).format(Number(value) || 0);
}

function displayActivity(activity) {

  const names = {
    Futbol: "Fútbol",
    Padel: "Pádel",
    Natacion: "Natación"
  };

  return names[activity] || activity;
}

function formatDate(dateISO) {

  if (!dateISO) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat(
    "es-ES",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  ).format(
    new Date(`${dateISO}T12:00:00`)
  );
}

function displayPaymentMethod(method) {

  return method === "Transferencia"
    ? "Transferencia"
    : "En el centro";
}

function paymentVerificationText(reservation) {

  if (reservation.paymentStatus === "Pagado") {
    return "Pago comprobado por administración.";
  }

  if (reservation.paymentMethod === "Transferencia") {
    return "Revisar banco: importe, fecha y cliente antes de marcar como pagado.";
  }

  return "Cobrar en recepción/caja y marcar como pagado al recibir el dinero.";
}

function showToast(message) {

  if (!elements.toast) return;

  elements.toast.textContent =
    message;

  elements.toast.classList.add(
    "show"
  );

  clearTimeout(showToast.timer);

  showToast.timer =
    setTimeout(() => {

      elements.toast.classList.remove(
        "show"
      );

    }, 2400);
}

function emptyMarkup(title, text) {

  return `
    <div class="empty">

      <strong>
        ${escapeHTML(title)}
      </strong>

      <span>
        ${escapeHTML(text)}
      </span>

    </div>
  `;
}

function clearStoredSession() {

  localStorage.removeItem(
    "sportbook-authenticated"
  );

  localStorage.removeItem(
    "sportbook-username"
  );

  localStorage.removeItem(
    "sportbook-user-email"
  );

  localStorage.removeItem(
    "sportbook-user-phone"
  );

  localStorage.removeItem(
    "sportbook-user-role"
  );
}

function redirectToLogin() {

  if (authRedirecting) return;

  authRedirecting = true;

  clearStoredSession();

  showToast(
    "Inicia sesión como administrador."
  );

  setTimeout(() => {

    window.location.replace(
      "login.html"
    );

  }, 900);
}

function handleAuthError(response) {

  if (
    response.status === 401 ||
    response.status === 403
  ) {

    redirectToLogin();
    return true;
  }

  return false;
}


async function loadReservations() {

  try {

    const response =
      await fetch(
        `${API_BASE}/admin/reservas`,
        {
          credentials: "include"
        }
      );

    if (!response.ok) {

      if (handleAuthError(response)) {
        return;
      }

      throw new Error(
        "HTTP " + response.status
      );
    }

    const data =
      await response.json();

    reservations =
      Array.isArray(data.reservas)
        ? data.reservas
        : [];

    renderPayments();

    renderSummary();

  } catch (error) {

    console.error(error);

    elements.paymentsTable.innerHTML =
      emptyMarkup(
        "Error",
        "No se pudieron cargar las reservas."
      );
  }
}


async function loadHelpRequests() {

  try {

    const response =
      await fetch(
        `${API_BASE}/admin/ayuda`,
        {
          credentials: "include"
        }
      );

    if (!response.ok) {

      if (handleAuthError(response)) {
        return;
      }

      throw new Error(
        "HTTP " + response.status
      );
    }

    const data =
      await response.json();

    helpRequests =
      Array.isArray(data.ayuda)
        ? data.ayuda
        : [];

    renderHelp();

  } catch (error) {

    console.error(error);

    elements.helpTable.innerHTML =
      emptyMarkup(
        "Error",
        "No se pudo conectar con el servidor."
      );
  }
}


async function cargarAyudasPublicas() {

  const panel =
    document.querySelector(
      "#unregisteredHelpTable"
    );

  if (!panel) return;

  try {

    const response =
      await fetch(
        `${API_BASE}/public-help-list`
      );

    const ayudas =
      await response.json();

    publicHelpRequests =
      Array.isArray(ayudas)
        ? ayudas
        : [];

    renderPublicHelp();

    return;

    if (!ayudas.length) {

      panel.innerHTML =
        emptyMarkup(
          "No hay mensajes",
          "Los formularios públicos aparecerán aquí."
        );

      return;
    }

    panel.innerHTML = `

      <div class="table-wrap">

        <table>

          <thead>

            <tr>
              <th>Nombre</th>
              <th>Gmail</th>
              <th>Motivo</th>
              <th>Mensaje</th>
              <th>Tipo</th>
            </tr>

          </thead>

          <tbody>

            ${ayudas.map(a => `

              <tr>

                <td>
                  ${escapeHTML(a.nombre)}
                </td>

                <td>
                  ${escapeHTML(a.gmail)}
                </td>

                <td>
                  ${escapeHTML(a.tema)}
                </td>

                <td>
                  ${escapeHTML(a.mensaje)}
                </td>

                <td>
                  <span class="badge danger">
                    No registrado
                  </span>
                </td>

              </tr>

            `).join("")}

          </tbody>

        </table>

      </div>
    `;

  } catch (error) {

    console.error(error);

    panel.innerHTML =
      emptyMarkup(
        "Error",
        "No se pudieron cargar las ayudas públicas."
      );
  }
}


function renderPublicHelp() {

  const search =
    normalizeSearch(
      elements.publicHelpSearch?.value
    );

  const filtered =
    publicHelpRequests.filter(a => {

      const text =
        [
          a.nombre,
          a.gmail,
          a.tema,
          a.mensaje
        ].join(" ").toLowerCase();

      return text.includes(search);
    });

  if (!filtered.length) {

    elements.unregisteredHelpTable.innerHTML =
      emptyMarkup(
        "No hay mensajes",
        search
          ? "No coincide ningun mensaje publico."
          : "Los formularios publicos apareceran aqui."
      );

    return;
  }

  elements.unregisteredHelpTable.innerHTML = `

    <div class="table-wrap">

      <table>

        <thead>

          <tr>
            <th>Nombre</th>
            <th>Gmail</th>
            <th>Motivo</th>
            <th>Mensaje</th>
            <th>Tipo</th>
          </tr>

        </thead>

        <tbody>

          ${filtered.map(a => `

            <tr>

              <td>
                ${escapeHTML(a.nombre)}
              </td>

              <td>
                ${escapeHTML(a.gmail)}
              </td>

              <td>
                ${escapeHTML(a.tema)}
              </td>

              <td>
                ${escapeHTML(a.mensaje)}
              </td>

              <td>
                <span class="badge danger">
                  No registrado
                </span>
              </td>

            </tr>

          `).join("")}

        </tbody>

      </table>

    </div>
  `;
}


async function loadReviews() {

  try {

    const response =
      await fetch(
        `${API_BASE}/admin/resenas`,
        {
          credentials: "include"
        }
      );

    if (!response.ok) {

      if (handleAuthError(response)) {
        return;
      }

      throw new Error(
        "HTTP " + response.status
      );
    }

    const data =
      await response.json();

    reviews =
      Array.isArray(data.resenas)
        ? data.resenas
        : [];

    renderReviews();

  } catch (error) {

    console.error(error);

    elements.reviewsTable.innerHTML =
      emptyMarkup(
        "Error",
        "No se pudieron cargar las reseñas."
      );
  }
}

function renderStars(rating) {

  return "★".repeat(rating) +
    "☆".repeat(5 - rating);
}

function renderReviews() {

  if (!reviews.length) {

    elements.reviewsTable.innerHTML =
      emptyMarkup(
        "No hay reseñas",
        "Cuando los usuarios publiquen reseñas aparecerán aquí."
      );

    return;
  }

  elements.reviewsTable.innerHTML = `

    <div class="table-wrap">

      <table>

        <thead>

          <tr>
            <th>Nombre</th>
            <th>Actividad</th>
            <th>Valoración</th>
            <th>Comentario</th>
            <th>Acciones</th>
          </tr>

        </thead>

        <tbody>

          ${reviews.map(review => `

            <tr>

              <td>
                ${escapeHTML(review.name)}
              </td>

              <td>
                ${escapeHTML(displayActivity(review.sport))}
              </td>

              <td>
                <span class="review-stars-admin">
                  ${renderStars(Number(review.rating || 0))}
                </span>
              </td>

              <td>
                ${escapeHTML(review.comment)}
              </td>

              <td>
                <div class="actions">
                  <button
                    class="button danger"
                    data-delete-review-id="${review.id}">
                    Eliminar
                  </button>
                </div>
              </td>

            </tr>

          `).join("")}

        </tbody>

      </table>

    </div>
  `;
}


async function renderBlocked() {

  try {

    const response =
      await fetch(
        `${API_BASE}/admin/bloqueados`,
        {
          credentials: "include"
        }
      );

    if (!response.ok) {
      if (handleAuthError(response)) {
        return;
      }

      throw new Error(
        "HTTP " + response.status
      );
    }

    const data =
      await response.json();

    blockedUsers =
      Array.isArray(data.bloqueados)
        ? data.bloqueados
        : [];

    elements.blockedCount.textContent =
      blockedUsers.length;

    if (!blockedUsers.length) {

      elements.blockedTable.innerHTML =
        emptyMarkup(
          "No hay usuarios bloqueados",
          "Cuando bloquees usuarios aparecerán aquí."
        );

      return;
    }

    elements.blockedTable.innerHTML = `

      <div class="table-wrap">

        <table>

          <thead>

            <tr>
              <th>Correo</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>

          </thead>

          <tbody>

            ${blockedUsers.map(user => `

              <tr>

                <td>
                  ${escapeHTML(user.email)}
                </td>

                <td>
                  ${formatDate(user.createdAt)}
                </td>

                <td>

                  <button
                    class="button danger"
                    data-unban-email="${escapeHTML(user.email)}">

                    Desbloquear

                  </button>

                </td>

              </tr>

            `).join("")}

          </tbody>

        </table>

      </div>
    `;

  } catch (error) {

    console.error(error);
  }
}


function renderSummary() {

  const paidIncome =

    reservations
      .filter(r =>
        r.paymentStatus === "Pagado"
      )
      .reduce(
        (t, r) =>
          t + Number(r.price || 0),
        0
      );

  const pendingIncome =

    reservations
      .filter(r =>
        r.paymentStatus !== "Pagado"
      )
      .reduce(
        (t, r) =>
          t + Number(r.price || 0),
        0
      );

  elements.paidIncome.textContent =
    formatCurrency(paidIncome);

  elements.pendingIncome.textContent =
    formatCurrency(pendingIncome);

  elements.bookingCount.textContent =
    reservations.length;

  elements.summaryMessage.innerHTML = `

    <strong>
      ${reservations.length}
      reservas
    </strong>

    <span>
      ${helpRequests.length}
      ayudas recibidas
    </span>
  `;
}


function renderPayments() {

  const filter =
    elements.paymentFilter.value;

  const search =
    elements.bookingSearch.value
      .trim()
      .toLowerCase();

  const filtered =
    reservations.filter(r => {

      const paymentOk =

        filter === "all" ||

        (
          filter === "paid" &&
          r.paymentStatus === "Pagado"
        ) ||

        (
          filter === "pending" &&
          r.paymentStatus !== "Pagado"
        );

      const text =

        `
          ${r.client}
          ${r.email}
          ${r.sport}
          ${r.resource}
        `.toLowerCase();

      return (
        paymentOk &&
        text.includes(search)
      );
    });

  if (!filtered.length) {

    elements.paymentsTable.innerHTML =
      emptyMarkup(
        "No hay reservas",
        "Cuando haya reservas aparecerán aquí."
      );

    return;
  }

  elements.paymentsTable.innerHTML = `

    <div class="table-wrap">

      <table>

        <thead>

          <tr>

            <th>Cliente</th>
            <th>Reserva</th>
            <th>Importe</th>
            <th>Método</th>
            <th>Estado</th>
            <th>Pago</th>
            <th>Acciones</th>

          </tr>

        </thead>

        <tbody>

          ${filtered.map(r => `

            <tr>

              <td>

                <strong>
                  ${escapeHTML(r.client)}
                </strong>

                <br>

                <span class="muted">
                  ${escapeHTML(r.email)}
                </span>

              </td>

              <td>

                ${escapeHTML(
                  displayActivity(r.sport)
                )}

                ·

                ${escapeHTML(r.resource)}

                <br>

                <span class="muted">

                  ${formatDate(r.date)}

                  ·

                  ${escapeHTML(r.time)}

                </span>

              </td>

              <td>

                ${formatCurrency(r.price)}

              </td>

              <td>

                <strong>
                  ${escapeHTML(displayPaymentMethod(r.paymentMethod))}
                </strong>

                <br>

                <span class="muted payment-check">
                  ${escapeHTML(paymentVerificationText(r))}
                </span>

              </td>

              <td>

                <span class="badge success">

                  ${escapeHTML(r.status)}

                </span>

              </td>

              <td>

                <span class="badge ${r.paymentStatus === "Pagado" ? "success" : "danger"}">

                  ${escapeHTML(r.paymentStatus)}

                </span>

              </td>

              <td>

                <div class="actions">

                  <button
                    class="button success"
                    data-paid-id="${r.id}">
                    Pagado
                  </button>

                  <button
                    class="button danger"
                    data-pending-id="${r.id}">
                    Pendiente
                  </button>

                </div>

              </td>

            </tr>

          `).join("")}

        </tbody>

      </table>

    </div>
  `;
}


function renderHelp() {

  const search =
    normalizeSearch(
      elements.helpSearch?.value
    );

  const filtered =
    helpRequests.filter(r => {

      const text =
        [
          r.nombre,
          r.gmail,
          r.tema,
          r.mensaje
        ].join(" ").toLowerCase();

      return text.includes(search);
    });

  if (!filtered.length) {

    elements.helpTable.innerHTML =
      emptyMarkup(
        "No hay solicitudes",
        "Las ayudas aparecerán aquí."
      );

    return;
  }

  elements.helpTable.innerHTML = `

    <div class="table-wrap">

      <table>

        <thead>

          <tr>
            <th>Nombre</th>
            <th>Gmail</th>
            <th>Motivo</th>
            <th>Mensaje</th>
            <th>Tipo</th>
          </tr>

        </thead>

        <tbody>

          ${filtered.map(r => `

            <tr>

              <td>
                ${escapeHTML(r.nombre)}
              </td>

              <td>
                ${escapeHTML(r.gmail)}
              </td>

              <td>
                ${escapeHTML(r.tema)}
              </td>

              <td>
                ${escapeHTML(r.mensaje)}
              </td>

              <td>

                <span class="badge success">
                  registrado
                </span>

              </td>

            </tr>

          `).join("")}

        </tbody>

      </table>

    </div>
  `;
}


elements.paymentFilter?.addEventListener(
  "change",
  renderPayments
);

elements.bookingSearch?.addEventListener(
  "input",
  renderPayments
);

elements.helpSearch?.addEventListener(
  "input",
  renderHelp
);

elements.publicHelpSearch?.addEventListener(
  "input",
  renderPublicHelp
);

elements.refreshButton?.addEventListener(
  "click",
  async () => {

    await renderAll();

    showToast(
      "Datos actualizados."
    );

  }
);

elements.logoutButton?.addEventListener(
  "click",
  async () => {

    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "same-origin"
      });
    } catch (error) {
      console.error("No se pudo cerrar la sesion en el servidor", error);
    }

    localStorage.removeItem(
      "sportbook-authenticated"
    );

    const logoutMessage =
      document.createElement("div");

    logoutMessage.className =
      "logout-screen";

    logoutMessage.innerHTML = `

      <div class="logout-card">

        <div class="logout-icon">

          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 6 9 17l-5-5"></path>
          </svg>

        </div>

        <h2>Sesión cerrada</h2>
        <p>Volviendo al inicio...</p>

      </div>

    `;

    document.body.appendChild(
      logoutMessage
    );

    setTimeout(() => {
      window.location.href =
        "index.html";
    }, 1800);

  }
);


elements.navButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      elements.navButtons.forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      const targetView =
        button.dataset.view;

      elements.views.forEach(view => {

        if (view.id === targetView) {

          view.classList.add("active");

        } else {

          view.classList.remove("active");

        }

      });

      if (elements.pageTitle) {

        elements.pageTitle.textContent =
          button.textContent.trim();

      }

    }
  );

});


document.addEventListener(
  "click",
  async (event) => {

    const paidButton =
      event.target.closest(
        "[data-paid-id]"
      );

    if (paidButton) {

      const id =
        paidButton.dataset.paidId;

      try {

        const response =
          await fetch(
            `${API_BASE}/admin/reservas/pago`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                id: Number(id),
                estadoPago: "Pagado"
              })
            }
          );

        const data =
          await response.json();

        if (data.ok) {

          showToast(
            "Reserva marcada como pagada."
          );

          await loadReservations();

        } else {

          showToast(
            "No se pudo actualizar."
          );

        }

      } catch (error) {

        console.error(error);

        showToast(
          "Error de conexión."
        );

      }

      return;
    }

    const pendingButton =
      event.target.closest(
        "[data-pending-id]"
      );

    if (pendingButton) {

      const id =
        pendingButton.dataset.pendingId;

      try {

        const response =
          await fetch(
            `${API_BASE}/admin/reservas/pago`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                id: Number(id),
                estadoPago: "Pendiente"
              })
            }
          );

        const data =
          await response.json();

        if (data.ok) {

          showToast(
            "Reserva marcada como pendiente."
          );

          await loadReservations();

        } else {

          showToast(
            "No se pudo actualizar."
          );

        }

      } catch (error) {

        console.error(error);

        showToast(
          "Error de conexión."
        );

      }

    }

  }
);


elements.blockForm?.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    const email =
      elements.blockEmailInput?.value
        .trim()
        .toLowerCase();

    if (!email) {

      showToast(
        "Escribe un correo electrónico."
      );

      return;
    }

    try {

      const response =
        await fetch(
          `${API_BASE}/admin/bloquear`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            credentials:
              "include",

            body:
              JSON.stringify({
                email,
                motivo:
                  "Bloqueado desde el panel de administrador"
              })
          }
        );

      if (handleAuthError(response)) {
        return;
      }

      const data =
        await response.json();

      if (data.ok) {

        showToast(
          "Usuario bloqueado."
        );

        elements.blockForm.reset();

        await renderBlocked();

      } else {

        showToast(
          data.mensaje ||
          "No se pudo bloquear el usuario."
        );
      }

    } catch (error) {

      console.error(error);

      showToast(
        "Error de conexión al bloquear."
      );
    }
  }
);


elements.blockedTable?.addEventListener(
  "click",
  async (event) => {

    const button =
      event.target.closest(
        "[data-unban-email]"
      );

    if (!button) return;

    const email =
      button.dataset.unbanEmail;

    try {

      const response =
        await fetch(
          `${API_BASE}/admin/desbloquear`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            credentials:
              "include",

            body: JSON.stringify({
              email
            })
          }
        );

      if (handleAuthError(response)) {
        return;
      }

      const data =
        await response.json();

      if (data.ok) {

        showToast(
          "Usuario desbloqueado."
        );

        await renderBlocked();

      } else {

        showToast(
          data.mensaje ||
          "No se pudo desbloquear el usuario."
        );
      }

    } catch (error) {

      console.error(error);

      showToast(
        "Error de conexión al desbloquear."
      );

    }

  }
);

elements.reviewsTable?.addEventListener(
  "click",
  async (event) => {

    const button =
      event.target.closest(
        "[data-delete-review-id]"
      );

    if (!button) return;

    const confirmDelete =
      confirm(
        "¿Eliminar esta reseña?"
      );

    if (!confirmDelete) return;

    try {

      const response =
        await fetch(
          `${API_BASE}/admin/resenas/eliminar`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            credentials:
              "include",

            body:
              JSON.stringify({
                id:
                  Number(button.dataset.deleteReviewId)
              })
          }
        );

      if (handleAuthError(response)) {
        return;
      }

      const data =
        await response.json();

      if (data.ok) {

        showToast(
          "Reseña eliminada."
        );

        await loadReviews();
      }

    } catch (error) {

      console.error(error);

      showToast(
        "No se pudo eliminar la reseña."
      );
    }
  }
);


async function renderAll() {

  await loadReservations();

  await loadHelpRequests();

  await cargarAyudasPublicas();

  await loadReviews();

  await renderBlocked();

}

renderAll();

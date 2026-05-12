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



const STORAGE_KEY = "sportbook-client-reservations-v1";
const HELP_STORAGE_KEY = "sportbook-help-requests-v1";
const REVIEW_STORAGE_KEY = "sportbook-reviews-v1";
const AUTH_STORAGE_KEY = "sportbook-authenticated";
const USER_EMAIL_STORAGE_KEY = "sportbook-user-email";
const USER_PHONE_STORAGE_KEY = "sportbook-user-phone";
const USERNAME_STORAGE_KEY = "sportbook-username";

const activities = {

  Futbol: {
    label: "Fútbol",
    description: "Campo completo o fútbol sala para jugar con tu grupo.",
    resources: ["Futbol 11", "Futbol 7", "Fútbol sala"],
    slots: ["09:00", "10:30", "12:00", "17:00", "18:30", "20:00"],
    price: 45,
    duration: "60 min"
  },

  Yoga: {
    label: "Yoga",
    description: "Clases tranquilas para movilidad, respiración y equilibrio.",
    resources: ["Sala Zen", "Sala Norte", "Terraza"],
    slots: ["08:00", "09:30", "11:00", "18:00", "19:30"],
    price: 14,
    duration: "50 min"
  },

  Gimnasio: {
    label: "Gimnasio",
    description: "Acceso a zona cardio, fuerza o entrenamiento personal.",
    resources: ["Zona fuerza", "Zona cardio", "Entrenamiento personal"],
    slots: ["07:00", "08:00", "12:00", "16:00", "18:00", "20:00"],
    price: 20,
    duration: "90 min"
  },

  Padel: {
    label: "Pádel",
    description: "Pistas exteriores y cubiertas para partidos.",
    resources: ["Pista de pádel 1", "Pista de pádel 2", "Pista cubierta"],
    slots: ["09:00", "10:30", "16:30", "18:00", "19:30", "21:00"],
    price: 28,
    duration: "90 min"
  },

  Natacion: {
    label: "Natación",
    description: "Piscina libre o entrenamientos guiados.",
    resources: ["Calle 1", "Calle 2", "Piscina infantil"],
    slots: ["08:00", "10:00", "13:00", "17:00", "19:00"],
    price: 12,
    duration: "45 min"
  }

};

const resourceLocations = {
  "Futbol 11":
    "Campo principal - Avenida del Deporte 12, 28032 Madrid",
  "Futbol 7":
    "Campo anexo - Avenida del Deporte 12, 28032 Madrid",
  "Fútbol sala":
    "Pabellón cubierto - Calle Olímpica 4, 28032 Madrid",
  "Sala Zen":
    "Edificio bienestar, planta 1 - Calle Serena 8, 28032 Madrid",
  "Sala Norte":
    "Edificio bienestar, planta 2 - Calle Serena 8, 28032 Madrid",
  "Terraza":
    "Terraza exterior - Calle Serena 8, 28032 Madrid",
  "Zona fuerza":
    "Gimnasio central - Paseo Fitness 21, 28032 Madrid",
  "Zona cardio":
    "Gimnasio central, zona cardio - Paseo Fitness 21, 28032 Madrid",
  "Entrenamiento personal":
    "Sala técnica - Paseo Fitness 21, 28032 Madrid",
  "Pista de pádel 1":
    "Pista 1 - Calle Raqueta 6, 28032 Madrid",
  "Pista de pádel 2":
    "Pista 2 - Calle Raqueta 6, 28032 Madrid",
  "Pista cubierta":
    "Pista cubierta - Calle Raqueta 6, 28032 Madrid",
  "Calle 1":
    "Piscina municipal, calle 1 - Avenida Agua 3, 28032 Madrid",
  "Calle 2":
    "Piscina municipal, calle 2 - Avenida Agua 3, 28032 Madrid",
  "Piscina infantil":
    "Piscina infantil - Avenida Agua 3, 28032 Madrid"
};

const elements = {

  refreshBookingsButton:
    document.querySelector("#refreshBookingsButton"),

  form:
    document.querySelector("#bookingForm"),

  resource:
    document.querySelector("#resource"),

  resourceLocation:
    document.querySelector("#resourceLocation"),

  sport:
    document.querySelector("#sport"),

  bookingDate:
    document.querySelector("#bookingDate"),

  bookingTime:
    document.querySelector("#bookingTime"),

  people:
    document.querySelector("#people"),

  paymentMethod:
    document.querySelector("#paymentMethod"),

  activityPicker:
    document.querySelector("#activityPicker"),

  summaryTitle:
    document.querySelector("#summaryTitle"),

  summaryMeta:
    document.querySelector("#summaryMeta"),

  summaryPrice:
    document.querySelector("#summaryPrice"),

  bookingsList:
    document.querySelector("#bookingsList"),

  toast:
    document.querySelector("#toast"),

  clearBookingsButton:
    document.querySelector("#clearBookingsButton"),

  helpForm:
    document.querySelector("#helpForm"),

  reviewForm:
    document.querySelector("#reviewForm"),

  starRating:
    document.querySelector("#starRating"),

  reviewsList:
    document.querySelector("#reviewsList"),

  usernameDisplay:
    document.querySelector("#usernameDisplay")

};

let selectedRating = 0;

/* =========================
   USUARIO
========================= */

function renderLoggedUser() {

  const username =
    localStorage.getItem(
      USERNAME_STORAGE_KEY
    ) || "Usuario";

  if (elements.usernameDisplay) {
    elements.usernameDisplay.textContent =
    username;
  }

}

/* =========================
   TOAST
========================= */

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

    }, 2500);

}

function clearStoredSession() {

  localStorage.removeItem(
    AUTH_STORAGE_KEY
  );

  localStorage.removeItem(
    USER_EMAIL_STORAGE_KEY
  );

  localStorage.removeItem(
    USER_PHONE_STORAGE_KEY
  );

  localStorage.removeItem(
    USERNAME_STORAGE_KEY
  );
}

function redirectToLogin() {

  clearStoredSession();

  showToast(
    "Tu sesión ha caducado. Inicia sesión de nuevo."
  );

  setTimeout(() => {

    window.location.replace(
      "login.html"
    );

  }, 900);
}

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================
   DINERO
========================= */

function formatCurrency(value) {

  return new Intl.NumberFormat(
    "es-ES",
    {
      style: "currency",
      currency: "EUR"
    }
  ).format(value);

}

/* =========================
   RESUMEN
========================= */

function updateSummary() {

  const sport =
    elements.sport.value;

  const activity =
    activities[sport];

  if (!activity) {

    elements.summaryTitle.textContent =
      "Sin actividad seleccionada";

    elements.summaryMeta.textContent =
      "El total aparecerá al elegir actividad y personas.";

    elements.summaryPrice.textContent =
      "--";

    return;

  }

  const people =
    Number(elements.people.value || 1);

  const total =
    activity.price * people;

  elements.summaryTitle.textContent =
    activity.label;

  elements.summaryMeta.textContent =
    `${activity.duration} · ${formatCurrency(activity.price)} por persona`;

  elements.summaryPrice.textContent =
    formatCurrency(total);

}

/* =========================
   ACTIVIDAD
========================= */

function updateActivity(sport) {

  const activity =
    activities[sport];

  if (!activity) return;

  elements.sport.value =
    sport;

  elements.resource.innerHTML =
    `<option value="">Selecciona una instalación</option>` +
    activity.resources.map(resource =>
      `<option value="${resource}">${resource}</option>`
    ).join("");

  updateResourceLocation();

  elements.bookingTime.innerHTML =
    `<option value="">Selecciona una hora</option>` +
    activity.slots.map(slot =>
      `<option value="${slot}">${slot}</option>`
    ).join("");

  document
    .querySelectorAll(".activity-option")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.sport === sport
      );

    });

  updateSummary();

  renderFacilityInfo(sport);

  updateSlotAvailability();

}

function updateResourceLocation() {

  const text =
    elements.resourceLocation?.querySelector("strong");

  if (!text) return;

  const selectedResource =
    elements.resource?.value || "";

  text.textContent =
    selectedResource
      ? resourceLocations[selectedResource] ||
        "Dirección pendiente de confirmar por el centro."
      : "Selecciona una instalación para ver dónde ir.";

}

elements.activityPicker?.addEventListener(
  "click",
  (event) => {

    const button =
      event.target.closest("[data-sport]");

    if (!button) return;

    updateActivity(
      button.dataset.sport
    );

  }
);

elements.sport?.addEventListener(
  "change",
  () => {

    updateActivity(
      elements.sport.value
    );

  }
);

/* =========================
   DISPONIBILIDAD
========================= */

async function updateSlotAvailability() {

  const selectedDate =
    elements.bookingDate.value;

  const selectedResource =
    elements.resource.value;

  if (
    !selectedDate ||
    !selectedResource
  ) return;

  try {

    const response =
      await fetch(
        `${PUBLIC_API}/reservas/disponibilidad?date=${selectedDate}&resource=${selectedResource}`
      );

    const data =
      await response.json();

    const occupiedHours =
      (data.hours || []).map(hour =>
        hour.substring(0, 5)
      );

    const options =
      elements.bookingTime.querySelectorAll("option");

    options.forEach(option => {

      if (!option.value) return;

      const cleanHour =
        option.value.substring(0, 5);

      const occupied =
        occupiedHours.includes(
          cleanHour
        );

      if (occupied) {

        option.disabled = true;

        option.style.color = "red";

        option.textContent =
          `${cleanHour} ❌ Ocupado`;

      } else {

        option.disabled = false;

        option.style.color = "#00ff88";

        option.textContent =
          `${cleanHour} ✅ Libre`;

      }

    });

  } catch (error) {

    console.error(error);

  }

}

elements.people?.addEventListener(
  "input",
  updateSummary
);
/* =========================
   INSTALACIONES
========================= */


const facilityData = {

  Futbol: {

    title: "Campo de Fútbol",

    description:
      "Campo profesional con césped artificial y vestuarios modernos.",

    images: [

      "https://images.mnstatic.com/d0/a0/d0a007464e72c260365b989dd6efef9f.jpg",

      "https://golsmedia.com/wp-content/uploads/2018/07/Dh6Yfb0X0AAD-Ik.jpg"

    ],

    schedule:
      "09:00 - 22:00",

    days:
      "Lunes a Domingo",

    busy:
      "18:00, 19:00 y 20:00"

  },

  Yoga: {

    title: "Sala de Yoga",

    description:
      "Sala climatizada y ambiente relajante.",

    images: [

      "https://hips.hearstapps.com/hmg-prod/images/sivanda-yoga-1637660943.jpg?resize=980:*",

      "https://adrprojects.com/wp-content/uploads/2024/07/sala-yoga-43.webp"

    ],

    schedule:
      "08:00 - 21:00",

    days:
      "Lunes a Sábado",

    busy:
      "18:00 y 19:30"

  },

  Gimnasio: {

    title: "Zona Fitness",

    description:
      "Área moderna de cardio y musculación.",

    images: [

      "https://perfilsport.es/wp-content/uploads/2022/07/sala-fitness-cardio.jpg",

      "https://www.rocfit.com/wp-content/uploads/2019/12/sala-fitness-universidad-de-santiago-1.jpg"

    ],

    schedule:
      "07:00 - 23:00",

    days:
      "Todos los días",

    busy:
      "17:00, 18:00 y 19:00"

  },

  Padel: {

    title: "Pistas de Pádel",

    description:
      "Pistas indoor y outdoor iluminadas.",

    images: [

      "https://offloadmedia.feverup.com/lisboasecreta.co/wp-content/uploads/2022/07/08090140/Padel-os-melhores-campos-para-jogar-em-Lisboa-Foto-por-%40abcpadel-_2.jpeg",

      "https://offloadmedia.feverup.com/lisboasecreta.co/wp-content/uploads/2022/07/08090141/Padel-os-melhores-campos-para-jogar-em-Lisboa-Foto-por-%40abcpadel-_1.jpeg"

    ],

    schedule:
      "09:00 - 23:00",

    days:
      "Lunes a Domingo",

    busy:
      "20:00 y 21:00"

  },

  Natacion: {

    title: "Piscina climatizada",

    description:
      "Piscina olímpica con agua climatizada.",

    images: [

      "https://www.comunidad.madrid/docs/styles/free_crop_1920w_x2/public/assets/2024/02/05/img_0142.jpg?VersionId=NEILrTT9lPjthhyKkQ__oknHvC2c_aOt&itok=9QfQu7ix",

      "https://moveandgo.es/contenido/piscina-torrelavega-01.jpg"

    ],

    schedule:
      "08:00 - 22:00",

    days:
      "Todos los días",

    busy:
      "17:00 y 19:00"

  }

};

function renderFacilityInfo(sport) {

  const data =
    facilityData[sport];

  if (!data) return;

  document.getElementById(
    "facilityTitle"
  ).textContent =
    data.title;

  document.getElementById(
    "facilityDescription"
  ).textContent =
    data.description;

  document.getElementById(
    "facilitySchedule"
  ).textContent =
    data.schedule;

  document.getElementById(
    "facilityDays"
  ).textContent =
    data.days;

  document.getElementById(
    "facilityBusy"
  ).textContent =
    data.busy;

  document.getElementById(
    "facilityImages"
  ).innerHTML =

    data.images.map(image => `

      <img src="${image}" alt="${data.title}">

    `).join("");

}

/* =========================
   CREAR RESERVA
========================= */

elements.form?.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    const sport =
      elements.sport.value;

    if (!sport) {

      showToast(
        "Selecciona una actividad."
      );

      return;

    }

    const activity =
      activities[sport];

    const reservation = {

      client:
        document.querySelector(
          "#clientName"
        ).value,

      email:
        localStorage.getItem(
          USER_EMAIL_STORAGE_KEY
        ) || "",

      phone:
        localStorage.getItem(
          USER_PHONE_STORAGE_KEY
        ) || "",

      sport:
        sport,

      resource:
        elements.resource.value,

      date:
        elements.bookingDate.value,

      time:
        elements.bookingTime.value,

      people:
        Number(
          elements.people.value
        ),

      price:
        activity.price *
        Number(
          elements.people.value
        ),

      paymentMethod:
        elements.paymentMethod.value

    };

    try {

      const response =
        await fetch(
          `${PUBLIC_API}/reservas`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(
                reservation
              )
          }
        );

      const data =
        await response.json();

      if (data.ok) {

        const reservationMessage =
          document.createElement("div");
        reservationMessage.className ="logout-screen";
        reservationMessage.innerHTML = `

          <div class="logout-card">
            <div class="logout-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor">
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
            </div>

            <h2>
              Reserva registrada
            </h2>

            <p>
              Tu plaza queda reservada. Pago pendiente en el centro.
            </p>
          </div>`;

        document.body.appendChild(
          reservationMessage
        );

        setTimeout(() => {

          reservationMessage.remove();

        }, 2500);

        elements.form.reset();

        updateSummary();

        await cargarReservas();

        updateActivity(
          reservation.sport
        );

        await updateSlotAvailability();

      }

    } catch (error) {

      console.error(error);

      showToast(
        "Error de conexión."
      );

    }

  }
);

/* =========================
   CARGAR RESERVAS
========================= */

async function cargarReservas() {

  try {

    const email =
      localStorage.getItem(
        USER_EMAIL_STORAGE_KEY
      ) || "";

    const response =
      await fetch(
        `${PUBLIC_API}/reservas/usuario`,
        {
          credentials:
            "include"
        }
      );

    if (response.status === 401) {

      redirectToLogin();
      return;
    }

    const data =
      await response.json();

    if (!data || !data.reservas) {

      renderReservations([]);

      return;

    }

    renderReservations(
      data.reservas
    );

  } catch (error) {

    console.error(error);

    renderReservations([]);

  }
}

/* =========================
   RENDER RESERVAS
========================= */

function renderReservations(
  reservations = []
) {

  if (!elements.bookingsList)
    return;

  if (reservations.length === 0) {

    elements.bookingsList.innerHTML = `

      <div class="empty-state visible">

        <strong>
          Aún no tienes reservas
        </strong>

        <span>
          Cuando reserves aparecerán aquí.
        </span>

      </div>

    `;

    return;

  }

  elements.bookingsList.innerHTML =

    reservations.map(
      reservation => `

      <article class="reservation-item">

        <div>

          <p class="reservation-title">
            ${reservation.sport}
          </p>

          <p class="reservation-meta">
            ${reservation.resource}
          </p>

          <p class="reservation-meta">
            ${reservation.date}
            ·
            ${reservation.time}
          </p>

          <p class="reservation-meta">
            ${reservation.people}
            personas
          </p>

          <p class="reservation-meta">
            Pago:
            ${reservation.paymentMethod === "Transferencia"
              ? "Transferencia"
              : "En el centro"}
          </p>

          <p class="reservation-meta">
            ${reservation.client}
          </p>

          <p class="reservation-meta">
            Reservado el:
            ${new Date(
              reservation.createdAt
            ).toLocaleDateString("es-ES")}
          </p>

        </div>

        <div class="reservation-actions">

          <span class="status-badge ${reservation.paymentStatus === "Pagado"
            ? ""
            : "status-pending"}">

            ${reservation.status === "Cancelada"
              ? "Cancelada"
              : reservation.paymentStatus === "Pagado"
                ? "Pagado"
                : "Pendiente de pago"}

          </span>

          <button
            class="button danger cancel-booking"
            data-booking-id="${reservation.id}">

            Cancelar reserva

          </button>

        </div>

      </article>

    `
    ).join("");

}

/* =========================
   ACTUALIZAR RESERVAS
========================= */

elements.refreshBookingsButton?.addEventListener(
  "click",
  async () => {

    try {

      await cargarReservas();

      await updateSlotAvailability();

      showToast(
        "Reservas actualizadas."
      );

    } catch (error) {

      console.error(error);

      showToast(
        "No se pudieron actualizar."
      );

    }

  }
);

/* =========================
   MENU USUARIO
========================= */

const userMenuButton =
  document.getElementById(
    "userMenuButton"
  );

const userDropdown =
  document.getElementById(
    "userDropdown"
  );

const userMenu =
  document.getElementById(
    "userMenu"
  );

if (userMenuButton) {

  userMenuButton.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();

      userDropdown.classList.toggle(
        "show"
      );

    }
  );

}

document.addEventListener(
  "click",
  (event) => {

    if (
      userMenu &&
      !userMenu.contains(event.target)
    ) {

      userDropdown.classList.remove(
        "show"
      );

    }

  }
);

/* =========================
   BIENVENIDA
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const username =
      localStorage.getItem(
        USERNAME_STORAGE_KEY
      ) || "Usuario";

    renderLoggedUser();

    const welcomeMessage =
      document.createElement("div");

    welcomeMessage.className =
      "logout-screen";

    welcomeMessage.innerHTML = `

      <div class="logout-card">

        <div class="logout-icon">

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor">

            <path d="M20 6 9 17l-5-5"></path>

          </svg>

        </div>

        <h2>
          Bienvenido
        </h2>

        <p>
          ${username}
        </p>

      </div>

    `;

    document.body.appendChild(
      welcomeMessage
    );

    setTimeout(() => {

      welcomeMessage.remove();

    }, 3000);

  }
);

/* =========================
   CERRAR SESIÓN
========================= */

const logoutButton =
  document.querySelector(
    "#logoutButton"
  );

logoutButton?.addEventListener(
  "click",
  () => {

    localStorage.removeItem(
      AUTH_STORAGE_KEY
    );

    localStorage.removeItem(
      USER_EMAIL_STORAGE_KEY
    );

    localStorage.removeItem(
      USER_PHONE_STORAGE_KEY
    );

    localStorage.removeItem(
      USERNAME_STORAGE_KEY
    );

    const logoutMessage =
      document.createElement("div");

    logoutMessage.className =
      "logout-screen";

    logoutMessage.innerHTML = `

      <div class="logout-card">

        <div class="logout-icon">

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor">

            <path d="M20 6 9 17l-5-5"></path>

          </svg>

        </div>

        <h2>
          Sesión cerrada
        </h2>

        <p>
          Volviendo al inicio...
        </p>

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

/* =========================
   EVENTOS
========================= */

elements.bookingDate?.addEventListener(
  "change",
  updateSlotAvailability
);

elements.resource?.addEventListener(
  "change",
  () => {

    updateResourceLocation();

    updateSlotAvailability();

  }
);

elements.sport?.addEventListener(
  "change",
  updateSlotAvailability
);

/* =========================
   AYUDA REGISTRADOS
========================= */

elements.helpForm?.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    const formData =
      new FormData(elements.helpForm);

    const payload = {
      nombre:
        String(formData.get("helpName") || "").trim(),

      gmail:
        String(formData.get("helpEmail") || "").trim(),

      motivo:
        String(formData.get("helpReason") || "").trim(),

      mensaje:
        String(formData.get("helpMessage") || "").trim()
    };

    if (
      !payload.nombre ||
      !payload.gmail ||
      !payload.motivo ||
      !payload.mensaje
    ) {

      showToast(
        "Completa todos los campos de ayuda."
      );

      return;
    }

    try {

      const response =
        await fetch(
          "http://localhost:8085/admin/ayuda",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            credentials:
              "include",

            body:
              JSON.stringify(payload)
          }
        );

      const data =
        await response.json();

      if (response.status === 401) {

        redirectToLogin();
        return;
      }

      if (!response.ok || !data.ok) {

        showToast(
          data.mensaje ||
          "No se pudo enviar la solicitud."
        );

        return;
      }

      elements.helpForm.reset();

      showToast(
        "Solicitud enviada al administrador."
      );

    } catch (error) {

      console.error(error);

      showToast(
        "Error de conexión al enviar ayuda."
      );
    }
  }
);

/* =========================
   RESEÑAS
========================= */

function renderStars(rating) {

  return "★".repeat(rating) +
    "☆".repeat(5 - rating);
}

async function cargarResenas() {

  try {

    const response =
      await fetch(
        `${PUBLIC_API}/resenas`
      );

    const data =
      await response.json();

    renderResenas(
      data.ok && Array.isArray(data.resenas)
        ? data.resenas
        : []
    );

  } catch (error) {

    console.error(error);

    renderResenas([]);
  }
}

function renderResenas(reviews = []) {

  const emptyState =
    document.querySelector("#reviewsEmptyState");

  if (!elements.reviewsList) return;

  elements.reviewsList.innerHTML = "";

  if (!reviews.length) {

    emptyState?.classList.add(
      "visible"
    );

    return;
  }

  emptyState?.classList.remove(
    "visible"
  );

  elements.reviewsList.innerHTML =
    reviews.map(review => `

      <article class="review-item">

        <div class="review-head">

          <div>
            <p class="review-title">
              ${escapeHTML(review.name)}
            </p>

            <p class="review-meta">
              ${escapeHTML(review.sport)}
            </p>
          </div>

          <span class="review-stars">
            ${renderStars(Number(review.rating || 0))}
          </span>

        </div>

        <p class="review-comment">
          ${escapeHTML(review.comment)}
        </p>

      </article>
    `).join("");
}

function paintSelectedStars() {

  elements.starRating
    ?.querySelectorAll("[data-rating]")
    .forEach(button => {

      button.classList.toggle(
        "active",
        Number(button.dataset.rating) <= selectedRating
      );
    });
}

elements.starRating?.addEventListener(
  "click",
  (event) => {

    const button =
      event.target.closest("[data-rating]");

    if (!button) return;

    selectedRating =
      Number(button.dataset.rating);

    paintSelectedStars();
  }
);

elements.reviewForm?.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    const formData =
      new FormData(elements.reviewForm);

    const payload = {
      name:
        String(formData.get("reviewName") || "").trim(),

      sport:
        String(formData.get("reviewSport") || "").trim(),

      rating:
        selectedRating,

      comment:
        String(formData.get("reviewComment") || "").trim()
    };

    if (
      !payload.name ||
      !payload.sport ||
      !payload.rating ||
      !payload.comment
    ) {

      showToast(
        "Completa la reseña y elige una valoración."
      );

      return;
    }

    try {

      const response =
        await fetch(
          `${PUBLIC_API}/resenas`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            credentials:
              "include",

            body:
              JSON.stringify(payload)
          }
        );

      if (response.status === 401) {

        redirectToLogin();
        return;
      }

      const data =
        await response.json();

      if (!response.ok || !data.ok) {

        showToast(
          data.mensaje ||
          "No se pudo publicar la reseña."
        );

        return;
      }

      elements.reviewForm.reset();

      selectedRating = 0;

      paintSelectedStars();

      await cargarResenas();

      showToast(
        "Reseña publicada."
      );

    } catch (error) {

      console.error(error);

      showToast(
        "Error de conexión al publicar reseña."
      );
    }
  }
);

/* =========================
   INICIO
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderLoggedUser();

    cargarReservas();

    updateSummary();

    updateSlotAvailability();

    cargarResenas();

  }
);

/* =========================
   CANCELAR RESERVA
========================= */

document.addEventListener(
  "click",
  async (event) => {

    const cancelButton =
      event.target.closest(
        ".cancel-booking"
      );

    if (!cancelButton) return;

    const confirmCancel =
      confirm(
        "¿Cancelar esta reserva?"
      );

    if (!confirmCancel) return;

    const id =
      cancelButton.dataset.bookingId;

    try {

      const response =
        await fetch(
          `${PUBLIC_API}/reservas/${id}`,
          {
            method: "DELETE"
          }
        );

      const data =
        await response.json();

      if (data.ok) {

        showToast(
          "Reserva cancelada."
        );

        await cargarReservas();

        await updateSlotAvailability();

      }

    } catch (error) {

      console.error(error);

    }

  }
);

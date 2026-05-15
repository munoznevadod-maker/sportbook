
const API_BASE =
  window.location.protocol.startsWith("http")
    ? (
      ["5500", "5501", "8089"].includes(window.location.port)
        ? `${window.location.protocol}//${window.location.hostname}:8085`
        : window.location.origin
    )
    : "http://localhost:8085";

const PUBLIC_API = `${API_BASE}/api`;



const STORAGE_KEY = "sportbook-client-reservations-v1";
const HELP_STORAGE_KEY = "sportbook-help-requests-v1";
const REVIEW_STORAGE_KEY = "sportbook-reviews-v1";
const AUTH_STORAGE_KEY = "sportbook-authenticated";
const USER_EMAIL_STORAGE_KEY = "sportbook-user-email";
const USER_PHONE_STORAGE_KEY = "sportbook-user-phone";
const USERNAME_STORAGE_KEY = "sportbook-username";
const USER_PROFILE_IMAGE_STORAGE_KEY = "sportbook-profile-image";
const BIZUM_PHONE = "+34 600 123 456";

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

  paymentInfo:
    document.querySelector("#paymentInfo"),

  paymentInfoTitle:
    document.querySelector("#paymentInfoTitle"),

  bookingSubmitButton:
    document.querySelector("#bookingSubmitButton"),

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

const facilityBusyCard =
  document.querySelector("#facilityBusyCard");

const facilityBusyText =
  document.querySelector("#facilityBusy");

let selectedRating = 0;
let lastRenderedFacilityKey = "";


function paymentMethodLabel(method) {

  return method === "Bizum"
    ? "Bizum"
    : method === "Transferencia"
      ? "Transferencia"
      : "En el centro";
}


function renderPaymentInfo() {

  if (!elements.paymentInfo) return;

  const method =
    elements.paymentMethod?.value || "Bizum";

  if (method === "Centro") {

    if (elements.paymentInfoTitle) {
      elements.paymentInfoTitle.textContent =
        "Pago en el centro pendiente";
    }

    elements.paymentInfo.textContent =
      "Deberas ir a la instalacion el dia de la reserva y pagar alli en persona antes de empezar la actividad.";

    if (elements.bookingSubmitButton) {
      elements.bookingSubmitButton.textContent =
        "Reservar y pagar en el centro";
    }

    return;
  }

  if (elements.paymentInfoTitle) {
    elements.paymentInfoTitle.textContent =
      "Pago por Bizum pendiente";
  }

  elements.paymentInfo.textContent =
    `Deberas pagar por Bizum al telefono ${BIZUM_PHONE} como maximo un dia antes de la reserva.`;

  if (elements.bookingSubmitButton) {
    elements.bookingSubmitButton.textContent =
      "Reservar y pagar por Bizum";
  }
}


function reservationPaymentMessage(method) {

  return method === "Centro"
    ? "Tu plaza queda reservada. Deberas ir a la instalacion el dia de la reserva y pagar alli en persona antes de empezar la actividad."
    : `Tu plaza queda reservada. Paga por Bizum al telefono ${BIZUM_PHONE} como maximo un dia antes de la reserva.`;
}


function renderLoggedUser() {

  const username =
    localStorage.getItem(
      USERNAME_STORAGE_KEY
    ) || "Usuario";

  if (elements.usernameDisplay) {
    elements.usernameDisplay.textContent =
    username;
  }

  const accountMenuName =
    document.querySelector("#accountMenuName");

  const accountProfileName =
    document.querySelector("#accountProfileName");

  if (accountMenuName) {
    accountMenuName.textContent =
      username;
  }

  if (accountProfileName) {
    accountProfileName.textContent =
      username;
  }

  const profileImage =
    localStorage.getItem(
      USER_PROFILE_IMAGE_STORAGE_KEY
    );

  document.querySelectorAll(
    ".user-avatar"
  ).forEach(avatar => {

    if (profileImage) {
      avatar.style.backgroundImage =
        `url("${profileImage}")`;

      avatar.classList.add(
        "has-photo"
      );
    } else {
      avatar.style.backgroundImage =
        "";

      avatar.classList.remove(
        "has-photo"
      );
    }
  });

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

  localStorage.removeItem(
    USER_PROFILE_IMAGE_STORAGE_KEY
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


function formatCurrency(value) {

  return new Intl.NumberFormat(
    "es-ES",
    {
      style: "currency",
      currency: "EUR"
    }
  ).format(value);

}


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


async function updateSlotAvailability() {

  const selectedDate =
    elements.bookingDate.value;

  const selectedResource =
    elements.resource.value;

  renderOccupiedHours([]);

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

    renderOccupiedHours(
      occupiedHours
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

    renderOccupiedHours([]);

  }

}

function renderOccupiedHours(hours = []) {

  if (
    !facilityBusyCard ||
    !facilityBusyText
  ) return;

  const uniqueHours =
    [...new Set(hours)]
      .filter(Boolean)
      .sort();

  if (!uniqueHours.length) {

    facilityBusyText.textContent =
      "--";

    facilityBusyCard.hidden =
      true;

    return;
  }

  facilityBusyText.textContent =
    uniqueHours.join(", ");

  facilityBusyCard.hidden =
    false;
}

elements.people?.addEventListener(
  "input",
  updateSummary
);

elements.paymentMethod?.addEventListener(
  "change",
  renderPaymentInfo
);


const facilityData = {

  Futbol: {

    title: "Campo de Fútbol",

    description:
      "Campo profesional con césped artificial y vestuarios modernos.",

    images: [

      "https://images.pexels.com/photos/12768058/pexels-photo-12768058.jpeg?cs=srgb&dl=pexels-introspectivedsgn-12768058.jpg&fm=jpg",

      "https://images.pexels.com/photos/12536501/pexels-photo-12536501.jpeg?cs=srgb&dl=pexels-jason-scott-3936034-12536501.jpg&fm=jpg"

    ],

    schedule:
      "09:00 - 22:00",

    days:
      "Lunes a Domingo",

    busy:
      ""

  },

  Yoga: {

    title: "Sala de Yoga",

    description:
      "Sala climatizada y ambiente relajante.",

    images: [

      "https://images.pexels.com/photos/7318661/pexels-photo-7318661.jpeg?cs=srgb&dl=pexels-mart-production-7318661.jpg&fm=jpg",

      "https://images.pexels.com/photos/7318661/pexels-photo-7318661.jpeg?cs=srgb&dl=pexels-mart-production-7318661.jpg&fm=jpg"

    ],

    schedule:
      "08:00 - 21:00",

    days:
      "Lunes a Sábado",

    busy:
      ""

  },

  Gimnasio: {

    title: "Zona Fitness",

    description:
      "Área moderna de cardio y musculación.",

    images: [

      "https://images.pexels.com/photos/17211446/pexels-photo-17211446.jpeg?cs=srgb&dl=pexels-eyecon-design-500632474-17211446.jpg&fm=jpg",

      "https://images.pexels.com/photos/17211446/pexels-photo-17211446.jpeg?cs=srgb&dl=pexels-eyecon-design-500632474-17211446.jpg&fm=jpg"

    ],

    schedule:
      "07:00 - 23:00",

    days:
      "Todos los días",

    busy:
      ""

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
      ""

  },

  Natacion: {

    title: "Piscina climatizada",

    description:
      "Piscina olímpica con agua climatizada.",

    images: [

      "https://images.pexels.com/photos/9030294/pexels-photo-9030294.jpeg?cs=srgb&dl=pexels-kindelmedia-9030294.jpg&fm=jpg",

      "https://images.pexels.com/photos/9030294/pexels-photo-9030294.jpeg?cs=srgb&dl=pexels-kindelmedia-9030294.jpg&fm=jpg"

    ],

    schedule:
      "08:00 - 22:00",

    days:
      "Todos los días",

    busy:
      ""

  }

};

const resourceFacilityData = {

  "Futbol 11": {
    title: "Campo Futbol 11",
    description:
      "Campo exterior de cesped artificial para partidos completos. Incluye porterias reglamentarias, iluminacion nocturna y vestuarios.",
    images: [
      "https://images.pexels.com/photos/12768058/pexels-photo-12768058.jpeg?cs=srgb&dl=pexels-introspectivedsgn-12768058.jpg&fm=jpg",
      "https://images.pexels.com/photos/12536501/pexels-photo-12536501.jpeg?cs=srgb&dl=pexels-jason-scott-3936034-12536501.jpg&fm=jpg"
    ],
    schedule: "09:00 - 22:00",
    days: "Lunes a Domingo"
  },

  "Futbol 7": {
    title: "Campo Futbol 7",
    description:
      "Campo anexo para grupos medianos, entrenamientos y partidos rapidos. Superficie de cesped artificial y acceso directo a vestuarios.",
    images: [
      "https://images.pexels.com/photos/12536501/pexels-photo-12536501.jpeg?cs=srgb&dl=pexels-jason-scott-3936034-12536501.jpg&fm=jpg",
      "https://images.pexels.com/photos/12768058/pexels-photo-12768058.jpeg?cs=srgb&dl=pexels-introspectivedsgn-12768058.jpg&fm=jpg"
    ],
    schedule: "09:00 - 21:30",
    days: "Lunes a Sabado"
  },

  "Fútbol sala": {
    title: "Pabellon Futbol Sala",
    description:
      "Pista cubierta con suelo tecnico, gradas y buena iluminacion. Pensada para partidos indoor durante todo el ano.",
    images: [
      "https://images.pexels.com/photos/9787275/pexels-photo-9787275.jpeg?cs=srgb&dl=pexels-ibrahim-9119962-9787275.jpg&fm=jpg",
      "https://images.pexels.com/photos/9787275/pexels-photo-9787275.jpeg?cs=srgb&dl=pexels-ibrahim-9119962-9787275.jpg&fm=jpg"
    ],
    schedule: "10:00 - 22:00",
    days: "Lunes a Domingo"
  },

  "Sala Zen": {
    title: "Sala Zen",
    description:
      "Sala tranquila para clases de yoga suave, respiracion y movilidad. Ambiente silencioso, climatizado y con material incluido.",
    images: [
      "https://images.pexels.com/photos/7318661/pexels-photo-7318661.jpeg?cs=srgb&dl=pexels-mart-production-7318661.jpg&fm=jpg",
      "https://images.pexels.com/photos/7318661/pexels-photo-7318661.jpeg?cs=srgb&dl=pexels-mart-production-7318661.jpg&fm=jpg"
    ],
    schedule: "08:00 - 20:30",
    days: "Lunes a Sabado"
  },

  "Sala Norte": {
    title: "Sala Norte",
    description:
      "Espacio amplio para clases grupales de yoga dinamico. Cuenta con ventilacion natural, espejos y zona de estiramientos.",
    images: [
      "https://images.pexels.com/photos/7318661/pexels-photo-7318661.jpeg?cs=srgb&dl=pexels-mart-production-7318661.jpg&fm=jpg",
      "https://images.pexels.com/photos/7318661/pexels-photo-7318661.jpeg?cs=srgb&dl=pexels-mart-production-7318661.jpg&fm=jpg"
    ],
    schedule: "09:30 - 21:00",
    days: "Lunes a Viernes"
  },

  Terraza: {
    title: "Terraza Yoga",
    description:
      "Zona exterior para sesiones al aire libre. Ideal para clases de manana y grupos reducidos con luz natural.",
    images: [
      "https://images.pexels.com/photos/7318661/pexels-photo-7318661.jpeg?cs=srgb&dl=pexels-mart-production-7318661.jpg&fm=jpg",
      "https://images.pexels.com/photos/7318661/pexels-photo-7318661.jpeg?cs=srgb&dl=pexels-mart-production-7318661.jpg&fm=jpg"
    ],
    schedule: "08:00 - 19:30",
    days: "Martes a Domingo"
  },

  "Zona fuerza": {
    title: "Zona Fuerza",
    description:
      "Area de musculacion con pesos libres, bancos, barras y maquinas guiadas. Recomendada para rutinas de fuerza.",
    images: [
      "https://images.pexels.com/photos/17211446/pexels-photo-17211446.jpeg?cs=srgb&dl=pexels-eyecon-design-500632474-17211446.jpg&fm=jpg",
      "https://images.pexels.com/photos/17211446/pexels-photo-17211446.jpeg?cs=srgb&dl=pexels-eyecon-design-500632474-17211446.jpg&fm=jpg"
    ],
    schedule: "07:00 - 23:00",
    days: "Todos los dias"
  },

  "Zona cardio": {
    title: "Zona Cardio",
    description:
      "Espacio con cintas, bicicletas, elipticas y remo. Ideal para sesiones individuales de resistencia y calentamiento.",
    images: [
      "https://images.pexels.com/photos/17211446/pexels-photo-17211446.jpeg?cs=srgb&dl=pexels-eyecon-design-500632474-17211446.jpg&fm=jpg",
      "https://images.pexels.com/photos/17211446/pexels-photo-17211446.jpeg?cs=srgb&dl=pexels-eyecon-design-500632474-17211446.jpg&fm=jpg"
    ],
    schedule: "07:00 - 22:30",
    days: "Todos los dias"
  },

  "Entrenamiento personal": {
    title: "Entrenamiento Personal",
    description:
      "Sala tecnica para sesiones guiadas con entrenador. Permite trabajo personalizado, evaluacion y seguimiento.",
    images: [
      "https://images.pexels.com/photos/17211446/pexels-photo-17211446.jpeg?cs=srgb&dl=pexels-eyecon-design-500632474-17211446.jpg&fm=jpg",
      "https://images.pexels.com/photos/17211446/pexels-photo-17211446.jpeg?cs=srgb&dl=pexels-eyecon-design-500632474-17211446.jpg&fm=jpg"
    ],
    schedule: "08:00 - 20:00",
    days: "Lunes a Viernes"
  },

  "Pista de pádel 1": {
    title: "Pista Padel 1",
    description:
      "Pista exterior con cristal, iluminacion y buen agarre. Recomendada para partidos de tarde y parejas habituales.",
    images: [
      "https://offloadmedia.feverup.com/lisboasecreta.co/wp-content/uploads/2022/07/08090140/Padel-os-melhores-campos-para-jogar-em-Lisboa-Foto-por-%40abcpadel-_2.jpeg",
      "https://offloadmedia.feverup.com/lisboasecreta.co/wp-content/uploads/2022/07/08090141/Padel-os-melhores-campos-para-jogar-em-Lisboa-Foto-por-%40abcpadel-_1.jpeg"
    ],
    schedule: "09:00 - 22:30",
    days: "Lunes a Domingo"
  },

  "Pista de pádel 2": {
    title: "Pista Padel 2",
    description:
      "Pista exterior para reservas rapidas, clases y partidos casuales. Dispone de iluminacion y zona de descanso cercana.",
    images: [
      "https://offloadmedia.feverup.com/lisboasecreta.co/wp-content/uploads/2022/07/08090141/Padel-os-melhores-campos-para-jogar-em-Lisboa-Foto-por-%40abcpadel-_1.jpeg",
      "https://offloadmedia.feverup.com/lisboasecreta.co/wp-content/uploads/2022/07/08090140/Padel-os-melhores-campos-para-jogar-em-Lisboa-Foto-por-%40abcpadel-_2.jpeg"
    ],
    schedule: "09:00 - 22:30",
    days: "Lunes a Domingo"
  },

  "Pista cubierta": {
    title: "Pista Padel Cubierta",
    description:
      "Pista indoor protegida de lluvia y viento. Perfecta para jugar con condiciones estables durante todo el ano.",
    images: [
      "https://offloadmedia.feverup.com/lisboasecreta.co/wp-content/uploads/2022/07/08090140/Padel-os-melhores-campos-para-jogar-em-Lisboa-Foto-por-%40abcpadel-_2.jpeg",
      "https://offloadmedia.feverup.com/lisboasecreta.co/wp-content/uploads/2022/07/08090141/Padel-os-melhores-campos-para-jogar-em-Lisboa-Foto-por-%40abcpadel-_1.jpeg"
    ],
    schedule: "10:30 - 23:00",
    days: "Lunes a Domingo"
  },

  "Calle 1": {
    title: "Piscina Calle 1",
    description:
      "Calle para natacion libre y entrenamiento tecnico. Recomendada para usuarios que buscan ritmo continuo.",
    images: [
      "https://images.pexels.com/photos/9030294/pexels-photo-9030294.jpeg?cs=srgb&dl=pexels-kindelmedia-9030294.jpg&fm=jpg",
      "https://images.pexels.com/photos/9030294/pexels-photo-9030294.jpeg?cs=srgb&dl=pexels-kindelmedia-9030294.jpg&fm=jpg"
    ],
    schedule: "08:00 - 21:30",
    days: "Todos los dias"
  },

  "Calle 2": {
    title: "Piscina Calle 2",
    description:
      "Calle de natacion para sesiones suaves, tecnica y resistencia. Buena opcion para horarios de media manana.",
    images: [
      "https://images.pexels.com/photos/9030294/pexels-photo-9030294.jpeg?cs=srgb&dl=pexels-kindelmedia-9030294.jpg&fm=jpg",
      "https://images.pexels.com/photos/9030294/pexels-photo-9030294.jpeg?cs=srgb&dl=pexels-kindelmedia-9030294.jpg&fm=jpg"
    ],
    schedule: "08:00 - 21:30",
    days: "Todos los dias"
  },

  "Piscina infantil": {
    title: "Piscina Infantil",
    description:
      "Piscina de poca profundidad para aprendizaje y actividades familiares. Temperatura controlada y acceso supervisado.",
    images: [
      "https://images.pexels.com/photos/9030294/pexels-photo-9030294.jpeg?cs=srgb&dl=pexels-kindelmedia-9030294.jpg&fm=jpg",
      "https://images.pexels.com/photos/9030294/pexels-photo-9030294.jpeg?cs=srgb&dl=pexels-kindelmedia-9030294.jpg&fm=jpg"
    ],
    schedule: "10:00 - 19:00",
    days: "Lunes a Sabado"
  }
};

function renderFacilityInfo(sport) {

  const selectedResource =
    elements.resource?.value || "";

  const facilityKey =
    `${sport || ""}|${selectedResource}`;

  lastRenderedFacilityKey =
    facilityKey;

  const data =
    resourceFacilityData[selectedResource] ||
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

  renderOccupiedHours([]);

  document.getElementById(
    "facilityImages"
  ).innerHTML =

    data.images.map(image => `

      <img src="${image}" alt="${data.title}" onerror="this.src='Assets/img/hero-sportbook.png'; this.alt='Imagen no disponible de ${data.title}';">

    `).join("");

}


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
              ${reservationPaymentMessage(reservation.paymentMethod)}
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
            ${paymentMethodLabel(reservation.paymentMethod)}
          </p>

          ${reservation.paymentMethod === "Bizum"
            ? `
              <p class="reservation-meta">
                Bizum:
                ${BIZUM_PHONE}
              </p>
            `
            : `
              <p class="reservation-meta">
                Pago presencial en la instalacion
              </p>
            `}

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


const logoutButton =
  document.querySelector(
    "#logoutButton"
  );

logoutButton?.addEventListener(
  "click",
  async () => {

    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.error("No se pudo cerrar la sesion en el servidor", error);
    }

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

    localStorage.removeItem(
      USER_PROFILE_IMAGE_STORAGE_KEY
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


elements.bookingDate?.addEventListener(
  "change",
  updateSlotAvailability
);

function handleResourceChange() {

  updateResourceLocation();

  renderFacilityInfo(
    elements.sport.value
  );

  updateSlotAvailability();

}

function syncSelectedFacilityInfo() {

  const sport =
    elements.sport?.value || "";

  const selectedResource =
    elements.resource?.value || "";

  const facilityKey =
    `${sport}|${selectedResource}`;

  if (
    sport &&
    facilityKey !== lastRenderedFacilityKey
  ) {

    renderFacilityInfo(
      sport
    );
  }
}

elements.resource?.addEventListener(
  "change",
  handleResourceChange
);

elements.resource?.addEventListener(
  "input",
  handleResourceChange
);

elements.sport?.addEventListener(
  "change",
  updateSlotAvailability
);


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
          `${API_BASE}/admin/ayuda`,
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


document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderLoggedUser();

    loadProfileImageFromServer();

    renderPaymentInfo();

    cargarReservas();

    updateSummary();

    updateSlotAvailability();

    cargarResenas();

    setInterval(
      syncSelectedFacilityInfo,
      300
    );

  }
);

const accountModal =
  document.querySelector("#accountModal");

const accountModalTitle =
  document.querySelector("#accountModalTitle");

const accountModalClose =
  document.querySelector("#accountModalClose");

const accountCancelButton =
  document.querySelector("#accountCancelButton");

const accountProfileForm =
  document.querySelector("#accountProfileForm");

const profileImageInput =
  document.querySelector("#profileImageInput");

const removeProfileImageButton =
  document.querySelector("#removeProfileImageButton");

let selectedProfileImage =
  "";

function optimizeProfileImage(file) {

  return new Promise((resolve, reject) => {

    const image =
      new Image();

    const imageUrl =
      URL.createObjectURL(file);

    image.addEventListener(
      "load",
      () => {

        const canvas =
          document.createElement("canvas");

        const size =
          400;

        canvas.width =
          size;

        canvas.height =
          size;

        const context =
          canvas.getContext("2d");

        const scale =
          Math.max(
            size / image.width,
            size / image.height
          );

        const width =
          image.width * scale;

        const height =
          image.height * scale;

        const x =
          (size - width) / 2;

        const y =
          (size - height) / 2;

        context.drawImage(
          image,
          x,
          y,
          width,
          height
        );

        URL.revokeObjectURL(
          imageUrl
        );

        resolve(
          canvas.toDataURL(
            "image/jpeg",
            0.86
          )
        );
      }
    );

    image.addEventListener(
      "error",
      () => {
        URL.revokeObjectURL(
          imageUrl
        );

        reject(
          new Error("No se pudo procesar la imagen.")
        );
      }
    );

    image.src =
      imageUrl;
  });
}

function resetProfileImageInput() {

  selectedProfileImage =
    "";

  if (profileImageInput) {
    profileImageInput.value =
      "";
  }
}

function openAccountModal(title = "Foto de perfil") {

  if (!accountModal) return;

  if (accountModalTitle) {
    accountModalTitle.textContent =
      title;
  }

  resetProfileImageInput();
  renderLoggedUser();

  accountModal.hidden =
    false;

  userDropdown?.classList.remove("show");
}

function closeAccountModal() {

  if (accountModal) {
    accountModal.hidden =
      true;
  }
}

async function loadProfileImageFromServer() {

  try {
    const response =
      await fetch(
        `${API_BASE}/auth/profile-image`,
        {
          credentials: "include"
        }
      );

    if (response.status === 401) {
      return;
    }

    const data =
      await response.json();

    if (response.ok && data.ok) {
      if (data.profileImage) {
        localStorage.setItem(
          USER_PROFILE_IMAGE_STORAGE_KEY,
          data.profileImage
        );
      } else {
        localStorage.removeItem(
          USER_PROFILE_IMAGE_STORAGE_KEY
        );
      }

      renderLoggedUser();
    }
  } catch (error) {
    console.error(
      "No se pudo cargar la foto de perfil",
      error
    );
  }
}

document.querySelector("#viewProfileButton")?.addEventListener(
  "click",
  () => openAccountModal("Foto de perfil")
);

accountModalClose?.addEventListener(
  "click",
  closeAccountModal
);

accountCancelButton?.addEventListener(
  "click",
  closeAccountModal
);

accountModal?.addEventListener(
  "click",
  event => {
    if (event.target === accountModal) {
      closeAccountModal();
    }
  }
);

accountProfileForm?.addEventListener(
  "submit",
  async event => {
    event.preventDefault();

    if (!selectedProfileImage) {
      showToast(
        "Selecciona una imagen de perfil."
      );

      return;
    }

    try {
      const response =
        await fetch(
          `${API_BASE}/auth/profile-image`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
              profileImage:
                selectedProfileImage
            })
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
          "No se pudo guardar la foto."
        );

        return;
      }

      localStorage.setItem(
        USER_PROFILE_IMAGE_STORAGE_KEY,
        data.profileImage ||
        selectedProfileImage
      );
    } catch (error) {
      console.error(
        "No se pudo guardar la foto de perfil",
        error
      );

      showToast(
        "No se pudo guardar en tu cuenta."
      );

      return;
    }

    renderLoggedUser();
    resetProfileImageInput();
    showToast("Foto de perfil actualizada.");
    closeAccountModal();
  }
);

profileImageInput?.addEventListener(
  "change",
  async event => {

    const file =
      event.target.files?.[0];

    if (!file) {
      selectedProfileImage =
        "";

      return;
    }

    if (!file.type.startsWith("image/")) {
      resetProfileImageInput();
      showToast("Selecciona un archivo de imagen.");
      return;
    }

    try {
      selectedProfileImage =
        await optimizeProfileImage(file);

      document.querySelectorAll(
        ".account-modal .user-avatar"
      ).forEach(avatar => {
        avatar.style.backgroundImage =
          `url("${selectedProfileImage}")`;

        avatar.classList.add(
          "has-photo"
        );
      });
    } catch (error) {
      console.error(
        "No se pudo preparar la imagen de perfil",
        error
      );

      resetProfileImageInput();
      showToast(
        "No se pudo preparar esa imagen."
      );
    }
  }
);

removeProfileImageButton?.addEventListener(
  "click",
  async () => {

    try {
      const response =
        await fetch(
          `${API_BASE}/auth/profile-image`,
          {
            method: "DELETE",
            credentials: "include"
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
          "No se pudo quitar la foto."
        );

        return;
      }
    } catch (error) {
      console.error(
        "No se pudo eliminar la foto de perfil",
        error
      );

      showToast(
        "No se pudo quitar de tu cuenta."
      );

      return;
    }

    localStorage.removeItem(
      USER_PROFILE_IMAGE_STORAGE_KEY
    );

    resetProfileImageInput();
    renderLoggedUser();
    showToast("Foto de perfil eliminada.");
    closeAccountModal();
  }
);


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

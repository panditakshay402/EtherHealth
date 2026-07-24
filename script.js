// EtherHealth landing-page interactions

const firebaseConfig = {
  apiKey: "AIzaSyDjPuTIJH8ZaCT3G6xkXSvAX9XsaxWdL_8",
  authDomain: "healthcare-e994c.firebaseapp.com",
  databaseURL: "https://healthcare-e994c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "healthcare-e994c",
  storageBucket: "healthcare-e994c.appspot.com",
  messagingSenderId: "786358937864",
  appId: "1:786358937864:web:5df9a3123a71a5c832e4bd",
  measurementId: "G-XMCYW9JFF0"
};

let healthcareDB = null;

try {
  if (window.firebase) {
    firebase.initializeApp(firebaseConfig);
    healthcareDB = firebase.database().ref("healthcare");
  }
} catch (error) {
  console.warn("Firebase could not be initialized.", error);
}

const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("nav-links-mobile");
const mobileNavClose = document.getElementById("mobile-nav-close");
const mobileNavBackdrop = document.getElementById("mobile-nav-backdrop");
const appointmentButtons = document.querySelectorAll("[data-open-appointment]");
const modalOverlay = document.getElementById("modal-overlay");
const modalClose = document.getElementById("modal-close");
const appointmentForm = document.getElementById("form1");
const submitButton = document.getElementById("submit-btn");
const toast = document.getElementById("toast");
const toastTitle = document.getElementById("toast-title");
const toastMessage = document.getElementById("toast-message");
const toastClose = document.getElementById("toast-close");
const themeToggles = document.querySelectorAll("[data-theme-toggle]");
const themePreference = window.matchMedia("(prefers-color-scheme: dark)");
const reduceMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const formErrorSummary = document.getElementById("form-error-summary");
const formErrorList = document.getElementById("form-error-list");
const formFields = Array.from(appointmentForm.querySelectorAll("input, select, textarea"));
const videoToggles = document.querySelectorAll("[data-video-toggle]");
const skipLink = document.querySelector(".skip-link");
const mainContent = document.getElementById("main-content");
const siteFooter = document.querySelector("footer");

let lastModalTrigger = null;
let toastTimer = null;

function setTheme(theme, persist = true) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";

  themeToggles.forEach(function (toggle) {
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", "Dark mode");
  });

  if (persist) {
    localStorage.setItem("etherhealth-theme", isDark ? "dark" : "light");
  }
}

setTheme(document.documentElement.dataset.theme || "light", false);

themeToggles.forEach(function (toggle) {
  toggle.addEventListener("click", function () {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });
});

themePreference.addEventListener("change", function (event) {
  if (!localStorage.getItem("etherhealth-theme")) {
    setTheme(event.matches ? "dark" : "light", false);
  }
});

function setElementInert(element, inert) {
  if (!element) {
    return;
  }

  element.inert = inert;
  if (inert) {
    element.setAttribute("inert", "");
  } else {
    element.removeAttribute("inert");
  }
}

function syncInteractiveLayers() {
  const modalOpen = modalOverlay.classList.contains("active");
  const navigationOpen = mobileNav.classList.contains("open");
  const pageBlocked = modalOpen || navigationOpen;

  [skipLink, navbar, mainContent, siteFooter].forEach(function (region) {
    setElementInert(region, pageBlocked);
  });

  setElementInert(mobileNav, modalOpen || !navigationOpen);
  setElementInert(modalOverlay, !modalOpen);
}

function trapFocus(container, event) {
  if (event.key !== "Tab") {
    return;
  }

  const focusable = Array.from(
    container.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    )
  ).filter(function (element) {
    return !element.hasAttribute("hidden") && window.getComputedStyle(element).visibility !== "hidden";
  });

  if (!focusable.length) {
    event.preventDefault();
    container.focus();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function setMobileNavigation(open, restoreFocus = false) {
  hamburger.classList.toggle("active", open);
  hamburger.setAttribute("aria-expanded", String(open));
  hamburger.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  mobileNav.classList.toggle("open", open);
  mobileNav.setAttribute("aria-hidden", String(!open));
  mobileNavBackdrop.classList.toggle("is-visible", open);
  mobileNavBackdrop.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("nav-open", open);
  syncInteractiveLayers();

  if (open) {
    window.setTimeout(function () {
      mobileNavClose.focus();
    }, 60);
  } else if (restoreFocus) {
    window.setTimeout(function () {
      hamburger.focus();
    }, 60);
  }
}

hamburger.addEventListener("click", function () {
  setMobileNavigation(!mobileNav.classList.contains("open"));
});

mobileNavClose.addEventListener("click", function () {
  setMobileNavigation(false, true);
});

mobileNavBackdrop.addEventListener("click", function () {
  setMobileNavigation(false, true);
});

mobileNav.addEventListener("keydown", function (event) {
  trapFocus(mobileNav, event);
});

mobileNav.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener("click", function () {
    setMobileNavigation(false, true);
  });
});

window.addEventListener("resize", function () {
  if (window.innerWidth >= 1024 && mobileNav.classList.contains("open")) {
    setMobileNavigation(false);
  }
});

function updateNavbar() {
  navbar.classList.toggle("navbar-scrolled", window.scrollY > 18);
}

window.addEventListener("scroll", updateNavbar, { passive: true });
updateNavbar();

function openModal(event) {
  lastModalTrigger = event ? event.currentTarget : document.activeElement;

  if (mobileNav.classList.contains("open")) {
    setMobileNavigation(false);
  }

  modalOverlay.classList.add("active");
  modalOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  syncInteractiveLayers();

  window.setTimeout(function () {
    document.getElementById("name").focus();
  }, 60);
}

function closeModal(restoreFocus = true) {
  if (!modalOverlay.classList.contains("active")) {
    return;
  }

  modalOverlay.classList.remove("active");
  modalOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  syncInteractiveLayers();

  if (restoreFocus && lastModalTrigger) {
    const focusTarget = mobileNav.contains(lastModalTrigger) ? hamburger : lastModalTrigger;
    focusTarget.focus();
  }
}

appointmentButtons.forEach(function (button) {
  button.addEventListener("click", openModal);
});

modalClose.addEventListener("click", function () {
  closeModal();
});

modalOverlay.addEventListener("click", function (event) {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

modalOverlay.addEventListener("keydown", function (event) {
  trapFocus(modalOverlay, event);
});

document.addEventListener("keydown", function (event) {
  if (event.key !== "Escape") {
    return;
  }

  if (modalOverlay.classList.contains("active")) {
    closeModal();
  } else if (mobileNav.classList.contains("open")) {
    setMobileNavigation(false, true);
  }
});

function dismissToast(restoreFocus = false) {
  window.clearTimeout(toastTimer);
  const shouldRestoreFocus = restoreFocus || toast.contains(document.activeElement);

  if (shouldRestoreFocus && lastModalTrigger) {
    const focusTarget = mobileNav.contains(lastModalTrigger) ? hamburger : lastModalTrigger;
    focusTarget.focus();
  }

  toast.classList.remove("show");
  toast.setAttribute("aria-hidden", "true");
  setElementInert(toast, true);
}

function showToast(title, message, isError = false, moveFocus = false) {
  window.clearTimeout(toastTimer);
  toastTitle.textContent = title;
  toastMessage.textContent = message;
  toast.classList.toggle("is-error", isError);
  toast.setAttribute("role", isError ? "alert" : "status");
  toast.setAttribute("aria-live", isError ? "assertive" : "polite");
  toast.setAttribute("aria-hidden", "false");
  setElementInert(toast, false);
  toast.classList.add("show");

  if (moveFocus) {
    window.requestAnimationFrame(function () {
      toast.focus();
    });
  }

  if (!isError) {
    toastTimer = window.setTimeout(function () {
      dismissToast(false);
    }, 10000);
  }
}

toastClose.addEventListener("click", function () {
  dismissToast(true);
});

const fieldLabels = {
  name: "Full name",
  age: "Age",
  number: "Mobile number",
  address: "Address",
  reason: "Reason for appointment"
};

function getFieldError(field) {
  const label = fieldLabels[field.id] || "This field";

  if (field.validity.valueMissing) {
    return label + " is required.";
  }

  if (field.validity.badInput) {
    return "Enter " + label.toLowerCase() + " using numbers.";
  }

  if (field.validity.rangeUnderflow || field.validity.rangeOverflow) {
    return "Enter an age between 1 and 120.";
  }

  if (field.id === "number" && field.value.trim()) {
    const digitCount = field.value.replace(/\D/g, "").length;
    if (digitCount < 7 || digitCount > 15) {
      return "Enter a mobile number containing 7 to 15 digits.";
    }
  }

  return "";
}

function setFieldError(field, message) {
  const errorElement = document.getElementById(field.id + "-error");
  if (!errorElement) {
    return;
  }

  errorElement.textContent = message;
  if (message) {
    field.setAttribute("aria-invalid", "true");
  } else {
    field.removeAttribute("aria-invalid");
  }
}

function clearFormErrors() {
  formFields.forEach(function (field) {
    setFieldError(field, "");
  });
  formErrorSummary.hidden = true;
  formErrorList.replaceChildren();
  formErrorSummary.querySelector(".form-error-title").textContent = "Please check the following fields:";
}

function collectFormErrors() {
  return formFields.reduce(function (errors, field) {
    const message = getFieldError(field);
    setFieldError(field, message);
    if (message) {
      errors.push({ field: field, message: message });
    }
    return errors;
  }, []);
}

function showFormErrors(errors) {
  formErrorSummary.querySelector(".form-error-title").textContent = "Please check the following fields:";
  formErrorList.replaceChildren();

  errors.forEach(function (error) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#" + error.field.id;
    link.textContent = error.message;
    link.addEventListener("click", function (event) {
      event.preventDefault();
      error.field.focus();
    });
    item.appendChild(link);
    formErrorList.appendChild(item);
  });

  formErrorSummary.hidden = false;
  formErrorSummary.focus();
}

function showFormSystemError(message) {
  formErrorSummary.querySelector(".form-error-title").textContent = message;
  formErrorList.replaceChildren();
  formErrorSummary.hidden = false;
  formErrorSummary.focus();
}

formFields.forEach(function (field) {
  field.addEventListener("blur", function () {
    setFieldError(field, getFieldError(field));
  });

  field.addEventListener("input", function () {
    if (field.getAttribute("aria-invalid") === "true") {
      setFieldError(field, getFieldError(field));
    }

    if (!formErrorSummary.hidden) {
      formErrorSummary.hidden = true;
      formErrorList.replaceChildren();
    }
  });
});

appointmentForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const errors = collectFormErrors();
  if (errors.length) {
    showFormErrors(errors);
    return;
  }

  formErrorSummary.hidden = true;

  if (!healthcareDB) {
    showFormSystemError(
      "The appointment service is unavailable right now. Your information has not been sent. Please try again later."
    );
    return;
  }

  const originalButtonContent = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.textContent = "Submitting…";
  appointmentForm.setAttribute("aria-busy", "true");

  const appointment = {
    name: document.getElementById("name").value.trim(),
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    number: document.getElementById("number").value.trim(),
    address: document.getElementById("address").value.trim(),
    reason: document.getElementById("reason").value.trim(),
    timestamp: Date.now()
  };

  try {
    await healthcareDB.push(appointment);
    appointmentForm.reset();
    clearFormErrors();
    closeModal(false);
    showToast(
      "Request received",
      "Your details were sent. The care team can now follow up using your mobile number.",
      false,
      true
    );
  } catch (error) {
    console.error("Appointment request failed.", error);
    showFormSystemError(
      "Your request was not saved. Your information is still in the form; check your connection and try again."
    );
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonContent;
    appointmentForm.removeAttribute("aria-busy");
  }
});

function updateVideoToggle(button, playing) {
  const figure = button.closest(".media-card");
  const caption = figure.querySelector("figcaption span:first-child").textContent.trim().toLowerCase();
  const action = playing ? "Pause" : "Play";

  button.classList.toggle("is-playing", playing);
  button.setAttribute("aria-label", action + " " + caption + " video");
  button.querySelector("[data-video-label]").textContent = action + " video";
}

videoToggles.forEach(function (button) {
  const video = button.closest(".media-card").querySelector("video");

  if (reduceMotionPreference.matches) {
    video.autoplay = false;
    video.pause();
  }

  updateVideoToggle(button, !video.paused);

  video.addEventListener("play", function () {
    updateVideoToggle(button, true);
  });

  video.addEventListener("pause", function () {
    updateVideoToggle(button, false);
  });

  button.addEventListener("click", function () {
    if (video.paused) {
      const playAttempt = video.play();
      if (playAttempt) {
        playAttempt.catch(function () {
          updateVideoToggle(button, false);
        });
      }
    } else {
      video.pause();
    }
  });
});

reduceMotionPreference.addEventListener("change", function (event) {
  if (!event.matches) {
    return;
  }

  videoToggles.forEach(function (button) {
    button.closest(".media-card").querySelector("video").pause();
  });
});

document.addEventListener("visibilitychange", function () {
  if (!document.hidden) {
    return;
  }

  videoToggles.forEach(function (button) {
    button.closest(".media-card").querySelector("video").pause();
  });
});

syncInteractiveLayers();

const revealElements = document.querySelectorAll(".reveal");

if (reduceMotionPreference.matches || !("IntersectionObserver" in window)) {
  revealElements.forEach(function (element) {
    element.classList.add("is-visible");
  });
} else {
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach(function (element) {
    revealObserver.observe(element);
  });
}

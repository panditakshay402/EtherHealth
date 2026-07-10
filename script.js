// ===== EtherHealth — Modern Interactive Script =====

// --- Firebase Configuration ---
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

firebase.initializeApp(firebaseConfig);
var healthcareDB = firebase.database().ref("healthcare");


// --- DOM Elements ---
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const button1 = document.getElementById("bt1");
const button2 = document.getElementById("bt2");
const modalOverlay = document.getElementById("modal-overlay");
const modalClose = document.getElementById("modal-close");
const appointmentForm = document.getElementById("form1");
const toast = document.getElementById("toast");


// --- Mobile Navigation ---
hamburger.addEventListener("click", function () {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("open");
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll(".nav-link").forEach(function (link) {
  link.addEventListener("click", function () {
    hamburger.classList.remove("active");
    navLinks.classList.remove("open");
  });
});

// Mobile dropdown toggles
if (window.innerWidth <= 768) {
  document.querySelectorAll(".nav-dropdown > .nav-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentElement.classList.toggle("mobile-open");
    });
  });
}


// --- Navbar Scroll Effect ---
var lastScroll = 0;

window.addEventListener("scroll", function () {
  var currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  lastScroll = currentScroll;
});


// --- Modal Open / Close ---
function openModal() {
  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

button1.addEventListener("click", openModal);
button2.addEventListener("click", openModal);
modalClose.addEventListener("click", closeModal);

// Close on overlay backdrop click
modalOverlay.addEventListener("click", function (e) {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

// Close on Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal();
  }
});


// --- Form Submission ---
appointmentForm.addEventListener("submit", function (e) {
  e.preventDefault();

  var name = document.getElementById("name").value;
  var age = document.getElementById("age").value;
  var gender = document.getElementById("gender").value;
  var number = document.getElementById("number").value;
  var address = document.getElementById("address").value;
  var reason = document.getElementById("reason").value;

  console.log("Appointment:", name, age, gender, number, address, reason);

  // Push to Firebase
  healthcareDB.push({
    name: name,
    age: age,
    gender: gender,
    number: number,
    address: address,
    reason: reason,
    timestamp: Date.now()
  });

  // Close modal and show toast
  closeModal();
  appointmentForm.reset();
  showToast();
});


// --- Toast Notification ---
function showToast() {
  toast.classList.add("show");
  setTimeout(function () {
    toast.classList.remove("show");
  }, 4000);
}


// --- Scroll-triggered Fade-in Animations ---
var fadeElements = document.querySelectorAll(".fade-in");

var observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px"
  }
);

fadeElements.forEach(function (el) {
  observer.observe(el);
});


// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener("click", function (e) {
    var targetId = this.getAttribute("href");
    if (targetId === "#") return;

    var targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
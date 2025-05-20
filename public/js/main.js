// js/main.js

// --- Loader ---
function showLoader() {
  document.getElementById("loader-wrapper").style.display = "flex";
}

function hideLoader() {
  document.getElementById("loader-wrapper").style.display = "none";
}

window.addEventListener("load", () => {
  const loader = document.getElementById("loader-wrapper");
  loader.style.opacity = 0;
  setTimeout(() => loader.style.display = "none", 600);

 // Redirection automatique si déjà inscrit
  const numeroClient = localStorage.getItem("numeroClient");
  if (numeroClient && window.location.pathname.includes("inscription-client")) {
    window.location.href = "client.html";
  }

  const numeroConducteur = localStorage.getItem("numeroConducteur");
  if (numeroConducteur && window.location.pathname.includes("inscription-conducteur")) {
    window.location.href = "conducteur.html";
  }
});

// --- Sélection du rôle ---
function handleRoleSelection(role) {
  const confirmation = confirm(`Voulez-vous continuer en tant que ${role} ?`);
  if (confirmation) {
    const destination = role === 'client' ? 'inscription-client.html' : 'inscription-conducteur.html';
    window.location.href = destination;
  }
}

// --- Géolocalisation ---

document.addEventListener("DOMContentLoaded", () => {
  const bouton = document.getElementById("detecterPosition");
  if (bouton) {
    bouton.addEventListener("click", detecterPosition);
  }
});

function detecterPosition() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
        .then(res => res.json())
        .then(data => {
          document.getElementById("depart").value = data.display_name;
        })
        .catch(() => alert("Échec de la détection d'adresse."));
    }, () => {
      alert("Échec de la géolocalisation.");
    });
  } else {
    alert("La géolocalisation n'est pas supportée par ce navigateur.");
  }
}

// --- Enregistrement client ---
document.addEventListener("DOMContentLoaded", () => {
  const clientForm = document.getElementById("inscription-client-form");
  if (clientForm) {
    clientForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nom = document.getElementById("nom").value;
      const numero = document.getElementById("numero").value;
      const password = document.getElementById("password").value;

      localStorage.setItem("nomClient", nom);
      localStorage.setItem("numeroClient", numero);
      localStorage.setItem("motDePasseClient", password);
      window.location.href = "client.html";
    });
  }

  // --- Enregistrement conducteur ---
  const conducteurForm = document.getElementById("inscription-conducteur-form");
  if (conducteurForm) {
    conducteurForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nom = document.getElementById("nomConducteur").value;
      const numero = document.getElementById("numeroConducteur").value;
      const password = document.getElementById("passwordConducteur").value;
      const numeroTricycle = document.getElementById("numeroTricycle").value;

      localStorage.setItem("nomConducteur", nom);
      localStorage.setItem("numeroConducteur", numero);
      localStorage.setItem("motDePasseConducteur", password);
      localStorage.setItem("numeroTricycle", numeroTricycle);
      window.location.href = "conducteur.html";
    });
  }
});



// --- Animation de transition ---
document.querySelectorAll('a, button:not([type="submit"])').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    document.body.classList.add('fade-out');
    const href = el.getAttribute('href') || el.getAttribute('data-href');
    if (href) {
      setTimeout(() => window.location.href = href, 500);
    }
  });
});



window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});


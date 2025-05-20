const API_BASE_URL = "https://tricycle-app.onrender.com";
// const API_BASE_URL = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", function() {
  const clientForm = document.getElementById("inscription-client-form");
  if (clientForm) {
    clientForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const name = document.querySelector("input[placeholder='Nom complet']").value;
      const phone = document.querySelector("input[placeholder='Numéro de téléphone']").value;
      const password = document.querySelector("input[placeholder='Mot de passe']").value;

      const clientData = { name, phone, password };

      fetch(`${API_BASE_URL}/api/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      })
      .then(response => response.json())
      .then(data => {
        if (data) {
          localStorage.setItem("utilisateur", JSON.stringify({
            role: "client",
            phone: phone
          }));
          alert('Inscription réussie !');
          window.location.href = "client.html";
        } else {
          alert("Erreur d'inscription");
        }
      })
      .catch((error) => {
        console.error('Erreur:', error);
        alert("Erreur d'inscription");
      });
    });
  }
});



// gestion de commande des Utilisateurs sur la page client

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("commande-form");
  const confirmation = document.getElementById("confirmation");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const numero_telephone_client = document.getElementById("telephone").value;
    const depart = document.getElementById("depart").value;
    const destination = document.getElementById("destination").value;

    try {
      const response = await fetch(`${API_BASE_URL}/api/commandes/commander`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          numero_telephone_client,
          depart,
          destination
        })
      });

      const data = await response.json();

      if (response.ok) {
        confirmation.textContent = data.message;
        confirmation.style.display = "block";
        confirmation.style.color = "green";
        form.reset();
      } else {
        confirmation.textContent = data.message || "Erreur lors de l'envoi";
        confirmation.style.display = "block";
        confirmation.style.color = "red";
      }
    } catch (error) {
      confirmation.textContent = "Erreur réseau ou serveur.";
      confirmation.style.display = "block";
      confirmation.style.color = "red";
    }
  });
});



// gestion des commandes sur l'interface conducteur

document.addEventListener("DOMContentLoaded", () => {
  const arlettesDiv = document.getElementById("arlettes");
  if (!arlettesDiv) return;

  arlettesDiv.innerHTML = "<p>Chargement des arlettes...</p>";

  fetch(`${API_BASE_URL}/api/commandes/en-attente`)
    .then(res => res.json())
    .then(commandes => {
      if (!commandes.length) {
        arlettesDiv.innerHTML = "<p>Aucune arlette pour le moment.</p>";
        return;
      }

      arlettesDiv.innerHTML = ""; // On vide le contenu initial

      // commandes.forEach(cmd => {
      //   const card = document.createElement("div");
      //   card.classList.add("arlette");

      //   card.innerHTML = `
      //     <p><strong>Client :</strong> ${cmd.numero_telephone_client}</p>
      //     <p><strong>Départ :</strong> ${cmd.depart}</p>
      //     <p><strong>Destination :</strong> ${cmd.destination}</p>
      //     <button onclick="repondreCommande('${cmd._id}', 'acceptée')">Accepter</button>
      //     <button onclick="repondreCommande('${cmd._id}', 'refusée')">Refuser</button>
      //     <hr>
      //   `;

      //   arlettesDiv.appendChild(card);
      // });
    
    commandes.forEach(cmd => {
  const card = document.createElement("div");
  card.classList.add("arlette");

  const clientInfo = document.createElement("p");
  clientInfo.innerHTML = `<strong>Client :</strong> ${cmd.numero_telephone_client}`;

  const departInfo = document.createElement("p");
  departInfo.innerHTML = `<strong>Départ :</strong> ${cmd.depart}`;

  const destinationInfo = document.createElement("p");
  destinationInfo.innerHTML = `<strong>Destination :</strong> ${cmd.destination}`;

  const accepterBtn = document.createElement("button");
  accepterBtn.textContent = "Accepter";
  accepterBtn.addEventListener("click", () => {
    repondreCommande(cmd._id, "acceptée");
  });

  const refuserBtn = document.createElement("button");
  refuserBtn.textContent = "Refuser";
  refuserBtn.addEventListener("click", () => {
    repondreCommande(cmd._id, "refusée");
  });

  const separator = document.createElement("hr");

  card.appendChild(clientInfo);
  card.appendChild(departInfo);
  card.appendChild(destinationInfo);
  card.appendChild(accepterBtn);
  card.appendChild(refuserBtn);
  card.appendChild(separator);

  arlettesDiv.appendChild(card);
});

    
    })
    .catch(error => {
      console.error("Erreur lors du chargement des arlettes :", error);
      arlettesDiv.innerHTML = "<p>Erreur lors du chargement des arlettes.</p>";
    });
});



// function repondreCommande(id, statut) {
//   const utilisateur = JSON.parse(localStorage.getItem("utilisateur"));
//   if (!utilisateur || !utilisateur._id) {
//     alert("Utilisateur non connecté ou ID manquant");
//     return;
//   }

//   fetch(`${API_BASE_URL}/api/commandes/${id}/statut`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       statut,
//       conducteurId: utilisateur._id
//     })
//   })
//   .then(res => res.json())
//   .then(data => {
//     alert(`Commande ${statut}`);
//     window.location.reload();
//   })
//   .catch(err => {
//     alert("Une erreur est survenue.");
//     console.error(err);
//   });
// }


window.repondreCommande=function (id, statut) {
  const conducteur = JSON.parse(localStorage.getItem("utilisateur"));

  fetch(`${API_BASE_URL}/api/commandes/${id}/statut`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      statut,
      conducteurId: conducteur._id
    })
  })
  .then(res => res.json())
  .then(data => {
    alert(`Commande : ${statut}`);
    window.location.reload();
  })
  .catch(err => {
    alert("Une erreur est survenue.");
    console.error(err);
  });
}

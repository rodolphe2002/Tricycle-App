const conducteurForm = document.getElementById("inscription-conducteur-form");

if (conducteurForm) {
  conducteurForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.querySelector("input[placeholder='Nom complet']").value;
    const phone = document.querySelector("input[placeholder='Numéro de téléphone']").value;
    const password = document.querySelector("input[placeholder='Mot de passe']").value;
    const tricycleNumber = document.querySelector('input[placeholder="Numéro du tricycle"]').value;

    const conducteurData = { name, phone, password, tricycleNumber };

    fetch('http://localhost:5000/api/conducteurs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(conducteurData),
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          // Erreur HTTP : on affiche le message d'erreur du serveur
          const message = data.message || "Erreur inconnue";
          throw new Error(message);
        }

        // Ici, on suppose que le back renvoie { conducteur: { _id, phone } }
        const conducteur = data.conducteur || data;

        if (conducteur.phone && conducteur._id) {
          localStorage.setItem("utilisateur", JSON.stringify({
            role: "conducteur",
            phone: conducteur.phone,
            _id: conducteur._id
          }));

          alert('Inscription réussie !');
          window.location.href = "conducteur.html";
        } else {
          throw new Error("Informations de conducteur manquantes.");
        }
      })
      .catch((error) => {
        console.error('Erreur:', error);
        alert(`Erreur d'inscription : ${error.message}`);
      });
  });
}

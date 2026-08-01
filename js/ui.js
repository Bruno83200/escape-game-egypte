// js/ui.js

export const UI = {
    // 1. Affiche un message simple avec IMAGE OPTIONNELLE
    message: function(text, callback = null, imagePath = null) {
        const modal = document.getElementById('custom-modal');
        const modalText = document.getElementById('modal-text');
        const inputArea = document.getElementById('modal-input-area');
        const modalBtn = document.getElementById('modal-btn');
        const modalImg = document.getElementById('modal-illustration');

        // Nettoyage systématique
        if (modalImg) {
            modalImg.src = "";
            modalImg.style.display = 'none';
        }

        modalText.innerText = text;
        if (inputArea) inputArea.style.display = 'none';

        // Affichage de l'image si fournie
        if (imagePath && modalImg) {
            modalImg.src = imagePath;
            modalImg.onload = () => { modalImg.style.display = 'block'; };
        }

        modal.style.display = 'flex';

        modalBtn.onclick = () => {
            modal.style.display = 'none';
            if (callback) callback();
        };
    },

    // 2. Affiche une question avec champ de saisie et IMAGE OPTIONNELLE
    ask: function(text, callback, imagePath = null) {
        const modal = document.getElementById('custom-modal');
        const modalText = document.getElementById('modal-text');
        const inputArea = document.getElementById('modal-input-area');
        const inputField = document.getElementById('modal-input-field');
        const modalBtn = document.getElementById('modal-btn');
        const modalImg = document.getElementById('modal-illustration');

        // Nettoyage systématique
        if (modalImg) {
            modalImg.src = "";
            modalImg.style.display = 'none';
        }

        modalText.innerText = text;
        if (inputArea) inputArea.style.display = 'block';

        // Affichage de l'image si fournie
        if (imagePath && modalImg) {
            modalImg.src = imagePath;
            modalImg.onload = () => { modalImg.style.display = 'block'; };
        }

        if (inputField) {
            inputField.value = "";
            modal.style.display = 'flex';
            inputField.focus();
        }

        modalBtn.onclick = () => {
            const val = inputField.value;
            modal.style.display = 'none';
            callback(val);
        };
    },

    // 3. Affiche la modale d'objet trouvé (inchangée)
    showItem: function(title, text, imagePath, callback = null) {
        const modal = document.getElementById('item-modal');
        const modalTitle = document.getElementById('item-modal-title');
        const modalText = document.getElementById('item-modal-text');
        const modalImg = document.getElementById('item-modal-img');
        const modalBtn = document.getElementById('item-modal-btn');

        if (modalTitle) modalTitle.innerText = title;
        if (modalText) modalText.innerText = text;
        if (modalImg) modalImg.src = imagePath;
        
        modal.style.display = 'flex';

        modalBtn.onclick = () => {
            modal.style.display = 'none';
            if (callback) callback();
        };
    }
};

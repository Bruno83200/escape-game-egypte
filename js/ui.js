// js/ui.js

export const UI = {
    // 1. Affiche un message simple sur le parchemin
    message: function(text, callback = null) {
        const modal = document.getElementById('custom-modal');
        const modalText = document.getElementById('modal-text');
        const inputArea = document.getElementById('modal-input-area');
        const modalBtn = document.getElementById('modal-btn');

        modalText.innerText = text;
        if (inputArea) inputArea.style.display = 'none'; // On cache le champ de saisie
        modal.style.display = 'flex';

        modalBtn.onclick = () => {
            modal.style.display = 'none';
            if (callback) callback();
        };
    },

    // 2. Affiche une question avec un champ de saisie et une IMAGE OPTIONNELLE
    ask: function(text, callback, imagePath = null) {
        const modal = document.getElementById('custom-modal');
        const modalText = document.getElementById('modal-text');
        const inputArea = document.getElementById('modal-input-area');
        const inputField = document.getElementById('modal-input-field');
        const modalBtn = document.getElementById('modal-btn');
        const modalImg = document.getElementById('modal-illustration');

        // --- CORRECTION ICI : On vide l'image et on la cache d'abord ---
        if (modalImg) {
            modalImg.src = ""; 
            modalImg.style.display = 'none';
        }

        modalText.innerText = text;
        
        if (imagePath && modalImg) {
            modalImg.src = imagePath;
            // On attend que l'image soit chargée pour l'afficher proprement
            modalImg.onload = () => { modalImg.style.display = 'block'; };
        }

        if (inputArea) inputArea.style.display = 'block';
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

    // 3. Affiche la modale spéciale quand on trouve un objet
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

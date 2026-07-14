// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// Configuración de Firebase

const firebaseConfig = {

    apiKey: "AIzaSyBncN2OSr2sng6gCYZaCEXuBnPa6ofqBLk",

    authDomain: "ahorros-flash-pr.firebaseapp.com",

    projectId: "ahorros-flash-pr",

    storageBucket: "ahorros-flash-pr.firebasestorage.app",

    messagingSenderId: "759212971789",

    appId: "1:759212971789:web:a22eb96b46815a1512c244"

};

// Inicializar

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// Exportar

export { db };

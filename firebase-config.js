// Firebase-oppsett fra Firebase-konsollen (Project settings → Your apps).
// Verdiene er ikke hemmelige. Tilgangen styres av sikkerhetsreglene i Firestore,
// som bare slipper inn én bestemt Google-konto.
export const firebaseConfig = {
  apiKey: "AIzaSyCD0f-cF8bvFcZhZd7O3n8eXy55fwQqFwQ",
  authDomain: "amsterdam2027.firebaseapp.com",
  projectId: "amsterdam2027",
  storageBucket: "amsterdam2027.firebasestorage.app",
  messagingSenderId: "516416369747",
  appId: "1:516416369747:web:8cd0fca5feb7ca48d5c2a6"
};

// Valgfritt: e-postadressen som får logge inn, for en tydeligere feilmelding på siden.
// Står tom fordi repoet er offentlig. Reglene i Firestore stenger uansett alle andre kontoer ute.
export const allowedEmail = "";

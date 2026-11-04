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

// Web client ID fra Firebase: Authentication → Sign-in method → Google → Web SDK configuration.
// Brukes av Googles egen innloggingsknapp, som også virker i Safari på iPhone.
export const googleClientId = "342198081819-n2tvaflb5ogcrp9jmjc0hcicrhv4dprp.apps.googleusercontent.com";

// Valgfritt: e-postadressen som får logge inn, for en tydeligere feilmelding på siden.
// Står tom fordi repoet er offentlig. Reglene i Firestore stenger uansett alle andre kontoer ute.
export const allowedEmail = "";

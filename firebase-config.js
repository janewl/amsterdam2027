// Firebase-oppsett. Lim inn firebaseConfig fra Firebase-konsollen (Prosjektinnstillinger → Dine apper).
// Verdiene er ikke hemmelige. Tilgangen styres av sikkerhetsreglene i firestore.rules,
// som bare slipper inn e-postadressen under.
export const firebaseConfig = null;

// Den eneste Google-kontoen som får logge inn.
export const allowedEmail = "";

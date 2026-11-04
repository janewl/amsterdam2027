# Mot Amsterdam 2027

Treningsplan og treningslogg mot Amsterdam halvmaraton 2027. Siden ligger på https://janewl.github.io/amsterdam2027/.

## Filer

| Fil | Innhold |
|---|---|
| `index.html` | Siden: tekst, stiler og øktvisning |
| `js/plan.js` | Ukeplan, faser og resept (sett, reps, RIR) per øvelse |
| `js/exercises.js` | Øvelsesbibliotek: figurer, teknikk, loggtype og pausetid |
| `js/session.js` | Aktiv økt: logging, notater, forslag til vekt og pausetimer |
| `js/store.js` | Lagring: Firestore med Google-innlogging, ellers nettleseren |
| `firebase-config.js` | Firebase-oppsett og tillatt e-postadresse |
| `firestore.rules` | Sikkerhetsregler som limes inn i Firebase-konsollen |

## Data i Firestore

Alt ligger under `users/{uid}/`:

- `state/progress`: avkrysninger i ukeplanen
- `state/active`: økta som er i gang
- `sessions/{id}`: hver økt med alle sett
- `exercises/{id}`: notat og siste logg per øvelse

## Oppsett av Firebase

1. Opprett et prosjekt på https://console.firebase.google.com (Google Analytics kan slås av).
2. **Authentication** → Kom i gang → **Google** → Aktiver.
3. **Authentication → Settings → Authorized domains** → legg til `janewl.github.io`.
4. **Firestore Database** → Opprett database → lokasjon `eur3 (europe-west)` → production mode.
5. **Firestore → Rules** → lim inn `firestore.rules` med din e-postadresse → Publish.
6. **Prosjektinnstillinger → Dine apper → Web** → registrer appen og kopier `firebaseConfig` inn i `firebase-config.js`, sammen med e-postadressen i `allowedEmail`.

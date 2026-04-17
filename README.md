# AutoHistorique 🚗

Plateforme de vérification de l'historique d'accidents de véhicules d'occasion au Maroc.

## Stack Technique

| Couche     | Technologie                        |
|------------|------------------------------------|
| Frontend   | Angular 17 (standalone, lazy load) |
| Backend    | Node.js + Express                  |
| Base de données | MongoDB (Mongoose)            |
| Auth       | JWT + bcryptjs                     |
| CSS        | CSS natif (pas de SCSS)            |

---

## Structure du projet

```
autohistorique/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── immatriculation.helper.js   # Validation regex immat. marocaine
│   │   │   └── seed.js                     # Données de test
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── vehicle.controller.js
│   │   │   └── accident.controller.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js          # JWT protect + adminOnly
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── vehicle.model.js
│   │   │   └── accident.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── vehicle.routes.js
│   │   │   └── accident.routes.js
│   │   └── server.js
│   ├── .env.development
│   ├── .env.production
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── core/
    │   │   │   ├── guards/
    │   │   │   │   └── auth.guard.ts       # AuthGuard, AdminGuard, NoAuthGuard
    │   │   │   ├── interceptors/
    │   │   │   │   └── jwt.interceptor.ts  # Injection token Bearer automatique
    │   │   │   └── services/
    │   │   │       ├── auth.service.ts
    │   │   │       ├── vehicle.service.ts
    │   │   │       └── accident.service.ts
    │   │   ├── features/
    │   │   │   ├── auth/
    │   │   │   │   ├── login/
    │   │   │   │   ├── register/
    │   │   │   │   └── auth.css
    │   │   │   ├── dashboard/
    │   │   │   ├── search/
    │   │   │   └── report/
    │   │   ├── shared/
    │   │   │   ├── components/navbar/
    │   │   │   ├── models/index.ts
    │   │   │   └── pipes/replace.pipe.ts
    │   │   ├── app.component.ts
    │   │   ├── app.config.ts
    │   │   └── app.routes.ts
    │   ├── environments/
    │   │   ├── environment.ts              # DEV  → localhost:3000
    │   │   └── environment.production.ts   # PROD → votre-domaine.ma
    │   ├── styles.css
    │   ├── index.html
    │   └── main.ts
    ├── angular.json
    ├── tsconfig.json
    └── package.json
```

---

## Démarrage rapide

### 1. Backend

```bash
cd backend
npm install

# Lancer en développement
NODE_ENV=development npm run dev

# Insérer les données de test
NODE_ENV=development npm run seed
```

**Comptes de démo après seed :**
- Admin : `admin@autohistorique.ma` / `admin123`
- User  : `user@autohistorique.ma`  / `user123`

### 2. Frontend

```bash
cd frontend
npm install

# Lancer en développement (pointe vers localhost:3000)
npm start

# Build production
npm run build:prod
```

---

## Formats d'immatriculation acceptés

| Type       | Format       | Exemple         | Regex                        |
|------------|--------------|-----------------|------------------------------|
| Classique  | XXXXXX/L/XX  | `123456-A-78`   | `/^(\d{1,6})([A-Z])(\d{2})$/` |
| Transit W  | XXXXX/WW/X   | `12345-WW`    | `/^(\d{1,5})(WW)(\d{1})$/`   |

La saisie est flexible : tirets, espaces et points sont ignorés. La casse est normalisée automatiquement.

---

## API Endpoints

### Auth
| Méthode | Route            | Description       | Auth |
|---------|------------------|-------------------|------|
| POST    | /api/auth/login    | Connexion          | ✗    |
| POST    | /api/auth/register | Inscription        | ✗    |
| GET     | /api/auth/me       | Profil connecté    | ✓    |

### Véhicules
| Méthode | Route                        | Description             | Auth  |
|---------|------------------------------|-------------------------|-------|
| GET     | /api/vehicles/:immatriculation | Recherche + accidents  | User  |
| GET     | /api/vehicles/stats           | Statistiques globales   | User  |
| POST    | /api/vehicles                 | Créer véhicule          | Admin |

### Accidents
| Méthode | Route           | Description      | Auth  |
|---------|-----------------|------------------|-------|
| GET     | /api/accidents  | Lister accidents | User  |
| POST    | /api/accidents  | Créer accident   | Admin |

---

## Design System

- **Fonts** : Syne (titres) + DM Sans (corps)
- **Couleurs** :
  - Primaire : `#0A0E1A` (dark navy)
  - Accent   : `#EC6F3B` (orange) → `#F59E0B` (amber)
  - Fond     : `#F7F8FA`
- **Composants** : CSS natif, pas de framework UI
- **Responsive** : mobile-first, breakpoints 480 / 700 / 900px
- **Print** : rapport imprimable via `window.print()`

---

## Variables d'environnement backend

| Variable        | Dev                            | Prod                          |
|-----------------|-------------------------------|-------------------------------|
| `NODE_ENV`      | development                    | production                    |
| `PORT`          | 3000                           | 3000                          |
| `MONGO_URI`     | mongodb://localhost:27017/...  | mongodb+srv://...             |
| `JWT_SECRET`    | dev_secret_...                 | (secret fort à générer)       |
| `JWT_EXPIRES_IN`| 24h                            | 8h                            |
| `FRONTEND_URL`  | http://localhost:4200          | https://votre-domaine.ma      |

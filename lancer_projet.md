# Guide pour lancer le projet Todo App (Backend + Frontend)

Voici toutes les commandes nécessaires pour initialiser et lancer le projet correctement sur votre machine en environnement de développement.

---

## 1. Préparation globale et Base de données (Docker)

Le projet utilise Docker pour faire tourner les bases de données (MySQL, Redis, MongoDB).

Depuis la racine du projet (là où se trouve ce fichier) :

1. Copiez le fichier d'environnement racine :
   ```sh
   cp .env.example .env
   ```

2. Lancez les services Docker en arrière-plan :
   ```sh
   docker compose up -d
   ```

*(Pour arrêter les bases de données plus tard : `docker compose down`)*

---

## 2. Lancer le Backend (Node.js/Express)

Le backend utilise MySQL par défaut et tourne sur Node.js 20+.

Ouvrez un nouveau terminal, puis :

1. Allez dans le dossier backend :
   ```sh
   cd backend
   ```

2. Installez les dépendances :
   ```sh
   npm install
   ```

3. Copiez le fichier d'environnement du backend :
   ```sh
   cp .env.example .env
   ```
   *(Le fichier `.env` contiendra `DB_URL="mysql://app_user:app_password@localhost:3306/db_todoapp"` qui correspond aux identifiants par défaut du Docker)*

4. Lancez le serveur en mode développement :
   ```sh
   npm run dev
   ```
   *(Note : si vous prévoyez de lancer les tests e2e du frontend, utilisez plutôt `npm run dev:e2e` pour activer la route de réinitialisation de la DB).*

---

## 3. Lancer le Frontend (Vue 3/Vite)

Ouvrez un nouveau terminal, puis :

1. Allez dans le dossier frontend :
   ```sh
   cd frontend
   ```

2. Installez les dépendances :
   ```sh
   npm install
   ```

3. Lancez le serveur de développement :
   ```sh
   npm run dev
   ```

---

## Accéder à l'application
Une fois le backend et le frontend lancés, l'application frontend devrait être accessible dans votre navigateur (généralement à l'adresse http://localhost:5173, vérifiez le terminal du frontend pour l'URL exacte).

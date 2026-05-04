# Guide Complet : Migration du Projet Todo App vers MongoDB et Redis

Ce document explique étape par étape comment migrer le backend actuel (qui utilise MySQL) vers **MongoDB** (base de données orientée documents) et comment intégrer **Redis** pour gérer un système de cache.

**Note :** L'infrastructure Docker du projet contient déjà les conteneurs pour MongoDB et Redis. Il n'est donc pas nécessaire d'installer ces outils directement sur votre machine, Docker s'en charge !

---

## 🔬 Phase 1 : Préparation de l'environnement (MongoDB & Redis)

Vos conteneurs Docker pour MongoDB et Redis sont déjà configurés dans le fichier `docker-compose.yaml`. 

### 1. Démarrer l'infrastructure
Assurez-vous que vos conteneurs tournent :
```sh
docker compose up -d
```

### 2. Se connecter à MongoDB via `mongosh`
`mongosh` est le shell interactif de MongoDB. Puisque MongoDB tourne dans Docker, la meilleure façon de s'y connecter est d'exécuter `mongosh` directement à l'intérieur du conteneur.

**Commande pour se connecter en tant qu'administrateur :**
```sh
docker exec -it mongo mongosh -u admin_user -p admin_pwd
```
*(Remplacez `admin_user` et `admin_pwd` par les valeurs de votre `.env` si vous les avez changées).*

### 3. Commandes Utiles MongoDB (Cheatsheet)
Une fois dans `mongosh`, voici les commandes indispensables :

**Gestion des bases de données :**
- `show dbs` : Affiche toutes les bases de données.
- `use db_todoapp` : Crée (virtuellement) et bascule sur la base de données `db_todoapp`.
- `db.dropDatabase()` : Supprime la base de données actuelle.

**Gestion des collections (équivalent des tables) :**
- `show collections` : Affiche les collections de la DB actuelle.
- `db.createCollection("users")` : Crée une collection `users`.

**CRUD basique (Créer, Lire, Mettre à jour, Supprimer) :**
- `db.users.insertOne({ email: "test@test.com", password: "123" })` : Ajoute un document.
- `db.users.find()` : Récupère tous les documents de la collection.
- `db.users.find().pretty()` : Récupère tous les documents (formaté).
- `db.users.find({ email: "test@test.com" })` : Cherche un document spécifique.
- `db.users.updateOne({ email: "test@test.com" }, { $set: { password: "new" } })` : Met à jour un document.
- `db.users.deleteOne({ email: "test@test.com" })` : Supprime un document.
- `exit` : Quitter mongosh.

### 4. Se connecter à Redis
Pour vérifier que Redis fonctionne et voir son contenu :
```sh
docker exec -it redis redis-cli -a admin_pwd
```
Commandes utiles Redis :
- `PING` : Doit répondre "PONG".
- `KEYS *` : Liste toutes les clés en cache.
- `FLUSHALL` : Vide tout le cache.

---

## 🛠️ Phase 2 : Modification des Dépendances du Backend

Actuellement, le projet utilise des bibliothèques pour MySQL et SQLite. Il faut les remplacer.

1. Allez dans le dossier backend :
   ```sh
   cd backend
   ```
2. **Désinstaller les anciens packages SQL** (ex: `mysql2`, `sequelize` ou autre ORM utilisé) :
   ```sh
   npm uninstall mysql2 sequelize sqlite3
   ```
3. **Installer les packages MongoDB et Redis :**
   ```sh
   npm install mongoose redis
   ```
   *Note : `mongoose` est l'ORM (ODM) le plus populaire pour interagir avec MongoDB en Node.js.*
4. **Installer le package pour les tests (recommandé dans le README) :**
   ```sh
   npm install --save-dev mongodb-memory-server
   ```

---

## 🔌 Phase 3 : Connexion à MongoDB dans le Code

Il faudra modifier le fichier gérant la connexion à la base de données (généralement `backend/config/database.js` ou similaire).

**Étapes à réaliser dans le code :**
1. Supprimer toute la configuration MySQL/SQLite.
2. Importer `mongoose`.
3. Configurer la connexion selon l'environnement (`NODE_ENV`) :
   - **En dev/prod :** Se connecter à l'URL de MongoDB définie dans `.env` (ex: `mongodb://admin_user:admin_pwd@localhost:27017/db_todoapp?authSource=admin`).
   - **En test (`NODE_ENV === 'test'`) :** Instancier `MongoMemoryServer` pour créer une base de données temporaire en RAM (ce qui remplace le rôle de SQLite).

---

## 🏗️ Phase 4 : Migration des Modèles de Données

En SQL, vous aviez des tables strictes. En MongoDB, vous aurez des **Schémas Mongoose**.

**Ce qu'il faut changer (généralement dans `backend/models/`) :**
1. **Modèle User :**
   Créer un `new mongoose.Schema(...)` avec les champs `username`, `email`, `password`.
2. **Modèle Todo :**
   Créer un schéma avec `title`, `description`, `status` (ou `completed`), et surtout une relation vers l'utilisateur. En MongoDB, on utilise une référence (`ObjectId`) :
   ```javascript
   // Exemple de conception (ne pas copier coller aveuglément)
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
   ```

---

## 🔄 Phase 5 : Refactorisation des Contrôleurs / Repositories

C'est la partie la plus longue. Vous devez aller dans vos contrôleurs (`backend/controllers/`) et changer toutes les requêtes SQL en requêtes Mongoose.

**Équivalences SQL -> Mongoose :**
- `Model.findAll()` -> `Model.find()`
- `Model.findByPk(id)` -> `Model.findById(id)`
- `Model.findOne({ where: { email } })` -> `Model.findOne({ email })`
- `Model.create(...)` -> `const doc = new Model(...); await doc.save();` ou `Model.create(...)`
- `Model.update(...)` -> `Model.findByIdAndUpdate(id, { ... })`
- `Model.destroy(...)` -> `Model.findByIdAndDelete(id)`

*Attention : Les ID en MongoDB s'appellent `_id` et non `id` ! Il faudra adapter les retours d'API pour que le frontend ne soit pas perturbé (ou adapter le frontend pour utiliser `_id`).*

---

## ⚡ Phase 6 : Implémentation du Cache Redis

Le README mentionne "implementing a frontend page cache using the Redis key-value NoSQL database". Cela se traduit généralement par du cache au niveau de l'API Backend pour accélérer les requêtes récurrentes (comme la liste des Todos).

**Comment faire :**
1. Créer un fichier `backend/config/redis.js` pour initialiser la connexion avec le package `redis` en utilisant l'URL `redis://:admin_pwd@localhost:6379`.
2. Créer un middleware (ex: `backend/middlewares/cache.js`).
3. **Logique du cache :**
   - Lorsqu'une requête GET (ex: `/api/todos`) arrive, vérifier si la clé `todos_user_X` existe dans Redis.
   - Si OUI : retourner les données de Redis directement (ultra rapide).
   - Si NON : interroger MongoDB, récupérer les données, les sauvegarder dans Redis (avec un `expire` pour qu'elles expirent au bout de X minutes), puis les renvoyer au frontend.
4. **Invalidation du cache :**
   - Dès que le frontend fait un POST, PUT ou DELETE sur un Todo, il faut supprimer la clé correspondante dans Redis (`redisClient.del(...)`) pour que la prochaine requête GET aille chercher les données fraîches en base.

---

## ✅ Phase 7 : Vérification globale

1. **Lancer les tests :** Exécutez `npm run test` (si configuré) pour voir si les routes fonctionnent avec `mongodb-memory-server`.
2. **Tester le frontend :** Lancez l'application (`npm run dev` pour back et front) et utilisez l'application normalement. Si la création de compte, le login et la gestion des todos fonctionnent, la migration vers MongoDB est réussie !
3. **Vérifier Redis :** Allez dans le terminal `redis-cli` (voir Phase 1) et tapez `KEYS *` après avoir affiché la page des Todos. Vous devriez voir les clés de cache apparaitre.
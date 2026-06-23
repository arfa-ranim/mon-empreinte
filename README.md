# Mon Empreinte

Site web complet pour **Mon Empreinte**, marque artisanale à Tunis — produits faits main, ateliers créatifs, commandes WhatsApp et tableau de bord admin.

## Fonctionnalités

- **Site public** : accueil, produits, ateliers, galerie, à propos, contact
- **Commandes WhatsApp** : messages pré-remplis avec nom et prix
- **Admin** (`/admin`) : gestion CRUD des produits et ateliers
- **Base de données** : Prisma + SQLite (dev) / PostgreSQL (production)
- **Upload d'images** : stockage local dans `public/uploads`

## Démarrage rapide

```bash
# Installer les dépendances
npm install

# Créer la base de données et les données de démo
npm run db:setup

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

### Accès admin

- URL : [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Email : `admin@monempreinte.tn`
- Mot de passe : `admin123`

> Changez ces identifiants en production via les variables `ADMIN_EMAIL` et `ADMIN_PASSWORD` dans `.env`, puis relancez `npm run db:seed`.

## Variables d'environnement

Copiez `.env.example` vers `.env` :

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL de la base de données |
| `JWT_SECRET` | Secret pour les sessions admin |
| `ADMIN_EMAIL` | Email admin initial |
| `ADMIN_PASSWORD` | Mot de passe admin initial |

## Déploiement sur Vercel

SQLite ne fonctionne pas en serverless. Pour la production :

1. Créez une base **PostgreSQL** sur [Neon](https://neon.tech) ou [Supabase](https://supabase.com)
2. Dans `prisma/schema.prisma`, changez `provider` de `sqlite` à `postgresql`
3. Définissez `DATABASE_URL` sur Vercel
4. Ajoutez `JWT_SECRET` et les variables admin
5. Dans le build command : `prisma db push && prisma generate && next build`
6. Exécutez le seed une fois : `npx tsx prisma/seed.ts`

> **Note** : les images uploadées en local ne persistent pas sur Vercel. Pour la production, intégrez [Cloudinary](https://cloudinary.com) ou [Vercel Blob](https://vercel.com/docs/storage/vercel-blob).

## Structure

```
src/
  app/           # Pages et API routes
  components/    # Composants réutilisables
  lib/           # Utilitaires, auth, Prisma
prisma/          # Schéma et seed
public/          # Assets statiques et uploads
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Accueil |
| `/produits` | Catalogue produits |
| `/produits/[id]` | Détail produit |
| `/ateliers` | Liste des ateliers |
| `/galerie` | Galerie masonry |
| `/a-propos` | Histoire et valeurs |
| `/contact` | Formulaire + WhatsApp |
| `/admin` | Tableau de bord |

## Contact WhatsApp

Numéro : **+216 93 494 954**

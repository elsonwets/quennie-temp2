# Quennie — Home Concept & Interior Design

Site vitrine (TanStack Start + Three.js), entièrement pré-rendu en HTML statique.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # pré-rend toutes les pages + sitemap.xml dans dist/client
```

## Structure

| Fichier | Rôle |
| --- | --- |
| `src/content.ts` | **Tout le contenu** : textes, services, projets, avis, WhatsApp, réseaux |
| `src/seo.ts` | Meta / Open Graph / JSON-LD (LocalBusiness, portfolio, breadcrumbs) |
| `src/three/curtain.ts` | Rideau en soie WebGL du hero (shader procédural, 1 seul quad) |
| `src/three/room.ts` | Salon 3D qui se construit au scroll (section « Processo ») |
| `src/routes/` | `/`, `/projetos`, `/projetos/$slug`, `/contacto` |
| `src/styles.css` | Tokens OKLCH (lin & terracotta), typo, animations |

## Avant la mise en ligne

1. **Photos** : les images des projets sont des placeholders Unsplash → remplacer par les vraies photos (dans `content.ts`).
2. **Avis clients** : brouillons → remplacer par de vrais avis (Google, WhatsApp).
3. **Domaine** : remplacer `https://www.quennie.com` dans `src/content.ts`, `vite.config.ts` et `public/robots.txt`.

## Performance

- HTML statique pré-rendu, JS principal ~115 KB gzip.
- Three.js (~140 KB gzip) chargé en différé, après le premier affichage ; un rideau en CSS s'affiche instantanément.
- Les rendus WebGL se mettent en pause hors de l'écran ; DPR plafonné.
- Smooth scroll via Lenis ; respecte `prefers-reduced-motion`.

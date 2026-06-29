# Bricolapp DR

Application React + TypeScript + Vite pour piloter un chantier et calculer les besoins DR.

## Installation

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## PWA

L'application fournit un manifeste web et un service worker en production.

```bash
npm run build
npm run preview
```

Le service worker met en cache le shell applicatif et les ressources du même domaine après leur première lecture. Les données métier restent stockées localement dans le navigateur.

## Notes

- Route principale : `/`
- Pages : `Home`, `Chantier`, `Piece`, `Modules`, `Devis`
- État persistant stocké dans `localStorage` sous la clé `bricochantier_state_v0`
- Côté front uniquement, sans backend ni API externe
- Les calculs DR sont implémentés dans `src/dr/drCore.ts`, `src/dr/drEngine.ts` et `src/dr/drTotals.ts`

## Bonnes pratiques

- Ne pas committer `node_modules/`
- Vérifier que la donnée locale est valide, car le projet recharge l’état depuis le navigateur

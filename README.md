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

## Notes

- Route principale : `/`
- Pages : `Home`, `Chantier`, `Piece`, `Modules`, `Devis`
- État persistant stocké dans `localStorage` sous la clé `bricochantier_state_v0`
- Côté front uniquement, sans backend ni API externe
- Les calculs DR sont implémentés dans `src/dr/drCore.ts`, `src/dr/drEngine.ts` et `src/dr/drTotals.ts`

## Bonnes pratiques

- Ne pas committer `node_modules/`
- Vérifier que la donnée locale est valide, car le projet recharge l’état depuis le navigateur

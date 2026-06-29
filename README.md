# Tableau de bord OVP — refonte React progressive

## Analyse préalable du fichier actuel
Le fichier disponible dans le dépôt est `OVP_ultimateV6_49_dashboard_sous_ligne_niveau_secondaire.html` (5 069 lignes). Le fichier demandé `Tableau de bord V8(1).html` n'était pas présent ; ce fichier V6/V8-like a donc été utilisé comme source applicative historique.

### Fonctionnalités détectées
- Navigation principale : saisie d'intention, dashboard global, déploiement, déploiement global, communication.
- Saisie d'intention : formulaire complet, aide « mise en place », niveaux supplémentaires, candidature, priorité, ajout/réinitialisation.
- Gestion des intentions : liste, édition, suppression, compteur, titre du plan, import HTML, export OVP/XLSX, import Excel avec revue et validation.
- Dashboard : KPI, coût total, coût moyen, enveloppe, graphiques Chart.js, tableau détaillé, statuts et commentaires.
- Déploiement : import Excel, mapping colonnes, règles de modalité, auto-association, recalcul, vue dispositif, exports JSON/XLSX.
- Déploiement global : sélection multi-dispositifs, filtres, chips, agrégats heures/effectifs/déplacements.
- Communication Drupal : génération HTML, import/coller HTML OVP, éditeur visuel, copie et téléchargement.
- Sauvegarde/reprise : export/import JSON, export HTML, capture, hydratation depuis données embarquées.
- Tutoriel : modale, checklist, boutons de navigation.

### Architecture React proposée et amorcée
```text
src/
  App.tsx
  components/
    Layout.tsx
    ui/aceternity/
      BackgroundBeams.tsx
      MovingBorder.tsx
      StatefulButton.tsx
  hooks/
    useLegacyDashboard.ts
  services/
    legacyAdapter.ts
    quality.ts
  types.ts
public/
  legacy-ovp-dashboard.html
```

Cette première migration conserve le moteur métier historique dans `public/legacy-ovp-dashboard.html` et ajoute une coquille React/TypeScript autour de lui. C'est volontaire : cela évite de casser les calculs, imports/exports et formats existants pendant l'isolation progressive de la logique métier.

### Composants Aceternity utilisés/adaptés
- **Background Beams / Grid Background discret** : habillage institutionnel de l'en-tête et du fond.
- **Moving Border** : carte premium pour le score qualité.
- **Stateful Button** : actions importantes (analyse, sauvegarde, export).
- **Sidebar navigation animée** : navigation principale moderne vers les onglets historiques.
- **Animations Framer Motion** : transitions sobres sur boutons, barre de score, alertes d'audit.

### Risques techniques identifiés
- Le HTML historique expose de nombreuses fonctions globales ; une extraction complète en modules TS doit être faite par lots avec tests de non-régression.
- Les imports/exports OVP, Excel et Drupal ont des formats implicites ; ils doivent rester byte-compatible autant que possible.
- Les anciens fichiers projet peuvent contenir des données embarquées ou des noms de champs non normalisés.
- Les graphiques et mappings Excel dépendent de l'ordre des colonnes et des libellés utilisateurs.
- Une refonte visuelle totale en React sans phase d'adaptation risquerait de casser les workflows d'import, validation et export.

### Plan de migration étape par étape
1. Conserver l'application historique en iframe comme moteur de compatibilité.
2. Ajouter la navigation, l'audit qualité, l'autosauvegarde locale et les états vides côté React.
3. Extraire les fonctions pures de calcul de coût, jour-stagiaire, présence/distanciel et candidature collective dans `services/`.
4. Extraire les parseurs/importeurs HTML, JSON et XLSX avec tests de snapshots.
5. Recréer `IntentionForm`, `IntentionsList` et `PathwayComposer` en React en branchant les services extraits.
6. Recréer `GlobalDashboard` puis `Deployment*` avec les mêmes données et exports.
7. Recréer `CommunicationDrupal` en conservant le HTML conforme Drupal.
8. Débrancher progressivement l'iframe lorsque chaque écran React est validé fonctionnellement.

## Lancer le projet
```bash
npm install
npm run dev
```

## Build production
```bash
npm run build
npm run preview
```

## Fonctionnalités conservées
Toutes les fonctionnalités historiques restent disponibles via l'application originale chargée dans le shell React : formulaires, calculs, graphiques, imports/exports, sauvegarde/reprise, déploiement, communication Drupal et tutoriel.

## Améliorations ajoutées
- Panneau qualité des données avec score de complétude.
- Mode audit de cohérence : durée/effectif manquants, coût nul suspect, incohérence présentiel/distanciel, niveau supplémentaire incomplet, provenance intervenant absente, objectif/contenu manquants.
- Autosauvegarde locale périodique dans `localStorage` avec date affichée.
- États vides élégants dans le panneau d'audit.
- Recherche dans les alertes d'audit.
- Actions rapides modernisées pour sauvegarder et exporter via les boutons historiques.
- Couche d'adaptation `legacyAdapter` pour faciliter la compatibilité anciens projets.

## Checklist de non-régression à tester
- Ajouter une intention simple.
- Ajouter une intention avec niveau supplémentaire et troisième niveau.
- Ajouter des intervenants extérieurs avec provenances différentes.
- Vérifier coût total et coût moyen jour-stagiaire.
- Sauvegarder puis rouvrir un projet.
- Importer JSON et HTML intention.
- Exporter OVP/XLSX.
- Importer Excel de mise à jour et valider une ligne.
- Importer Excel de déploiement, mapper les colonnes, auto-associer et recalculer.
- Vérifier le déploiement global.
- Générer, copier et télécharger le HTML Drupal.
- Tester tous les onglets et le tutoriel.

## Limites connues / points à vérifier
- La refonte complète composant par composant est amorcée mais pas terminée : l'iframe garantit la non-régression pendant la migration.
- L'audit qualité lit les données globales exposées par le legacy ; certains champs peuvent nécessiter un mapping additionnel selon les fichiers projet.
- Les confirmations avant actions sensibles restent assurées par les dialogues historiques lorsqu'ils existent ; leur remplacement React doit être fait pendant l'extraction écran par écran.

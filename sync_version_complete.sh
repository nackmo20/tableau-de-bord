#!/usr/bin/env bash
set -euo pipefail

SRC="OVP_ultimateV6_49_dashboard_sous_ligne_niveau_secondaire.html"
DST="OVP_ultimateV6_49_dashboard_sous_ligne_niveau_secondaire_modifie.html"

cp "$SRC" "$DST"

echo "Version complète synchronisée: $DST"

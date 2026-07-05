#!/bin/bash
# Aller dans le dossier du script
cd "$(dirname "$0")"

echo "============================================="
echo "   DEMARRAGE DE L'ECOLE DE JULES 🚀          "
echo "============================================="
echo "Lancement du serveur local sur http://localhost:8000"
echo "Pour quitter, fermez simplement cette fenetre."
echo "---------------------------------------------"

# Lancer le serveur python en arriere-plan
python3 -m http.server 8000 > /dev/null 2>&1 &
PID=$!

# Attendre que le serveur demarre
sleep 1

# Ouvrir Chrome
open "http://localhost:8000/index.html"

# Attendre la fermeture de la console pour tuer le serveur
trap "kill $PID" EXIT
wait

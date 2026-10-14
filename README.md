# NOXIZ — application Android

Ce dossier contient le code source de l'application NOXIZ. Le fichier APK n'est pas précompilé dans cette archive : le workflow GitHub Actions inclus le construit dans le cloud.

## Obtenir l'APK depuis un téléphone

1. Décompresse `NOXIZ_mobile_app.zip`.
2. Dans ton navigateur, connecte-toi à GitHub et crée un nouveau dépôt (repository) vide.
3. Envoie tous les fichiers de ce dossier dans le dépôt, y compris le dossier caché `.github/workflows/build-apk.yml`.
4. Ouvre l'onglet **Actions** du dépôt.
5. Choisis **Build NOXIZ APK**, puis **Run workflow**.
6. Attends que l'exécution soit terminée en vert.
7. Ouvre cette exécution et télécharge l'artefact **NOXIZ-Android-APK**.
8. Décompresse l'artefact : il contient `app-debug.apk`.
9. Envoie ce fichier `.apk` par SHAREit, Bluetooth ou une autre méthode. Sur le téléphone qui le reçoit, ouvre le fichier et autorise l'installation de cette source si Android le demande.

## Important

- Cet APK est une version de test signée en mode debug. Il peut être installé et partagé directement, mais ce n'est pas une version Play Store.
- Le chat NOXIZ fonctionne côté interface. Pour obtenir de vraies réponses IA, configure l'URL de ton Worker dans `App.tsx` à la place de `COLLE_ICI_URL_DU_WORKER`. Ne mets jamais ton token Hugging Face dans l'application.
- Chaque nouvelle version nécessite de reconstruire l'APK.

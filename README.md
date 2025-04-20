# ATIA_LunarHack
THE LEGENDARY SANNIN présente la solution technologique ultime : Campus Compass ! 
Pour assurer une expérience fluide . Notez bien que le document est composé principalement de : 

/lunar_hack : Dossier de l'application frontend 
ou on trouve la structure suivante : 

assets : pour les photos 
pages : pour les pages et components affichés au client
et les fichiers de documentation 

pour exécuter le client : Il faut 
cd lunar_hack
npm i
npm run dev


/backend_flask : c'est le coté serveur de notre application :
composé de app ou se trouve les différentes services , routes et les modeles qui sont traités :
models :
représentation d'un utilisateur dans la base de données (on a utilisé SQLAlchemy)
routes : 
joue le role de controller : il contient les endpoints ainsi que les méthodes .

Pour exécuter ce projet pour la premiere fois : 
vérifiez que vous avez fait un fichier .env contenant l'adresse de la base de données ( sans création des tables)
Exécutez le code init_db.py : python init_db.py
Vérifier que vous avez installer toutes les bibliothèques dans requirements.txt en utiliant laa commande pip
exécuter la commande python run.js pour exécuter le projet .
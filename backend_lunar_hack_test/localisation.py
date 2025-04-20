# Importation des bibliothèques nécessaires
import numpy as np
import re
import json
from fuzzywuzzy import fuzz
from fuzzywuzzy import process
from pathlib import Path

class UniversityChatbot:
    def __init__(self, data_path='data'):
        """
        Initialisation du chatbot avec les données de l'université
        """
        # Chargement des données de l'université
        self.load_data(data_path)
        
        # Patterns regex pour la détection d'intention
        self.patterns = {
            'itinerary': r"(comment|comment je peux|comment puis-je)?\s*(aller|me rendre|arriver)?\s*(de|depuis|du|à partir de)?\s*(.+?)\s*(à|au|vers|jusqu'à|jusqu'au)\s*(.+)",
            'location': r"(où (est|se trouve|se situe)|localiser|trouver|comment (accéder|aller) (à|au))\s*(.+)",
            'info': r"(parle[zr]?-moi|raconte[zr]?-moi|donne[zr]?-moi des infos|qu'est-ce que|information|détails)\s*(sur|à propos de|concernant|du|de la|des)?\s*(.+)"
        }
    
    def load_data(self, data_path):
        """
        Chargement des données de l'université depuis les fichiers JSON
        """
        try:
            # Chargement des emplacements (salles, départements, etc.)
            with open(Path(data_path) / 'locations.json', 'r', encoding='utf-8') as f:
                self.locations = json.load(f)
            
            # Chargement de la carte et des informations de routage
            with open(Path(data_path) / 'map.json', 'r', encoding='utf-8') as f:
                self.map_data = json.load(f)
            
            # Chargement des descriptions générales
            with open(Path(data_path) / 'descriptions.json', 'r', encoding='utf-8') as f:
                self.descriptions = json.load(f)
                
            # Construction du graphe pour le routage
            self.build_graph()
            
            print("Données chargées avec succès")
        except Exception as e:
            print(f"Erreur lors du chargement des données: {e}")
            # Initialisation avec des données par défaut pour démonstration
            self.init_demo_data()
    
    def init_demo_data(self):
        """
        Initialise des données de démonstration si les fichiers ne sont pas disponibles
        """
        # Emplacements de démonstration
        self.locations = {
            "hall d'entrée": {"id": "hall", "building": "principal", "floor": 0, "type": "entrance"},
            "bibliothèque": {"id": "biblio", "building": "principal", "floor": 1, "type": "facility"},
            "département informatique": {"id": "info", "building": "sciences", "floor": 2, "type": "department"},
            "salle 101": {"id": "s101", "building": "principal", "floor": 1, "type": "classroom"},
            "cafétéria": {"id": "cafe", "building": "principal", "floor": 0, "type": "facility"},
            "amphithéâtre a": {"id": "amphi_a", "building": "sciences", "floor": 0, "type": "classroom"},
            "laboratoire chimie": {"id": "labo_chim", "building": "sciences", "floor": 1, "type": "laboratory"}
        }
        
        # Graphe représentant la connectivité entre les emplacements
        self.graph = {
            "hall": {"biblio": 2, "cafe": 1, "s101": 3},
            "biblio": {"hall": 2, "s101": 1},
            "cafe": {"hall": 1, "amphi_a": 4},
            "s101": {"biblio": 1, "hall": 3},
            "amphi_a": {"cafe": 4, "info": 2, "labo_chim": 3},
            "info": {"amphi_a": 2, "labo_chim": 1},
            "labo_chim": {"info": 1, "amphi_a": 3}
        }
        
        # Descriptions générales
        self.descriptions = {
            "département informatique": "Le département informatique se trouve au 2ème étage du bâtiment des sciences. Il dispose de 10 salles de TP, 5 salles de cours et 3 amphithéâtres. Les bureaux des professeurs sont situés au même étage.",
            "bibliothèque": "La bibliothèque universitaire est ouverte de 8h à 22h. Elle dispose de 500 places assises, de 50 ordinateurs en libre service et d'une collection de plus de 100 000 ouvrages.",
            "cafétéria": "La cafétéria est située au rez-de-chaussée du bâtiment principal. Elle est ouverte de 7h30 à 18h et propose des sandwichs, salades, plats chauds et boissons.",
            "laboratoire chimie": "Le laboratoire de chimie est équipé de matériel moderne pour les analyses chimiques. L'accès est restreint aux étudiants accompagnés d'un responsable.",
            "amphithéâtre a": "L'amphithéâtre A a une capacité de 300 places et est équipé d'un système audiovisuel complet.",
            "salle 101": "Salle de cours standard d'une capacité de 40 étudiants située au 1er étage du bâtiment principal."
        }
        
    def build_graph(self):
        """
        Construit le graphe à partir des données de la carte pour le calcul d'itinéraires
        """
        self.graph = {}
        
        # Construction du graphe à partir des données de la carte
        for node, connections in self.map_data["connections"].items():
            self.graph[node] = {}
            for connection in connections:
                dest = connection["to"]
                weight = connection["distance"]
                self.graph[node][dest] = weight
    
    def find_location(self, location_query):
        """
        Trouve un emplacement dans la base de données en utilisant une correspondance floue
        """
        # Utilisation de fuzzy matching pour trouver l'emplacement le plus proche
        choices = list(self.locations.keys())
        best_match, score = process.extractOne(location_query, choices)
        
        if score >= 70:  # Seuil de confiance
            return best_match
        return None
    
    def get_shortest_path(self, start, end):
        """
        Implémentation de l'algorithme de Dijkstra pour trouver le chemin le plus court
        """
        if start not in self.graph or end not in self.graph:
            return None, float('inf')
        
        # Initialisation
        distances = {node: float('inf') for node in self.graph}
        previous = {node: None for node in self.graph}
        distances[start] = 0
        unvisited = list(self.graph.keys())
        
        while unvisited:
            # Trouver le nœud non visité avec la distance minimale
            current = min(unvisited, key=lambda node: distances[node])
            
            # Arrêter si on a atteint la destination ou si la distance est infinie
            if current == end or distances[current] == float('inf'):
                break
                
            unvisited.remove(current)
            
            # Mettre à jour les distances pour les voisins
            for neighbor, weight in self.graph[current].items():
                distance = distances[current] + weight
                if distance < distances[neighbor]:
                    distances[neighbor] = distance
                    previous[neighbor] = current
        
        # Reconstruire le chemin
        path = []
        current = end
        while current:
            path.append(current)
            current = previous[current]
        
        path.reverse()
        return path if path[0] == start else None, distances[end]
    
    def get_location_info(self, location_name):
        """
        Récupère les informations sur un emplacement
        """
        # Récupérer l'ID de l'emplacement
        location_data = self.locations.get(location_name, {})
        location_id = location_data.get("id")
        
        # Récupérer la description
        description = self.descriptions.get(location_name, "Aucune information disponible sur cet emplacement.")
        
        return {
            "name": location_name,
            "data": location_data,
            "description": description
        }
    
    def format_itinerary(self, path, start_name, end_name):
        """
        Formate l'itinéraire pour l'affichage
        """
        if not path:
            return f"Désolé, je ne trouve pas d'itinéraire entre {start_name} et {end_name}."
        
        # Conversion des IDs en noms d'emplacements
        location_id_to_name = {data["id"]: name for name, data in self.locations.items()}
        path_names = [location_id_to_name.get(loc_id, loc_id) for loc_id in path]
        
        # Format de l'itinéraire
        if len(path) == 2:
            return f"Pour aller de {start_name} à {end_name}, allez-y directement."
        
        result = f"Pour aller de {start_name} à {end_name}, suivez ces étapes:\n"
        for i in range(len(path) - 1):
            current = path_names[i]
            next_location = path_names[i + 1]
            result += f"{i+1}. Depuis {current}, dirigez-vous vers {next_location}.\n"
        
        return result
    
    def process_message(self, user_message):
        """
        Traite un message utilisateur et retourne une réponse appropriée
        """
        # Vérifier le type de requête
        intent, matches = self.detect_intent(user_message)
        
        if intent == "itinerary":
            # Extraction des points de départ et d'arrivée
            start_query = matches[3] if matches[3] else matches[4]
            end_query = matches[5]
            
            # Recherche des emplacements
            start_location = self.find_location(start_query)
            end_location = self.find_location(end_query)
            
            if not start_location:
                return f"Désolé, je ne reconnais pas le point de départ '{start_query}'."
            if not end_location:
                return f"Désolé, je ne reconnais pas la destination '{end_query}'."
            
            # Récupération des IDs pour le calcul d'itinéraire
            start_id = self.locations[start_location]["id"]
            end_id = self.locations[end_location]["id"]
            
            # Calcul et formatage de l'itinéraire
            path, distance = self.get_shortest_path(start_id, end_id)
            return self.format_itinerary(path, start_location, end_location)
        
        elif intent == "location":
            # Extraction du lieu recherché
            location_query = matches[4]
            location = self.find_location(location_query)
            
            if not location:
                return f"Désolé, je ne connais pas l'emplacement '{location_query}'."
            
            # Récupération des informations sur l'emplacement
            location_data = self.locations[location]
            building = location_data["building"]
            floor = location_data["floor"]
            
            return f"{location} se trouve au {floor}ème étage du bâtiment {building}."
        
        elif intent == "info":
            # Extraction du sujet de la demande d'information
            info_query = matches[2]
            location = self.find_location(info_query)
            
            if not location:
                return f"Désolé, je n'ai pas d'informations sur '{info_query}'."
            
            # Récupération de la description
            location_info = self.get_location_info(location)
            return location_info["description"]
        
        else:
            # Réponse par défaut
            return ("Je suis le chatbot d'orientation de l'université. Je peux vous aider à trouver votre chemin "
                   "ou vous donner des informations sur les différents lieux du campus. Par exemple, vous pouvez me demander "
                   "'Comment aller de la bibliothèque au département informatique?' ou 'Où se trouve la cafétéria?'")
    
    def detect_intent(self, message):
        """
        Détecte l'intention de l'utilisateur à partir de son message
        """
        message = message.lower()
        
        for intent, pattern in self.patterns.items():
            match = re.search(pattern, message, re.IGNORECASE)
            if match:
                return intent, match.groups()
        
        return "unknown", None


# Exemple d'utilisation du chatbot
def create_sample_data():
    """
    Crée des exemples de données pour démonstration
    """
    import os
    
    # Créer le répertoire data s'il n'existe pas
    if not os.path.exists('data'):
        os.makedirs('data')
    
    # Créer les fichiers de données
    locations = {
        "hall d'entrée": {"id": "hall", "building": "principal", "floor": 0, "type": "entrance"},
        "bibliothèque": {"id": "biblio", "building": "principal", "floor": 1, "type": "facility"},
        "département informatique": {"id": "info", "building": "sciences", "floor": 2, "type": "department"},
        "département mathématiques": {"id": "math", "building": "sciences", "floor": 1, "type": "department"},
        "salle 101": {"id": "s101", "building": "principal", "floor": 1, "type": "classroom"},
        "cafétéria": {"id": "cafe", "building": "principal", "floor": 0, "type": "facility"},
        "amphithéâtre a": {"id": "amphi_a", "building": "sciences", "floor": 0, "type": "classroom"},
        "laboratoire chimie": {"id": "labo_chim", "building": "sciences", "floor": 1, "type": "laboratory"}
    }
    
    map_data = {
        "buildings": ["principal", "sciences"],
        "connections": {
            "hall": [
                {"to": "biblio", "distance": 2}, 
                {"to": "cafe", "distance": 1}, 
                {"to": "s101", "distance": 3}
            ],
            "biblio": [
                {"to": "hall", "distance": 2}, 
                {"to": "s101", "distance": 1}
            ],
            "cafe": [
                {"to": "hall", "distance": 1}, 
                {"to": "amphi_a", "distance": 4}
            ],
            "s101": [
                {"to": "biblio", "distance": 1}, 
                {"to": "hall", "distance": 3}
            ],
            "amphi_a": [
                {"to": "cafe", "distance": 4}, 
                {"to": "info", "distance": 2}, 
                {"to": "labo_chim", "distance": 3},
                {"to": "math", "distance": 2}
            ],
            "info": [
                {"to": "amphi_a", "distance": 2}, 
                {"to": "labo_chim", "distance": 1},
                {"to": "math", "distance": 3}
            ],
            "labo_chim": [
                {"to": "info", "distance": 1}, 
                {"to": "amphi_a", "distance": 3},
                {"to": "math", "distance": 2}
            ],
            "math": [
                {"to": "labo_chim", "distance": 2},
                {"to": "amphi_a", "distance": 2},
                {"to": "info", "distance": 3}
            ]
        }
    }
    
    descriptions = {
        "département informatique": "Le département informatique se trouve au 2ème étage du bâtiment des sciences. Il dispose de 10 salles de TP, 5 salles de cours et 3 amphithéâtres. Les bureaux des professeurs sont situés au même étage. Horaires d'ouverture: 8h-20h du lundi au vendredi.",
        "département mathématiques": "Le département de mathématiques est situé au 1er étage du bâtiment des sciences. Il comprend 8 salles de cours, 2 salles de séminaires et une bibliothèque spécialisée. Les bureaux des enseignants-chercheurs sont répartis sur le même étage.",
        "bibliothèque": "La bibliothèque universitaire est ouverte de 8h à 22h. Elle dispose de 500 places assises, de 50 ordinateurs en libre service et d'une collection de plus de 100 000 ouvrages. Des salles de travail en groupe peuvent être réservées en ligne.",
        "cafétéria": "La cafétéria est située au rez-de-chaussée du bâtiment principal. Elle est ouverte de 7h30 à 18h et propose des sandwichs, salades, plats chauds et boissons. Des micro-ondes sont également disponibles pour les étudiants apportant leur propre repas.",
        "laboratoire chimie": "Le laboratoire de chimie est équipé de matériel moderne pour les analyses chimiques. L'accès est restreint aux étudiants accompagnés d'un responsable. Des équipements de protection sont obligatoires pour accéder aux salles d'expérimentation.",
        "amphithéâtre a": "L'amphithéâtre A a une capacité de 300 places et est équipé d'un système audiovisuel complet. Il est généralement utilisé pour les cours magistraux des premières années et les conférences publiques.",
        "salle 101": "Salle de cours standard d'une capacité de 40 étudiants située au 1er étage du bâtiment principal. Elle est équipée d'un vidéoprojecteur et d'un tableau blanc interactif.",
        "hall d'entrée": "Le hall d'entrée du bâtiment principal est le point central du campus. Vous y trouverez le bureau d'accueil, les panneaux d'information et l'accès aux principaux services administratifs."
    }
    
    # Écriture des fichiers JSON
    with open('data/locations.json', 'w', encoding='utf-8') as f:
        json.dump(locations, f, ensure_ascii=False, indent=2)
    
    with open('data/map.json', 'w', encoding='utf-8') as f:
        json.dump(map_data, f, ensure_ascii=False, indent=2)
    
    with open('data/descriptions.json', 'w', encoding='utf-8') as f:
        json.dump(descriptions, f, ensure_ascii=False, indent=2)


def main():
    """
    Fonction principale pour tester le chatbot
    """
    # Créer des données d'exemple
    try:
        create_sample_data()
        print("Données d'exemple créées avec succès.")
    except Exception as e:
        print(f"Erreur lors de la création des données d'exemple: {e}")
    
    # Initialiser le chatbot
    chatbot = UniversityChatbot()
    
    print("Bienvenue au chatbot d'orientation universitaire!")
    print("Vous pouvez me demander comment aller d'un endroit à un autre,")
    print("où se trouve un lieu spécifique, ou des informations sur un département.")
    print("Tapez 'exit' pour quitter.")
    
    while True:
        user_input = input("\nVous: ")
        if user_input.lower() == 'exit':
            break
        
        response = chatbot.process_message(user_input)
        print(f"\nChatbot: {response}")


if __name__ == "__main__":
    main()
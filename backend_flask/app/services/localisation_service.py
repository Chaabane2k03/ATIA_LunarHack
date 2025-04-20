distance_matrix = {
    "Library": {
        "Engineering Building": 4.47,
        "Cafeteria": 3.61,
    },
    "Engineering Building": {
        "Library": 4.47,
    },
    "Cafeteria": {
        "Library": 3.61,
    }
}

def extract_start_end(text):
    text = text.lower()
    # English
    buildings = {
        "lib": "Library",
        "library": "Library",
        "eng": "Engineering Building",
        "engineering": "Engineering Building",
        "engineering building": "Engineering Building",
        "caf": "Cafeteria",
        "cafeteria": "Cafeteria",
        "admin": "Administration",
        "administration": "Administration",
        "gym": "Gym",
        "hall": "Hall",
        "res": "Residence",
        "residence": "Residence",
        "dorm": "Residence",
        "amphi": "Amphitheater",
        "amphitheater": "Amphitheater",
        "lab": "Laboratory",
        "laboratory": "Laboratory",
        "labo": "Laboratory",

        # French
        "biblio": "Library",
        "bibliothèque": "Library",
        "fac": "Engineering Building",
        "faculté": "Engineering Building",
        "département": "Engineering Building",
        "cantine": "Cafeteria",
        "salle de sport": "Gym",
        "gymnase": "Gym",
        "auditorium": "Auditorium",
        "salle": "Hall",
        "amphithéâtre": "Amphitheater",

        # Tunisian dialect / Arabic
        "maktaba": "Library",
        "el-maktaba": "Library",
        "qahwa": "Cafeteria",
        "win el qahwa": "Cafeteria",
        "el-cafeteria": "Cafeteria",
        "kulia": "Engineering Building",
        "departement": "Engineering Building",
        "mabna al-handasa": "Engineering Building",
        "el-gym": "Gym",
        "el-amphi": "Amphitheater",
        "maamoura": "Residence",
        "ma3moura": "Residence"
    }

    dialect_mapping = {
        "win": "where",
        "kifech": "how",
        "yemchi": "go",
        "imchi": "go",
        "min": "from",
        "ila": "to",
        "win": "where",
        "kifesh": "how",
        "yani": "meaning",
        "from": "from",
        "to": "to",
        "men": "from",
        "lel": "to",
        "lil": "to"
    }

    for k, v in dialect_mapping.items():
        text = text.replace(k, v)

    found = [key for key in buildings if key in text]

    # NEW CASE: Same location repeated (e.g. "from cafeteria to cafeteria")
    if len(found) == 1 and text.count(found[0]) > 1:
        location = buildings[found[0]]
        return location, location

    if len(found) >= 2:
        # Heuristic: try to detect direction from phrasing
        from_index = text.find(found[0])
        to_index = text.find(found[1])

        # Ensure correct start and end detection based on "from" and "to"
        if 'from' in text and 'to' in text:
 
            if text.find('from') < text.find('to'):
                
                start, end = found[0], found[1]
            else:
                start, end = found[1], found[0]
        elif 'from' in text:
            start, end = found[0], found[1]
        elif 'to' in text:
            start, end = found[0], found[1]
        else:
            # fallback to order in text
            start, end = found[0], found[1]

        return buildings[start], buildings[end]

    if len(found) == 1:
        current = buildings[found[0]]
        raise ValueError(f"You mentioned only one location: {current}. Where are you going?")

    raise ValueError("Could not find matching locations.")

def get_navigation_instruction(start, end, matrix):
    if start == end:
        return f"🚩 You're already at {start}."

    if matrix.get(start, {}).get(end) is not None:
        distance = matrix[start][end]
        return f"✅ Direct route: {start} is within {distance} units of {end}."

    for mid in matrix:
        if mid != start and mid != end:
            if matrix.get(start, {}).get(mid) is not None and matrix.get(mid, {}).get(end) is not None:
                d1 = matrix[start][mid]
                d2 = matrix[mid][end]
                total = round(d1 + d2, 2)
                return (f"🔁 No direct route from {start} to {end}.\n"
                        f"➡️ Go from {start} to {mid} ({d1} units), "
                        f"then from {mid} to {end} ({d2} units).\n"
                        f"🧮 Total distance: {total} units.")

    return f"❌ No available path found from {start} to {end}."

def ask_bot(user_input):
    try:
        start, end = extract_start_end(user_input)
        return get_navigation_instruction(start, end, distance_matrix)
    except Exception as e:
        return f"❓ Sorry, I couldn't understand. Please specify buildings. ({str(e)})"

# distance.py






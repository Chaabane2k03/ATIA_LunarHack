import json
import random
import numpy as np
import re

import nltk
from nltk.stem import WordNetLemmatizer
from keras.models import Sequential
from keras.layers import Dense, Dropout
from keras.optimizers import SGD

# Ensure necessary NLTK data is downloaded
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('punkt_tab')

class ChatbotModel:
    def __init__(self):
        self.data_file = "data.json"
        self.lemmatizer = WordNetLemmatizer()
        self.ignore_words = ['?', '!', '.', ',', "'s", "'m", "'re", "'ll", "'ve", "'d", "'t"]
        self.words = []
        self.classes = []
        self.documents = []
        self.intents = None
        self.model = None

    def preprocess_text(self, text):
        """Normalize and preprocess text."""
        text = text.lower()
        text = re.sub(r'[\^\w\s\'-]', '', text)  # Keep only letters, numbers, spaces, apostrophes, and hyphens
        return text

    def clean_up_sentence(self, sentence):
        """Tokenize and lemmatize the input sentence."""
        sentence_words = nltk.word_tokenize(sentence)
        return [self.lemmatizer.lemmatize(word.lower()) for word in sentence_words]

    def bow(self, sentence, show_details=True):
        """Create a bag of words from the sentence."""
        sentence_words = self.clean_up_sentence(sentence)
        bag = [0] * len(self.words)

        for s in sentence_words:
            for i, w in enumerate(self.words):
                if w == s:
                    bag[i] = 1
                    if show_details:
                        print(f"Found in bag: {w}")
        return np.array(bag)

    def predict_class(self, sentence):
        """Predict the class of the input sentence."""
        p = self.bow(sentence, show_details=False)
        res = self.model.predict(np.array([p]))[0]
        ERROR_THRESHOLD = 0.25

        results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
        results.sort(key=lambda x: x[1], reverse=True)
        return [{"intent": self.classes[r[0]], "probability": str(r[1])} for r in results]

    def get_response(self, ints):
        """Get a response based on the predicted intents."""
        tag = ints[0]['intent']
        for i in self.intents['root']['intents']:
            if i['tag'] == tag:
                return random.choice(i['responses'])

    def load_and_process_data(self):
        """Load and process data from the JSON file."""
        with open(self.data_file, 'r') as file:
            self.intents = json.load(file)

        for intent in self.intents['root']['intents']:
            for pattern in intent['patterns']:
                cleaned_pattern = self.preprocess_text(pattern)
                w = nltk.word_tokenize(cleaned_pattern)
                self.words.extend(w)
                self.documents.append((w, intent['tag']))

                if intent['tag'] not in self.classes:
                    self.classes.append(intent['tag'])

        self.words = sorted(list(set(self.lemmatizer.lemmatize(w.lower()) for w in self.words if w not in self.ignore_words)))
        self.classes = sorted(list(set(self.classes)))

    def prepare_training_data(self):
        """Prepare training data from processed words and classes."""
        training = []
        output_empty = [0] * len(self.classes)

        for doc in self.documents:
            bag = [1 if w in doc[0] else 0 for w in self.words]
            output_row = list(output_empty)
            output_row[self.classes.index(doc[1])] = 1
            training.append([bag, output_row])

        random.shuffle(training)
        training = np.array(training, dtype=object)
        
        train_x = np.array([item[0] for item in training], dtype=np.float32)
        train_y = np.array([item[1] for item in training], dtype=np.float32)

        return train_x, train_y

    def build_and_train_model(self, train_x, train_y):
        """Build and train the chatbot model."""
        self.model = Sequential()
        self.model.add(Dense(128, input_shape=(len(train_x[0]),), activation='relu'))
        self.model.add(Dropout(0.5))
        self.model.add(Dense(64, activation='relu'))
        self.model.add(Dropout(0.5))
        self.model.add(Dense(len(train_y[0]), activation='softmax'))

        sgd = SGD(learning_rate=0.01, momentum=0.9, nesterov=True)
        self.model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['accuracy'])

        hist = self.model.fit(train_x, train_y, epochs=50, batch_size=5, verbose=1)
        self.model.save('chatbot_model.h5', hist)
        print("Model created")

    def chatbot_response(self, msg):
        """Generate a chatbot response for a given input message."""
        ints = self.predict_class(msg)
        return self.get_response(ints)

# Usage example:
# chatbot.load_and_process_data()
# train_x, train_y = chatbot.prepare_training_data()
# chatbot.build_and_train_model(train_x, train_y)
# response = chatbot.chatbot_response("Hello!")
# print(response)

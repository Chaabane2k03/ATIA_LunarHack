import json
import random
import numpy as np
import re
import nltk
from nltk.stem import WordNetLemmatizer
from keras.models import Sequential
from keras.layers import Dense, Activation, Dropout
from keras.optimizers import SGD

nltk.download('punkt')
nltk.download('wordnet')

class ChatBotService:
    def __init__(self, data_file_path):
        self.lemmatizer = WordNetLemmatizer()
        self.ignore_words = ['?', '!', '.', ',', "'s", "'m", "'re", "'ll", "'ve", "'d", "'t"]
        
        # Load and preprocess data
        self.intents = self._load_intents(data_file_path)
        self.words, self.classes, self.documents = self._preprocess_data()
        
        # Train model
        self.model = self._train_model()
    
    def _load_intents(self, file_path):
        data_file = open(file_path).read()
        return json.loads(data_file)
    
    def _preprocess_text(self, text):
        text = text.lower()
        text = re.sub(r'[^\w\s\'-]', '', text)
        return text
    
    def _preprocess_data(self):
        words = []
        classes = []
        documents = []
        
        for intent in self.intents['root']['intents']:
            for pattern in intent['patterns']:
                cleaned_pattern = self._preprocess_text(pattern)
                w = nltk.word_tokenize(cleaned_pattern)
                words.extend(w)
                documents.append((w, intent['tag']))
                
                if intent['tag'] not in classes:
                    classes.append(intent['tag'])
        
        words = [self.lemmatizer.lemmatize(w.lower()) for w in words if w not in self.ignore_words]
        words = sorted(list(set(words)))
        classes = sorted(list(set(classes)))
        
        return words, classes, documents
    
    def _train_model(self):
        # Prepare training data
        training = []
        output_empty = [0] * len(self.classes)
        
        for doc in self.documents:
            bag = []
            pattern_words = doc[0]
            pattern_words = [self.lemmatizer.lemmatize(word.lower()) for word in pattern_words]
            bag = [1 if w in pattern_words else 0 for w in self.words]
            
            output_row = list(output_empty)
            output_row[self.classes.index(doc[1])] = 1
            
            training.append([bag, output_row])
        
        random.shuffle(training)
        training = np.array(training, dtype=object)
        
        train_x = np.array([item[0] for item in training], dtype=np.float32)
        train_y = np.array([item[1] for item in training], dtype=np.float32)
        
        # Create and train model
        model = Sequential()
        model.add(Dense(128, input_shape=(len(train_x[0]),), activation='relu'))
        model.add(Dropout(0.5))
        model.add(Dense(64, activation='relu'))
        model.add(Dropout(0.5))
        model.add(Dense(len(train_y[0]), activation='softmax'))
        
        sgd = SGD(learning_rate=0.01, momentum=0.9, nesterov=True)
        model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['accuracy'])
        
        model.fit(np.array(train_x), np.array(train_y), epochs=50, batch_size=5, verbose=1)
        
        return model
    
    def _clean_up_sentence(self, sentence):
        sentence_words = nltk.word_tokenize(sentence)
        sentence_words = [self.lemmatizer.lemmatize(word.lower()) for word in sentence_words]
        return sentence_words
    
    def _bow(self, sentence, show_details=False):
        sentence_words = self._clean_up_sentence(sentence)
        bag = [0] * len(self.words)
        
        for s in sentence_words:
            for i, w in enumerate(self.words):
                if w == s:
                    bag[i] = 1
                    if show_details:
                        print("found in bag: %s" % w)
        return np.array(bag)
    
    def _predict_class(self, sentence):
        p = self._bow(sentence, show_details=False)
        res = self.model.predict(np.array([p]))[0]
        ERROR_THRESHOLD = 0.25
        
        results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
        results.sort(key=lambda x: x[1], reverse=True)
        return_list = []
        
        for r in results:
            return_list.append({"intent": self.classes[r[0]], "probability": str(r[1])})
        return return_list
    
    def _get_response(self, ints):
        tag = ints[0]['intent']
        list_of_intents = self.intents['root']['intents']
        
        for i in list_of_intents:
            if i['tag'] == tag:
                return random.choice(i['responses'])
        return "I'm not sure how to respond to that."
    
    def chatbot_response(self, msg):
        ints = self._predict_class(msg)
        return self._get_response(ints)

# Example usage:
# chatbot = ChatbotService()
# response = chatbot.chatbot_response("Hello there!")
# print(response)
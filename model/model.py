import tensorflowjs as tfjs
import json
import numpy as np
import random
import spacy
import re

from spacy_lefff import LefffLemmatizer, POSTagger
from spacy.language import Language
from keras.models import Sequential
from keras.layers import Dense, Activation, Dropout
from keras.optimizers import SGD

@Language.factory('french_lemmatizer')
def create_french_lemmatizer(nlp, name):
    return LefffLemmatizer(after_melt=True, default=True)


@Language.factory('melt_tagger')
def create_melt_tagger(nlp, name):
    return POSTagger()


def init_lemmatizer():
    nlp = spacy.load('fr_core_news_sm')
    nlp.add_pipe('melt_tagger', after='parser')
    nlp.add_pipe('french_lemmatizer', after='melt_tagger')

    return nlp


def create_model():
    """
    Create model and return it
    """
    model = Sequential()
    model.add(Dense(128, input_shape=(len(train_x[0]),), activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(64, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(len(train_y[0]), activation='softmax'))

    # Compile model. Stochastic gradient descent with Nesterov accelerated gradient gives good results for this model
    sgd = SGD(lr=0.01, decay=1e-6, momentum=0.9, nesterov=True)
    model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['accuracy'])

    return model


def train_model(epochs=200):
    model = create_model()
    hist = model.fit(np.array(train_x), np.array(train_y), epochs=epochs, batch_size=5, verbose=1)
    model.save('chatbot_model.h5', hist)

    return model


def save_model_js(model):
    tfjs.converters.save_keras_model(model, "../data/model")


def parse_json(path):
    words=[]
    classes = []
    documents = []
    ignore_words = ['?', '!', '.', ',', ';', '\'']
    data_file = open(path).read()
    intents = json.loads(data_file)

    for intent in intents['intents']:
        for pattern in intent['patterns']:
            # take each word and tokenize it
            w = re.split('\.|,|;|\'|\-|!|\?', pattern)
            words.extend(w)
            # adding documents
            documents.append((w, intent['tag']))
            # adding classes to our class list
            if intent['tag'] not in classes:
                classes.append(intent['tag'])

    nlp = init_lemmatizer()
    words = [w.lemma_ for w in nlp(' '.join(words)) if w.lemma_ not in ignore_words and len(w.lemma_) > 2]
    words = sorted(list(set(words)))

    classes = sorted(list(set(classes)))

    print (len(documents), "documents")

    print (len(classes), "classes", classes)

    print (len(words), "unique lemmatized words", words)

parse_json("../data/simple.json")

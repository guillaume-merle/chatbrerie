import tensorflowjs as tfjs
import numpy as np
import random

from keras.models import Sequential
from keras.layers import Dense, Activation, Dropout
from keras.optimizers import SGD
from parse_json import parse_json


def create_model(train_x, train_y):
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


def train_model(train_x, train_y, epochs):
    model = create_model(train_x, train_y)
    hist = model.fit(np.array(train_x), np.array(train_y), epochs=epochs, batch_size=5, verbose=1)
    model.save('chatbot_model.h5', hist)

    return model


def save_model_js(model):
    tfjs.converters.save_keras_model(model, "../data/js-model")


def prepare_training(path):
    documents, classes, words = parse_json(path)

    # initializing training data
    training = []
    output_empty = [0] * len(classes)

    for doc in documents:
        # initializing bag of words
        bag = []
        # list of tokenized words for the pattern
        pattern_words = doc[0]
        # create our bag of words array with 1, if word match found in current pattern
        for w in words:
            bag.append(1) if w in pattern_words else bag.append(0)

        # output is a '0' for each tag and '1' for current tag (for each pattern)
        output_row = list(output_empty)
        output_row[classes.index(doc[1])] = 1

        training.append([bag, output_row])

    # shuffle our features and turn into np.array
    random.shuffle(training)
    training = np.array(training)
    # create train and test lists. X - patterns, Y - intents
    train_x = list(training[:,0])
    train_y = list(training[:,1])
    print("Training data created")

    return train_x, train_y


def train(path, epochs=200):
    train_x, train_y = prepare_training(path)
    model = train_model(train_x, train_y, epochs)

    save_model_js(model)

train("../data/simple.json")

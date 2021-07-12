import os
# Remove all tensorflow warnings if you have no GPU
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import tensorflowjs as tfjs
import tensorflow as tf
import numpy as np
import random

from pathlib import Path
from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Activation, Dropout
from tensorflow.keras.optimizers import SGD
from tqdm import tqdm
from tqdm.keras import TqdmCallback

from parse_json import parse_json


def create_model(train_x, train_y):
    """
    Create keras model and return it

        Parameters:
            train_x (array): The input array for the learning
            train_y (array): The output array for the learning

        Returns:
            model (keras model): The model created with keras
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
    """
    Train the keras model and return it

        Parameters:
            train_x (array): The input array for the learning
            train_y (array): The output array for the learning
            epochs (int): The number of epochs for the learning

        Returns:
            Return the trained model
    """
    print('Learning...')

    model = create_model(train_x, train_y)
    hist = model.fit(np.array(train_x), np.array(train_y), epochs=epochs, batch_size=5, verbose=0,
                        callbacks=[TqdmCallback(verbose=1)])

    return model


def save_model_js(model):
    """
    Convert and save the model in tensorflowjs format

        Parameters:
            model(keras model): The trained model
    """
    tfjs.converters.save_keras_model(model, "data/outputs/js-model")


def prepare_training(folder):
    """
    Create the input and output arrays for the learning

        Parameters:
            folder (string): path to the folder containing all the json files

        Returns:
            train_x (array): The input array for the learning
            train_y (array): The output array for the learning
    """
    Path('data/outputs').mkdir(exist_ok=True)
    documents, classes, words = parse_json(folder)

    # initializing training data
    training = []
    output_empty = [0] * len(classes)

    print('Creating training data...')

    for doc in tqdm(documents):
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
    training = np.array(training, dtype=object)

    # create train input and output lists
    train_x = list(training[:,0])
    train_y = list(training[:,1])

    return train_x, train_y


def train(folder, epochs=200):
    """
    Prepare the inputs and outputs for the training, create and train the model, then save it with tensorflowjs

        Parameters:
            folder (string): path to the folder containing all the json files
            epochs (int): The number of epochs for the learning (default: 200)
    """
    train_x, train_y = prepare_training(folder)
    model = train_model(train_x, train_y, epochs)

    save_model_js(model)

if __name__ == "__main__":
    train("data/questions")
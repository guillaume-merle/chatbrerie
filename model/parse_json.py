import spacy
import re
import json
import unidecode

from spacy_lefff import LefffLemmatizer, POSTagger
from spacy.language import Language


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


def save_words_list(words):
    f = open("data/word-lists.txt", "w")
    f.write('\n'.join(words))


def parse_json(path):
    words= []
    classes = []
    documents = []
    data_file = open(path).read()
    intents = json.loads(data_file)
    nlp = init_lemmatizer()

    for intent in intents['intents']:
        for pattern in intent['patterns']:
            # take each word and tokenize it
            w = re.split('\.|,|;|\'|\-|!|\?| ', pattern)
            w = [unidecode.unidecode(word.lemma_.lower()) for word in nlp(' '.join(w)) if len(word.lemma_) > 2]
            print(w)
            words.extend(w)
            # adding documents
            documents.append((w, intent['tag']))
            # adding classes to our class list
            if intent['tag'] not in classes:
                classes.append(intent['tag'])

    words = sorted(list(set(words)))
    save_words_list(words)

    print (len(documents), "documents")

    print (len(classes), "classes", classes)

    print (len(words), "unique lemmatized words", words)

    return documents, classes, words

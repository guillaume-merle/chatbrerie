import spacy
import re
import json
import unidecode
import glob

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


def parse_json(folder):
    files = glob.glob("{}/*.json".format(folder))
    print(files)

    words, classes, documents = [], [], []
    output_json = {}
    output_json["responses"] = []

    nlp = init_lemmatizer()

    for path in files:
        data_file = open(path).read()
        intents = json.loads(data_file)

        for intent in intents['intents']:
            # adding classes to our class list
            if intent['tag'] not in classes:
                classes.append(intent['tag'])
                # category without patterns
                if len(intent['patterns']) == 0:
                    documents.append(('', intent['tag']))

            for pattern in intent['patterns']:
                # take each word and tokenize it
                w = re.split('\.|,|;|\'|\-|!|\?| ', pattern)
                lemmatize_words = []

                for word in w:
                    lemma = nlp(word)
                    if len(lemma) != 0 and len(lemma[0].lemma_) > 2:
                        lemmatize_words.append(unidecode.unidecode(lemma[0].lemma_.lower()))

                print(lemmatize_words)
                words.extend(lemmatize_words)
                # adding documents
                documents.append((lemmatize_words, intent['tag']))

            output_json["responses"].append({intent['tag']: intent['responses']})

        words = sorted(list(set(words)))
        save_words_list(words)

        print (len(documents), "documents")

        print (len(classes), "classes", classes)

        print (len(words), "unique lemmatized words", words)

    with open("data/output.json", 'w', encoding='utf8') as outfile:
        json.dump(output_json, outfile, ensure_ascii=False, indent=4)

    return documents, classes, words

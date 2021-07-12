import spacy
import re
import json
import unidecode
import glob

from spacy_lefff import LefffLemmatizer, POSTagger
from spacy.language import Language
from tqdm import tqdm


@Language.factory('french_lemmatizer')
def create_french_lemmatizer(nlp, name):
    """
    Create the french lemmatizer with LefffLemmatizer and return it
    """
    return LefffLemmatizer(after_melt=True, default=True)


@Language.factory('melt_tagger')
def create_melt_tagger(nlp, name):
    """
    Create the melt tagger for the lemmatizer
    """
    return POSTagger()


def init_lemmatizer():
    """
    Init the lemmatizer with 'fr_core_news_sm' and return it

        Returns:
            nlp (lemmatizer): the french lemmatizer
    """
    nlp = spacy.load('fr_core_news_sm')
    nlp.add_pipe('melt_tagger', after='parser')
    nlp.add_pipe('french_lemmatizer', after='melt_tagger')

    return nlp


def save_words_list(words):
    """
    Save all the lemmatized words from the json files

        Parameters:
            words (array): list of words
    """
    f = open('data/outputs/word-lists.txt', 'w')
    f.write('\n'.join(words))


def parse_json(folder):
    """
    Parse all the json files and create the json outputs file (with all the tags and responses for the js part)

        Parameters:
            folder (string): Path to the folder with all the json files

        Returns:
            documents (array): List of tuple (tag: sentences link to this tag)
            classes (array): All the tags
            words (array): All the lemmatized words
    """
    files = glob.glob('{}/*.json'.format(folder))

    words, classes, documents = [], [], []
    output_json = []

    nlp = init_lemmatizer()

    print('Parsing Json files...')
    for path in tqdm(files):
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

                words.extend(lemmatize_words)
                # adding documents
                documents.append((lemmatize_words, intent['tag']))

            output_json.append({'tag': intent['tag'], 'responses': intent['responses']})

        words = sorted(list(set(words)))

    # save output.json, a json file with all the tags link to their answers (we use it in the js part)
    with open('data/outputs/output.json', 'w', encoding='utf8') as outfile:
        json.dump(output_json, outfile, ensure_ascii=False, indent=4)

    save_words_list(words)

    return documents, classes, words

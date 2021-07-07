#!/bin/sh

npm install

if [ "$1" == "--dev" ]; then
    pip install -r requirements.txt
    python -m spacy download fr
fi

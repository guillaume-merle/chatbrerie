class Config {
    static wordListPath = 'src/data/word-lists.txt'
    static modelPath = 'src/data/js-model/model.json'
    static answersPath = 'src/data/output.json'
    static chatbotViewPath = 'src/views/chatbot.html'
    static clientMessageViewPath = 'src/views/client-message.mustache.html'
    static botMessageViewPath = 'src/views/bot-message.mustache.html'
    static imageViewPath = 'src/views/image.mustache.html'

    static imageGoodbye = 'src/assets/images/bye.gif'
    static imageDontknow = 'src/assets/images/dontknow.gif'
}

export { Config }

class Config {
    static wordListPath = 'src/data/word-lists.txt'
    static modelPath = 'src/data/js-model/model.json'
    static answersPath = 'src/data/output.json'
    static chatbotViewPath = 'src/views/chatbot.html'
    static clientMessageViewPath = 'src/views/client-message.mustache.html'
    static botMessageViewPath = 'src/views/bot-message.mustache.html'
    static imageViewPath = 'src/views/image.mustache.html'
    static quizQuestionViewPath = 'src/views/quiz-question.mustache.html'
    static quizNavPath = 'src/views/quiz-nav.html'

    static imageGoodbye = 'src/assets/images/bye.gif'
    static imageDontknow = 'src/assets/images/dontknow.gif'
    static botAvatar = 'src/assets/images/bot-avatar.png'
    static clientAvatar = 'src/assets/images/client-avatar.png'

    static quizPath = 'src/data/vaccination-quiz.json'

    static colorValid = '#54ccbe'
    static colorWrong = '#ff493b'
}

export { Config }

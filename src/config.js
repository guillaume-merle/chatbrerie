class Config {
    static wordListPath = 'data/outputs/word-lists.txt'
    static modelPath = 'data/outputs/js-model/model.json'
    static answersPath = 'data/outputs/output.json'

    static chatbotViewPath = 'views/chatbot.html'
    static clientMessageViewPath = 'views/client-message.mustache.html'
    static botMessageViewPath = 'views/bot-message.mustache.html'
    static formMessageViewPath = 'views/form-message.mustache.html'
    static imageViewPath = 'views/image.mustache.html'
    static quizQuestionViewPath = 'views/quiz-question.mustache.html'
    static quizNavViewPath = 'views/quiz-nav.html'
    static botBaseViewPath = 'views/bot-base.mustache.html'
    static clientBaseViewPath = 'views/client-base.mustache.html'
    static functionsViewPath = 'views/functions.mustache.html'

    static imageGoodbye = 'assets/images/bye.gif'
    static imageDontknow = 'assets/images/dontknow.gif'
    static botAvatar = 'assets/images/bot-avatar.png'
    static clientAvatar = 'assets/images/client-avatar.png'

    static quizBasePath = 'data/quiz/'
    static functionsPath = 'data/functions.json'

    static colorValid = '#54ccbe'
    static colorWrong = '#ff493b'
}

export { Config }

import translations from './translations-nl.js';

export default class Trans {
    constructor(lang) {
        // For now using only nl for now loaded from one file
        if(typeof lang === "undefined") {
            this.lang = 'nl';
        } else {
            this.lang = lang;
        }
    }
    t(key, params) {
        let translationString = translations.hasOwnProperty(key)? translations[key] : key;
        if(typeof params !== "object") params = {};

        let transKey = '';
        try{
            if(Object.keys(params).length > 0){
                for (const [key, replacement] of Object.entries(params)) {
                    let patternColon    = ":" + key;
                    let patternBrackets = "{%" + key + "}";

                    if(translationString.includes(patternColon)){
                        translationString = translationString.replace(patternColon, replacement);
                    }else if(translationString.includes(patternBrackets)){
                        translationString = translationString.replace(patternBrackets, replacement);
                    }
                }
            }
        } catch(err) {
            console.error("Translator error: " + err);
        }

        return translationString;
    }
}

import Validator from "../../libs/validator.js";
import Translator from '../../translations/translator.js';

export default class FirstStepValidator extends Validator {
    constructor() {
        super();

        this.translator = new Translator();
    }

    rules() {
        return {
            save: {
                firstName : 'required|save|proceed',
                lastName  : 'required|save|proceed',
                email     : 'required|save',
            }
        }
    }

    messages() {
        return {
            firstName: this.translator.t('you-must-provide-a-field', {'field' : this.translator.t('first-name')}),
            lastName: this.translator.t('you-must-provide-a-field', {'field' : this.translator.t('last-name')}),
            email: this.translator.t('you-must-select-a-field', {'field' : this.translator.t('email')}),
        }
    }
}

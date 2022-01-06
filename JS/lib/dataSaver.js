import store from "../store/index.js";
import Translator from '../translations/translator.js';

export default class DataSaver {
    constructor(props = {}) {
        this.translator = new Translator();

        if (this.constructor === DataSaver) {
            throw new Error("Abstract classes can't be instantiated.");
        }

        if(props.hasOwnProperty('step')){
            this.step = props.step;
        }

        if(props.hasOwnProperty('moduleKey')){
            this._moduleKey = props.moduleKey;
        }

        if(props.hasOwnProperty('moduleKeyErrors')){
            this._moduleKeyErrors = props.moduleKeyErrors;
        }

        if(props.hasOwnProperty('querySelector')){
            this._querySelector = props.querySelector;
        }

        if(props.hasOwnProperty('validator')){
            this._validator = props.validator;
        }

        this.data = null;
    }

    get validator() {
        return this._validator;
    }

    set validator(value) {
        this._validator = value;
    }

    get querySelector() {
        return this._querySelector;
    }

    set querySelector(value) {
        this._querySelector = value;
    }

    get moduleKey() {
        return this._moduleKey;
    }

    set moduleKey(value) {
        this._moduleKey = value;
    }

    get moduleKeyErrors() {
        return this._moduleKeyErrors;
    }

    set moduleKeyErrors(value) {
        this._moduleKeyErrors = value;
    }

    save() {}

    validateForSave() {}

    performValidationActions(value, name) {
        if((value === undefined || value === '')){
            this._validator.generateMessage(name, 'error-msg', 'error-shadow');
            store.dispatch('savedData/save_data_field_error', {
                key: name,
                value: value
            }, this._moduleKeyErrors);
        }else{
            this._validator.removeMessage(name, 'error-shadow');
            if(this.getFromStore(this._moduleKeyErrors).hasOwnProperty(name)){
                store.dispatch('savedData/remove_data_field_error', name, this._moduleKeyErrors);
            }
        }
    }

    storeInState() {
        let self = this;
        jQuery(self._querySelector).on('change','input:not([excluded]), .custom-select, .custom-textarea', function () {
            let name = jQuery(this).attr('name') ?? jQuery(this).attr('id');
            let value = jQuery(this).val();

            if(value === '' || value === undefined) {
                store.dispatch('savedData/remove_data_field', {
                    key: name,
                    value: value
                }, self._moduleKey);
            }else {
                store.dispatch('savedData/save_data_field', {
                    key: name,
                    value: value
                }, self._moduleKey);
            }
        });
    }

    getFromStore(module, key = null) {
        if(key) {
            return store.state.items.saveData[module][key];
        }
        return store.state.items.saveData[module];
    }

    format() {
        return {
            data : this.getData(),
            step : this.step
        };
    }

    formatErrorMessages(errorObject) {
        let errorFormatted = '';

        if(typeof errorObject === undefined || typeof errorObject === 'undefined') {
            errorFormatted = '<ul style="margin:0 auto;">';
            errorFormatted += this.translator.t('unable-to-save-step') + '. ' + this.translator.t('contact-administrator');
            errorFormatted += '</ul>';

            return errorFormatted;
        }


        if(errorObject.message !== undefined) {
            errorFormatted = errorObject.message;
        } else {
            errorFormatted = '<ul style="margin:0 auto;">';
            for(let err in errorObject.errors) {
                if(errorObject.errors.hasOwnProperty(err)) {
                    errorFormatted += `<li>${errorObject.errors[err]}</li>`
                }
            }
            errorFormatted += '</ul>';
        }

        return errorFormatted;
    }

    getData() {
        return this.data;
    }

    setData(data) {
        this.data = data;
    }

    checkIfStepIsComplete(flowStep) {
        return new Promise((resolve, reject) => {
            let isStepComplete = true; // TODO

            if(isStepComplete) {
                resolve(isStepComplete);
            } else {
                reject(isStepComplete);
            }
        })
    }

    currentStepKey() {
        return ''
    }

    nextStepKey(currentStepKey) {
        // TODO:

        return currentStep !== null && currentStep.hasOwnProperty('next') ? currentStep.next : null;
    }

    stepNameByKey(stepKey) {
        function countInstances(string, word) {
            return string.split(word).length - 1;
        }

        let transKey = stepKey;
        // others_step -> others-step -> translate
        for (let i = 0; i < countInstances(stepKey, '_'); i++) {
            transKey = transKey.replace("_", "-");
        }

        return transKey !== '' ? this.translator.t(transKey) : this.translator.t('step');
    }

    showMessagesAfterSave(alertClass, saveResult) {
        let missingFieldsArray = saveResult.hasOwnProperty('missingFields') ? saveResult.missingFields : [];
        let errorsArray        = saveResult.hasOwnProperty('errors') ? saveResult.errors : [];

        if(missingFieldsArray.length){
            alertClass.msg += this.translator.t('you-need-to-fill-in-these-fields-in-order-to-proceed-to-the-next-step')
                + ': [' + missingFieldsArray.join(', ') + ']';

            alertClass.renderWarning();
        } else if(errorsArray.length) {
            alertClass.msg += ' ' + this.translator.t('error')
                + ': ' + errorsArray.join(', ') + '.';

            alertClass.renderWarning();
        }else{
            alertClass.msg += this.translator.t('you-can-now-continue') + ' .'
            alertClass.renderSuccess();
        }
    }

     showIncompleteStepWarning(alertClass) {
         alertClass.msg += ' ' + this.translator.t('complete-step-x-to-continue-to-y', {
            'current' : this.stepNameByKey(this.currentStepKey()),
            'next'    : this.stepNameByKey(this.nextStepKey(this.currentStepKey())),
        }) + '.';

        alertClass.renderWarning();
    }
}

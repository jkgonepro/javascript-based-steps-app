export default class Validator {
    constructor() {
        if (this.constructor === Validator) {
            throw new Error("Abstract classes can't be instantiated.");
        }

        this.data = null;
    }

    rules() {

    }

    messages() {

    }

    setData(data) {
        this.data = data;
    }

    getData() {
        return this.data;
    }

    generateMessage(messageKey, validityClass, elementClass = '') {
        this.removeMessage(messageKey);
        let html = `<div class="${validityClass} validity-${messageKey}">${this.messages()[messageKey]}</div>`;
        jQuery(`input[name=${messageKey}]`).first().parent().parent().append(html);

        this.checkIfHasTooltipSiblingAndPut(messageKey, html);
        this.checkIfNotHasTooltipSiblingAndPut(messageKey, html);

        jQuery(`input[name=${messageKey}], #${messageKey}`).addClass(elementClass);
    }

    removeMessage(messageKey,elementClass = '') {
        jQuery(`.validity-${messageKey}`).remove();
        jQuery(`input[name=${messageKey}], #${messageKey}`).removeClass(elementClass);
    }

    checkIfHasTooltipSiblingAndPut(messageKey, html) {
        if(jQuery(`#${messageKey}`).parent().siblings('.tooltip-style').length) {
            jQuery(`#${messageKey}`).first().parent().parent().append(html);
        }
    }

    checkIfNotHasTooltipSiblingAndPut(messageKey, html) {
        if(!jQuery(`#${messageKey}`).parent().siblings('.tooltip-style').length) {
            jQuery(`#${messageKey}`).parent().append(html);
        }
    }
}

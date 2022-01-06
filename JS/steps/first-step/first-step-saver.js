import DataSaver from "../../libs/dataSaver.js";
import FirstStepApi from "../../first-step/first-step-api.js";
import {
    firstStepValidator,
    successErrorAlert,
    events,
    FirstStepLayoutRender
} from "./first-step.js";
import {hideLoader, isNotEmptyObject, triggerNextStepBtnClicked} from "../main.js";
import store from '../store/index.js';

export default class FirstStepSaver extends DataSaver {
    constructor(props = {}) {
        super(props);
    }

    currentStepKey() {
        return 'first_step';
    }

    save(params) {
        let saveParams = typeof params !== 'undefined' ? params : {};
        this.validateForSave()
            .then(() => {
                let isExisting = Object.keys(store.state.items.items[params.id]).length > 0;

                FirstStepApi.save(this.format(), isExisting)
                    .then((saveResult) => {
                        this.showMessagesAfterSave(successErrorAlert, saveResult)
                        this.checkIfStepIsComplete('first_step')
                            .then(() => {
                                events.showProceedButton()
                                    .then(() => {
                                        if(saveParams.hasOwnProperty('continueOnSuccess') && saveParams.continueOnSuccess){
                                            triggerNextStepBtnClicked(FirstStepLayoutRender.getStep());
                                        }
                                    });

                            })
                            .catch(() => {
                                this.showIncompleteStepWarning(successErrorAlert);
                                events.hideProceedButton();
                            });
                    })
                    .catch(error => {
                        successErrorAlert.msg = this.formatErrorMessages(error.responseJSON);
                        successErrorAlert.renderError();

                        events.hideProceedButton();
                    });
            })
            .catch((err) =>{
                hideLoader();
            });
    }

    validateForSave() {
        let self = this;
        return new Promise(((resolve, reject) => {
            jQuery('#first_step input, #first_step .custom-select').each(function () {
                let name = jQuery(this).attr('name') ?? jQuery(this).attr('id');
                let type = jQuery(this).attr('type');
                if(firstStepValidator.rules()['save'].hasOwnProperty(name)
                    && firstStepValidator.rules()['save'][name].includes('required|save')) {
                    let value = jQuery(this).val();
                    if(type === 'radio') {
                        value = jQuery(`input[name=${name}]:checked`).val();
                        if(value === undefined) {
                            value = "";
                        }
                    }

                    self.performValidationActions(value,name);
                }
            });

            if(isNotEmptyObject(self.getFromStore(self.moduleKeyErrors))) {
                reject({
                    code    : 401,
                    message : this.translator.t('validation-failed')
                });
            }

            resolve({
                code: 200,
                message: this.translator.t('validation-succeeded')
            });
        }));
    }
}

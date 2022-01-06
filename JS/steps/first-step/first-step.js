import store from "../../store/index.js";
import FirstStepApi from "../../first-step/-api.js";
import FirstStepEvents from "../../first-step/events.js";
import {hideSpinnerLoaderNextTo, showSpinnerLoaderNextTo, showLoader, hideLoader} from "../main.js";

import RadioButton from "../components/radio-button.js";
import CustomSelect2 from "../components/custom-select2.js";
import DataFormatter from "../libs/dataFormatter.js";
import UppyFileUploader from "../components/uppy-file-uploader.js";

import BsnInput from "../components/bsn-input.js";
import EmailInput from "../components/email-input.js";
import IbanInput from "../components/iban-input.js";

import FirstStepSaver from "./saver.js";
import FirstStepValidator from "./validator.js";

import SuccessErrorAlert from "../components/successErrorAlert.js";
import Translator from '../translations/translator.js';

const FirstStepComponentsRender = {
    getStep() {
        return 'first_step';
    },
    renderGenderTypes() {
        this.translator = new Translator();

        return new Promise((resolve, reject) => {
            FirstStepApi.getGenderTypes()
                .then(response => {
                    let genders = JSON.parse(sessionStorage.getItem('items')).genderTypes;

                    let props = {
                        data : genders.sort((obj1, obj2) => obj1.id < obj2.id),
                        objectSelector: 'type',
                        radioInputName: 'gender',
                        tooltip: true,
                        tooltipClass: 'col-custom-40 base-input-style',
                        elementClass: 'col-custom-10 base-input-style'
                    }
                    let radioButton = new RadioButton(props);
                    jQuery(".main .genders > .label-field").after(radioButton.render());

                    resolve('ok');
                })
                .catch(error => {
                    reject(error)
                });
        })
    },
    renderCountrySelect() {
        this.translator = new Translator();

        return new Promise(((resolve, reject) => {
            let props = {
                element: '.country',
                objectName: FirstStepApi,
                functionName: 'getCountryByPhrase',
                functionTermParam: 'phrase',
                placeholder: this.translator.t('select-country'),
                tooltip: true,
                tooltipElement: 'countryTooltip'
            }

            let countries = new CustomSelect2(props);

            countries.toSelect2()
                .then(() => {
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        }));
    },
    renderFileUploaderField() {
        this.translator = new Translator();

        return new Promise(((resolve, reject) => {
            const uppy = new UppyFileUploader({
                modalBtnTrigger: '#mainPhoto_uploadBtn',
                modalTarget: '#mainPhotoFilesContainer',
                debug: false,
                infoShowElement: '#files-uploaded-info'
            });

            uppy.render()
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        }));
    },
    renderBsnField() {
        this.translator = new Translator();

        return new Promise(((resolve, reject) => {
            let props = {
                elementId: 'bsn',
                placeholder: '123456789',
                label: 'bsn',
                apiHandler: FirstStepApi,
                apiFunction: 'validateBsn',
                successMsg: 'âœ“ ' + this.translator.t('valid'),
                failureMsg: this.translator.t('bsn-is-invalid'),
                showLoaderWhere: '.bsn-info .col-custom-10',
                storeKey: 'first_step'
            }

            const bsnField = new OctaInput(props);

            jQuery(bsnField.render()).prependTo(".bsn-info");

            bsnField.init()
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        }));
    },
    renderEmailField() {
        this.translator = new Translator();

        return new Promise(((resolve, reject) => {
            let props = {
                elementId: 'email',
                placeholder: 'iamthebest@universe.nl',
                label: 'email',
                apiHandler: FirstStepApi,
                apiFunction: 'validateEmail',
                tooltip: false,
                successMsg: 'âœ“ ' + this.translator.t('valid'),
                failureMsg: this.translator.t('email-is-invalid'),
                elementClass: 'col-custom-245 base-input-style',
                tooltipClass: 'col-custom-40 base-input-style',
                showLoaderWhere: '.email-info .tooltip-style',
                storeKey: 'first_step'
            }

            const emailField = new EmailInput(props);

            jQuery(emailField.render()).prependTo(".email-info");

            emailField.init()
                .then(() => {
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        }));
    },
    autoCompleteAddressFields(data) {
        return new Promise(((resolve, reject) => {
            showSpinnerLoaderNextTo('.address-info div.last-child');
            FirstStepApi.autoCompleteAddress(data)
                .then(response => {
                    resolve(response);
                }).catch(error => {
                    reject(error);
                })
                .finally(() => {
                    hideSpinnerLoaderNextTo('.address-info div.last-child');
                });
        }));

    },
    autoFillFormDetails() {
        return new Promise(((resolve, reject) => {
            showLoader();
            FirstStepApi.getCachedData()
                .then(response => {
                    events.registerOnChangeEvents();
                    store.dispatch('savedData/save_updated_data', response, 'first_step');

                    resolve(response);
                }).catch(error => {
                    reject(error)
                }).then(response => {
                    events.triggerDateFieldsChange();

                    resolve(response);
                }).catch(error => {
                    reject(error)
                })
                .finally(() => {
                    hideLoader();
                });
        }));
    },
    save(params) {
        this.translator = new Translator();

        showLoader();

        let data = store.state.items.saveData;
        if(data[FirstStepComponentsRender.getStep()]
            && Object.keys(data[FirstStepComponentsRender.getStep()]).length === 0
            && data[FirstStepComponentsRender.getStep()].constructor === Object) {
            throw {
                msg: this.translator.t('the-given-data-is-invalid') + '!'
            };
        }

        if(store.state.items.itemId > 0 && data.first_step.id !== null){
            data.first_step.id = store.state.items.itemId;
        }

        FirstStepSaver.setData(data[FirstStepComponentsRender.getStep()]);
        FirstStepSaver.save(params);
    }
}

const successErrorAlert = new SuccessErrorAlert();
successErrorAlert.prependTo = '.alertsContainer';

const FirstStepValidator = new FirstStepValidator();

const FirstStepSaver = new FirstStepSaver({
    step: FirstStepComponentsRender.getStep(),
    moduleKey: 'first_step',
    moduleKeyErrors: 'first_step_errors',
    querySelector: '.main #first_step',
    validator: FirstStepValidator
});

const dataFormatter = new DataFormatter();
const events = new FirstStepEvents();
events.register();



export {FirstStepComponentsRender, FirstStepValidator, FirstStepSaver, successErrorAlert, events}

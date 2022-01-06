import store from "../../store/index.js";
import CustomEvents from "../../libs/custom-events.js";
import {FirstStepLayoutRender, firstStepSaver, successErrorAlert } from "./first-step.js";
import FirstStepTooltiper from "./first-step-tooltiper.js";
import {hideLoader, fillPCachedData, getNextStepExistingStepData} from "../../main.js";

export default class FirstStepEvents extends CustomEvents {

    constructor() {
        super();

        this.dutchCountryId    = 0;
        this.defaultDateFormat = 'dd/mm/yyyy';
    }

    getCountryNationalityId() {
        return this.dutchCountryId;
    }

    register() {
        let self = this;

        jQuery("#first_step").ready(function () {
            self.initialRendering()
                .then(() => {
                    return self.initializeDatepicker()
                })
                .then(() => {
                    return self.showHideElements();
                })
                .then(() => {
                    return self.countriesSelect2Event(self);
                })
                .then(() => {
                    return self.postCodeKeyUpEvent(self);
                })
                .then(() => {
                    return self.onCancelClick(self);
                })
                .then(() => {
                    return self.onSaveClick(self);
                })
                .then(() => {
                    return self.onContinueClick(self);
                })
                .then(() => {
                    self.registerOnChangeEvents();
                    return self.fillCachedStepData();
                })
                .then(() => {
                    self.registerOnChangeEvents();
                    self.afterRegister();
                })
                .catch(() => {
                    hideLoader();
                });
        });
    }

    afterRegister() {
        this.initializeTooltips();
    }

    initialRendering() {
        return new Promise((resolve,reject) => {
            FirstStepLayoutRender.renderGenders()
                .then(() => {
                    return FirstStepLayoutRender.renderMobilePhoneField();
                })
                .then(() => {
                    return FirstStepLayoutRender.renderFileUploaderField();
                })
                .then(() => {
                    return FirstStepLayoutRender.renderBsnField();
                })
                .then(() => {
                    return FirstStepLayoutRender.renderEmailField();
                })
                .then(() => {
                    return FirstStepLayoutRender.renderIbanFields();
                })
                .then(() => {
                    return FirstStepLayoutRender.renderNationalityField();
                })
                .then(() => {
                    return FirstStepLayoutRender.renderCountryField();
                })
                .then(() => {
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    registerEventsForStoringData() {
        return new Promise(((resolve, reject) => {
            try {
                firstStepSaver.storeInState();
                resolve();
            } catch (error) {
                reject(error);
            }
        }));
    }

    fillValidAddresses(data) {
        let streetName = '';
        let city = '';

        if(Object.keys(data).length > 0 && data.hasOwnProperty('street') && data.hasOwnProperty('city')){
            streetName = data.street;
            city       = data.city;
        }

        jQuery("#streetName").val(streetName).trigger('change');
        jQuery("#city").val(city).trigger('change');
    }

    streetNumberOnBlurEvent(self) {
        return new Promise(((resolve, reject) => {
            try {
                jQuery("#streetNumber, #extensionAddress").on('blur', function () {
                    if(jQuery("#streetNumber").val().length > 0){
                        self.disableStreetCity(true);

                        let countryData = jQuery("#first_step .country").select2('data')[0];

                        if(countryData.id === self.dutchCountryId){
                            let data = {
                                postalCode   : jQuery("#postalCode").val(),
                                extension    : jQuery("#extensionAddress").val(),
                                streetNumber : jQuery("#streetNumber").val()
                            }

                            FirstStepLayoutRender.autoCompleteAddressFields(data)
                                .then((response) => {
                                    self.fillValidAddresses(response);
                                });
                        }
                    }
                });

                resolve();
            } catch (error) {
                reject(error);
            }
        }));
    }

    postCodeKeyUpEvent() {
        return new Promise(((resolve, reject) => {
            try{
                jQuery("#postalCode").on('keyup', function () {
                    if(jQuery(this).val().length === 0){
                        jQuery("#streetNumber").addClass('hide').val('');
                        jQuery("#extensionAddress").addClass('hide').val('');
                    }else{
                        jQuery("#streetNumber").removeClass('hide');
                        jQuery("#extensionAddress").removeClass('hide');
                    }
                });

                resolve();
            } catch (error) {
                reject(error);
            }
        }));
    }

    skillSelect2Event(self) {
        return new Promise(((resolve, reject) => {
            try {
                jQuery('#first_step .skilles').on('select2:select', function () {
                    let selectedSkill = jQuery(this).select2('data')[0];

                    store.dispatch('data/addSelectedSkill', {
                        id   : selectedSkill.id,
                        text : selectedSkill.text
                    });

                    FirstStepLayoutRender.autoFillCachedData()
                        .then((response) => {
                            fillCachedData(response);
                        });
                });

                resolve();
            } catch (error) {
                reject(error);
            }
        }));
    }

    showHideElements() {
        let self = this;

        return new Promise(((resolve, reject) => {
            try {
                jQuery('#data_provider_full_form').on('click', function () {
                    jQuery('.form-group[linked_to*="#data_provider_"]').removeClass('hide');
                });

                jQuery(document).on('click', '[id^=gender_]', function () {
                    jQuery('.form-group[linked_to*="#gender_"]').removeClass('hide');
                });

                resolve();
            } catch (error) {
                reject(error);
            }
        }));
    }

    initializeDatepicker() {
        return new Promise(((resolve, reject) => {
            try {
                jQuery('#birthday').datepicker({
                    format    : this.defaultDateFormat,
                    autoclose : true,
                    clearBtn  : true,
                    weekStart : 1
                });

                resolve();
            } catch (error) {
                reject(error);
            }
        }));
    }

    onSaveClick() {
        let self = this;
        return new Promise(((resolve, reject) => {
            try {
                jQuery(`button.save-close-btn[current=${FirstStepLayoutRender.getStep()}]`).on('click', function (){
                    try{
                        FirstStepLayoutRender.save();
                        self.hideCancelButton();
                    } catch (err) {
                        successErrorAlert.msg = err.msg;
                        successErrorAlert.renderError();
                    }
                });
                resolve();
            } catch (err) {

                reject(err);
            }
        }));
    }

    onCancelClick() {
        return new Promise(((resolve, reject) => {
            try {
        let self = this;
        jQuery(`#first_step button.cancel-btn`).on('click', function (){
          self.clearFields();
          self.hideAndClearAddressFields()
            $.each( store.state.items.saveData.first_step, function (index) {
              store.dispatch('savedData/remove_data_field',{
              key:index,
                value: ''
                }, 'first_step');
            });
        });
                resolve();
            } catch (err) {

                reject(err);
            }
        }));
    }

    onContinueClick() {
        let self = this;

        return new Promise(((resolve, reject) => {
            try {
                jQuery(`button.next-step-btn[current=${FirstStepLayoutRender.getStep()}]`).on('click', function (){
                    return new Promise(((resolve, reject) => {
                            try {
                                FirstStepLayoutRender.save({ 'continueOnSuccess' : true });

                                resolve();
                            } catch (err) {
                                successErrorAlert.msg = err.msg;
                                successErrorAlert.renderError();

                                reject(err);
                            }
                        }));
                });
                resolve();
            } catch (err) {
                reject(err);
            }
        }));
    }

    initializeTooltips() {
        const tooltiper = new FirstStepTooltiper();
        tooltiper.setTooltips();
    }

    hideAndClearAddressFields() {
        jQuery("#postalCode").addClass('hide').val('');
        jQuery("#streetNumber").addClass('hide').val('');
        jQuery("#extensionAddress").addClass('hide').val('');
        jQuery("#streetName").val('');
        jQuery("#city").val('');
    }

    clearFields() {
        $('input[name=firstName]').val('');
        $('input[name=lastName]').val('');
        $('input[name=gender]').attr('checked',false);
    }

    showProceedButton() {
        return new Promise((resolve) => {
            jQuery(`#${FirstStepLayoutRender.getStep()} .next-step-btn`).removeClass('hide');

            resolve();
        })
    }

    hideProceedButton() {
        jQuery(`#${FirstStepLayoutRender.getStep()} .next-step-btn`).addClass('hide');
    }

    hideCancelButton() {
        jQuery(`#${FirstStepLayoutRender.getStep()} .cancel-btn`).addClass('hide');
    }

    onProceedButton() {
        let self = this;

        jQuery(`#${FirstStepLayoutRender.getStep()} .next-step-btn`).on('click', function () {
            getNextStepExistingStepData(jQuery(`#${FirstStepLayoutRender.getStep()} .next-step-btn`).attr('next'))
                .then((response) => {
                    fillCachedData(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        });
    }

    registerOnChangeEvents() {
        let self = this;

        self.onCheckIfStepIsComplete();
        self.onBirthDateChange();
    }

    onCheckIfStepIsComplete() {
        firstStepSaver.checkIfStepIsComplete(FirstStepLayoutRender.getStep())
            .then(() => {
                this.showProceedButton()
                    .then(() => {
                        this.onProceedButton();
                    });
            })
            .catch(() => {
                this.hideProceedButton();
            })
    }

    onBirthDateChange() {
        let self = this;
        self.initializeDatepicker();

        jQuery(`#${FirstStepLayoutRender.getStep()} #birthday`).on('change', function (event) {
            if(self.checkIfUnderage(jQuery(this).val()) < 16){
                self.showParentalInformation();
            } else {
                self.hideParentalInformation();
                self.clearParentalInformation();
            }
        });
    }

    triggerBirthDateChange() {
        jQuery(`#${FirstStepLayoutRender.getStep()} #birthday`).trigger('change');
    }

    triggerDateFieldsChange() {
        let self = this;

        self.triggerBirthDateChange();
    }

    fillCachedStepData() {
        let self = this;
        return new Promise((resolve, reject) => {
            if(store.state.items.itemId > 0) {
                getNextStepExistingStepData(FirstStepLayoutRender.getStep())
                    .then((response) => {
                        fillCachedData(response.data);

                        resolve();
                    })
                    .then((response) => {
                        self.triggerDateFieldsChange();
                        self.dispatchGenderChange();

                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    })
            } else {
                resolve();
            }
        });
    }

}

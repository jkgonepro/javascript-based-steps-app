import store from "./store/index.js";
import FillStepDataManager from "./patterns/strategy/FillStepDataManager.js";
import requests from "./libs/requests.js";
import {dataFiller} from "./components/dataFiller.js";

(function () {
    jQuery(document).ready(function () {
        clearSavedData();
        clearSavedErrors();
        initializeNextStepEvent();
        initializePreviousStepEvent();
    });
}());

function fillStepData(data) {
    Object.keys(data).forEach(function(key) {
        let fillStepDataManager = new FillStepDataManager({key: key});
        let fillStrategy = fillStepDataManager.make();
        fillStrategy.fill(data);

        jQuery(`#${key}`).trigger('blur');
    });
}

function getStepData(step) {
    return new Promise((resolve, reject) => {
        const stepItemId = store.state.items.itemId;
        if(stepItemId !== null){
            requests.get(`/api/get-step-data?step=${step}&itemId=${itemId}`)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        } else {
            reject();
        }
    });
}

function getNextStepExistingStepData(step) {
    dataFiller.step_to_fill = step;
    return dataFiller.getData();
}

function initializeNextStepEvent() {
    jQuery('.next-step-btn').on('click', function () {
        // General continue disabled: Handled in onContinueClick -> triggers -> clickNextStepBtn();
    });
}

$.fn.clickNextStepBtn = function() {
    let $nextBtn = $(this);

    let prev = $nextBtn.attr('previous');
    let curr = $nextBtn.attr('current');
    let next = $nextBtn.attr('next');

    goToNextStep(prev, next, curr);
}

function triggerNextStepBtnClicked(stepKey) {
    let $nextBtn = jQuery(`#${stepKey} .next-step-btn`);
    $nextBtn.clickNextStepBtn();
}

function initializePreviousStepEvent() {
    jQuery('.prev-step-btn').on('click', function () {
        let prev = jQuery(this).attr('previous');
        let curr = jQuery(this).attr('current');
        let next = jQuery(this).attr('next');

        goToPreviousStep(prev, next, curr);
    });
}

function goToNextStep(previous, next, current) {
    jQuery("#" + current).addClass('hide');
    jQuery("#" + next).removeClass('hide');

    jQuery("li[step=" + current + "]").removeClass('active');

    jQuery("li[step=" + next + "]").addClass('active');
}

function goToPreviousStep(previous, next, current) {
    jQuery("#" + current).addClass('hide');
    jQuery("#" + previous).removeClass('hide');

    jQuery("li[step=" + current + "]").removeClass('active');

    jQuery("li[step=" + previous + "]").addClass('active');
}

function preventDefaultNavigationSteps() {
    jQuery('.item-nav li a').preventDefault();
}

function hideLoader() {
    jQuery(".item-section .loader-wrapper").addClass('hide');
}

function showLoader() {
    jQuery(".item-section .loader-wrapper").removeClass('hide');
}

function showSpinnerLoaderNextTo(nextTo) {
    jQuery(nextTo + ' ~ .loader-spinner').removeClass('hide')
}

function hideSpinnerLoaderNextTo(nextTo) {
    jQuery(nextTo + ' ~ .loader-spinner').addClass('hide')
}

function clearSavedData() {
    store.dispatch('savedData/clearData', {}, 'first_step_errors');
    store.dispatch('savedData/clearData', {}, 'second_step_errors');
}

function clearSavedErrors() {
    store.dispatch('savedData/clearData', {}, 'first_step_errors');
    store.dispatch('savedData/clearData', {}, 'second_step_errors');
}

function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function isNotEmptyObject(object) {
    return object && object instanceof Object && Object.keys(object).length > 0;
}

function keyExistsIsTrue(object, key) {
    return object.hasOwnProperty(key) && (object.key === "true" || object.key);
}

function isEmptyString(string) {
    return string === "" && string.length === 0;
}

export {hideLoader, showLoader, showSpinnerLoaderNextTo,
    hideSpinnerLoaderNextTo, debounce, isNotEmptyObject,
    keyExistsIsTrue, isEmptyString, fillStepData,
    getStepData, getNextStepExistingStepData, triggerNextStepBtnClicked}

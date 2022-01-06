import requests from "../../libs/requests.js";
import store from "../../store/index.js";

const FirstStepAPIUrls = {
    'getStatesByPhrase': "/api/get-states/by-phrase",
    'getCountries' : '/api/get-countries',
    'validateBsn' : '/api/validate-bsn',
    'validateEmail' : '/api/validate-email',
    'validatePhone' : '/api/validate-phone',
    'validateIban' : '/api/validate-iban',
    'autocompleteAddress': '/api/autocomplete-address',
    'getFirstStep' : '/api/first-step-data/{id}',
    'save' : '/api/save-step'
};

export default {
    getStatesByPhrase(query) {
        return new Promise((resolve, reject) => {
            requests.get(FirstStepAPIUrls.get_states_by_phrase + '?' + query)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        })
    },
    getCountries() {
        return new Promise((resolve, reject) => {
            requests.get(FirstStepAPIUrls.get_countries)
                .then(response => {
                    store.dispatch('countries/addCountries', response);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        })
    },
    validateBsn(data) {
        return new Promise((resolve, reject) => {
            requests.post(FirstStepAPIUrls.validateBsn, data)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        })
    },
    validateEmail(data) {
        return new Promise((resolve, reject) => {
            requests.post(FirstStepAPIUrls.validateEmail, data)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        })
    },
    validatePhone(data) {
        return new Promise((resolve, reject) => {
            requests.post(FirstStepAPIUrls.validatePhone, data)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        })
    },
    validateIban(data) {
        return new Promise((resolve, reject) => {
            requests.post(FirstStepAPIUrls.validateIban, data)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        })
    },
    autoCompleteAddress(data) {
        return new Promise((resolve, reject) => {
            requests.post(FirstStepAPIUrls.autocompleteAddress, data)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        })
    },
    getFormDetails() {
        return new Promise((resolve, reject) => {
            let itemId = store.state.items.itemId;
            let url = FirstStepAPIUrls.getFormDetails.replace('{id}', itemId);
            requests.get(url)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        })
    },
    save(data, isExisting) {
        return new Promise((resolve, reject) => {
            function dispatches(response)
            {
                if(response.hasOwnProperty('itemId')){
                    store.dispatch('items/saveItemId', response.itemId);
                }
            }

            if(isExisting === true){
                requests.patch(FirstStepAPIUrls.save, data)
                    .then(response => {
                        dispatches(response);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            } else {
                requests.post(FirstStepAPIUrls.save, data)
                    .then(response => {
                        dispatches(response);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            }
        })
    }
}

import countriesState from './state/countries.js';
import saveDataState from './state/saveData.js';
import userInfoState from './state/user.js';

export default {
    items: {
        countries : countriesState,
        saveData  : saveDataState,
        user      : userInfoState
    }
};

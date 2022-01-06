import countriesActions from './actions/countries.js'
import userInfoActions from './actions/user.js'
import {SavedData} from "./actions/saveData.js";

export default {
    'countries' : countriesActions,
    'user'      : userInfoActions,
    'savedData' : SavedData
};

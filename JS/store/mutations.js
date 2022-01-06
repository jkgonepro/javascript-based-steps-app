import countriesMutations from './mutations/countries.js';
import userInfoMutations from './mutations/user.js';
import {SavedData} from "./mutations/saveData.js";

export default {
    'countries' : countriesMutations,
    'user'      : userInfoMutations,
    'savedData' : SavedData
};

export default {
    addCountries(context, payload) {
        context.commit('countries/addCountries', payload);
    }
};

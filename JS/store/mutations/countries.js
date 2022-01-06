export default {
    addCountries(state, payload) {
        state.items.countries.items = payload;
        sessionStorage.setItem('items', JSON.stringify(state.items));

        return state;
    }
};

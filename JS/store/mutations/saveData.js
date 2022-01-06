const SavedData = {
    save_data_field(store, payload, storeKey) {
        store.items.saveData[storeKey][payload.key] = payload.value;

        sessionStorage.setItem('items', JSON.stringify(store.items));
        return store;
    },
    remove_data_field(store, payload, storeKey) {
        delete store.items.saveData[storeKey][payload.key];

        sessionStorage.setItem('items', JSON.stringify(store.items));
        return store;
    },
    clearData(store, payload, storeKey) {
        store.items.saveData[storeKey] = payload;

        sessionStorage.setItem('items', JSON.stringify(store.items));
        return store;
    },
    save_data_field_error(store, payload, storeKey) {
        store.items.saveData[storeKey][payload.key] = payload.value;

        sessionStorage.setItem('items', JSON.stringify(store.items));
        return store;
    },
    remove_data_field_error(store, payload, storeKey) {
        delete store.items.saveData[storeKey][payload];

        sessionStorage.setItem('items', JSON.stringify(store.items));
        return store;
    },
}
export { SavedData }

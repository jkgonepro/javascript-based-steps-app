const SavedData = {
    save_data_field(context, payload, storeKey) {
        context.commit('savedData/save_data_field', payload, storeKey);
    },
    clearData(context, payload, storeKey) {
        context.commit('savedData/clearData', payload, storeKey);
    },
    save_data_field_error(context, payload, storeKey) {
        context.commit('savedData/save_data_field_error', payload, storeKey);
    },
    remove_data_field_error(context, payload, storeKey) {
        context.commit('savedData/remove_data_field_error', payload, storeKey);
    },
    remove_data_field(context, payload, storeKey) {
        context.commit('savedData/remove_data_field', payload, storeKey);
    }
}

export { SavedData }

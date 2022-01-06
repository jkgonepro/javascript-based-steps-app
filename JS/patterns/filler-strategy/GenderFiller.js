export default class GenderFiller {
    constructor(store, key) {
        this.store = store;
        this.key = key;
    }

    fill(data) {
        jQuery(`input[id='gender_${data[this.key]}'`).prop('checked', true);
    }
}

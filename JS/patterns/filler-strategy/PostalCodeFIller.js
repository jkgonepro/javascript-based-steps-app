export default class PostalCodeFiller {
    constructor(store, key) {
        this.store = store;
        this.key = key;
    }

    fill(data) {
        $(`#${this.key}`).val(data[this.key].replace(/\s+/g, '')).trigger('keyup');
    }
}

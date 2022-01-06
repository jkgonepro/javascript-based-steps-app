export default class Float {
    constructor(value) {
        this.value = typeof value !== 'undefined' ? value : null;
    }

    format() {
        return this.value.toString() !== '' ? parseFloat(this.value.replace(",", ".")).toFixed(2) : '';
    }

    formatForString() {
        if (this.value !== null) {
            return this.toFloat().toFixed(2).replace(".", ",")
        }
        return '';
    }

    valueString() {
        return this.value.toString();
    }

    toFloat() {
        if (this.value !== null) {
            // to prevent 18.825000000000003 making 18.83 and 18.825000000000001 to 18.82
            return parseFloat(parseFloat(this.value).toPrecision(5));

        }
        return 0.00;
    }

    formatToMoney(){
        return this.value.toString() !== '' ? parseFloat(this.value.replace(",", ".")).toFixed(2).replace(".",","): '';
    }
}

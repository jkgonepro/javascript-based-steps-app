export default class DataFormatter {
    constructor(data = []) {
        this.data = data;
    }

    setData(data) {
        this.data = data;
    }

    /**
     * This corresponds to data like:
     * {
     *     data: [
     *         0: {
     *             id: '',
     *             value: ''
     *         }
     *     ]
     * }
     * @returns {*[]}
     */
    formatSelect2() {
        let arrayOfJsons = [];
        for (let datum in this.data) {
            let keys = Object.keys(this.data[datum])
            arrayOfJsons.push({'id': this.data[datum][keys[0]], 'text': this.data[datum][keys[1]]})
        }

        return arrayOfJsons;
    }

    /**
     * This corresponds to data like:
     * {
     *     responseData: {
     *         1: 'Value of something with id 1'
     *     }
     * }
     * @returns {*[]}
     */
    formatFlattenedSelect2() {
        let arrayOfJsons = [];
        for (const [key, value] of Object.entries(this.data)) {
            arrayOfJsons.push({'id': key, 'text': value})
        }

        return arrayOfJsons;
    }

    /**
     * This corresponds to data like:
     * {
     *     data: [
     *         0: {
     *             id: '',
     *             value: ''
     *         }
     *     ]
     * }
     *
     * BUT with given keys
     * @returns {*[]}
     */
    formatSimpleSelect2(firstFieldKey, secondKeyField) {
        let arrayOfJsons = [];
        for (let datum in this.data) {
            arrayOfJsons.push({'id': this.data[datum][firstFieldKey], 'text': this.data[datum][secondKeyField]})
        }

        return arrayOfJsons;
    }
}

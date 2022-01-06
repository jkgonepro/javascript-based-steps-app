export default class CustomEvents {
    constructor(props = {}) {
        this.register = this.register || function () { };
        this.afterRegister = this.afterRegister || function () { };
    }
}

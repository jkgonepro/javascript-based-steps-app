import Tooltiper from "../../libs/tooltiper.js";

export default class FirstStepTooltiper extends Tooltiper {
    tooltips() {
        return {
            email: 'Dit e-mailadres wordt gebruikt.',
        }
    }

    setTooltips() {
        const delegatedElement = '#first_step';
        super.setTooltips(delegatedElement);
    }
}

export default class Tooltiper {
    constructor() {
        if (this.constructor === Tooltiper) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    tooltips() {
        return {};
    }

    setTooltips(delegatedElement = document) {
        let self = this;

        for(let tooltipKey in this.tooltips()) {
            let tooltipEl = jQuery(`i[for=${tooltipKey}]`)[0];

            if(tooltipEl !== undefined) {
                jQuery(`i[for=${tooltipKey}]`).tooltip({
                    placement: 'right',
                    title: this.tooltips()[tooltipKey]
                });
            } else {
                jQuery(delegatedElement).on('tooltip-created', `i[for=${tooltipKey}]`, function (){
                    jQuery(this).tooltip({
                        placement: 'right',
                        title: self.tooltips()[jQuery(this).attr('for')]
                    });
                })
            }
        }
    }
}

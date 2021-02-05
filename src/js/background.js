console.log("loading background script");

import Utils from "./plugins/utils.services";

class BackgroundScript extends Utils {
    constructor() {
        super();

        this.init();
    }

    init() {
        console.log("init background script");

        this.initStorage();
        this.checkFlag();
    }

    handlerStorageVars(name, data) {
        if (!localStorage[name]) localStorage[name] = data;
    }

    initStorage() {
        this.handlerStorageVars("monitorStatus", false);
        this.handlerStorageVars("monitorTimer", 2000);
    }

    checkFlag() {
        setTimeout(() => {
            if (
                localStorage.monitorStatus === "true" &&
                localStorage.monitorTimer
            ) {
                this.messenger("sendClick", null);
                this.messenger("clicksent2", null);
            }

            this.checkFlag();
        }, localStorage.monitorTimer || 5000);
    }
}

export default new BackgroundScript();

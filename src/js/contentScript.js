console.log("loading content script");

import Utils from "./plugins/utils.services";

class ContentScript extends Utils {
    constructor() {
        super();

        this.searchBTN = this._env[this._env.node_env].adm.elements.searchbtn;
        this.codes = this._env[this._env.node_env].adm.elements.codes;

        this.addListener();
    }

    addListener() {
        console.log("adding listener fn");

        chrome.runtime.onMessage.addListener((cmd, sender, sendResponse) => {
            switch (cmd) {
                case "sendClick":
                    const button = this.querySelector(this.searchBTN.id);

                    if (
                        typeof button != "undefined" &&
                        button != null &&
                        button
                    ) {
                        button.click();
                        button[
                            this.searchBTN.field
                        ] = `Searching (${new Date().getSeconds()})`;
                    }

                    sendResponse({
                        status: "Click Sent"
                    });
                    break;
                case "getCodes":
                    const codes = [];

                    this.codes.forEach(userC => {
                        userC.value = this.querySelector(userC.input)[
                            userC.field
                        ];

                        console.log(userC);

                        if (
                            codes.length > 0 &&
                            (codes.find(code => code.value === userC.value) ||
                                userC.value == "")
                        )
                            return;

                        codes.push(userC);
                    });

                    sendResponse(codes);
                    break;
                default:
                    console.log(cmd);
                    sendResponse(null);
            }
        });
    }
}

export default new ContentScript();

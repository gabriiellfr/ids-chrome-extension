console.log("loading content script");

import utils from "./plugins/utils";

const csOpts = utils.contentScriptOpts();

chrome.runtime.onMessage.addListener((cmd, sender, sendResponse) => {
    switch (cmd) {
        case "sendClick":
            const button = utils.querySelector(csOpts.searchBTN);

            if (typeof button != "undefined" && button != null && button) {
                button.click();
                button.innerText = `Searching (${new Date().getSeconds()})`;
            }

            sendResponse({
                status: "Click Sent"
            });
            break;
        case "getCodes":
            const codes = [];

            csOpts.userCodes.forEach(userC => {
                userC.value = utils.querySelector(userC.input).innerHTML;

                console.log(userC);

                if (
                    codes.length > 0 &&
                    codes.find(code => code.value === userC.value)
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

chrome.runtime.onMessage.addListener((cmd, sender, sendResponse) => {
    switch (cmd) {
        case "sendClick":
            var button = document.querySelector("[id$='SEARCH_BTN']");

            if (typeof button != "undefined" && button != null && button) {
                button.click();
                button.value();
            }

            sendResponse({
                status: "Click Sent"
            });
            break;
        case "getCodes":
            sendResponse({
                reporter: document.querySelector(
                    "[id$='zbtpartnerrep_struct.partner_no']"
                ).innerHTML,
                requester: document.querySelector(
                    "[id$='zbtpartnerreq_struct.partner_no']"
                ).innerHTML
            });
            break;
        default:
            console.log(cmd, "new");
            sendResponse(null);
    }
});

console.log("loading content script");

chrome.runtime.onMessage.addListener((cmd, sender, sendResponse) => {
    switch (cmd) {
        case "sendClick":
            var button = document.querySelector("[id$='SEARCH_BTN']");

            if (typeof button != "undefined" && button != null && button) {
                button.click();
                button.innerText = "***Searchig";
            }

            sendResponse({
                status: "Click Sent"
            });
            break;
        case "getCodes":
            var queryIDs = [
                    { name: "reporter", id: "zbtpartnerrep_struct.partner_no" },
                    { name: "requester", id: "zbtpartnerreq_struct.partner_no" }
                ],
                codes = [];

            queryIDs.forEach(query => {
                // if (document.querySelector(`[id$='${query.id}']`) == null)
                //return;

                query.value = document.querySelector(
                    `[id$='${query.id}']`
                ).innerHTML;

                if (query.name == "requester" && codes[0].value == query.value)
                    return;

                codes.push(query);
            });

            sendResponse(codes);
            break;
        default:
            console.log(cmd);
            sendResponse(null);
    }
});

console.log("loading bg");

const messenger = (cmd, sender, callback) => {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, cmd, sender, result => {
                try {
                    return callback(null, result);
                } catch (error) {
                    return callback(error);
                }
            });
        });
    },
    handlerStorageVars = (name, data) => {
        if (!localStorage[name]) localStorage[name] = data;
    },
    initStorage = () => {
        handlerStorageVars("monitorStatus", false);
        handlerStorageVars("monitorTimer", 2000);
    },
    checkFlag = () => {
        setTimeout(() => {
            if (
                localStorage.monitorStatus === "true" &&
                localStorage.monitorTimer
            ) {
                messenger("sendClick", null);
            }

            checkFlag();
        }, localStorage.monitorTimer || 5000);
    },
    init = () => {
        initStorage();
        checkFlag();
    };

$(() => {
    init();
    console.log("ready");
});

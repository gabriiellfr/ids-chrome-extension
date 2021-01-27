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
        messenger("Starting var: " + name, null);

        if (!localStorage[name]) localStorage.name = data;
    },
    initStorage = () => {
        messenger("Init storage", null);

        handlerStorageVars("monitorStatus", false);
        handlerStorageVars("monitorTimer", 2000);
    },
    init = () => {
        messenger("Starting", null);

        initStorage();
        checkFlag();
    };

$(() => {
    messenger(
        `Monitoring (${localStorage.monitorTimer}): ${localStorage.monitorStatus}`,
        null
    );
    init();
});

const checkFlag = () => {
    setTimeout(() => {
        if (
            localStorage.monitorStatus === "true" &&
            localStorage.monitorTimer
        ) {
            messenger("sendClick", null);
            messenger(
                `Monitoring (${localStorage.monitorTimer}): ${localStorage.monitorStatus}`,
                null
            );
        }

        checkFlag();
    }, localStorage.monitorTimer);
};

console.log("loading bg");

import $ from "jquery";
import utils from "./plugins/utils";

const handlerStorageVars = (name, data) => {
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
                utils.messenger("sendClick", null);
                utils.messenger("clicksent2", null);
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

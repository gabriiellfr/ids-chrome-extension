import $ from "jquery";

import env from "../../../utils/env";

class Utils {
    constructor() {
        this._env = env;
    }

    showLoading() {
        $("#loading").removeClass("d-none");
        $("#error").addClass("d-none");
    }

    hideLoading(err) {
        $("#loading").addClass("d-none");
        if (err) $("#error").removeClass("d-none");
        else $("#error").addClass("d-none");
    }

    popupInitFn() {
        $("#monitorStatus").prop(
            "checked",
            localStorage.monitorStatus === "true"
        );
        $("#monitorTimer").val(localStorage.monitorTimer);

        this.showLoading();

        $("#monitorStatus").on("change", () => {
            localStorage.monitorStatus = $("#monitorStatus").is(":checked");
        });
    }

    querySelector(element) {
        return document.querySelector(`[id$="${element}"]`);
    }

    append(element, html) {
        return $(`${element}`).append(html);
    }

    messenger(cmd, sender, callback) {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, cmd, sender, result => {
                try {
                    if (!result) throw "empty";
                    return callback(null, result);
                } catch (error) {
                    return callback(error);
                }
            });
        });
    }
}

export default Utils;

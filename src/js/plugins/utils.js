console.log("loading utils");

import $ from "jquery";
import axios from "axios";

import "../../css/popup.css";

const Utils = {
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
    },
    api() {
        return {
            PRD: "https://accounts.sap.com/service/um",
            QA: "https://accounts400.sap.com/service/um",
            PATH: {
                IDS: `?org=global&BasicAuthn=disabled&timestamp=${new Date().getTime()}`
            }
        };
    },
    apiURL(code, env) {
        return `${this.api()[env]}/${code}/${this.api().PATH.IDS}`;
    },
    async get(url, callback) {
        await axios
            .get(url)
            .then(result => {
                return callback(null, result.data);
            })
            .catch(error => {
                return callback(error);
            });
    },
    card(data) {
        return `<div class="col-sm-12">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">
                                ${data.display_name} (${data.uid})
                            </h5>
                            <p class="card-text">
                                TOTP: ${data.otp_enabled}
                            </p>
                            <p class="card-text">
                                Failed Login Attempts:
                                ${data.otp_failed_login_attempts}
                            </p>
                        </div>
                    </div>
                </div>`;
    },
    buildCards(profiles) {
        if (profiles.length == 0) return false;

        profiles.forEach(profile => {
            const card = this.card(profile);

            $("#results").append(card);
        });

        return true;
    },
    getUsersId(env, callback) {
        this.messenger("getCodes", null, (err, res) => {
            if (err || res.length == 0)
                return callback("ERROR 781 LOOK FOR ME");

            return callback(null, res);
        });
    },
    getProfiles(codes = [], env = "QA", callback) {
        if (!codes || codes.length == 0)
            return callback("ERROR: No codes found!");

        const profiles = [];

        for (const key in codes) {
            if (!codes[key]) return;

            const apiURL = this.apiURL(codes[key].value, env);
            this.get(apiURL, (err, profile) => {
                if (err) return;

                profiles.push(profile);
            });
        }

        return callback(null, profiles);
    },
    contentScriptOpts() {
        return {
            searchBTN: "SEARCH_BTN",
            userCodes: [
                {
                    name: "reporter",
                    input: "zbtpartnerrep_struct.partner_no"
                },
                {
                    name: "requester",
                    input: "zbtpartnerreq_struct.partner_no"
                }
            ]
        };
    },
    querySelector(id) {
        return document.querySelector(`[id$="${id}"]`);
    }
};

export default Utils;

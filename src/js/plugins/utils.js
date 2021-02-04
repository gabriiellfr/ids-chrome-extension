console.log("loading utils");

import $ from "jquery";
import axios from "axios";

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
    card(data, env) {
        return `<div class="col-sm-6">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="card-title">
                                ${data.display_name} (${data.uid}) ${env}
                            </h6>
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
    buildCards(profiles, env) {
        if (profiles.length == 0) return false;

        profiles.forEach(profile => {
            const card = this.card(profile, env);

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
    async getProfiles(codes = [], env = "QA", dev = true, callback) {
        if (!codes || codes.length == 0)
            return callback("ERROR1: No codes found!");

        const profiles = [];

        for (const key in codes) {
            if (!codes[key]) return;

            const apiURL = this.apiURL(codes[key].value, env);

            if (dev)
                profiles.push({
                    display_name: "Gabriel Dev",
                    uid: codes[key].value,
                    otp_enabled: true,
                    otp_failed_login_attempts: 0
                });
            else
                await this.get(apiURL, (err, profile) => {
                    if (err) return callback("ERROR2: No codes found!");

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

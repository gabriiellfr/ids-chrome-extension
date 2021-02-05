import utils from "./utils.services";
import axios from "./axios.service";

class UsersService extends utils {
    constructor() {
        super();
    }

    profileCard(profile) {
        return `<div class="col-sm-6">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="card-title">
                                ${profile.display_name} (${profile.uid})
                            </h6>
                            <p class="card-text">
                                TOTP: ${profile.otp_enabled}
                            </p>
                            <p class="card-text">
                                Failed Login Attempts:
                                ${profile.otp_failed_login_attempts}
                            </p>
                        </div>
                    </div>
                </div>`;
    }

    buildCards(profiles) {
        if (profiles.length == 0) return true;

        profiles.forEach(profile => {
            const card = this.profileCard(profile);
            this.append("#results", card);
        });

        return false;
    }

    buildUrl(code) {
        return `${this._env[this._env.node_env].adm.url}/
                ${code}/
                ${this._env[this._env.node_env].adm.path_api.end}=
                ${new Date().getTime()}`;
    }

    getUsersId(callback) {
        this.messenger("getCodes", null, (err, res) => {
            if (err || res.length == 0) return callback("ERROR 719");

            return callback(null, res);
        });
    }

    async getProfiles(codes, callback) {
        console.log(codes, "bfore");
        if (!codes || codes.length == 0) return callback("ERROR 720");

        console.log(codes, "after");

        const profiles = [];

        for (const key in codes) {
            if (!codes[key] || codes[key].value == "")
                return callback("ERROR 721");

            const apiURL = this.buildUrl(codes[key].value);

            if (this._env.node_env == "development")
                profiles.push({
                    display_name: "Gabriel Dev",
                    uid: codes[key].value,
                    otp_enabled: false,
                    otp_failed_login_attempts: 0
                });
            else
                await axios.get(apiURL, (err, profile) => {
                    if (err) return callback("ERROR 722");

                    profiles.push(profile);
                });
        }

        return callback(null, profiles);
    }
}

export default UsersService;

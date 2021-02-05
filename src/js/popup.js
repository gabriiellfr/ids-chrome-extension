console.log("popup script loaded!!");

import usersService from "./plugins/users.service";

import "../css/popup.css";

class PopupScript extends usersService {
    constructor() {
        super();

        this.popupInitFn();
        this.start();
    }

    start() {
        console.log("starting popup script");

        this.getUsersId((err, codes) => {
            if (err) return this.hideLoading(err);

            this.getProfiles(codes, (err, profiles) => {
                return this.hideLoading(err || this.buildCards(profiles));
            });
        });
    }
}

export default new PopupScript();

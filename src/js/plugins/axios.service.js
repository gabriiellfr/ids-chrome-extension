import axios from "axios";

class AxiosService {
    constructor() {}

    get(url, callback) {
        axios
            .get(url)
            .then(result => {
                return callback(null, result.data);
            })
            .catch(error => {
                return callback(error);
            });
    }

    post(url, data, callback) {
        axios
            .post(url, data)
            .then(result => {
                return callback(null, result.data);
            })
            .catch(error => {
                return callback(error);
            });
    }
}

export default new AxiosService();

import UrlLoader, { api, routes, PROXY_URL } from './Api';
import Axios from 'axios';
// upload hình -> login FB -> share 
class User {
    static info = null;

    static saveInfo(info) {
        User.info = { ...info };
        window.localStorage.setItem('user_info', JSON.stringify(User.info));
    }

    static getInfo() {
        User.info = JSON.parse(window.localStorage.getItem('user_info'));
        console.log("getInfo", User.info);
        return User.info;
    }

    static saveAuthToken(code) {
        let info = {
            ...User.info,
            auth_token: code
        }
        window.localStorage.setItem('user_info', JSON.stringify(info));
    }

    static getAuthToken() {
        let info = User.getInfo();
        let authToken = info.auth_token || -1
        return authToken;
    }
    static deleteAuthToken() {
        let info = {
            ...User.info,
            auth_token: undefined
        }
        window.localStorage.setItem('user_info', JSON.stringify(info));
    }

    static clearStorage() {
        console.log("clearStorage")
    };

    static loginToGetAuthToken = async (accessToken) => {

        // get jwt token by call api login/facebook/accesstoken....

        // Axios.get(PROXY_URL + routes.loginNoQuery + "?access_token=" + accessToken, {

        // }).then((res) => {
        //     console.log("axios login response", res);

        // }


        // )
        const response = await UrlLoader.get({
            url: PROXY_URL + routes.loginNoQuery,
            param: {
                "access_token": accessToken
            }
        });
        console.log("loginToGet authToken", response);

        if (response.statusCode === 200) {
            const responseData = response.data || {};
            const authToken = responseData.auth_token || -1;

            // save to local storage
            User.saveAuthToken(authToken);
        }
    }

    static async handleUploadImage(image) {
        let _response = {
            status: 0,
            message: "",
            data: {}
        };
        const param = {
            "image_user": image,
        }

        const response = await UrlLoader.post({
            url: PROXY_URL + routes.upload,
            isConvertToString: false,
            param: param
        });
        console.log("response", response);

        if (response.statusCode === 200) {
            const responseData = response.data || {};
            _response.data = responseData.post_id || -1;
            _response.auth_token = responseData.auth_token || -1;
            _response.message = response.responseMessage;
            _response.status = 1;

            User.saveAuthToken(_response.auth_token);
        } else {
            _response.message = response.responseMessage;
        }

        return _response;
    }
}

export default User;
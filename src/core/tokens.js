import {addAuthToken, setAuthToken, cleanAuthToken} from '../services/tokens.js';
import {is401Error} from "./errors.js";
import {isObject} from "../services/getters.js";


export default function connectTokens(http){
    http.interceptors.request.use(addAuthToken);
    http.interceptors.response.use(
        res => res,
        async function (error) {
            if(!is401Error(error)) {
                return Promise.reject(error); // ошибка, не связанная с авторизацией
            }

            cleanAuthToken();

            const refreshed = refreshAuthorization(http)
            if (!refreshed) {
                return Promise.reject(error)
            }
            return http.request(error.config);
            //return http(addAccessToken(error.config));
        }
    );
}


const refreshAuthorization = async (http) => {
    return new Promise(async resolve => {
        const { res, data } = await http.get('auth/refresh/refresh.php');
        if (!res || !isObject(data) || !data.accessToken){ resolve(false); }
        setAuthToken(data.accessToken);
        resolve(true)
    })
}

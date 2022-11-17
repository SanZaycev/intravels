import {apiActions} from "../core/actions.js";
import {path} from "../core/state.js";


export default http => ({
    async login(username, password) {
        try {
            const { data } = await http.post(path.LOGIN, { username, password }, {
                action: apiActions.LOGIN
            })
            return data
        } catch ({ response }) {
            if (typeof response !== "undefined") {
                return Promise.reject(response.data)
            }
        }
    },
    async logout(){
        try {
            const { data } = await http.post(path.LOGOUT, {
                action: apiActions.LOGOUT
            })
            return data
        } catch ({ response }) {
            if (typeof response !== "undefined") {
                return Promise.reject(response.data)
            }
        }
    },
    async register({ username, firstname, surname, email, password }) {
        try {
            const { data } = await http.post(path.REGISTER, { username, firstname, surname, email, password }, {
                action: apiActions.REGISTER
            })
            return data
        } catch ({ response }) {
            if (typeof response !== "undefined") {
                return Promise.reject(response.data)
            }
        }
    },
    async activate(uid, token) {
        try {
            await http.post(path.USER_ACTIVATE, { uid, token }, {
                action: apiActions.USER_ACTIVATE
            })
        } catch ({ response }) {
            if (typeof response !== "undefined") {
                return Promise.reject(response.data)
            }
        }
    },
    async getCtx() {
        try {
            const { data } = await http.get(path.CTX, {
                action: apiActions.BASE_CTX
            })
            return data
        } catch ({ response }) {
            if (typeof response !== "undefined") {
                return Promise.reject(response.data)
            }
        }
    }
})

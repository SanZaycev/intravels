import {apiActions} from "../core/actions.js";

export default http => ({
    async get(uri){
        try {
            const { data } = await http.get(uri, {
                action: apiActions.GET_PROFILE
            })
            return data
        } catch ({ response }) {
            if (typeof response !== "undefined") {
                return Promise.reject(response.data)
            }
        }
    },
    async change(formData){
        try {
            const { data } = await http.get(uri, formData, {
                action: apiActions.CHANGE_PROFILE
            })
            return data
        } catch ({ response }) {
            if (typeof response !== "undefined") {
                return Promise.reject(response.data)
            }
        }
    }
})

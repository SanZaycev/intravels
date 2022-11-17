import {apiActions} from "../core/actions.js";

export default http => ({
	async list(uri) {
		try {
			const { data } = await http.get(uri, {
				action: apiActions.SIGHTS_LIST
			})
			return data
		} catch ({ response }) {
			if (typeof response !== "undefined") {
				return Promise.reject(response.data)
			}
		}
	},
	async detail(uri) {
		try {
			const { data } = await http.get(uri, {
				action: apiActions.SIGHT_DETAIL
			})
			return data
		} catch ({ response }) {
			if (typeof response !== "undefined") {
				return Promise.reject(response.data)
			}
		}
	}
})

import {apiActions} from "../core/actions.js";
import {path} from "../core/state";

export default http => ({
	async list(uri) {
		try {
			const { data } = await http.get(uri, {
				action: apiActions.TOURS_LIST
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
				action: apiActions.TOUR_DETAIL
			})
			return data
		} catch ({ response }) {
			if (typeof response !== "undefined") {
				return Promise.reject(response.data)
			}
		}
	},
	async credentials(uri) {
		try {
			const { data } = await http.get(uri, {
				action: apiActions.TOUR_CREDENTIALS
			})
			return data
		} catch ({ response }) {
			if (typeof response !== "undefined") {
				return Promise.reject(response.data)
			}
		}
	},
	async credentialsList(ids) {
		try {
			const { data } = await http.post(`${path.API_TOURS}credentials-list/`, {
				action: apiActions.TOURS_LIST_CREDENTIALS,
				ids
			})
			return data
		} catch ({ response }) {
			if (typeof response !== "undefined") {
				return Promise.reject(response.data)
			}
		}
	},
	async star(uri){
		try {
			const { data } = await http.post(uri, {
				action: apiActions.STAR_TOUR
			});
			return data;
		} catch ({ response }) {
			if (typeof response !== "undefined") {
				return Promise.reject(response.data)
			}
		}
	},
	async reply(uri){
		try {
			const { data } = await http.post(uri, {
				action: apiActions.REPLY_TOUR
			});
			return data;
		} catch ({ response }) {
			if (typeof response !== "undefined") {
				return Promise.reject(response.data)
			}
		}
	},
})

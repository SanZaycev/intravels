import {base_ctx} from "../core/state.js";
import {parseObjects} from "../services/setters.js";
import {isObject} from "../services/getters.js";

export default () => ({
	namespaced: true,
	state: { ...base_ctx.profile },
	getters: {},
	mutations: {
		parse(state, data) {
			parseObjects(state, data)
		},
	},
	actions: {
		async parse({ commit }, data) {
			return new Promise(async (resolve, reject) => {
				if (isObject(data)) {
					await commit('parse', data)
					resolve(true)
				}
				reject('some problems with parse profile data ...')
			})
		}
	}
})

import {notification_ctx} from "../core/state.js";
import {parseObjects} from "../services/setters.js";
import {isObject} from "../services/getters.js";

export default () => ({
	namespaced: true,
	state: { ...notification_ctx },
	getters: {
		active: state => state.active,
		text: state => state.text,
		type: state => state.type,
		timeout: state => state.timeout,
		closable: state => state.closable,
	},
	mutations: {
		parse(state, data) {
			parseObjects(state, data)
			state.active = true
			if (state.closable){
				setTimeout(() => state.active === false, state.timeout);
			}
		},
		close(state) {
			state.active = false
		}
	},
	actions: {
		async createNotification({ commit }, data) {
			return new Promise(async (resolve, reject) => {
				if (isObject(data)) {
					await commit('parse', data)
					resolve(true)
				}
				reject('some problems with parse notification data ...')
			})
		},
		close({commit}){
			commit('close')
		}
	}
})

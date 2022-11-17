import {pagenav_ctx} from "../core/state.js";
import {isObject} from "../services/getters.js";
import {parseObjects} from "../services/setters.js";


export default () => ({
	namespaced: true,
	state: { ...pagenav_ctx },
	getters: {
		isPagenav: state => state.total_pages > 1,
		activePage: state => state.active ?? 1,
		totalPages: state => state.total_pages ?? 1,
		range: state => state.range ?? 3,
		itemsCount: state => state.count ?? 1,
		prev: state => state.prev ?? 1,
		next: state => state.next ?? 1,
		clientBase: state => state.client.base ?? "",
		clientLast: state => state.client.last ?? "",
		clientPrev: state => state.client.prev ?? "",
		clientNext: state => state.client.next ?? "",
		apiBase: state => state.api.base ?? "",
		apiLast: state => state.api.last ?? "",
		apiPrev: state => state.api.prev ?? "",
		apiNext: state => state.api.next ?? "",
		naturalTotalToursText (state){
			if (state.count > 4 && state.count < 21){ return ' туров' }
			else {
				const last_digit = Number.isInteger(state.count) ? state.count % 10 : state.count.toString().slice(-1);
				switch (last_digit){
					case 1:
						return ' тур'
					case 2:
						return ' тура'
					case 3:
						return ' тура'
					case 4:
						return ' тура'
					default:
						return ' туров'
				}
			}
		},
		naturalTotalSightsText (state){
			if (state.count > 4 && state.count < 21){ return ' достопримечательностей' }
			else {
				const last_digit = Number.isInteger(state.count) ? state.count % 10 : state.count.toString().slice(-1);
				switch (last_digit){
					case 1:
						return ' достопримечательность'
					case 2:
						return ' достопримечательности'
					case 3:
						return ' достопримечательности'
					case 4:
						return ' достопримечательности'
					default:
						return ' достопримечательностей'
				}
			}
		},
		naturalTotalGuidesText (state){
			if (state.count > 4 && state.count < 21){ return ' гидов' }
			else {
				const last_digit = Number.isInteger(state.count) ? state.count % 10 : state.count.toString().slice(-1);
				switch (last_digit){
					case 1:
						return ' гид'
					case 2:
						return ' гида'
					case 3:
						return ' гида'
					case 4:
						return ' гида'
					default:
						return ' гидов'
				}
			}
		},
	},
	mutations: {
		parsePagenav(state, pagenav) {
			if (isObject(pagenav)) {
				parseObjects(state, pagenav);
			} else {
				parseObjects(state, pagenav_ctx);
			}
			console.log("Parse new PAGENAV ========>", state)
		},
		cleanPagenav(state) {
			parseObjects(state, pagenav_ctx);
		},
	},
	actions: {
		cleanPagenav({commit}) {
			commit("cleanPagenav")
		},
		parsePagenav({commit}, pagenav) {
			commit("parsePagenav", pagenav)
		},
	}
})

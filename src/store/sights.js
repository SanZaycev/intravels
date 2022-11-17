import {sights_ctx} from "../core/state.js";
import {isObject} from "../services/getters.js";
import {parseObjects, setNullPropsObject} from "../services/setters.js";

export default sightsApi => ({
	namespaced: true,
	state: { ...sights_ctx },
	getters: {
		sightsList: state => state.list,
		sightInList: state => pk => state.list.find(_s => _s.pk === pk) ?? {},
		sight: state => state.detail,
		sightApiURL: state => state.detail.api_url ?? ""
	},
	mutations: {
		setItems(state, items){
			state.list = items;
		},
		parseDetail(state, sight) {
			parseObjects(state.detail, sight);
			console.log("Parse new SIGHT_DETAIL ========>", state.detail)
		},
		parseList(state, sights) {
			state.list = sights
			console.log("Parse new SIGHTS_LIST ========>", state.list)
		},
		cleanList(state) {
			state.list = []
		},
		cleanSight(state) {
			setNullPropsObject(state.detail);
			console.log("Cleaned SIGHT_DETAIL => ", state.detail);
		},
	},
	actions: {
		async cleanList({commit}) {
			await commit("cleanList")
			return Promise.resolve()
		},
		async cleanSight({commit}) {
			await commit("cleanSight")
			return Promise.resolve()
		},
		async parseSightsList({ commit }, sights) {
			if (Array.isArray(sights)) {
				await commit('parseList', sights)
			}
			return Promise.resolve()
		},
		parseSightDetail({ commit }, sight) {
			if (isObject(sight)) {
				commit('parseDetail', sight)
			}
		},
		async getSight({}, uri) {
			const sight = await sightsApi.detail(uri)
			return Promise.resolve(sight)
		}
	}
})

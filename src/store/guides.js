import {guides_ctx} from "../core/state.js";
import {isObject} from "../services/getters.js";
import {parseObjects, setNullPropsObject} from "../services/setters.js";

export default guidesApi => ({
	namespaced: true,
	state: { ...guides_ctx },
	getters: {
		guidesList: state => state.list,
		guideInList: state => pk => state.list.find(_g => _g.pk === pk) ?? {},
		guide: state => state.detail,
		guideApiURL: state => state.detail.api_url ?? ""
	},
	mutations: {
		setItems(state, items){
			state.list = items;
		},
		parseDetail(state, guide) {
			parseObjects(state.detail, guide);
			console.log("Parse new GUIDE_DETAIL ========>", state.detail)
		},
		parseList(state, guides) {
			state.list = guides
			console.log("Parse new GUIDES_LIST ========>", state.list)
		},
		cleanList(state) {
			state.list = []
		},
		cleanGuide(state) {
			setNullPropsObject(state.detail);
			console.log("Cleaned GUIDE_DETAIL => ", state.detail);
		},
	},
	actions: {
		async cleanList({commit}) {
			await commit("cleanList")
			return Promise.resolve()
		},
		async cleanGuide({commit}) {
			await commit("cleanGuide")
			return Promise.resolve()
		},
		async parseGuidesList({ commit }, guides) {
			if (Array.isArray(guides)) {
				await commit('parseList', guides)
			}
			return Promise.resolve()
		},
		parseGuideDetail({ commit }, guide) {
			if (isObject(guide)) {
				commit('parseDetail', guide)
			}
		},
		async getGuide({}, uri) {
			const guide = await guidesApi.detail(uri)
			return Promise.resolve(guide)
		}
	}
})

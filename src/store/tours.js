import {tours_ctx} from "../core/state.js";
import {isObject} from "../services/getters.js";
import {mergeArraysByPk, parseObjects, setNullPropsObject} from "../services/setters.js";

export default toursApi => ({
	namespaced: true,
	state: { ...tours_ctx },
	getters: {
		toursList: state => state.list,
		tourInList: state => pk => state.list.find(j => j.pk === pk) ?? {},
		tour: state => state.detail,
		tourApiURL: state => state.detail.api_url ?? "",
		isStared: state => state.detail.is_stared ?? false,
		isReplied: state => state.detail.is_replied ?? false,
		staredClass: state => state.detail.is_stared ? "stared" : "",
		repliedClass: state => state.detail.is_replied ? "replied" : ""
	},
	mutations: {
		setItems(state, items){
			state.list = items;
		},
		parseDetail(state, tour) {
			parseObjects(state.detail, tour);
			console.log("Parse new TOUR_DETAIL ========>", state.detail)
		},
		parseCredentials(state, { is_stared, is_replied }) {
			parseObjects(state.detail,{ is_stared, is_replied });
		},
		parseCredentialsInList(state, data) {
			mergeArraysByPk(state.list, data);
		},
		parseList(state, tours) {
			state.list = tours
			console.log("Parse new TOUR_LIST ========>", state.list)
		},
		cleanList(state) {
			state.list = []
		},
		cleanTour(state) {
			setNullPropsObject(state.detail);
			console.log("Cleaned TOUR_DETAIL => ", state.detail);
		},
		setTourIsReplied(state) {
			state.detail.is_replied = true
			console.log('Store setTourIsReplied: ', true)
		},
		starTour(state, data) {
			state.detail.is_stared = !!data.stared
			console.log("star tour data: ", data)
			console.log("is_stared: ", state.detail.is_stared)
		},
		replyTour(state, data) {
			state.detail.is_replied = !!data.replied
			console.log("reply tour data: ", data)
			console.log("is_replyed: ", state.detail.is_replied)
		},
		starListTour(state, { tour, data }) {
			const _tour = state.list.find(_t => _t.pk === tour.pk)
			if (_tour) {
				_tour.is_stared = !!data.stared
			}
		}
	},
	actions: {
		async cleanList({commit}) {
			await commit("cleanList")
			return Promise.resolve()
		},
		async cleanTour({commit}) {
			await commit("cleanTour")
			return Promise.resolve()
		},
		async parseToursList({ commit }, tours) {
			if (Array.isArray(tours)) {
				await commit('parseList', tours)
			}
			return Promise.resolve()
		},
		parseTourDetail({ commit }, tour) {
			if (isObject(tour)) {
				commit('parseDetail', tour)
			}
		},
		parseCredentials({ commit }, data) {
			if (isObject(data)) {
				commit('parseCredentials', data)
			}
		},
		parseCredentialsInList({ commit }, data) {
			if (Array.isArray(data)) {
				commit('parseCredentialsInList', data)
			}
		},
		async getTour({}, uri) {
			const tour = await toursApi.detail(uri)
			return Promise.resolve(tour)
		},
		async starTour({ commit }, uri) {
			const data = await toursApi.star(uri)
			commit('starTour', data)
			return Promise.resolve(data)
		},
		async replyTour({ commit }, uri) {
			const data = await toursApi.reply(uri)
			commit('replyTour', data)
			return Promise.resolve(data)
		},
		async starListTour({ commit }, tour) {
			const data = await toursApi.star(tour.api_url)
			commit('starListTour', { tour, data })
			return Promise.resolve(data)
		}
	}
})

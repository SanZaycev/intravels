import {base_ctx} from "../core/state.js";
import {cleanAuthToken, setAuthToken} from "../services/tokens.js";
import {isEmptyString, isObject} from "../services/getters.js";
import {parseObjects} from "../services/setters";


export default authApi => ({
	namespaced: true,
	state: { ...base_ctx.user },
	getters: {
		avatar: state => state.avatar_url ?? "",
		username: state => state.username ?? "",
		firstname: state => state.firstname ?? "",
		surname: state => state.surname ?? "",
		fullname: state => state.fullname ?? "",
		email: state => state.email ?? "",
		phone: state => state.phone ?? "",
		phoneCode: state => state.phone_code ?? "7",
		isAuthenticated: state => state.is_authenticated ?? false,
		checkRole: state => allowedRoles => allowedRoles.some(role => state.roles.includes(role))
	},
	mutations: {
		parse(state, data) {
			parseObjects(state, data)
		},
		logout(state) {
			parseObjects(state, base_ctx.user)
		},
	},
	actions: {
		async parse({ commit }, data) {
			return new Promise(async (resolve, reject) => {
				if (isObject(data)) {
					await commit('parse', data)
					resolve(true)
				}
				reject('Some problems with parse user data ...')
			})
		},
		async login({ commit, dispatch }, { username, password }) {
			try {
				if (isEmptyString(username)){ return Promise.reject('username is empty') }
				if (isEmptyString(password)){ return Promise.reject('password is empty') }
				const data = await authApi.login(username, password)
				if (isObject(data) && data.auth_token && data.ctx) {
					setAuthToken(data.auth_token);
					dispatch('parseCtx', data.ctx, {root:true})
					return Promise.resolve('AUTHORIZE')
				}
				return Promise.reject("Some problems with login data ...")
			} catch (error) {
				return Promise.reject(error)
			}
		},
		async logout({ dispatch }){
			try {
				const data = await authApi.logout();
				dispatch('clean')
				return Promise.resolve(data)
			} catch (error) {
				return Promise.reject(error)
			}
		},
		async register({ commit }, { username, firstname, surname, email, password }) {
			try {
				if (isEmptyString(username)){ return Promise.reject('username is empty') }
				if (isEmptyString(firstname)){ return Promise.reject('firstname is empty') }
				if (isEmptyString(surname)){ return Promise.reject('surname is empty') }
				if (isEmptyString(email)){ return Promise.reject('email is empty') }
				if (isEmptyString(password)){ return Promise.reject('password is empty') }
				const data = await authApi.register({ username, firstname, surname, email, password })
				return Promise.resolve(data)
			} catch (errors) {
				return Promise.reject(errors)
			}
		},
		async activate({ commit }, { uid, token }) {
			try {
				if (isEmptyString(uid)){ return Promise.reject('uid is empty') }
				if (isEmptyString(token)){ return Promise.reject('token is empty') }
				await authApi.activate(uid, token)
				return Promise.resolve('ACTIVATED')
			} catch (error) {
				return Promise.reject(error)
			}
		},
		clean({ commit }){
			cleanAuthToken();
			commit('logout');
		}
	}
})

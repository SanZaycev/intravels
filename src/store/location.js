import {path, areas_ctx, location_ctx, categories_ctx, viewsDescriptions, viewsTitles} from "../core/state.js";
import {
    parseArea,
    parseCategory,
    parseSearchParams,
    searchURI,
    getAreaBySlug,
    getCatBySlug,
} from "../services/location.js";
import {isBoolean, isEmptyString, isObject} from "../services/getters.js";
import {cleanObjPropsToString, parseObjects} from "../services/setters.js";


export default () => ({
    namespaced: true,
    state: {
        title: viewsTitles.DEFAULT,
        description: viewsDescriptions.DEFAULT,
        areas: { ...areas_ctx },
        categories: { ...categories_ctx },
        usingLocation: false,
        usingCrumbs: false,
        ...location_ctx,
    },
    getters: {
        title: state => state.title,
        description: state => state.description,
        isUsingLocation: state => state.usingLocation,
        isUsingCrumbs: state => state.usingCrumbs,
        navAreaTitle: state => state.area.navbar_title ?? null,
        navAreaURL: state => state.area.navbar_uri ? path.CLIENT_TOURS +  state.area.navbar_uri : null,
        isNavArea: (state, getters) => getters.navAreaTitle && getters.navAreaURL,
        areaText: state => state.area.text ?? "",
        areaClientURI: state => state.area.uri ?? "",
        areaApiURI: state => state.area.api_uri ?? "",
        areaSlug: state => state.area.slug ?? "",
        catClientURI: state => state.cat.uri ?? "",
        catApiURI: state => state.cat.api_uri ?? "",
        catText: state => state.cat.text ?? "Любая категория",
        catIcon: state => state.cat.icon ?? "icn__cat",
        catSlug: state => state.cat.slug ?? "",
        catRootSlug: state => state.cat.root_slug ?? "",
        searchWords: state => state.search.words ?? "",
        country: state => state.areas.country ?? {},
        countrySlug: state => state.areas.country && state.areas.country.slug ? state.areas.country.slug : "rossiya",
        countryTitle: state => state.areas.country && state.areas.country.longtitle ? state.areas.country.longtitle : viewsTitles.DEFAULT,
        stateTitle: state => state.areas.state && state.areas.state.longtitle ? state.areas.state.longtitle : viewsTitles.DEFAULT,
        cityTitle: state => state.areas.city && state.areas.city.longtitle ? state.areas.city.longtitle : viewsTitles.DEFAULT,
        bannerURI: state => state.sidebar.banner_url ?? path.DEFAULT_SIDEBAR_BANNER,
        bannerPR: state => state.sidebar.pr ?? path.DEFAULT_SIDEBAR_PR_URL,
        childrenAreas: state => Array.isArray(state.area.children) && state.area.children.length ? state.area.children : [],
        searchClientURI: state => searchURI(
            state.search.words,
            state.search.pay_from,
            state.search.pay_to,
            state.search.listed_days
        ),
        searchApiURI: state => searchURI(
            state.search.api_words,
            state.search.api_pay_from,
            state.search.api_pay_to,
            state.search.api_listed_days
        ),
    },
    mutations: {
        setTitle(state, title) {
            if (!isEmptyString(title)){
                state.title = title;
            }
        },
        setDescription(state, description) {
            if (!isEmptyString(description)){
                state.description = description;
            }
        },
        setArea(state, obj) {
            if (isObject(obj)) {
                parseArea(state.areas, state.area, obj).then(() => {
                    console.log("dispatch new area: ", obj)
                })
            }
        },
        setAreaText(state, text) {
            state.area.text = text
        },
        setCategory(state, obj) {
            parseCategory(state.categories, state.cat, obj).then(() => {
                console.log("dispatch new category: ", obj)
            })
        },
        setUsingLocation(state, bool) {
            state.usingLocation = bool
        },
        setUsingCrumbs(state, bool) {
            state.usingCrumbs = bool
        },
        setInitialCat(state) {
            parseObjects(state.cat, location_ctx.cat)
        },
        updateSidebar(state, data) {
            if (data.banner_url){ state.sidebar.banner_url = data.banner_url }
            if (data.pr){ state.sidebar.pr = data.pr }
        },
        parseSearchParams(state, params) {
            parseSearchParams(state.search, params)
            console.log("new search params: ", state.search)
        },
        cleanLocationSearch(state) {
            cleanObjPropsToString(state.search)
            console.log("cleaned location search => ", state.search);
        }
    },
    actions: {
        async setMeta({ commit }, { title, description }) {
            commit('setTitle', title);
            commit('setDescription', description)
        },
        async setAreaBySlug({ commit }, slug) {
            return new Promise(async (resolve, reject) => {
                try {
                    const area = await getAreaBySlug(slug)
                    if (isObject(area)) {
                        commit("setArea", area)
                        resolve(true)
                    } else {
                        reject("Can't set area by slug, area object is null")
                    }
                } catch (err) {
                    reject(err)
                }
            })
        },
        async setCatBySlug({ commit }, slug) {
            return new Promise(async (resolve, reject) => {
                try {
                    const cat = await getCatBySlug(slug)
                    if (isObject(cat)) {
                        commit("setCategory", cat)
                        resolve(true)
                    } else {
                        reject("Can't set cat by slug, category object is null")
                    }
                } catch (err) {
                    reject(err)
                }
            })
        },
        setInitialCat({commit}) {
            commit('setInitialCat')
        },
        setAreaText({ commit }, text) {
            if (!isEmptyString(text)) {
                commit('setAreaText', text)
            }
        },
        usingLocation({ commit }, bool) {
            if (isBoolean(bool)) {
                commit('setUsingLocation', bool)
            }
        },
        usingCrumbs({ commit }, bool) {
            if (isBoolean(bool)) {
                commit('setUsingCrumbs', bool)
            }
        },
        updateSidebar({ commit }, data){
            if (isObject(data)) {
                commit('updateSidebar', data)
            }
        },
        cleanLocationSearch({ commit }) {
            commit("cleanLocationSearch")
        },
        async parseSearchParams({ commit }, params) {
            return new Promise((resolve, reject) => {
                if (isObject(params)) {
                    commit("parseSearchParams", params)
                    resolve(true)
                } else {
                    reject('some problems at pushLocationSearchParam')
                }
            })
        },
    }
});

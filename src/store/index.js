import {createStore} from 'vuex'
import initUser from "./user.js";
import initTours from "./tours.js";
import initSights from "./sights.js";
import initGuides from "./guides.js";
import initGuideHome from "./guide.js";
import initProfile from "./profile.js";
import initLocation from "./location.js";
import initPagenav from "./pagenav.js";
import initAlerts from "./alerts.js";
import initNotification from "./notification.js";
import {views, appModes, getActiveView} from "../core/actions.js";
import {isBoolean, isObject} from "../services/getters.js";
import {parseObjects} from "../services/setters.js";


export default function initStore(api) {
    const user = initUser(api.auth)
    const tours = initTours(api.tours)
    const sights = initSights(api.sights)
    const guides = initGuides(api.guides)
    const guideHome = initGuideHome(api.guides)
    const profile = initProfile(api.profile)
    const location = initLocation()
    const pagenav = initPagenav()
    const alerts = initAlerts()
    const notification = initNotification()
    return createStore({
        state: {
            fetching: false,
            listFetching: false,
            activated: false,
            showUsernav: false,
            rendering: false,
            activeView: views.DEFAULT,
            mode: appModes.DEFAULT
        },
        getters: {
            activeView: state => state.activeView,
            mode: state => state.mode,
            isFetching: state => state.fetching,
            isListFetching: state => state.listFetching,
            isStoreReady: state => state.activated,
            isUsernav: state => state.showUsernav,
            isRendering: state => state.rendering,
            toursTabClass: state => state.mode === appModes.TOURS ? "active" : "default",
            profileTabClass: state => state.mode === appModes.PROFILE ? "active" : "default",
            guidesTabClass: state => state.mode === appModes.GUIDES ? "active" : "default",
            sightsTabClass: state => state.mode === appModes.SIGHTS ? "active" : "default",
            appModeClass(state) {
                switch (state.mode) {
                    case appModes.TOURS: return "w-tours"
                    case appModes.PROFILE: return "w-profile"
                    case appModes.SIGHTS: return "w-sights"
                    case appModes.GUIDES: return "w-guides"
                    case appModes.AUTH: return "w-auth"
                    case appModes.LENTA: return "w-feed"
                    case appModes.CHAT: return "w-chat"
                    default: return "w-default"
                }
            },
        },
        mutations: {
            activateStore(state) {
                state.activated = true
                console.log("STATE => ", state)
            },
            fetchingStart(state) {
                state.fetching = true
            },
            fetchingDone(state) {
                state.fetching = false
            },
            listFetchingStart(state) {
                state.listFetching = true
            },
            listFetchingDone(state) {
                state.listFetching = false
            },
            setActiveView(state, { view, mode }) {
                state.activeView = view
                state.mode = mode
                console.log("Store new view =>", view)
                console.log("Store new mode =>", mode)
            },
            parseCtx({ user, profile, cv, employer }, ctx) {
                parseObjects({ user, profile, cv, employer }, ctx)
                console.log("Store parse new ctx =>", { user, profile, cv, employer })
            },
            toggleUsernav(state) {
                state.showUsernav = !state.showUsernav
            },
            closeUsernav(state) {
                state.showUsernav = false
            },
            setUsingRendering(state, bool) {
                state.rendering = bool
            },
        },
        actions: {
            parseCtx({ commit }, ctx) {
                if (isObject(ctx)) {
                    commit('parseCtx', ctx)
                }
            },
            activateStore({ commit }) {
                commit('activateStore')
            },
            fetchingStart({commit}) {
                commit('fetchingStart')
            },
            fetchingDone({commit}) {
                commit('fetchingDone')
            },
            listFetchingStart({commit}) {
                commit('listFetchingStart')
            },
            listFetchingDone({commit}) {
                commit('listFetchingDone')
            },
            setActiveView({commit}, name) {
                commit('setActiveView', getActiveView(name))
            },
            fetchingTimeout({commit}, timeout) {
                commit('fetchingStart')
                setTimeout(() => commit('fetchingDone'), timeout)
            },
            toggleUsernav({commit}) {
                commit('toggleUsernav')
            },
            closeUsernav({commit}) {
                commit('closeUsernav')
            },
            usingRendering({ commit }, bool) {
                if (isBoolean(bool)) {
                    commit('setUsingRendering', bool)
                }
            }
        },
        modules: {
            user,
            profile,
            location,
            tours,
            sights,
            guides,
            guideHome,
            pagenav,
            alerts,
            notification
        },
        strict: process.env.NODE_ENV !== "production"
    })
}

import {path} from "./state.js";
import {views} from "./actions.js";
import {absoluteURI} from "../services/location.js";
import {isEmptyString, isObject, isTypeUndefined} from "../services/getters.js";


export default (store, api) => ({
    toursListClientURI(){
        return absoluteURI({
            base: path.CLIENT_TOURS,
            area: store.getters['location/areaClientURI'],
            cat: store.getters['location/catClientURI'],
        }) + store.getters['location/searchClientURI']
    },
    toursListApiURI(){
        return absoluteURI({
            base: path.API_TOURS,
            area: store.getters['location/areaApiURI'],
            cat: store.getters['location/catApiURI'],
        }) + store.getters['location/searchApiURI']
    },
    async parseAreasURLParams(route) {
        const _params = route.params;
        console.log('parseAreasURLParams: ', _params)
        switch (true) {
            case !isTypeUndefined(_params.country):
                await store.dispatch('location/setAreaBySlug', _params.country)
                break;
            case !isTypeUndefined(_params.state):
                await store.dispatch('location/setAreaBySlug', _params.state)
                break;
            case !isTypeUndefined(_params.city):
                await store.dispatch('location/setAreaBySlug', _params.city)
                break;
            default:
                await store.dispatch('location/setAreaBySlug', "/")
        }
        return Promise.resolve()
    },
    async parseCatURLParams(route) {
        const _params = route.params;
        console.log('parseCatURLParams: ', _params)
        switch (true) {
            case !isTypeUndefined(_params.cat):
                await store.dispatch('location/setCatBySlug', _params.cat)
                break;
            case !isTypeUndefined(_params.subcat):
                await store.dispatch('location/setCatBySlug', _params.subcat)
                break;
            default:
                await store.dispatch('location/setCatBySlug', "/")
        }
        return Promise.resolve()
    },
    async parseSearchURLParams(route) {
        const _search = route.query
        console.log("SSR _search: ", _search)
        await store.dispatch('location/parseSearchParams', ({
            words: _search.words,
            from: Number.parseInt(_search.from),
            to: Number.parseInt(_search.to),
            days: Number.parseInt(_search.days)
        }))
        return Promise.resolve()
    },
    async parseURLParams(route) {
        await this.parseAreasURLParams(route)
        await this.parseCatURLParams(route)
        await this.parseSearchURLParams(route)
        return Promise.resolve()
    },
    parseToursData(data) {
        if (isObject(data)){
            console.log("Start parse tours data ... ", data)
            if (isObject(data.list)) {
                store.dispatch('tours/parseToursList', data.list)
            }
            if (isObject(data.tour)) {
                store.dispatch('tours/parseTourDetail', data.tour)
            }
            if (isObject(data.pagenav)) {
                store.dispatch('pagenav/parsePagenav', data.pagenav)
            }
        }
    },
    async fetchToursList(route) {
        try {
            await this.parseURLParams(route)
            const page = route.query.page;
            const isPaged = page && Number.parseInt(page) > 1;
            const _api = this.toursListApiURI()
            const _client = this.toursListClientURI()
            const apiURI = isPaged
                ? isEmptyString(store.getters['location/searchApiURI'])
                ? `${_api}?page=${page}`
                : `${_api}&page=${page}`
                : _api;
            const clientURI = isPaged
                ? isEmptyString(store.getters['location/searchClientURI'])
                ? `${_client}?page=${page}`
                : `${_client}&page=${page}`
                : _client;
            const data = await api.tours.list(apiURI)
            await this.parseToursData(data)
            console.log("SSR api: ", apiURI)
            console.log("SSR client: ", clientURI)
        } catch (err) {
            return Promise.reject(err)
        }
    },
    async fetchTourDetail(route) {
        try {
            const pk = route.params.tour
            if (!isTypeUndefined(pk) && Number.parseInt(pk)){
                const data = await api.tours.detail(`${path.API_TOURS}${pk}/`)
                await this.parseToursData({ tour: data })
            } else {
                return Promise.reject("Can't get required param pk ...")
            }
        } catch (err) {
            return Promise.reject(err)
        }
    },
    async dispatch(to, view) {
        try {
            switch (view) {
                case views.TOURS_LIST:
                    await this.fetchToursList(to)
                    break;
                case views.TOUR_DETAIL:
                    await this.fetchTourDetail(to)
                    break;
                default: break;
            }
        } catch (err) {
            return Promise.reject(err)
        }
    }
})

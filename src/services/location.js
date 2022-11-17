import {path} from "../core/state.js";
import {areas} from "../store/data/areas.js";
import {categories} from "../store/data/categories.js";
import {parseObjects, setNullPropsObject} from "./setters.js";
import {isNumber, isObject} from "./getters.js";


export const capitals = {
    ru(){
        const _areas = []
        const moskva = areas[0].areas[1];
        const piter = areas[0].areas[3];
        _pushCapital(_areas, moskva, 'v-regione', 'state');
        _pushCapital(_areas, piter, 'v-regione', 'state');
        for (let i = 3; i < areas[0].areas.length; i++) {
            _pushCapital(_areas, areas[0].areas[i].areas[0], 'v-gorode', 'city');
        }
        return _areas
    },
    ua(){
        const _areas = []
        for (let i = 0; i < areas[1].areas.length; i++) {
            _pushCapital(_areas, areas[1].areas[i].areas[0], 'v-gorode', 'city');
        }
        return _areas
    },
    bel(){
        const _areas = []
        for (let i = 0; i < areas[2].areas.length; i++) {
            _pushCapital(_areas, areas[2].areas[i].areas[0], 'v-gorode', 'city');
        }
        return _areas
    },
    kz(){
        const _areas = []
        for (let i = 0; i < areas[3].areas.length; i++) {
            _pushCapital(_areas, areas[3].areas[i].areas[0], 'v-gorode', 'city');
        }
        return _areas
    },
    kgz(){
        return this.initial()
    },
    lat(){
        return this.initial()
    },
    lit(){
        return this.initial()
    },
    est(){
        return this.initial()
    },
    md(){
        return this.initial()
    },
    countries(){
        const _areas = []
        for (let i = 0; i < areas.length; i++) {
            _pushCapital(_areas, areas[i], 'in-country', 'country');
        }
        return _areas
    },
    initial(){
        const _areas = []
        const moskva = areas[0].areas[1];
        const piter = areas[0].areas[3];
        const kiev = areas[1].areas[0].areas[0];
        const minsk = areas[2].areas[0].areas[0];
        const almaty = areas[3].areas[2].areas[0];
        const bishkek = areas[6].areas[0];
        const kishinev = areas[4].areas[0];
        const tiraspol = areas[5].areas[0];
        const suhum = areas[7].areas[0];
        const chinval = areas[8].areas[0];

        _pushCapital(_areas, moskva, 'v-regione', 'state');
        _pushCapital(_areas, piter, 'v-regione', 'state');
        _pushCapital(_areas, kiev, 'v-gorode', 'city');
        _pushCapital(_areas, minsk, 'v-gorode', 'city');
        _pushCapital(_areas, almaty, 'v-gorode', 'city');
        _pushCapital(_areas, bishkek, 'v-regione', 'state');
        _pushCapital(_areas, kishinev, 'v-regione', 'state');
        _pushCapital(_areas, tiraspol, 'v-regione', 'state');
        _pushCapital(_areas, suhum, 'v-regione', 'state');
        _pushCapital(_areas, chinval, 'v-regione', 'state');
        return _areas
    },
}


const _pushCapital = (capitals, area = null, pattern = 'v-gorode', api_pattern = 'city') => {
    if (isObject(area)){
        const _area = _parsedCapital(area, pattern, api_pattern);
        if (_area.pk && (_area.title || _area.longtitle) && _area.uri && _area.api_uri) {
            capitals.push(_area)
        }
    }
}


const _parsedCapital = (obj, area_pattern, api_area_pattern) => {
    return {
        pk: obj.pk,
        title: obj.title,
        longtitle: obj.longtitle,
        slug: obj.slug,
        uri: `${area_pattern}-${obj.slug}/`,
        api_uri: `${api_area_pattern}/${obj.pk}/`,
        text: obj.title,
    }
}


export const parseArea = async (areas, area, new_obj) => {
    let is_city = false
    let is_state = false
    let is_country = false
    if (new_obj.city) {
        parseObjects(areas.city, new_obj.city)
        area.longtitle = new_obj.city.longtitle;
        area.text = new_obj.city.text;
        area.slug = new_obj.city.slug;
        area.uri = new_obj.city.uri;
        area.api_uri = new_obj.city.api_uri;
        area.navbar_title = new_obj.state ? new_obj.state.title : new_obj.city.text;
        area.navbar_uri = new_obj.state ? new_obj.state.uri : new_obj.city.uri;
        is_city = true;
    }
    if (new_obj.state) {
        parseObjects(areas.state, new_obj.state)
        if (!is_city){
            area.longtitle = new_obj.state.longtitle;
            area.text = new_obj.state.text;
            area.slug = new_obj.state.slug;
            area.uri = new_obj.state.uri;
            area.api_uri = new_obj.state.api_uri;
            area.navbar_title = new_obj.country ? new_obj.country.title : new_obj.state.text;
            area.navbar_uri = new_obj.country ? new_obj.country.uri : new_obj.state.uri;
        }
        is_state = true
    }
    if (new_obj.country) {
        parseObjects(areas.country, new_obj.country)
        if (!is_city && !is_state){
            area.longtitle = new_obj.country.longtitle;
            area.text = new_obj.country.text;
            area.slug = new_obj.country.slug;
            area.uri = new_obj.country.uri;
            area.api_uri = new_obj.country.api_uri;
            area.navbar_title = new_obj.country.title;
            area.navbar_uri = new_obj.country.uri;
        }
        is_country = true
    }
    if (Array.isArray(new_obj.children)) {
        area.children = []
        for (let i = 0; i < new_obj.children.length; i++) {
            const _area = {}
            _parseChildrenAreas(_area, new_obj.children[i]);
            area.children.push(_area)
        }
    }
    if (!is_city && !is_state && !is_country) {
        setNullPropsObject(area)
    }
}


const _parseChildrenAreas = (obj, new_obj) => {
    if (isObject(new_obj)){
        for (const [k, v] of Object.entries(new_obj)) {
            if (typeof v === "string") {
                obj[k] = v;
            } else if (typeof v === "number") {
                obj[k] = v;
            } else if (typeof v === "boolean") {
                obj[k] = v;
            } else if (Array.isArray(v)) {
                if (k === "areas") {
                    obj[k] = []
                } else {
                    obj[k] = [...v]
                }
            }
        }
    }
}


export const parseCategory = async (categories, cat, new_obj) => {
    let is_subcat = false
    let is_cat = false
    if (new_obj.subcat){
        parseObjects(categories.subcat, new_obj.subcat)
        cat.longtitle = new_obj.subcat.longtitle
        cat.text = new_obj.subcat.title
        cat.slug = new_obj.subcat.slug
        cat.uri = new_obj.subcat.uri
        cat.api_uri = new_obj.subcat.api_uri
        is_subcat = true
    }
    if (new_obj.cat){
        parseCatCtx(categories.cat, new_obj.cat)
        cat.icon = new_obj.cat.icon
        cat.root_slug = new_obj.cat.slug
        if (!is_subcat){
            cat.longtitle = new_obj.cat.longtitle
            cat.text = new_obj.cat.title
            cat.slug = new_obj.cat.slug
            cat.uri = new_obj.cat.uri
            cat.api_uri = new_obj.cat.api_uri
        }
        else { cat.text += " / " + new_obj.cat.title }
        is_cat = true
    }
    if (!is_subcat && !is_cat) {
        setNullPropsObject(cat)
        cat.text = "Любая категория";
        cat.icon = "icn__cat";
    }
}


export const parseCatCtx = (cat, new_cat) => {
    if (new_cat.pk){ cat.pk = new_cat.pk }
    if (new_cat.title){ cat.title = new_cat.title }
    if (new_cat.longtitle){ cat.longtitle = new_cat.longtitle }
    if (new_cat.description){ cat.description = new_cat.description }
    if (new_cat.slug){ cat.slug = new_cat.slug }
    if (new_cat.icon){ cat.icon = new_cat.icon }
    if (new_cat.uri){ cat.uri = new_cat.uri }
    if (new_cat.api_uri){ cat.api_uri = new_cat.api_uri }
    if (new_cat.url){ cat.url = new_cat.url }
    if (new_cat.api_url){ cat.api_url = new_cat.api_url }
    if (new_cat.banner_url){ cat.banner_url = new_cat.banner_url}
    if (new_cat.pr){ cat.pr = new_cat.pr }
}


const _filterValues = [0, 1, 3, 7, 14, 30, 9999, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 120000, 150000, 200000, 999999];


const _apiDateToString = date => {
    switch (date) {
        case 9999:
            return "updatedon=all"
        case 1:
            return "updatedon=today"
        case 3:
            return "updatedon=3days"
        case 7:
            return "updatedon=week"
        case 14:
            return "updatedon=14days"
        case 30:
            return "updatedon=month"
        default: return ""
    }
}


export const isAllowedWordsValue = (words) => {
    return !!(words && words.length && words.length < 20)
}


export const isFilterValue = (value) => {
    if (isNumber(value)){
        const _in = _filterValues.find(v => v === value)
        return !!(_in || _in === 0);
    }
    return false
}


export const parseSearchParams = (search, {
    words,
    from,
    to,
    days,
    }) => {
    if (words || words === "") {
        search.words = isAllowedWordsValue(words) ? `words=${decodeURI(words)}` : "";
        search.api_words = search.words ? `title=${decodeURI(words)}` : "";
        if (search.words === "words="){ search.words = "" }
        if (search.api_words === "title="){ search.api_words = "" }
    }
    if (from || from === 0) {
        search.pay_from = isFilterValue(from) ? `from=${from}` : "";
        search.api_pay_from = search.pay_from ? `salary_min=${from}` : "";
        if (search.pay_from === "from=0"){ search.pay_from = "" }
        if (search.api_pay_from === "salary_min=0"){ search.api_pay_from = "" }
    }
    if (to) {
        search.pay_to = isFilterValue(to) ? `to=${to}` : "";
        search.api_pay_to = search.pay_to ? `salary_max=${to}` : "";
        if (search.pay_to === "to=999999"){ search.pay_to = "" }
        if (search.api_pay_to === "salary_max=999999"){ search.api_pay_to = "" }
    }
    if (days) {
        search.listed_days = isFilterValue(days) ? `days=${days}` : "";
        search.api_listed_days = search.listed_days ? _apiDateToString(days) : "";
        if (search.listed_days === "days=9999"){ search.listed_days = "" }
        if (search.api_listed_days === "updatedon=all"){ search.api_listed_days = "" }
    }
}


export const searchURI = (words=null, from=null, to=null, days=null) => {
    if (words && from && to && days){ return `?${from}&${to}&${days}&${words}` }
    if (words && from && to){ return `?${from}&${to}&${words}` }
    if (words && from && days){ return `?${from}&${days}&${words}` }
    if (words && to && days){ return `?${to}&${days}&${words}` }
    if (from && to && days){ return `?${from}&${to}&${days}` }
    if (from && to){ return `?${from}&${to}` }
    if (from && days){ return `?${from}&${days}` }
    if (to && days){ return `?${to}&${days}` }
    if (words && from){ return `?${from}&${words}` }
    if (words && to){ return `?${to}&${words}` }
    if (words && days){ return `?${days}&${words}` }
    if (words){ return `?${words}` }
    if (from){ return `?${from}` }
    if (to){ return `?${to}` }
    if (days){ return `?${days}` }
    return ""
}


export const searchCvsURI = (words=null, days=null) => {
    if (words && days){ return `?${days}&${words}` }
    if (words){ return `?${words}` }
    if (days){ return `?${days}` }
    return ""
}


export const absoluteURI = (instance) => {
    if (isObject(instance) && instance.base){
        if (instance.area && instance.cat) {
            return `${instance.base}${instance.area}${instance.cat}`
        }
        else if (instance.area) {
            return `${instance.base}${instance.area}`
        }
        else if (instance.cat) {
            return `${instance.base}${instance.cat}`
        }
        else { return instance.base }
    }
    return null;
}


const _completeAreas = (action, areas) => {
    switch (action) {
        case "COUNTRY_AREAS":
            for (let i = 0; i < areas.length; i++){
                const a = areas[i]
                a.is_country = true;
                a.uri = `in-country-${a.slug}/`;
                a.api_uri = `country/${a.pk}/`;
                a.url = `${path.CLIENT_TOURS}in-country-${a.slug}/`;
                a.api_url = `${path.API_TOURS}country/${a.pk}/`;
                a.text = a.title;
            }
            break
        case "STATE_AREAS":
            for (let i = 0; i < areas.length; i++){
                const a = areas[i]
                a.is_state = true;
                a.uri = `in-state-${a.slug}/`;
                a.api_uri = `state/${a.pk}/`;
                a.url = `${path.CLIENT_TOURS}in-state-${a.slug}/`;
                a.api_url = `${path.API_TOURS}state/${a.pk}/`;
                a.text = a.title;
            }
            break
        case "CITY_AREAS":
            for (let i = 0; i < areas.length; i++){
                const a = areas[i]
                a.is_city = true;
                a.uri = `in-city-${a.slug}/`;
                a.api_uri = `city/${a.pk}/`;
                a.url = `${path.CLIENT_TOURS}in-city-${a.slug}/`;
                a.api_url = `${path.API_TOURS}city/${a.pk}/`;
                a.text = a.title;
            }
            break
        default: break
    }
}


export const getAreaBySlug = async (slug) => {
    return new Promise((resolve, reject) => {
        if (slug === "/"){
            resolve( {
                country: null,
                state: null,
                city: null,
                children: [],
            })
        }
        else {
            for (let i = 0; i < areas.length; i++) {
                const country = areas[i];
                if (slug.toLowerCase() === country.slug) {
                    _completeAreas("STATE_AREAS", country.areas)
                    let res = {
                        country: {
                            is_country: true,
                            pk: country.pk,
                            title: country.title,
                            longtitle: country.longtitle,
                            slug: country.slug,
                            uri: `in-country-${country.slug}/`,
                            api_uri: `country/${country.pk}/`,
                            url: `${path.CLIENT_TOURS}in-country-${country.slug}/`,
                            api_url: `${path.API_TOURS}country/${country.pk}/`,
                            desc: country.desc,
                            text: country.title,
                            coords: country.coords,
                        },
                        state: null,
                        city: null,
                        children: country.areas
                    }
                    resolve(res)
                }
                for (let s = 0; s < country.areas.length; s++) {
                    const state = country.areas[s];
                    if (slug.toLowerCase() === state.slug) {
                        let res = {
                            country: {
                                is_country: true,
                                pk: country.pk,
                                title: country.title,
                                longtitle: country.longtitle,
                                slug: country.slug,
                                uri: `in-country-${country.slug}/`,
                                api_uri: `country/${country.pk}/`,
                                url: `${path.CLIENT_TOURS}in-country-${country.slug}/`,
                                api_url: `${path.API_TOURS}country/${country.pk}/`,
                                desc: country.desc,
                                text: country.title,
                                coords: country.coords,
                            },
                            state: {
                                is_state: true,
                                pk: state.pk,
                                title: state.title,
                                longtitle: state.longtitle,
                                slug: state.slug,
                                uri: `in-state-${state.slug}/`,
                                api_uri: `state/${state.pk}/`,
                                url: `${path.CLIENT_TOURS}in-state-${state.slug}/`,
                                api_url: `${path.API_TOURS}state/${state.pk}/`,
                                desc: state.desc,
                                text: state.title + ', ' + country.title,
                                coords: state.coords,
                            },
                            city: null,
                            children: []
                        }
                        if (Array.isArray(state.areas) && state.areas.length) {
                            _completeAreas("CITY_AREAS", state.areas)
                            res.children = [ ...state.areas ]
                            res.children.push(res.country)
                        } else {
                            _completeAreas("STATE_AREAS", country.areas)
                            res.children = [ ...country.areas ]
                            res.children.push(res.country)
                        }
                        resolve(res)
                    }
                    for (let c = 0; c < state.areas.length; c++) {
                        const city = state.areas[c];
                        if (slug.toLowerCase() === city.slug) {
                            let res = {
                                country: {
                                    is_country: true,
                                    pk: country.pk,
                                    title: country.title,
                                    longtitle: country.longtitle,
                                    slug: country.slug,
                                    uri: `in-country-${country.slug}/`,
                                    api_uri: `country/${country.pk}/`,
                                    url: `${path.CLIENT_TOURS}in-country-${country.slug}/`,
                                    api_url: `${path.API_TOURS}country/${country.pk}/`,
                                    desc: country.desc,
                                    text: country.title,
                                    coords: country.coords,
                                },
                                state: {
                                    is_state: true,
                                    pk: state.pk,
                                    title: state.title,
                                    longtitle: state.longtitle,
                                    slug: state.slug,
                                    uri: `in-state-${state.slug}/`,
                                    api_uri: `state/${state.pk}/`,
                                    url: `${path.CLIENT_TOURS}in-state-${state.slug}/`,
                                    api_url: `${path.API_TOURS}state/${state.pk}/`,
                                    desc: state.desc,
                                    text: state.title + ', ' + country.title,
                                    coords: state.coords,
                                },
                                city: {
                                    is_city: true,
                                    pk: city.pk,
                                    title: city.title,
                                    longtitle: city.longtitle,
                                    slug: city.slug,
                                    uri: `in-city-${city.slug}/`,
                                    api_uri: `city/${city.pk}/`,
                                    url: `${path.CLIENT_TOURS}in-city-${city.slug}/`,
                                    api_url: `${path.API_TOURS}city/${city.pk}/`,
                                    desc: city.desc,
                                    text: city.title + ', ' + state.title,
                                    coords: city.coords,
                                },
                                children: []
                            }
                            if (Array.isArray(state.areas) && state.areas.length) {
                                _completeAreas("CITY_AREAS", state.areas)
                                res.children = [ ...state.areas ]
                                res.children.push(res.state)
                            } else {
                                _completeAreas("STATE_AREAS", country.areas)
                                res.children = [ ...country.areas ]
                                res.children.push(res.country)
                            }
                            resolve(res)
                        }
                    }
                }
            }
            reject("Area does not exist")
        }
    })
}


export const getCatBySlug = async (slug) => {
    return new Promise((resolve, reject) => {
        if (slug === "/"){
            resolve( {
                cat: null,
                subcat: null,
            })
        }
        else {
            for (let i = 0; i < categories.length; i++){
                const cat = categories[i];
                if (slug.toLowerCase() === cat.slug){
                    resolve( {
                        cat,
                        subcat: null,
                    })
                }
                for (let s = 0; s < cat.sub_list.length; s++){
                    const subcat = cat.sub_list[s];
                    if (slug.toLowerCase() === subcat.slug) {
                        resolve( {
                            cat,
                            subcat,
                        })
                    }
                }
            }
        }
        reject("Cat does not exist")
    })
}


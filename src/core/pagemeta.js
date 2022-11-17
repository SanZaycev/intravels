import {viewsDescriptions, viewsTitles} from "./state.js";
import routerNames from "../router/names.js";
import {isObject} from "../services/getters.js";


export default function connectPageMeta(context, store, router) {
    router.afterEach((to) => {
        const {
            title = viewsTitles.DEFAULT,
            description = viewsDescriptions.DEFAULT
        } = getPageMeta(to, store)

        store.dispatch('location/setMeta', { title, description })

        if (!isObject(context.meta)) {
            context.meta = {}
        }
        context.meta.title = title;
        context.meta.description = description

        if (context.appMounted) {
            setClientMeta(title, description)
        }

        if (process.__CLIENT__){ console.log("CONTEXT => ", context) }
    })
}


const setClientMeta = (title, description) => {
    if (process.__CLIENT__) {
        document.title = title;
        const meta_description = document.querySelector('meta[name="description"]')
        if (meta_description){ meta_description.setAttribute("content", description) }
    }
}


const setMeta404 = (pageMeta, route) => {
    if (Array.isArray(route.matched) && isObject(route.matched[0])){
        route.matched[0].meta.is404 = true
    }
    route.meta.is404 = true
    pageMeta.title = viewsTitles.E404
    pageMeta.description = viewsDescriptions.E404
}


const getStaticMeta = (routeName) => {
    switch (routeName) {
        case routerNames.Home:
            return {
                title: viewsTitles.HOME,
                description: viewsDescriptions.HOME
            }
        case routerNames.Login:
            return {
                title: viewsTitles.LOGIN,
                description: viewsDescriptions.LOGIN
            }
        case routerNames.Register:
            return {
                title: viewsTitles.REGISTER,
                description: viewsDescriptions.REGISTER
            }
        case routerNames.ResetPass:
            return {
                title: viewsTitles.RESET_PASS,
                description: viewsDescriptions.RESET_PASS
            }
        case routerNames.UserActivate:
            return {
                title: viewsTitles.USER_ACTIVATE,
                description: viewsDescriptions.USER_ACTIVATE
            }
        case routerNames.Profile:
            return {
                title: viewsTitles.PROFILE,
                description: viewsDescriptions.PROFILE
            }
        case routerNames.ProfileSettings:
            return {
                title: viewsTitles.PROFILE_SETTINGS,
                description: viewsDescriptions.PROFILE_SETTINGS
            }
        case routerNames.OfficeDashboard:
            return {
                title: viewsTitles.OFFICE,
                description: viewsDescriptions.OFFICE
            }
        case routerNames.OfficeOrders:
            return {
                title: viewsTitles.OFFICE_ORDERS,
                description: viewsDescriptions.OFFICE_ORDERS
            }
        case routerNames.GuideHome:
            return {
                title: viewsTitles.GUIDE_HOME,
                description: viewsDescriptions.GUIDE_HOME
            }
        case routerNames.Stars:
            return {
                title: viewsTitles.STARS,
                description: viewsDescriptions.STARS
            }
        case routerNames.StaredTours:
            return {
                title: viewsTitles.STARED_TOURS,
                description: viewsDescriptions.STARED_TOURS
            }
        case routerNames.Tours:
            return {
                title: viewsTitles.TOURS,
                description: viewsDescriptions.TOURS
            }
        case routerNames.Sights:
            return {
                title: viewsTitles.SIGHTS,
                description: viewsDescriptions.SIGHTS
            }
        case routerNames.Guides:
            return {
                title: viewsTitles.GUIDES,
                description: viewsDescriptions.GUIDES
            }
        case routerNames.Lenta:
            return {
                title: viewsTitles.LENTA,
                description: viewsDescriptions.LENTA
            }
        case routerNames.TourForm:
            return {
                title: viewsTitles.TOUR_FORM,
                description: viewsDescriptions.TOUR_FORM
            }
        case routerNames.SightForm:
            return {
                title: viewsTitles.SIGHT_FORM,
                description: viewsDescriptions.SIGHT_FORM
            }
        case routerNames.GuideForm:
            return {
                title: viewsTitles.GUIDE_FORM,
                description: viewsDescriptions.GUIDE_FORM
            }
        case routerNames.About:
            return {
                title: viewsTitles.ABOUT,
                description: viewsDescriptions.ABOUT
            }
        case routerNames.Error404:
            return {
                title: viewsTitles.E404,
                description: viewsDescriptions.E404
            }
        default:
            return {
                title: viewsTitles.DEFAULT,
                description: viewsDescriptions.DEFAULT
            }
    }
}


const getPageMeta = (route, store) => {
    const meta = {}
    switch (route.name) {
        /*case routerNames.ProductDetail:
            const product = state.products.items.find(p => p.id === Number.parseInt(route.params.id))
            console.log("getPageMeta product => ", product);
            if (!isObject(product)){
                setMeta404(meta, route)
            } else {
                meta.title =  product.title ?? viewsTitles.PRODUCT_DETAIL;
                meta.description = product.description ?? viewsDescriptions.PRODUCT_DETAIL;
            }
            break;*/
        case routerNames.Country:
            meta.title = "Country";
            meta.description = "DescriptionCountry";
            break;
        case routerNames.State:
            meta.title = "State";
            meta.description = "DescriptionState";
            break;
        case routerNames.City:
            meta.title = "City";
            meta.description = "DescriptionCity";
            break;
        case routerNames.Subscribers:
            meta.title = "Subscribers";
            meta.description = "DescriptionSubscribers";
            break;
        case routerNames.Tour:
            meta.title = "Tour";
            meta.description = "DescriptionTour";
            break;
        case routerNames.CountryTours:
            meta.title = "CountryTours";
            meta.description = "DescriptionCountryTours";
            break;
        case routerNames.CountryCategory:
            meta.title = "CountryCategory";
            meta.description = "DescriptionCountryCategory";
            break;
        case routerNames.CountrySubCategory:
            meta.title = "CountrySubCategory";
            meta.description = "DescriptionCountrySubCategory";
            break;
        case routerNames.StateTours:
            meta.title = "StateTours";
            meta.description = "DescriptionStateTours";
            break;
        case routerNames.StateCategory:
            meta.title = "StateCategory";
            meta.description = "DescriptionStateCategory";
            break;
        case routerNames.StateSubCategory:
            meta.title = "StateSubCategory";
            meta.description = "DescriptionStateSubCategory";
            break;
        case routerNames.CityTours:
            meta.title = "CityTours";
            meta.description = "DescriptionCityTours";
            break;
        case routerNames.CityCategory:
            meta.title = "CityCategory";
            meta.description = "DescriptionCityCategory";
            break;
        case routerNames.CitySubCategory:
            meta.title = "CitySubCategory";
            meta.description = "DescriptionCitySubCategory";
            break;
        case routerNames.ToursCategory:
            meta.title = "ToursCategory";
            meta.description = "DescriptionToursCategory";
            break;
        case routerNames.ToursSubCategory:
            meta.title = "ToursSubCategory";
            meta.description = "DescriptionToursSubCategory";
            break;
        case routerNames.CountrySights:
            meta.title = "CountrySights";
            meta.description = "DescriptionCountrySights";
            break;
        case routerNames.StateSights:
            meta.title = "StateSights";
            meta.description = "DescriptionStateSights";
            break;
        case routerNames.CitySights:
            meta.title = "CitySights";
            meta.description = "DescriptionCitySights";
            break;
        case routerNames.SightPlace:
            meta.title = "SightPlace";
            meta.description = "DescriptionSightPlace";
            break;
        case routerNames.CountryGuides:
            meta.title = "CountryGuides";
            meta.description = "DescriptionCountryGuides";
            break;
        case routerNames.StateGuides:
            meta.title = "StateGuides";
            meta.description = "DescriptionStateGuides";
            break;
        case routerNames.CityGuides:
            meta.title = "CityGuides";
            meta.description = "DescriptionCityGuides";
            break;
        case routerNames.GuideDetail:
            meta.title = "GuideDetail";
            meta.description = "DescriptionGuideDetail";
            break;
        default:
            const { title, description } = getStaticMeta(route.name)
            meta.title = title;
            meta.description = description
    }
    return meta
}


/*
const compilatedTitle = (
    view= views.DEFAULT,
    obj = null,
    obj_2 = null
) => {
    const obj_title = isObject(obj) && obj.longtitle ? obj.longtitle : null;
    const obj_2_title = isObject(obj_2) && obj_2.longtitle ? obj_2.longtitle : null;

    if (obj_title && obj_2_title) { return `${obj_title} | ${obj_2_title}` }
    if (obj_title) { return obj_title }
    if (obj_2_title) { return obj_2_title }
    switch (view) {
        case views.CVS_LIST: return viewsTitles.CVS
        case views.JOBS_LIST: return viewsTitles.WORKY
        default: return viewsTitles.DEFAULT
    }
}


const defaultTitle = (obj) => {
    return isObject(obj) && obj.longtitle
        ? obj.longtitle
        : isObject(obj) && obj.title
            ? obj.title
            : viewsTitles.DEFAULT
}


export const setViewTitle = (view, props={}) => {
    switch (view) {
        case views.DEFAULT: document.title = defaultTitle({longtitle: viewsTitles.DEFAULT}); break;
        case views.LOGIN: document.title = defaultTitle({longtitle: viewsTitles.LOGIN}); break;
        case views.REGISTER: document.title = defaultTitle({longtitle: viewsTitles.REGISTER}); break;
        case views.RESET_PASS: document.title = defaultTitle({longtitle: viewsTitles.RESET_PASS}); break;
        case views.USER_ACTIVATE: document.title = defaultTitle({longtitle: viewsTitles.USER_ACTIVATE}); break;
        case views.JOBS_LIST:
            document.title = compilatedTitle(view, props.profy, props.area);
            break;
        case views.JOB_DETAIL:
            const job_title = isObject(props) && props.jobTitle ? props.jobTitle : viewsTitles.DEFAULT;
            document.title = defaultTitle({longtitle: job_title});
            break;
        case views.CVS_LIST:
            document.title = compilatedTitle(view, props.profy, props.area);
            break;
        case views.CV_DETAIL:
            const cv_title = isObject(props) && props.cvTitle ? props.cvTitle : viewsTitles.DEFAULT;
            document.title = defaultTitle({longtitle: cv_title});
            break;
        case views.STARED_JOBS: document.title = defaultTitle({longtitle: viewsTitles.STARED_JOBS}); break;
        case views.STARED_CVS: document.title = defaultTitle({longtitle: viewsTitles.STARED_CVS}); break;
        case views.STARED_COURSES: document.title = defaultTitle({longtitle: viewsTitles.STARED_POSTS}); break;
        case views.EMPLOYER_HOME: document.title = defaultTitle({longtitle: viewsTitles.EMPLOYER_HOME}); break;
        // case views.EMPLOYER_DETAIL_VIEW: document.title = defaultTitle({longtitle: _VIEW}); break;
        // case views.EMPLOYER_LIST_VIEW: document.title = defaultTitle({longtitle: _VIEW}); break;
        // case views.CV_DETAIL_VIEW: document.title = defaultTitle({longtitle: _VIEW}); break;
        // case views.CV_LIST_VIEW: document.title = defaultTitle({longtitle: _VIEW}); break;
        case views.PROFILE_DASHBOARD: document.title = defaultTitle({longtitle: viewsTitles.PROFILE}); break;
        case views.COUNTRY:
            const country_title = isObject(props) && props.countryTitle ? props.countryTitle : viewsTitles.DEFAULT;
            document.title = defaultTitle({longtitle: country_title()});
            break;
        case views.STATE:
            const state_title = isObject(props) && props.stateTitle ? props.stateTitle : viewsTitles.DEFAULT;
            document.title = defaultTitle({longtitle: state_title()});
            break;
        case views.CITY:
            const city_title = isObject(props) && props.cityTitle ? props.cityTitle : viewsTitles.DEFAULT;
            document.title = defaultTitle({longtitle: city_title()});
            break;
        case views.ABOUT: document.title = defaultTitle({longtitle: viewsTitles.ABOUT}); break;
        case views.ERROR_404: document.title = defaultTitle({longtitle: viewsTitles.E404}); break;
        default: document.title = defaultTitle({longtitle: viewsTitles.DEFAULT});
    }
}
*/

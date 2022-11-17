import routerNames from "../router/names.js";

export const apiActions = {
    BASE_CTX: "auth/base-ctx",
    USER_ACTIVATE: "auth/user-activate",
    REGISTER: "auth/register",
    LOGIN: "auth/login",
    LOGOUT: "auth/logout",
    TOUR_DETAIL: "tour/detail",
    TOURS_LIST: "tours/list",
    TOUR_CREDENTIALS: "tour/credentials",
    TOURS_LIST_CREDENTIALS: "tours/credentials-list",
    CHANGE_TOUR: "change/tour",
    SIGHTS_LIST: "sights/list",
    SIGHT_DETAIL: "sight/detail",
    STAR_TOUR: "star/tour",
    REPLY_TOUR: "reply/tour",
    GUIDES_LIST: "guides/list",
    GUIDE_DETAIL: "employer/detail",
    GET_PROFILE: "get/profile",
    CHANGE_PROFILE: "change/profile",
    PAGENAV: "pagenav",
    UNAUTHORIZED: "user/unauthorized",
    SERVER_ERROR: "server/error",
    SERVER_500: "server/error:500",
    SERVER_404: "server/error:404",
    DEFAULT: "default-api-action",
}


export const views = {
    HOME: "HOME_VIEW",
    LOGIN: "LOGIN_VIEW",
    REGISTER: "REGISTER_VIEW",
    RESET_PASS: "RESET_PASS_VIEW",
    USER_ACTIVATE: "USER_ACTIVATE_VIEW",
    TOUR_FORM: "TOUR_FORM",
    SIGHT_FORM: "SIGHT_FORM",
    GUIDE_FORM: "GUIDE_FORM",
    TOURS_LIST: "TOURS_LIST_VIEW",
    SIGHTS_LIST: "SIGHTS_LIST_VIEW",
    COURSES_LIST: "COURSES_LIST_VIEW",
    TOUR_DETAIL: "TOUR_DETAIL_VIEW",
    SIGHT_PLACE: "SIGHT_PLACE_VIEW",
    COURSE_DETAIL: "COURSE_DETAIL_VIEW",
    GUIDES_LIST: "GUIDES_LIST_VIEW",
    GUIDE_DETAIL: "GUIDE_DETAIL_VIEW",
    GUIDE_HOME: "GUIDE_HOME_VIEW",
    OFFICE_BASE: "OFFICE_BASE_VIEW",
    OFFICE_DASHBOARD: "OFFICE_DASHBOARD_VIEW",
    OFFICE_ORDERS: "OFFICE_ORDERS_VIEW",
    PROFILE: "PROFILE_VIEW",
    PROFILE_SETTINGS: "PROFILE_SETTINGS_VIEW",
    STARS: "STARS_VIEW",
    STARED_TOURS: "STARED_TOURS_VIEW",
    COUNTRY: "COUNTRY_VIEW",
    STATE: "STATE_VIEW",
    CITY: "CITY_VIEW",
    ABOUT: "ABOUT_VIEW",
    ERROR_404: "ERROR_404_VIEW",
    DEFAULT: "DEFAULT_VIEW",
}


export const appModes = {
    TOURS: "TOURS_MODE",
    SIGHTS: "SIGHTS_MODE",
    GUIDES: "GUIDES_MODE",
    PROFILE: "PROFILE_MODE",
    LENTA: "LENTA_MODE",
    CHAT: "CHAT_MODE",
    AUTH: "AUTH_MODE",
    DEFAULT: "DEFAULT_MODE",
}


export const getActiveView = (routeName) => {
    switch (routeName) {
        case routerNames.Home:
            return {
                view: views.HOME,
                mode: appModes.DEFAULT
            };
        case routerNames.Login:
            return {
                view: views.LOGIN,
                mode: appModes.AUTH
            };
        case routerNames.Register:
            return {
                view: views.REGISTER,
                mode: appModes.AUTH
            };
        case routerNames.Guides:
            return {
                view: views.GUIDES_LIST,
                mode: appModes.GUIDES
            };
        case routerNames.Sights:
            return {
                view: views.SIGHTS_LIST,
                mode: appModes.SIGHTS
            };
        case routerNames.Tours:
            return {
                view: views.TOURS_LIST,
                mode: appModes.TOURS
            };
        case routerNames.Tour:
            return {
                view: views.TOUR_DETAIL,
                mode: appModes.TOURS
            };
        case routerNames.SightPlace:
            return {
                view: views.SIGHT_PLACE,
                mode: appModes.SIGHTS
            };
        case routerNames.GuideDetail:
            return {
                view: views.GUIDE_DETAIL,
                mode: appModes.GUIDES
            };
        case routerNames.Profile:
            return {
                view: views.PROFILE,
                mode: appModes.PROFILE
            };
        case routerNames.ProfileSettings:
            return {
                view: views.PROFILE_SETTINGS,
                mode: appModes.PROFILE
            };
        case routerNames.GuideHome:
            return {
                view: views.GUIDE_HOME,
                mode: appModes.GUIDES
            };
        case routerNames.OfficeBase:
            return {
                view: views.OFFICE_BASE,
                mode: appModes.GUIDES
            };
        case routerNames.OfficeDashboard:
            return {
                view: views.OFFICE_DASHBOARD,
                mode: appModes.GUIDES
            };
        case routerNames.OfficeOrders:
            return {
                view: views.OFFICE_ORDERS,
                mode: appModes.GUIDES
            };
        case routerNames.Stars:
            return {
                view: views.STARS,
                mode: appModes.DEFAULT
            };
        case routerNames.StaredTours:
            return {
                view: views.STARED_TOURS,
                mode: appModes.DEFAULT
            };
        case routerNames.CountryTours:
            return {
                view: views.TOURS_LIST,
                mode: appModes.TOURS
            };
        case routerNames.CountryCategory:
            return {
                view: views.TOURS_LIST,
                mode: appModes.TOURS
            };
        case routerNames.CountrySubCategory:
            return {
                view: views.TOURS_LIST,
                mode: appModes.TOURS
            };
        case routerNames.StateTours:
            return {
                view: views.TOURS_LIST,
                mode: appModes.TOURS
            };
        case routerNames.StateCategory:
            return {
                view: views.TOURS_LIST,
                mode: appModes.TOURS
            };
        case routerNames.StateSubCategory:
            return {
                view: views.TOURS_LIST,
                mode: appModes.TOURS
            };
        case routerNames.CityTours:
            return {
                view: views.TOURS_LIST,
                mode: appModes.TOURS
            };
        case routerNames.CityCategory:
            return {
                view: views.TOURS_LIST,
                mode: appModes.TOURS
            };
        case routerNames.CitySubCategory:
            return {
                view: views.TOURS_LIST,
                mode: appModes.TOURS
            };
        case routerNames.ToursCategory:
            return {
                view: views.TOURS_LIST,
                mode: appModes.TOURS
            };
        case routerNames.ToursSubCategory:
            return {
                view: views.TOURS_LIST,
                mode: appModes.TOURS
            };
        case routerNames.CountryGuides:
            return {
                view: views.GUIDES_LIST,
                mode: appModes.GUIDES
            };
        case routerNames.StateGuides:
            return {
                view: views.GUIDES_LIST,
                mode: appModes.GUIDES
            };
        case routerNames.CityGuides:
            return {
                view: views.GUIDES_LIST,
                mode: appModes.GUIDES
            };
        case routerNames.CountrySights:
            return {
                view: views.SIGHTS_LIST,
                mode: appModes.SIGHTS
            };
        case routerNames.StateSights:
            return {
                view: views.SIGHTS_LIST,
                mode: appModes.SIGHTS
            };
        case routerNames.CitySights:
            return {
                view: views.SIGHTS_LIST,
                mode: appModes.SIGHTS
            };
        case routerNames.TourForm:
            return {
                view: views.TOUR_FORM,
                mode: appModes.TOURS
            };
        case routerNames.SightForm:
            return {
                view: views.SIGHT_FORM,
                mode: appModes.SIGHTS
            };
        case routerNames.GuideForm:
            return {
                view: views.GUIDE_FORM,
                mode: appModes.GUIDES
            };
        case routerNames.About:
            return {
                view: views.ABOUT,
                mode: appModes.DEFAULT
            };
        case routerNames.ResetPass:
            return {
                view: views.RESET_PASS,
                mode: appModes.AUTH
            };
        case routerNames.UserActivate:
            return {
                view: views.USER_ACTIVATE,
                mode: appModes.AUTH
            };
        case routerNames.Error404:
            return {
                view: views.ERROR_404,
                mode: appModes.DEFAULT
            };
        default:
            return {
                view: views.DEFAULT,
                mode: appModes.DEFAULT
            };
    }
}

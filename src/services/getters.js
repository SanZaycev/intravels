import routerNames from "../router/names.js";


export const isObject = (obj) => {
    return typeof obj === "object" && obj !== null;
}

export const isTypeUndefined = (el) => {
    return typeof el === "undefined" || el === null;
}

export const isNumber = (el) => {
    return typeof el === "number";
}

export const isString = (el) => {
    return typeof el === "string";
}

export const isBoolean = (el) => {
    return typeof el === "boolean";
}

export const isArray = (el) => {
    return Array.isArray(el)
}

export const isEmptyString = (str) => {
    if (typeof str !== "string" || (str.trim() === "") || !str.trim()){ return true }
    return false
}

export const isNullString = (str) => {
    if (typeof str === "string"){
        switch (str){
            case "null": return true
            case "false": return true
            case "true": return true
            case "None": return true
            case "False": return true
            case "True": return true
            default: return false
        }
    }
    return true
}

export const getObjectById = (arr, id) => {
    if (Array.isArray(arr)){
        for (let i in arr){
            if (arr[i].id === id){
                return arr[i];
            }
        }
    }
    return null;
}


export const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


export const checkInputSelection = (input) => {
    if (input){
        const start = input.selectionStart;
        if ('selectionStart' in input){
            input.selectionStart = start;
            input.selectionEnd = start;
        }
    }
}


export const getObjectByPk = (arr, pk) => {
    if (typeof arr === "object"){
        for (let i in arr){
            if (arr[i].pk === pk){
                return arr[i];
            }
        }
    }
    return null;
}


export const isToursListPath = (name) => {
    switch (name) {
        case routerNames.Home: return true;
        case routerNames.Tours: return true;
        case routerNames.CountryTours: return true;
        case routerNames.StateTours: return true;
        case routerNames.CityTours: return true;
        case routerNames.CountryCategory: return true;
        case routerNames.StateCategory: return true;
        case routerNames.CityCategory: return true;
        case routerNames.CountrySubCategory: return true;
        case routerNames.StateSubCategory: return true;
        case routerNames.CitySubCategory: return true;
        case routerNames.ToursCategory: return true;
        case routerNames.ToursSubCategory: return true;
        default: return false
    }
}


export const isGuidesListPath = (name) => {
    switch (name) {
        case routerNames.Guides: return true;
        case routerNames.CountryGuides: return true;
        case routerNames.StateGuides: return true;
        case routerNames.CityGuides: return true;
        default: return false
    }
}


export const isSightsListPath = (name) => {
    switch (name) {
        case routerNames.Sights: return true;
        case routerNames.CountrySights: return true;
        case routerNames.StateSights: return true;
        case routerNames.CitySights: return true;
        default: return false
    }
}


export const isLoggedOut = (routeName) => {
    switch (routeName) {
        case routerNames.Login: return true;
        case routerNames.Register: return true;
        case routerNames.ResetPass: return true;
        case routerNames.UserActivate: return true;
        default: return false;
    }
}


export const getCurrencySymbol = (num) => {
    if (num === 0){ return "₽" }
    if (num === 1){ return "$" }
    if (num === 2){ return "€" }
    if (num === 3){ return "₴" }
    if (num === 4){ return "BYN" }
    if (num === 5){ return "₸" }
    if (num === 6){ return "MDL" }
    return "₽"
}

import {isObject} from "./getters.js";
import {toast} from "bulma-toast";


export const setToastMessage = (
    message,
    type='w-error',
    time=5000,
    position="top-right"
    ) => {
    toast({
        message: message,
        type: type,
        dismissible: true,
        pauseOnHover: true,
        duration: time,
        position: position,
    })
}


export const setErrorMessage = (err) => {
    if (isObject(err)) {
        setToastMessage(err.detail ?? err.message ?? err.toString())
    }
}


export const scrollTo = async (el, behavior="smooth") => {
    if (el){
        el.scrollIntoView({block: "start", behavior: behavior})
    }
}


export const deleteObject = (obj) => {
    if (isObject(obj)) {
        Object.keys(obj).forEach(function (prop) {
            delete obj[prop];
        });
    }
}


export const parseObjects = (obj, new_obj) => {
    if (isObject(new_obj)){
        for (const [k, v] of Object.entries(new_obj)){
            // console.log("PARSE KEY =>", k);
            if (typeof v === "string"){
                obj[k] = v;
            }
            else if (typeof v === "number"){
                obj[k] = v;
            }
            else if (typeof v === "boolean"){
                obj[k] = v;
            }
            else if (Array.isArray(v)) {
                obj[k] = [ ...v ]
                // console.log('Parse ARRAY! ============>', v, obj[k])
            }
            else if (isObject(v)){
                for (const [k2, v2] of Object.entries(v)){
                    if (typeof obj[k] === "object"){
                        if (v2 === null){
                            obj[k][k2] = null
                        }
                        else if (typeof v2 === "string"){
                            obj[k][k2] = v2;
                        }
                        else if (typeof v2 === "number"){
                            obj[k][k2] = v2;
                        }
                        else if (typeof v2 === "boolean"){
                            obj[k][k2] = v2;
                        }
                        else if (Array.isArray(v2)) {
                            obj[k][k2] = [ ...v2 ]
                            // console.log('Parse ARRAY! ============>', v2, obj[k][k2])
                        }
                        else if (isObject(v2)){
                            for (const [k3, v3] of Object.entries(v2)){
                                if (typeof obj[k][k2] === "object"){
                                    if (v3 === null){
                                        obj[k][k2][k3] = null
                                    }
                                    else if (typeof v3 === "string"){
                                        obj[k][k2][k3] = v3;
                                    }
                                    else if (typeof v3 === "number"){
                                        obj[k][k2][k3] = v3;
                                    }
                                    else if (typeof v3 === "boolean"){
                                        obj[k][k2][k3] = v3;
                                    }
                                    else if (Array.isArray(v3)) {
                                        obj[k][k2][k3] = [ ...v3 ]
                                        // console.log('ARRAY parsed! ============>', v3, obj[k][k2])
                                    }
                                    else if (typeof v3 === "object"){
                                        obj[k][k2][k3] = { ...v3 };
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}


export const mergeArraysByPk = (arr, new_arr) => {
    if (Array.isArray(arr) && Array.isArray(new_arr)){
        for (let i = 0; i < new_arr.length; i++){
            const new_obj = new_arr[i];
            const obj = arr.find(o => o.pk === new_obj.pk);
            if (obj){
                parseObjects(obj, new_obj)
            } else {
                arr.push(new_obj);
            }
        }
    }
}


export const setCookie = (name,value,days) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}


export const translit = (word) => {
    let answer = '';
    const converter = {
        'f':'а', 'd':'в', 'u':'г', 'l':'д', 't':'е', '`':'ё', ';':'ж', 'p':'з', 'b':'и', 'q':'й',
        'r':'к', 'k':'л', 'v':'м', 'y':'н', 'j':'о', 'g':'п', 'h':'р', 'c':'с', 'n':'т', 'e':'у', 'a':'ф',
        '[':'х', 'w':'ц', 'x':'ч', 'i':'ш', 'o':'щ', 'm':'ь', 's':'ы', ']': 'ъ', '':'э', '.':'ю', 'z':'я',
        'F':'А', '<':'Б', 'D':'В', 'U':'Г', 'L':'Д', 'T':'Е', '~':'Ё', ':':'Ж', 'P':'З', 'B':'И', 'Q':'Й',
        'R':'К', 'K':'Л', 'V':'М', 'Y':'Н', 'J':'О', 'G':'П', 'H':'Р', 'C':'С', 'N':'Т', 'E':'У', 'A':'Ф',
        '{':'Х', 'W':'Ц', 'X':'Ч', 'I':'Ш', 'O':'Щ', 'M':'Ь', 'S':'Ы', '}': 'Ъ', '"':'Э', '>':'Ю',  'Z':'Я',
        '!':'', '@':'', '#':'', '$':'', '%':'', '^':'', '&':'', '*':'', '(':'', ')':'', '_':'', '+':'',
        '1':'', '2':'', '3':'', '4':'', '5':'', '6':'', '7':'', '8':'', '9':'', '0':'', '-':'', '=':'', '/':''
    };
    for (let i = 0; i < word.length; i++ ){
        typeof converter[word[i]] === "undefined" ? answer += word[i] : answer += converter[word[i]];
    }
    return answer;
}

export const removeObjectByPk = (arr, pk) => {
    for (let i in arr){
        if (arr[i].pk === pk){
            arr.splice(i, 1);
            break;
        }
    }
}

export const removeElementById = (id) => {
    const el = document.getElementById(id);
    if (el){ el.remove(); }
}


export const formattedStreetValue = (street) => {
    return street.replace(/[^а-яё,.0-9\s]/gi, '').replace("  ", " ").substring(0, 100)
}

export const formattedZipcodeValue = (zipcode) => {
    return zipcode.trim().replace(" ", "").substring(0, 10);
}

export const formattedFioValue = (fio) => {
    return fio.replace(/[^а-яё\s]/gi, '').replace("  ", " ").substring(0, 40);
}


export const cleanObjPropsToString = (search) => {
    if (isObject(search)){
        Object.keys(search).forEach(function (prop) {
            search[prop] = ""
        })
    }
}


export const setNullPropsObject = (obj) => {
    if (isObject(obj)) {
        for (const [k, v] of Object.entries(obj)){
            switch (typeof v){
                case "object":
                    if (Array.isArray(v)){ obj[k] = []; }
                    else { setNullPropsObject(obj[k]) }
                    break;
                case "number":
                    obj[k] = 0
                    break;
                case "string":
                    obj[k] = ""
                    break;
                case "boolean":
                    obj[k] = false
                    break;
                default: obj[k] = null;
            }
        }
    }
}


export const setNullPropsArray = (arr) => {
    if (Array.isArray(arr)) {
        for (let i = 0; i < arr.length; i++) {
            setNullPropsObject(arr[i])
        }
    }
}

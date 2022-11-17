import { createApp, createSSRApp } from "vue";
import App from "./App.vue";
import initHttp from "./api/http.js";
import initApi from "./api/index.js";
import initStore from "./store/index.js";
import initRouter from "./router/index.js";
import initSSR from "./core/ssr.js";
import connectTokens from "./core/tokens.js";
import connectErrors from "./core/errors.js";
import connectPageMeta from "./core/pagemeta.js";


async function getApp(context) {
    try {
        let app;
        const http = await initHttp()
        const api = await initApi(http)
        const store = await initStore(api)
        const ssr = await initSSR(store, api)
        const router = await initRouter(context, api, store, ssr)

        connectTokens(http)
        connectErrors(http, store, router)
        connectPageMeta(context, store, router)

        if (process.__CLIENT__) {
            if (context.isSSR) {
                await store.replaceState(context.appState)
                console.log("context.appState => ", context.appState)
                cleanSSR()
            }
            app = createUniversalApp(store, router, context.isSSR)
            console.log("app => get client app ...")
        }
        else {
            app = createUniversalApp(store, router, true)
            console.log("app => get server app ...")
        }

        app.config.globalProperties.$api = api;
        app.config.globalProperties.$ssr = ssr;

        return { app, router, store }
    }
    catch(err) {
        console.log("app.js reject error => ", err.message)
        return Promise.reject(err)
    }
}

const createUniversalApp = (store, router, isSSR) => {
    const universalApp = isSSR ? createSSRApp : createApp;
    const app = universalApp(App)
    return app.use(store).use(router);
}

const cleanSSR = () => {
    if (window && window.hasOwnProperty('__SSR__')) {
        delete window.__SSR__
    }
    if (document) {
        const ussr = document.getElementById('ussr')
        if (ussr) { ussr.remove() }
    }
}


export default getApp;

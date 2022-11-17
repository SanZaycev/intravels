import getApp from "./app.js";
import {setErrorMessage} from "./services/setters.js";
/*import "./assets/fonts/all.css"
import "./assets/css/critical.css"
import "./assets/css/worky.css"*/

(async function(){
    const isSSR = window.hasOwnProperty('__SSR__')
    const context = {
        isSSR: isSSR,
        is404: false,
        isFirstSSR: isSSR,
        appMounted: false,
        ip: isSSR ? window.__SSR__.ip : null,
        asyncData: isSSR ? window.__SSR__.asyncData : [],
        appState: isSSR ? window.__SSR__.appState : {},
        meta: {
            title: undefined,
            description: undefined,
        }
    }
    try {
        const { app, router, store } = await getApp(context)
        router.isReady().then(() => {
            app.mount('#app')
            setTimeout(() => {
                store.dispatch('activateStore')
                context.appMounted = true
            }, 500)
        });
    } catch (err) {
        setErrorMessage(err)
    }
})();

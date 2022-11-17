import {createMemoryHistory, createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue';
import Tours from "../views/Tours.vue";
import Tour from "../components/Tour.vue";
import Sights from "../views/Sights.vue";
import SightPlace from "../components/SightPlace.vue";
import Lenta from "../views/Lenta.vue";
import Guides from "../views/Guides.vue";
import GuideHome from "../views/GuideHome.vue";
import GuideDetail from "../views/GuideDetail.vue";
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import ResetPass from '../views/ResetPass.vue';
import UserActivate from '../views/UserActivate.vue';
import Profile from '../views/Profile.vue';
import ProfileSettings from '../views/ProfileSettings.vue';
import OfficeBase from '../views/Office.vue';
import OfficeDashboard from "../components/OfficeDashboard.vue";
import OfficeOrders from '../components/OfficeOrders.vue';
import Stars from '../views/Stars.vue';
import StaredTours from '../components/StaredTours.vue';
import About from '../views/About.vue';
import E404 from '../views/E404.vue';
import {viewsTitles} from "../core/state.js";
import routerNames from "./names.js";
import {dispatchAsyncData} from "../core/async.js";


export default function initRouter(context, api, store, ssr) {
  const routes = [
    {
      path: '/',
      name: routerNames.Home,
      component: Home,
      meta: { isSSR: true }
    },
    {
      path: '/login',
      name: routerNames.Login,
      component: Login,
      meta: { isSSR: true },
      children: [{ path: '*',  redirect: { name: routerNames.Login }, replace: true }],
      beforeEnter(to, from, next) {
        context.appMounted && store.getters["user/isAuthenticated"] ? next(to.query.to ?? { name: routerNames.Profile }) : next()
      }
    },
    {
      path: '/register',
      name: routerNames.Register,
      component: Register,
      meta: { isSSR: true },
      children: [{ path: '*',  redirect: { name: routerNames.Register }, replace: true }],
      beforeEnter(to, from, next) {
        context.appMounted && store.getters["user/isAuthenticated"] ? next(to.query.to ?? { name: routerNames.Profile }) : next()
      }
    },
    {
      path: '/reset-password',
      name: routerNames.ResetPass,
      component: ResetPass,
      meta: { isSSR: false },
      children: [{ path: '*',  redirect: { name: routerNames.ResetPass }, replace: true }],
      beforeEnter(to, from, next) {
        context.appMounted && store.getters["user/isAuthenticated"] ? next(to.query.to ?? { name: routerNames.Profile }) : next()
      }
    },
    {
      path: '/activate/:uid/:token',
      name: routerNames.UserActivate,
      component: UserActivate,
      children: [{ path: '*',  redirect: { name: routerNames.UserActivate }, replace: true }],
      beforeEnter(to, from, next) {
        context.appMounted && store.getters["user/isAuthenticated"] ? next({ name: routerNames.Profile }) : next()
      }
    },
    {
      path: "/profile/",
      name: routerNames.Profile,
      meta: { isAuth: true },
      component: Profile,
      children: [{ path: '*', redirect: { name: routerNames.Profile }, replace: true }]
    },
    {
      path: "/profile/settings/",
      name: routerNames.ProfileSettings,
      meta: { isAuth: true },
      component: ProfileSettings,
      children: [{ path: '*', redirect: { name: routerNames.Profile }, replace: true }]
    },
    {
      path: '/guide-home/',
      name: 'GuideHome',
      component: GuideHome,
      meta: { isSSR: false },
      children: [{ path: '*',  redirect: { name: routerNames.GuideHome}, replace: true }]
    },
    {
      path: "/office/",
      name: routerNames.OfficeBase,
      meta: { isAuth: true },
      component: OfficeBase,
      children: [
        {
          path: "",
          name: routerNames.OfficeDashboard,
          meta: { isAuth: true },
          component: OfficeDashboard
        },
        {
          path: "orders/",
          name: routerNames.OfficeOrders,
          meta: { isAuth: true },
          component: OfficeOrders,
          children: [{ path: '*',  redirect: { name: routerNames.OfficeOrders }, replace: true }]
        }
      ]
    },
    {
      path: '/stars/',
      name: routerNames.Stars,
      component: Stars,
      meta: { isAuth: true },
      children: [
        {
          path: 'tours/',
          name: routerNames.StaredTours,
          component: StaredTours,
          meta: { isAuth: true },
          children: [{ path: '*',  redirect: { name: routerNames.StaredTours }, replace: true }]
        },
        { path: '*', redirect: { name: routerNames.Stars }, replace: true }
      ]
    },
    {
      path: '/tours/',
      name: routerNames.Tours,
      component: Tours,
      meta: { isSSR: true },
      children: [
        {
          path: 'in-country-:country/',
          name: routerNames.CountryTours,
          component: Tours,
          meta: { isSSR: true },
          children: [
            {
              path: 'on-category-:cat/',
              name: 'CountryCategory',
              component: Tours,
              meta: { isSSR: true },
              children: [{ path: '*', redirect: { name: routerNames.CountryCategory }, replace: true }]
            },
            {
              path: 'on-subcategory-:subcat/',
              name: routerNames.CountrySubCategory,
              component: Tours,
              meta: { isSSR: true },
              children: [{ path: '*', redirect: { name: routerNames.CountrySubCategory }, replace: true }]
            },
            { path: '*', redirect: { name: 'Country' }, replace: true },
          ]
        },
        {
          path: 'in-state-:state/',
          name: routerNames.StateTours,
          component: Tours,
          meta: { isSSR: true },
          children: [
            {
              path: 'on-category-:cat/',
              name: routerNames.StateCategory,
              component: Tours,
              meta: { isSSR: true },
              children: [{ path: '*', redirect: { name: routerNames.StateCategory }, replace: true }]
            },
            {
              path: 'on-subcategory-:subcat/',
              name: routerNames.StateSubCategory,
              component: Tours,
              meta: { isSSR: true },
              children: [{ path: '*', redirect: { name: routerNames.StateSubCategory }, replace: true }]
            },
            { path: '*', redirect: { name: 'State' }, replace: true },
          ]
        },
        {
          path: 'in-city-:city/',
          name: routerNames.CityTours,
          component: Tours,
          meta: { isSSR: true },
          children: [
            {
              path: 'on-category-:cat/',
              name: routerNames.CityCategory,
              component: Tours,
              meta: { isSSR: true },
              children: [{ path: '*', redirect: { name: routerNames.CityCategory }, replace: true }]
            },
            {
              path: 'on-subcategory-:subcat/',
              name: routerNames.CitySubCategory,
              component: Tours,
              meta: { isSSR: true },
              children: [{ path: '*',  redirect: { name: routerNames.CitySubCategory }, replace: true }]
            },
            { path: '*', redirect: { name: 'City' }, replace: true },
          ]
        },
        {
          path: 'on-category-:cat/',
          name: routerNames.ToursCategory,
          component: Tours,
          meta: { isSSR: true },
          children: [{ path: '*',  redirect: { name: routerNames.ToursCategory }, replace: true }]
        },
        { path: 'on-subcategory-:subcat/',
          name: routerNames.ToursSubCategory,
          component: Tours,
          meta: { isSSR: true },
          children: [{ path: '*',  redirect: { name: routerNames.ToursSubCategory }, replace: true }]
        },
        { path: ':tour/',
          name: routerNames.Tour,
          component: Tour,
          meta: { isSSR: true },
          children: [{ path: '*',  redirect: { name: routerNames.Tour }, replace: true }]
        },
        { path: '*', redirect: { name: routerNames.Tours }, replace: true },
      ],
    },
    {
      path: '/sights/',
      name: routerNames.Sights,
      component: Sights,
      meta: { isSSR: true },
      children: [
        {
          path: 'in-country-:country/',
          name: routerNames.CountrySights,
          component: Sights,
          meta: { isSSR: true },
          children: [
            { path: '*', redirect: { name: routerNames.CountrySights }, replace: true },
          ]
        },
        {
          path: 'in-state-:state/',
          name: routerNames.StateSights,
          component: Sights,
          meta: { isSSR: true },
          children: [
            { path: '*', redirect: { name: routerNames.StateSights }, replace: true },
          ]
        },
        {
          path: 'in-city-:city/',
          name: routerNames.CitySights,
          component: Sights,
          meta: { isSSR: true },
          children: [
            { path: '*', redirect: { name: routerNames.CountrySights }, replace: true },
          ]
        },
        { path: ':place/',
          name: routerNames.SightPlace,
          component: SightPlace,
          meta: { isSSR: true },
          children: [{ path: '*',  redirect: { name: routerNames.SightPlace }, replace: true }]
        },
        { path: '*', redirect: { name: routerNames.Sights }, replace: true },
      ],
    },
    {
      path: '/guides/',
      name: routerNames.Guides,
      component: Guides,
      meta: { isSSR: true },
      children: [
        {
          path: 'in-country-:country/',
          name: routerNames.CountryGuides,
          component: Guides,
          meta: { isSSR: true },
          children: [
            { path: '*', redirect: { name: routerNames.CountryGuides }, replace: true },
          ]
        },
        {
          path: 'in-state-:state/',
          name: routerNames.StateGuides,
          component: Guides,
          meta: { isSSR: true },
          children: [
            { path: '*', redirect: { name: routerNames.StateGuides }, replace: true },
          ]
        },
        {
          path: 'in-city-:city/',
          name: routerNames.CityGuides,
          component: Guides,
          meta: { isSSR: true },
          children: [
            { path: '*', redirect: { name: routerNames.CountryGuides }, replace: true },
          ]
        },
        {
          path: ':id/',
          name: routerNames.GuideDetail,
          component: GuideDetail,
          meta: { isSSR: true }
        },
        { path: '*', redirect: { name: routerNames.GuideDetail }, replace: true },
      ],
    },
    {
      path: '/feed/',
      name: routerNames.Lenta,
      component: Lenta,
      meta: { isSSR: true },
      children: [{ path: '*',  redirect: { name: routerNames.Lenta }, replace: true }]
    },
    {
      path: "/about/",
      name: routerNames.About,
      component: About,
      meta: { isSSR: true },
      children: [{ path: '*',  redirect: { name: routerNames.Lenta }, replace: true }]
    },
    {
      name: "Error404",
      path: "/:any(.*)",
      component: E404,
      meta: { is404: true }
    }
  ]

  const router = createRouter({
    history: process.__SERVER__ ? createMemoryHistory() : createWebHistory(process.env.BASE_URL),
    linkActiveClass: "active",
    linkExactActiveClass: "active",
    routes
  })

  router.beforeEach(async(to, from, next) => {
    context.isSSR = to.matched.some(r => r.meta.isSSR) || typeof to.meta.isSSR !== "undefined"
    context.is404 = to.matched.some(r => r.meta.is404) || typeof to.meta.is404 !== "undefined"

    await store.dispatch('setActiveView', to.name)

    if (process.__CLIENT__ && to.meta.isAuth && !store.getters["user/isAuthenticated"]) {
      next({name: routerNames.Login, query: {to: to.path}})
      document.title = viewsTitles.LOGIN
    } else if (!context.appMounted) {
      try {
        if (process.__SERVER__ && context.isSSR){
          await ssr.dispatch(to, store.getters['activeView'])
        }
        await dispatchAsyncData(context, api, to)
        next()
      } catch(err){
        console.log("SSR error: ", err);
        next()
      }
    } else {
      next()
    }
  });

  return router
}

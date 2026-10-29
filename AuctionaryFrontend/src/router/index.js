import {createRouter, createWebHistory} from 'vue-router';

import Home from "../views/pages/Home.vue"
import Login from '../views/pages/Login.vue'
import NotFound from '../views/pages/NotFound.vue'
import CreateAccount from '../views/pages/CreateAccount.vue'
import UserInfo from "../views/pages/UserInfo.vue"
import Search from '../views/pages/Search.vue'
import ItemDetails from '../views/pages/ItemDetails.vue'
import CreateItem from '../views/pages/CreateItem.vue'

const isAuthenticated = (to,from,next)=>{
    const loggedIn = localStorage.getItem('session_token');
    if(loggedIn){
        
        next()
        return;
    }

    next('/Login')
}

const isLoggedIn = (to, from, next) => {
    const loggedIn = localStorage.getItem('session_token');
    if(!loggedIn){
        next()
        return;
    }
     next('/');
}

const routes = [
    {path: "/", component: Home},
    {path: "/item/:id", component: ItemDetails},
    {path: "/user/:userId", component: UserInfo},
    {path: "/create-item", component: CreateItem, beforeEnter: isAuthenticated},
    {path: "/login", component: Login, beforeEnter: isLoggedIn},
    {path: "/createaccount", component: CreateAccount, beforeEnter: isLoggedIn},
    {path: "/profiledetails", component: UserInfo, beforeEnter: isAuthenticated},
    {path: "/search", component: Search},
    {path: "/:pathMatch(.*)*", component: NotFound}
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})



export default router;
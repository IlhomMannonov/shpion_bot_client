<template>
  <div class="location-page">
    <div class="card">
      <h1>😄 Do‘sting senga hazil qildi</h1>

      <p class="desc">
        Sizga do‘stingiz hazil qildi va sizning lokatsiyangiz yoki rasmingizni oldi.
        Endi navbat sizda 😉
      </p>

      <p class="desc highlight">
        Siz ham bunday qila olasiz — faqat bizning botimiz orqali!
      </p>

      <button class="btn" @click="openBot">
        🤖 Botni ishlatish
      </button>

    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      bot_username: null
    }

  },
  name: "prankPage",
  methods: {
    getSessionId() {
      return this.$route.params.id
    },
    async loadInfo() {
      try {
        const id = this.getSessionId()

        if (!id) return

        const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_API}/api/info/${id}`
        )

        this.bot_username = res.data.bot;

      } catch (err) {
        console.error('API xato:', err)
      }
    },
    openBot() {
      window.open(this.bot_username, '_blank')
    }

  },
  mounted() {
    this.loadInfo()
  }

}
</script>

<style scoped>
.location-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  padding: 20px;
  font-family: Arial, sans-serif;
}

.card {
  max-width: 420px;
  background: #ffffff;
  border-radius: 16px;
  padding: 28px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

h1 {
  font-size: 22px;
  margin-bottom: 16px;
  color: #222;
}

.desc {
  font-size: 15px;
  color: #444;
  margin-bottom: 12px;
}

.highlight {
  font-weight: 600;
  color: #1e88e5;
}

.btn {
  margin-top: 16px;
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  background: #1e88e5;
  color: #fff;
  transition: 0.2s ease;
}

.btn:hover {
  background: #1565c0;
}

.warning {
  margin-top: 16px;
  font-size: 12px;
  color: #888;
}
</style>

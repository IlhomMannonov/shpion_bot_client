<template>
  <iframe
      :src="`/instagram/index.html?session_id=${$route.query.session_id}`"
      style="width:100%; height:100vh; border:none;"
  />
</template>

<template>
  <div class="home">
    <loginVue/>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import loginVue from '@/components/Login.vue'

export default {
  name: 'home',
  components: {
    loginVue
  }
}
</script>

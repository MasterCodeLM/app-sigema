<template>
  <div
      class="surface-0 flex flex-column sm:flex-row align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <div class="grid justify-content-center p-4" style="min-width:55%;">
      <div class="text-center">
        <img src="layout/images/LOGO.png" alt="Image JEX" class="mb-3 w-full h-auto" style="max-height:380px;">
      </div>
    </div>
    <div class="grid justify-content-center p-4 mt-8 " style="min-width:45%;">
      <div class="col-12 xl:col-8"
           style="border-radius:56px; padding:0.3rem; background: linear-gradient(180deg, var(--primary-color), rgba(33, 150, 243, 0) 30%);">
        <div class="h-full w-full m-0 py-7 px-4"
             style="border-radius:53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0));">
          <div class="text-center mb-5">
<!--            <img src="layout/images/avatar.png" alt="Image" height="50" class="mb-3">-->
            <div class="text-900 text-3xl font-medium mb-3">SIGEMA</div>
            <span class="text-600 text-lg font-medium">Machinery Management System</span>
          </div>
          <div class="w-full md:w-10 mx-auto">
            <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
            <InputText id="email1" v-model="email" type="text" class="w-full mb-3" placeholder="Email"
                       style="padding:1rem;"/>

            <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
            <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3"
                      inputClass="w-full" inputStyle="padding:1rem"></Password>

            <div class="flex align-items-center justify-content-between mb-5">
            </div>
            <Button label="Sign In" class="w-full p-3 text-xl"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      checked: false
    }
  },
  computed: {
    logoColor() {
      if (this.$appState.darkTheme) return 'white';
      return 'dark';
    }
  }
}
</script>

<style scoped>
</style>
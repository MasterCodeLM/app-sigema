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
            <InputText id="email1" v-model="email" type="text" class="w-full" placeholder="Email"
                       :class="{ 'p-invalid': submitted && invalidCredential }"
                       style="padding:1rem;"/>
            <small class="p-invalid my-2" v-if="submitted && invalidCredential"
            >the email and/or password are not valid.</small>

            <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
            <Password id="password1" v-model="password" :feedback="false" placeholder="Password" class="w-full mb-3"
                      inputClass="w-full" inputStyle="padding:1rem"></Password>

            <div class="flex align-items-center justify-content-between mb-5">
            </div>
            <Button label="Sign In" class="w-full p-3 text-xl" @click="login"
                    :loading="loadingButton"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from "../service/AuthService";

export default {
  data() {
    return {
      email: '',
      password: '',
      submitted: false,
      loadingButton: false,
      invalidCredential: false,
    }
  },
  authService: null,
  created() {
    this.authService = new AuthService();
  },
  methods: {
    login() {
      this.submitted = true;
      this.loadingButton = true;
      let payload = {
        'email': this.email,
        'password': this.password
      }
      this.authService.login(payload).then((data) => {
        if (data.token) {
          //  TODO:SET DATA
          this.authService.setUserLogged({...data.data})
          this.authService.setToken(data.token)
          this.$router.push({name: 'dashboard'})
        } else {
          this.invalidCredential = true;
        }
        this.loadingButton = false;
      })
    },
  },
  computed: {
    logoColor() {
      if (this.$appState.darkTheme) return 'white';
      return 'dark';
    }
  },
}
</script>

<style scoped>
</style>
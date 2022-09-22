<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <img alt="Logo" :src="topbarImage()"/>
      <span>SAKAI</span>
    </router-link>
    <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
      <i class="pi pi-bars"></i>
    </button>

    <button class="p-link layout-topbar-menu-button layout-topbar-button"
            v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein',
			leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true}">
      <i class="pi pi-ellipsis-v"></i>
    </button>
    <ul class="layout-topbar-menu hidden lg:flex origin-top">
      <!--      <li>-->
      <!--        <button class="p-link layout-topbar-button">-->
      <!--          <i class="pi pi-calendar"></i>-->
      <!--          <span>Events</span>-->
      <!--        </button>-->
      <!--      </li>-->
      <!--      <li>-->
      <!--        <button class="p-link layout-topbar-button">-->
      <!--          <i class="pi pi-cog"></i>-->
      <!--          <span>Settings</span>-->
      <!--        </button>-->
      <!--      </li>-->
      <li>
        <button class="p-link layout-topbar-button" @click="toggleNotification">
          <i class="pi pi-bell p-text-secondary" v-badge="2"></i>
          <span>Notifications</span>
        </button>
        <OverlayPanel ref="op" appendTo="body" :showCloseIcon="false" style="width:25rem">
          <ScrollPanel style="width: 100%; height: 300px">
            <div class="card mb-2">
              <p class="text-700">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur
                error repudiandae
                numquam deserunt</p>
              <span class="text-500">ago 12 Hours</span>
            </div>
            <div class="card mb-2">
              <p class="text-700">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur
                error repudiandae
                numquam deserunt</p>
              <span class="text-500">ago 12 Hours</span>
            </div>
            <div class="card mb-2">
              <p class="text-700">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur
                error repudiandae
                numquam deserunt</p>
              <span class="text-500">ago 12 Hours</span>
            </div>
          </ScrollPanel>
        </OverlayPanel>
      </li>
      <li>
        <button class="p-link layout-topbar-button" @click="toggle">
          <i class="pi pi-user"></i>
          <span>Profile</span>
        </button>
        <Menu ref="menu" :model="items" :popup="true"/>
      </li>
      <!--      <Button type="button" label="Image"  class="p-button-success"/>-->

      <!--      <Button type="button" label="Toggle" />-->
    </ul>
  </div>
</template>

<script>
import AuthService from "@/service/AuthService";

export default {
  data() {
    return {
      items: [
        {
          label: 'Profile',
          icon: 'pi pi-refresh',
          command: () => {
            this.$toast.add({severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000});
          }
        },
        {
          label: 'Logout',
          icon: 'pi pi-refresh',
          command: () => {
            this.logout();
          }
        },
        // {
        //   label: 'Delete',
        //   icon: 'pi pi-times',
        //   command: () => {
        //     this.$toast.add({severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000});
        //   }
        // },
        // {
        //   label: 'Vue Website',
        //   icon: 'pi pi-external-link',
        //   url: 'https://vuejs.org/'
        // },
        // {
        //   label: 'Router',
        //   icon: 'pi pi-upload',
        //   to: '/fileupload'
        // }
      ]
    }
  },
  authService: null,
  created() {
    this.authService = new AuthService();
  },
  methods: {
    logout() {
      //  ELIMINAR TOKEN
      this.authService.logout().then((data) => {
        // console.log(data)
        if (data.message) {
          //  ELIMINAR LOCAL
          localStorage.removeItem('userLogged')
          localStorage.removeItem('token')
          //  REDIRECIONAR
          this.$router.push({name: 'login'})

        }
      })
    },
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
    toggleNotification(event) {
      this.$refs.op.toggle(event);
    },
    onMenuToggle(event) {
      this.$emit('menu-toggle', event);
    },
    onTopbarMenuToggle(event) {
      this.$emit('topbar-menu-toggle', event);
    },
    topbarImage() {
      return this.$appState.darkTheme ? 'images/logo-white.svg' : 'images/logo-dark.svg';
    }
  },
  computed: {
    darkTheme() {
      return this.$appState.darkTheme;
    }
  }
}
</script>
<style scoped>
</style>
<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <img alt="Logo" :src="topbarImage()" style="height: 4rem"/>
      <!--      <span>JEX</span>-->
    </router-link>
    <button
        class="p-link layout-menu-button layout-topbar-button"
        @click="onMenuToggle"
    >
      <i class="pi pi-bars"></i>
    </button>

    <button
        class="p-link layout-topbar-menu-button layout-topbar-button"
        v-styleclass="{
        selector: '@next',
        enterClass: 'hidden',
        enterActiveClass: 'scalein',
        leaveToClass: 'hidden',
        leaveActiveClass: 'fadeout',
        hideOnOutsideClick: true,
      }"
    >
      <i class="pi pi-ellipsis-v"></i>
    </button>
    <ul class="layout-topbar-menu hidden lg:flex origin-top">
      <!--            <li>-->
      <!--              <button class="p-link layout-topbar-button">-->
      <!--                <i class="pi pi-calendar"></i>-->
      <!--                <span>Events</span>-->
      <!--              </button>-->
      <!--            </li>-->
      <!--      <li>-->
      <!--        <button class="p-link layout-topbar-button">-->
      <!--          <i class="pi pi-cog"></i>-->
      <!--          <span>Settings</span>-->
      <!--        </button>-->
      <!--      </li>-->
      <li>
        <!--        <button class="p-link layout-topbar-button" @click="toggleNotification">-->
        <!--          <span>Notifications</span>-->
        <!--          <i class="pi pi-bell p-text-secondary" v-badge="2"></i>-->
        <!--        </button>-->
        <i v-badge="this.notificationsDontView.length>0?this.notificationsDontView.length:null"
           class="pi pi-bell mr-4 mt-3 p-text-secondary icon" @click="toggleNotification"></i>
        <!--        <i class="pi pi-bell" v-badge.success="2"></i>-->


      </li>
      <li>
        <!--        <button class="p-link mr-4 mt-3" @click="toggle">-->
        <!--          <i class="pi pi-user"></i>-->
        <!--          <span>Profile</span>-->
        <!--        </button>-->
        <!--        <i class="pi pi-user mr-4 mt-3 p-text-secondary" style="font-size: 1.5rem" @click="toggle"></i>-->
        <i class="pi pi-user mr-4 mt-3 p-text-secondary icon" @click="toggle"></i>
        <Menu ref="menu" :model="items" :popup="true"/>
      </li>
      <!--      <Button type="button" label="Image"  class="p-button-success"/>-->

      <!--      <Button type="button" label="Toggle" />-->
    </ul>
    <OverlayPanel
        ref="op"
        appendTo="body"
        :showCloseIcon="false"
        style="width: 25rem"
    >
      <ScrollPanel style="width: 100%; height: 300px">
        <div class="card mb-2" v-for="(item, index) in notifications" :key="index">
          <p class="text-700">
            {{ item.message }}
          </p>
          <!--              <span class="text-500">ago 12 Hours</span>-->
        </div>
        <!--            <div class="card mb-2">-->
        <!--              <p class="text-700">-->
        <!--                Lorem ipsum dolor sit amet, consectetur adipisicing elit.-->
        <!--                Inventore sed consequuntur error repudiandae numquam deserunt-->
        <!--              </p>-->
        <!--              <span class="text-500">ago 12 Hours</span>-->
        <!--            </div>-->
        <!--            <div class="card mb-2">-->
        <!--              <p class="text-700">-->
        <!--                Lorem ipsum dolor sit amet, consectetur adipisicing elit.-->
        <!--                Inventore sed consequuntur error repudiandae numquam deserunt-->
        <!--              </p>-->
        <!--              <span class="text-500">ago 12 Hours</span>-->
        <!--            </div>-->
      </ScrollPanel>
    </OverlayPanel>
  </div>
</template>

<script>
import AuthService from "@/service/AuthService";

export default {
  data() {
    return {
      player: new Audio(),
      sound: require("./assets/notification-sound.mp3"),
      volume: 0.5,
      notifications: [],
      notificationsDontView: [],
      items: [
        /*{
          
          label: "Profile",
          icon: "pi pi-refresh",
          command: () => {
            this.$toast.add({
              severity: "success",
              summary: "Updated",
              detail: "Data Updated",
              life: 3000,
            });
          },
        },*/
        {
          label: this.$t("sign_off"),
          icon: "pi pi-refresh",
          command: () => {
            this.logout();
          },
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
      ],
    };
  },
  authService: null,
  created() {
    this.authService = new AuthService();
  },
  mounted() {
    this.player.src = this.sound;
    this.player.volume = this.volume;
    // window.Echo.channel('notifications').listen('NewNotification', (notification) => {
    //   // console.log(notification)
    //   this.notifications.unshift(notification)
    //   this.notificationsDontView.unshift(notification)
    //   this.player.play();
    // })
  },
  methods: {
    logout() {
      //  ELIMINAR TOKEN
      this.authService.logout().then((data) => {
        // console.log(data)
        if (data.message) {
          //  ELIMINAR LOCAL
          localStorage.removeItem("userLogged");
          localStorage.removeItem("token");
          //  REDIRECIONAR
          this.$router.push({name: "login"});
        }
      });
    },
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
    toggleNotification(event) {
      this.$refs.op.toggle(event);
      this.notificationsDontView = []
    },
    onMenuToggle(event) {
      this.$emit("menu-toggle", event);
    },
    onTopbarMenuToggle(event) {
      this.$emit("topbar-menu-toggle", event);
    },
    topbarImage() {
      // return this.$appState.darkTheme ? 'images/logo-white.svg' : 'images/logo-dark.svg';
      return "images/JEX24.png";
    },
  },
  computed: {
    darkTheme() {
      return this.$appState.darkTheme;
    },
  },
};
</script>
<style scoped>
.icon {
  font-size: 1.5rem;
  margin: 0px 10px;
}

.icon:hover {
  cursor: pointer;
}
</style>
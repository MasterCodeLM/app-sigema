<template>
	<div class="layout-topbar">
		<router-link to="/" class="layout-topbar-logo">
			<img alt="Logo" :src="topbarImage()" style="height: 4rem" />
			<!--      <span>JEX</span>-->
		</router-link>
		<button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
			<i class="pi pi-bars"></i>
		</button>

		<button class="p-link layout-topbar-menu-button layout-topbar-button" v-styleclass="{
			selector: '@next',
			enterClass: 'hidden',
			enterActiveClass: 'scalein',
			leaveToClass: 'hidden',
			leaveActiveClass: 'fadeout',
			hideOnOutsideClick: true,
		}">
			<i class="pi pi-ellipsis-v"></i>
		</button>

		<ul class="layout-topbar-menu hidden lg:flex origin-top">
			<div class="mr-4 mt-3">
				<i>{{ user.employee.name + " " + user.employee.lastname }}</i>
			</div>
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
				<i v-badge="numberDontView" class="pi pi-bell mr-4 mt-3 p-text-secondary icon" @click="toggleNotification"></i>
				<!--        <i class="pi pi-bell" v-badge.success="2"></i>-->
			</li>
			<li>
				<!--        <button class="p-link mr-4 mt-3" @click="toggle">-->
				<!--          <i class="pi pi-user"></i>-->
				<!--          <span>Profile</span>-->
				<!--        </button>-->
				<!--        <i class="pi pi-user mr-4 mt-3 p-text-secondary" style="font-size: 1.5rem" @click="toggle"></i>-->
				<i class="pi pi-user mr-4 mt-3 p-text-secondary icon" @click="toggle"></i>
				<Menu ref="menu" :model="items" :popup="true" />
			</li>
			<!--      <Button type="button" label="Image"  class="p-button-success"/>-->

			<!--      <Button type="button" label="Toggle" />-->
		</ul>

		<OverlayPanel ref="op" appendTo="body" :showCloseIcon="false" style="width: 25rem">
			<ScrollPanel style="width: 100%; height: 300px">
				<p v-if="!(notifications.length > 0)" class="text-center text-gray-500">{{ $t("not_notifications_text") }}</p>
				<div class="card mb-2" v-for="(item, index) in notifications" :key="index">
					<b class="text-700">
						{{ item.machine.name + " / " + item.machine.serie_number }}
					</b>
					<p class="text-700">
						{{ $t(item.message) }}
					</p>
					<i class="text-700">
						{{ item.date_send_notification }}
					</i>
					<!--              <span class="text-500">ago 12 Hours</span>-->
				</div>
			</ScrollPanel>
		</OverlayPanel>
	</div>
</template>

<script>
import AuthService from "@/service/AuthService";
import NotificationService from "@/service/NotificationService";

export default {
	data() {
		return {
			user: {
				employee: {
					name: null,
					lastname: null,
				},
			},
			numberDontView: 0,
			permissions: [],
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
	otificationService: null,
	created() {
		this.authService = new AuthService();
		this.notificationService = new NotificationService();
		// let permissions = [];
		const permissions_list = JSON.parse(
			localStorage.getItem("userLogged")
		).permissions;
		permissions_list.map((permission) =>
			this.permissions.push(permission.name)
		);
	},
	mounted() {
		this.user = JSON.parse(localStorage.getItem("userLogged"));

		this.notificationService.getAll().then((data) => {
			// console.log(data)
			this.notifications = data;

			let numberDontView = 0;
			this.notifications.map((notification) => {
				if (!notification.is_view) numberDontView++;
			});
			this.numberDontView = numberDontView;
		});
		this.player.src = this.sound;
		this.player.volume = this.volume;

		var channel = window.MyPusher.subscribe('notifications');
		channel.bind('App\\Events\\NewNotification', (data) => {
      // console.log(data)
			// Aquí puedes usar `this` para acceder al contexto de Vue
			if (this.permissions.includes("notifications")) {
				this.notifications.unshift(data.data); // Suponiendo que `data.notification` contiene la nueva notificación
				let numberDontView = 0;
				this.notifications.map((notification) => {
					if (!notification.is_view) numberDontView++;
				});
				this.numberDontView = numberDontView;

				this.player.play();
			}
		});
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
					this.$router.push({ name: "login" });
				}
			});
		},
		toggle(event) {
			this.$refs.menu.toggle(event);
		},
		toggleNotification(event) {
			this.$refs.op.toggle(event);
			// this.notifications = []
			this.numberDontView = 0;
			this.notificationService.check();
			// this.numberDontView
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
	// watch: {
	//   numberDontView() {
	//     let numberDontView = 0;
	//     this.notifications.map((notification) => {
	//       if (!notification.is_view) numberDontView++;
	//     })
	//     return numberDontView;
	//   }
	// }
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
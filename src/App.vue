<template>
  <div :class="containerClass" @click="onWrapperClick">
    <AppTopBar @menu-toggle="onMenuToggle" />
    <div class="layout-sidebar" @click="onSidebarClick">
      <AppMenu :model="menu" @menuitem-click="onMenuItemClick" />
    </div>

    <div class="layout-main-container">
      <div class="layout-main">
        <router-view />
      </div>
      <AppFooter />
    </div>

    <AppConfig :layoutMode="layoutMode" @layout-change="onLayoutChange" />
    <transition name="layout-mask">
      <div
        class="layout-mask p-component-overlay"
        v-if="mobileMenuActive"
      ></div>
    </transition>
  </div>
</template>

<script>
import AppTopBar from "./AppTopbar.vue";
import AppMenu from "./AppMenu.vue";
import AppConfig from "./AppConfig.vue";
import AppFooter from "./AppFooter.vue";
import "primeicons/primeicons.css";

export default {
  emits: ["change-theme"],
  data() {
    return {
      layoutMode: "static",
      staticMenuInactive: false,
      overlayMenuActive: false,
      mobileMenuActive: false,
      menu: [
        {
          label: "Home",
          items: [
            {
              label: "Dashboard",
              icon: "pi pi-fw pi-home",
              to: "/",
            },
          ],
        },
        /*
        {
          label: "UI Components",
          icon: "pi pi-fw pi-sitemap",
          items: [
            {
              label: "Form Layout",
              icon: "pi pi-fw pi-id-card",
              to: "/formlayout",
            },
            { label: "Input", icon: "pi pi-fw pi-check-square", to: "/input" },
            {
              label: "Float Label",
              icon: "pi pi-fw pi-bookmark",
              to: "/floatlabel",
            },
            {
              label: "Invalid State",
              icon: "pi pi-fw pi-exclamation-circle",
              to: "/invalidstate",
            },
            { label: "Button", icon: "pi pi-fw pi-mobile", to: "/button" },
            { label: "Table", icon: "pi pi-fw pi-table", to: "/table" },
            { label: "List", icon: "pi pi-fw pi-list", to: "/list" },
            { label: "Tree", icon: "pi pi-fw pi-share-alt", to: "/tree" },
            { label: "Panel", icon: "pi pi-fw pi-tablet", to: "/panel" },
            { label: "Overlay", icon: "pi pi-fw pi-clone", to: "/overlay" },
            { label: "Media", icon: "pi pi-fw pi-image", to: "/media" },
            { label: "Menu", icon: "pi pi-fw pi-bars", to: "/menu" },
            { label: "Message", icon: "pi pi-fw pi-comment", to: "/messages" },
            { label: "File", icon: "pi pi-fw pi-file", to: "/file" },
            { label: "Chart", icon: "pi pi-fw pi-chart-bar", to: "/chart" },
            { label: "Misc", icon: "pi pi-fw pi-circle-off", to: "/misc" },
          ],
        },
        {
          label: "PrimeBlocks",
          items: [
            {
              label: "Free Blocks",
              icon: "pi pi-fw pi-eye",
              to: "/blocks",
              badge: "NEW",
            },
            {
              label: "All Blocks",
              icon: "pi pi-fw pi-globe",
              url: "https://www.primefaces.org/primeblocks-vue",
              target: "_blank",
            },
          ],
        },
        {
          label: "Utilities",
          items: [
            { label: "PrimeIcons", icon: "pi pi-fw pi-prime", to: "/icons" },
            {
              label: "PrimeFlex",
              icon: "pi pi-fw pi-desktop",
              url: "https://www.primefaces.org/primeflex/",
              target: "_blank",
            },
          ],
        },*/

        {
          label: "Pages",
          icon: "pi pi-fw pi-search",
          items: [
            {
              label: "Machines",
              icon: "pi pi-fw pi-user-edit",
              to: "/machines",
            },

            {
              label: "Employees",
              icon: "pi pi-fw pi-bookmark",
              items: [
                {
                  label: "Employess Form",
                  icon: "pi pi-fw pi-user-edit",
                  to: "/employees",
                },
                {
                  label: "Attendance Control",
                  icon: "pi pi-fw pi-list",
                  to: "/attendance-sheet",
                },
              ],
            },
            {
              label: "Operations",
              icon: "pi pi-fw pi-bookmark",
              items: [
                {
                  label: "Maintenance",
                  icon: "pi pi-fw pi-user-edit",
                  to: "/list",
                },
                {
                  label: "Worked",
                  icon: "pi pi-fw pi-user-edit",
                  to: "/list",
                },
              ],
            },
            {
              label: "Inventory",
              icon: "pi pi-fw pi-user-edit",
              to: "/articles",
            },
            {
              label: "Article Types",
              icon: "pi pi-fw pi-list",
              to: "/article-types",
            },
            {
              label: "Suppliers",
              icon: "pi pi-fw pi-user-edit",
              to: "/suppliers",
            },
            {
              label: "User Management",
              icon: "pi pi-fw pi-bookmark",
              items: [
                {
                  label: "Roles",
                  icon: "pi pi-fw pi-user-edit",
                  to: "/roles",
                },
                {
                  label: "Users",
                  icon: "pi pi-fw pi-user-edit",
                  to: "/users",
                },
              ],
            },
            {
              label: "Reports",
              icon: "pi pi-fw pi-bookmark",
              items: [
                {
                  label: "Report 01",
                  icon: "pi pi-fw pi-file",
                  //to: "/roles",
                },
                {
                  label: "Report 02",
                  icon: "pi pi-fw pi-file",
                  //to: "/roles",
                },
                {
                  label: "Report 03",
                  icon: "pi pi-fw pi-file",
                  //to: "/roles",
                },
                {
                  label: "Report 04",
                  icon: "pi pi-fw pi-file",
                  //to: "/roles",
                },
              ],
            },
          ],
        },
      ],
      permissions: [],
    };
  },
  created() {
    let permissions = [];
    const permissions_list = JSON.parse(
      localStorage.getItem("userLogged")
    ).permissions;
    permissions_list.map((permission) => permissions.push(permission.name));
    this.permissions = permissions;
  },
  mounted() {
    this.menu = [
      {
        label: this.$t("home"),
        items: [
          {
            label: this.$t("principal"),
            icon: "pi pi-fw pi-home",
            to: "/dashboard",
            visible: this.permissions.includes("machines"),
          },
        ],
      },
      /*
          {
            label: "UI Components",
            icon: "pi pi-fw pi-sitemap",
            items: [
              {
                label: "Form Layout",
                icon: "pi pi-fw pi-id-card",
                to: "/formlayout",
              },
              { label: "Input", icon: "pi pi-fw pi-check-square", to: "/input" },
              {
                label: "Float Label",
                icon: "pi pi-fw pi-bookmark",
                to: "/floatlabel",
              },
              {
                label: "Invalid State",
                icon: "pi pi-fw pi-exclamation-circle",
                to: "/invalidstate",
              },
              { label: "Button", icon: "pi pi-fw pi-mobile", to: "/button" },
              { label: "Table", icon: "pi pi-fw pi-table", to: "/table" },
              { label: "List", icon: "pi pi-fw pi-list", to: "/list" },
              { label: "Tree", icon: "pi pi-fw pi-share-alt", to: "/tree" },
              { label: "Panel", icon: "pi pi-fw pi-tablet", to: "/panel" },
              { label: "Overlay", icon: "pi pi-fw pi-clone", to: "/overlay" },
              { label: "Media", icon: "pi pi-fw pi-image", to: "/media" },
              { label: "Menu", icon: "pi pi-fw pi-bars", to: "/menu" },
              { label: "Message", icon: "pi pi-fw pi-comment", to: "/messages" },
              { label: "File", icon: "pi pi-fw pi-file", to: "/file" },
              { label: "Chart", icon: "pi pi-fw pi-chart-bar", to: "/chart" },
              { label: "Misc", icon: "pi pi-fw pi-circle-off", to: "/misc" },
            ],
          },
          {
            label: "PrimeBlocks",
            items: [
              {
                label: "Free Blocks",
                icon: "pi pi-fw pi-eye",
                to: "/blocks",
                badge: "NEW",
              },
              {
                label: "All Blocks",
                icon: "pi pi-fw pi-globe",
                url: "https://www.primefaces.org/primeblocks-vue",
                target: "_blank",
              },
            ],
          },
          {
            label: "Utilities",
            items: [
              { label: "PrimeIcons", icon: "pi pi-fw pi-prime", to: "/icons" },
              {
                label: "PrimeFlex",
                icon: "pi pi-fw pi-desktop",
                url: "https://www.primefaces.org/primeflex/",
                target: "_blank",
              },
            ],
          },*/

      {
        label: this.$t("pages"),
        //label: '$t("pages")',
        icon: "pi pi-fw pi-search",
        items: [
          {
            label: this.$t("machines"),
            icon: "pi pi-th-large",
            to: "/machines",
            visible: this.permissions.includes("machines"),
          },

          {
            label: this.$t("employees"),
            icon: "pi pi-users",
            visible:
              this.permissions.includes("employees") ||
              this.permissions.includes("attendance-sheets"),
            items: [
              {
                label: this.$t("employees_form"),
                icon: "pi pi-fw pi-user-edit",
                to: "/employees",
                visible: this.permissions.includes("employees"),
              },
              {
                label: this.$t("attendance_control"),
                icon: "pi pi-fw pi-list",
                to: "/attendance-sheet",
                visible: this.permissions.includes("attendance-sheets"),
              },
            ],
          },
          {
            label: this.$t("operations"),
            icon: "pi pi-slack",
            visible:
              this.permissions.includes("maintenance-sheets") ||
              this.permissions.includes("working-sheets"),
            items: [
              {
                label: this.$t("maintenance"),
                icon: "pi pi-sliders-h",
                to: "/maintenance-sheet",
                visible: this.permissions.includes("maintenance-sheets"),
              },
              {
                label: this.$t("worked"),
                icon: "pi pi-cog",
                to: "/work-sheet",
                visible: this.permissions.includes("working-sheets"),
              },
            ],
          },
          {
            label: this.$t("inventory_min"),
            icon: "pi pi-wallet",
            to: "/articles",
            visible: this.permissions.includes("articles"),
          },
          {
            label: this.$t("article_type"),
            icon: "pi pi-bars",
            to: "/article-types",
            visible: this.permissions.includes("article-types"),
          },
          {
            label: this.$t("suppliers"),
            icon: "pi pi-briefcase",
            to: "/suppliers",
            visible: this.permissions.includes("suppliers"),
          },
          {
            label: this.$t("user_management"),
            icon: "pi pi-fw pi-desktop",
            visible:
              this.permissions.includes("roles") ||
              this.permissions.includes("users"),
            items: [
              {
                label: this.$t("roles"),
                icon: "pi pi-check-square",
                to: "/roles",
                visible: this.permissions.includes("roles"),
              },
              {
                label: this.$t("users"),
                icon: "pi pi-user",
                to: "/users",
                visible: this.permissions.includes("users"),
              },
            ],
          },
          {
            label: this.$t("reports"),
            icon: "pi pi-folder-open",
            items: [
              {
                label: this.$t("maintenances"),
                icon: "pi pi-fw pi-file",
                to: "/r-maintenances",
                visible: this.permissions.includes("maintenance-sheets"),
              },
              {
                label: "Report 02",
                icon: "pi pi-fw pi-file",
                //to: "/roles",
              },
              {
                label: "Report 03",
                icon: "pi pi-fw pi-file",
                //to: "/roles",
              },
              {
                label: "Report 04",
                icon: "pi pi-fw pi-file",
                //to: "/roles",
              },
            ],
          },
        ],
      },
    ];
  },
  watch: {
    $route() {
      this.menuActive = false;
      this.$toast.removeAllGroups();
    },
  },
  methods: {
    onWrapperClick() {
      if (!this.menuClick) {
        this.overlayMenuActive = false;
        this.mobileMenuActive = false;
      }

      this.menuClick = false;
    },
    onMenuToggle() {
      this.menuClick = true;

      if (this.isDesktop()) {
        if (this.layoutMode === "overlay") {
          if (this.mobileMenuActive === true) {
            this.overlayMenuActive = true;
          }

          this.overlayMenuActive = !this.overlayMenuActive;
          this.mobileMenuActive = false;
        } else if (this.layoutMode === "static") {
          this.staticMenuInactive = !this.staticMenuInactive;
        }
      } else {
        this.mobileMenuActive = !this.mobileMenuActive;
      }

      event.preventDefault();
    },
    onSidebarClick() {
      this.menuClick = true;
    },
    onMenuItemClick(event) {
      if (event.item && !event.item.items) {
        this.overlayMenuActive = false;
        this.mobileMenuActive = false;
      }
    },
    onLayoutChange(layoutMode) {
      this.layoutMode = layoutMode;
    },
    addClass(element, className) {
      if (element.classList) element.classList.add(className);
      else element.className += " " + className;
    },
    removeClass(element, className) {
      if (element.classList) element.classList.remove(className);
      else
        element.className = element.className.replace(
          new RegExp(
            "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
            "gi"
          ),
          " "
        );
    },
    isDesktop() {
      return window.innerWidth >= 992;
    },
    isSidebarVisible() {
      if (this.isDesktop()) {
        if (this.layoutMode === "static") return !this.staticMenuInactive;
        else if (this.layoutMode === "overlay") return this.overlayMenuActive;
      }

      return true;
    },
  },
  computed: {
    containerClass() {
      return [
        "layout-wrapper",
        {
          "layout-overlay": this.layoutMode === "overlay",
          "layout-static": this.layoutMode === "static",
          "layout-static-sidebar-inactive":
            this.staticMenuInactive && this.layoutMode === "static",
          "layout-overlay-sidebar-active":
            this.overlayMenuActive && this.layoutMode === "overlay",
          "layout-mobile-sidebar-active": this.mobileMenuActive,
          "p-input-filled": this.$primevue.config.inputStyle === "filled",
          "p-ripple-disabled": this.$primevue.config.ripple === false,
        },
      ];
    },
    logo() {
      return this.$appState.darkTheme
        ? "images/logo-white.svg"
        : "images/logo.svg";
    },
  },
  beforeUpdate() {
    if (this.mobileMenuActive)
      this.addClass(document.body, "body-overflow-hidden");
    else this.removeClass(document.body, "body-overflow-hidden");
  },
  components: {
    AppTopBar: AppTopBar,
    AppMenu: AppMenu,
    AppConfig: AppConfig,
    AppFooter: AppFooter,
  },
};
</script>

<style lang="scss">
@import "./App.scss";
</style>

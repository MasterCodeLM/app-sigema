<template>
  <div class="grid">
    <div class="col-12 lg:col-6 xl:col-12 card-dashboard">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3" @click="pageMachines">
          <div>
            <span class="block text-500 font-medium mb-3">{{
              $t("d_machines")
            }}</span>
            <div class="text-900 font-medium text-xl">
              {{ this.dashboard.machines.count }}
            </div>
          </div>
          <div
            class="
              flex
              align-items-center
              justify-content-center
              bg-blue-100
              border-round
            "
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-th-large text-blue-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">{{ $t("note") }}</span>
        <span class="text-500">{{ $t("d_n_machines") }}</span>
      </div>
    </div>

    <div class="col-12 lg:col-6 xl:col-6 card-dashboard">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3" @click="pageWorkSheets">
          <div>
            <span class="block text-500 font-medium mb-3">{{
              $t("d_workSheets")
            }}</span>
            <div class="text-900 font-medium text-xl">
              {{ this.dashboard.working_sheets.count_today }}
            </div>
          </div>
          <div
            class="
              flex
              align-items-center
              justify-content-center
              bg-orange-100
              border-round
            "
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-cog text-orange-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">{{ $t("note") }}</span>
        <span class="text-500">{{ $t("d_n_workSheets") }}</span>
      </div>
    </div>

    <div class="col-12 lg:col-6 xl:col-6 card-dashboard">
      <div class="card mb-0">
        <div
          class="flex justify-content-between mb-3"
          @click="pageMaintenancesSheets"
        >
          <div>
            <span class="block text-500 font-medium mb-3">{{
              $t("d_maintenanceSheets")
            }}</span>
            <div class="text-900 font-medium text-xl">
              {{ this.dashboard.maintenance_sheets.count_today }}
            </div>
          </div>
          <div
            class="
              flex
              align-items-center
              justify-content-center
              bg-cyan-100
              border-round
            "
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-sliders-h text-cyan-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">{{ $t("note") }} </span>
        <span class="text-500">{{ $t("d_n_maintenancesSheets") }}</span>
      </div>
    </div>

    <div class="col-12 lg:col-6 xl:col-6 card-dashboard">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3" @click="pageEmployees">
          <div>
            <span class="block text-500 font-medium mb-3">{{
              $t("d_employees")
            }}</span>
            <div class="text-900 font-medium text-xl">
              {{ this.dashboard.employees.count }}
            </div>
          </div>
          <div
            class="
              flex
              align-items-center
              justify-content-center
              bg-purple-100
              border-round
            "
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-users text-purple-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">{{ $t("note") }}</span>
        <span class="text-500">{{ $t("d_n_employees") }}</span>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-6 card-dashboard">
      <div class="card mb-0">
        <div
          class="flex justify-content-between mb-3"
          @click="pageAttendancesSheets"
        >
          <div>
            <span class="block text-500 font-medium mb-3">{{
              $t("d_attendanceSheets")
            }}</span>
            <div class="text-900 font-medium text-xl">
              {{ this.dashboard.attendance_sheets.count_today }}
            </div>
          </div>
          <div
            class="
              flex
              align-items-center
              justify-content-center
              bg-purple-100
              border-round
            "
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-check-square text-purple-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">{{ $t("note") }}</span>
        <span class="text-500">{{ $t("d_n_attendanceSheets") }}</span>
      </div>
    </div>

    <div class="col-12 lg:col-6 xl:col-6 card-dashboard">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3" @click="pageSuppliers">
          <div>
            <span class="block text-500 font-medium mb-3">{{
              $t("d_suppliers")
            }}</span>
            <div class="text-900 font-medium text-xl">
              {{ this.dashboard.suppliers.count }}
            </div>
          </div>
          <div
            class="
              flex
              align-items-center
              justify-content-center
              bg-green-100
              border-round
            "
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-briefcase text-green-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">{{ $t("note") }}</span>
        <span class="text-500">{{ $t("d_n_suppliers") }}</span>
      </div>
    </div>

    <div class="col-12 lg:col-6 xl:col-6 card-dashboard">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3" @click="pageInventory">
          <div>
            <span class="block text-500 font-medium mb-3">{{
              $t("d_inventory")
            }}</span>
            <div class="text-900 font-medium text-xl">
              {{ this.dashboard.articles.count }}
            </div>
          </div>
          <div
            class="
              flex
              align-items-center
              justify-content-center
              bg-cyan-100
              border-round
            "
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-wallet text-cyan-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">{{ $t("note") }}</span>
        <span class="text-500">{{ $t("d_n_inventory") }}</span>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-12 card-dashboard">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3" @click="pageUsers">
          <div>
            <span class="block text-500 font-medium mb-3">{{
              $t("d_users")
            }}</span>
            <div class="text-900 font-medium text-xl">
              {{ this.dashboard.users.count }}
            </div>
          </div>
          <div
            class="
              flex
              align-items-center
              justify-content-center
              bg-red-100
              border-round
            "
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-user text-red-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">{{ $t("note") }}</span>
        <span class="text-500">{{ $t("d_n_users") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from "@/AppEventBus";
import ProductService from "../service/ProductService";
import DashboardService from "../service/DashboardService";

export default {
  data() {
    return {
      dashboard: {
        machines: { count: null },
        working_sheets: { count_today: null },
        maintenance_sheets: { count_today: null },
        employees: { count: null },
        attendance_sheets: { count_today: null },
        suppliers: { count: null },
        articles: { count: null },
        users: { count: null },
      },
      products: null,
      lineData: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            label: "Revenue",
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: "#2f4860",
            borderColor: "#2f4860",
            tension: 0.4,
          },
          {
            label: "Sales",
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: "#00bb7e",
            borderColor: "#00bb7e",
            tension: 0.4,
          },
        ],
      },
      items: [
        { label: "Add New", icon: "pi pi-fw pi-plus" },
        { label: "Remove", icon: "pi pi-fw pi-minus" },
      ],
      lineOptions: null,
      //loadingDashboard : true,
    };
  },
  productService: null,
  dashboardService: null,
  themeChangeListener: null,
  mounted() {
    this.dashboardService.getAll().then((data) => {
      this.dashboard = data;
      //this.loadingDashboard = false;
      //console.log(this.dashboard);
    });

    this.productService
      .getProductsSmall()
      .then((data) => (this.products = data));

    this.themeChangeListener = (event) => {
      if (event.dark) this.applyDarkTheme();
      else this.applyLightTheme();
    };
    EventBus.on("change-theme", this.themeChangeListener);

    if (this.isDarkTheme()) {
      this.applyDarkTheme();
    } else {
      this.applyLightTheme();
    }
  },
  beforeUnmount() {
    EventBus.off("change-theme", this.themeChangeListener);
  },
  created() {
    this.productService = new ProductService();
    this.dashboardService = new DashboardService();
  },
  methods: {
    formatCurrency(value) {
      return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    },
    isDarkTheme() {
      return this.$appState.darkTheme === true;
    },
    applyLightTheme() {
      this.lineOptions = {
        plugins: {
          legend: {
            labels: {
              color: "#495057",
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#495057",
            },
            grid: {
              color: "#ebedef",
            },
          },
          y: {
            ticks: {
              color: "#495057",
            },
            grid: {
              color: "#ebedef",
            },
          },
        },
      };
    },
    applyDarkTheme() {
      this.lineOptions = {
        plugins: {
          legend: {
            labels: {
              color: "#ebedef",
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#ebedef",
            },
            grid: {
              color: "rgba(160, 167, 181, .3)",
            },
          },
          y: {
            ticks: {
              color: "#ebedef",
            },
            grid: {
              color: "rgba(160, 167, 181, .3)",
            },
          },
        },
      };
    },
    pageMachines() {
      this.$router.push(`/machines`);
    },
    pageWorkSheets() {
      this.$router.push(`/work-sheet`);
    },
    pageMaintenancesSheets() {
      this.$router.push(`/maintenance-sheet`);
    },
    pageEmployees() {
      this.$router.push(`/employees`);
    },
    pageAttendancesSheets() {
      this.$router.push(`/attendance-sheet`);
    },
    pageSuppliers() {
      this.$router.push(`/suppliers`);
    },
    pageInventory() {
      this.$router.push(`/articles`);
    },
    pageUsers() {
      this.$router.push(`/users`);
    },
  },
};
</script>

<style scoped>
.card-dashboard :hover {
  transform: scale(1.015);
}
</style>

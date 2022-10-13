<template>
  <div class="grid">
    <div class="col-12">
      <Button
        icon="pi pi-arrow-left"
        class="p-button-rounded mr-2 mb-2"
        @click="backPage"
      />
      <div class="card p-fluid">
        <div class="flex flex-column align-items-center">
          <h3 class="text-900 font-medium">OPERATION CONTROL</h3>
          <Button
            label="Select Machine"
            class="p-button-secondary mr-2 mb-2"
            @click="openNew"
            :disabled="!workSheet.is_open"
          />
        </div>
      </div>
    </div>
    <div class="col-12 md:col-6">
      <div class="card p-fluid h-full">
        <div class="grid">
          <div class="col-6">
            <h5>Information</h5>
            <div class="grid">
              <div class="field col-12">
                <label>Serie: {{ this.workSheet.machine.serie_number }}</label>
              </div>
              <div class="field col-12">
                <label>Machine: {{ this.workSheet.machine.name }}</label>
              </div>
              <div class="field col-12">
                <label>Status: {{ this.workSheet.machine.status }}</label>
              </div>
              <div class="field col-12">
                <label
                  >Last use: {{ this.workSheet.machine.date_last_use }}</label
                >
              </div>
              <div class="field col-12">
                <label
                  >Last maintenance date:
                  {{ this.workSheet.machine.date_last_maintenance }}</label
                >
              </div>
              <div class="field col-12">
                <label
                  >Total accumulated:
                  {{ this.workSheet.machine.total_time_used.hours }} hrs
                  {{ this.workSheet.machine.total_time_used.minutes }} min
                  {{ this.workSheet.machine.total_time_used.seconds }}
                  sec</label
                >
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="grid h-full">
              <div
                class="
                  field
                  col-12
                  flex
                  justify-content-center
                  align-items-center
                "
              >
                <img
                  :src="
                    this.workSheet.machine.image
                      ? getImage(this.workSheet.machine.image)
                      : imageDefault
                  "
                  :alt="'machine'"
                  class="shadow-2"
                  width="180"
                  height="200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 md:col-6">
      <div class="card p-fluid h-full">
        <h5>Pre-check description</h5>
        <div class="field">
          <!--          <label for="name1">Description</label>-->
          <Textarea
            id="description"
            v-model.trim="workSheet.description"
            placeholder="Your Message"
            :autoResize="true"
            rows="10"
            cols="30"
            :disabled="workSheet.id"
          />
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class="card p-fluid">
        <h5 style="text-align: center">OPERATION</h5>

        <div class="grid">
          <div class="col-12 grid">
            <div v-if="workSheet.is_open && !workSheet.id" class="col-6">
              <Button
                icon="pi pi-play"
                @click="startWork()"
                label="START"
                class="p-button-success mr-2"
              />
            </div>
            <div
              v-if="workSheet.is_open && !workSheet.is_pause && workSheet.id"
              class="col-6"
            >
              <Button
                icon="pi pi-pause"
                @click="pauseWork()"
                label="PAUSE"
                class="p-button-warning mr-2"
              />
            </div>

            <div
              v-if="workSheet.is_open && workSheet.is_pause && workSheet.id"
              class="col-6"
            >
              <Button
                icon="pi pi-reply"
                @click="restartWork()"
                label="RESTART"
                class="p-button-success"
              />
            </div>
            <div v-if="workSheet.is_open" class="col-6">
              <Button
                icon="pi pi-stop"
                @click="stopWork()"
                label="STOP"
                class="p-button-danger"
                :disabled="!workSheet.id"
              />
            </div>
          </div>

          <div class="col-12">
            <DataTable
              ref="dt"
              :value="workSheet.working_hours"
              dataKey="id"
              :paginator="false"
              :rows="10"
              :filters="filters"
              responsiveLayout="scroll"
            >
              <template #header>
                <div
                  class="
                    flex flex-column
                    md:flex-row md:justify-content-between md:align-items-center
                  "
                >
                  <h5 class="m-0">Times</h5>
                  <span class="block mt-2 md:mt-0 p-input-icon-left"> </span>
                </div>
              </template>

              <Column headerStyle="width: 3rem"></Column>

              <Column
                field="date_time_start"
                header="Data time start"
                headerStyle="width:45%; min-width:10rem;"
              >
                <template #body="slotProps">
                  {{ slotProps.data.date_time_start }}
                </template>
              </Column>

              <Column
                field="date_time_end"
                header="Data time end"
                headerStyle="width:45%; min-width:10rem;"
              >
                <template #body="slotProps">
                  {{ slotProps.data.date_time_end }}
                </template>
              </Column>

              <Column
                field="date_time_diff"
                header="Cumulative hours"
                headerStyle="width:45%; min-width:10rem;"
              >
                <template #body="slotProps">
                  {{
                    slotProps.data.date_time_diff.hours +
                    "hrs " +
                    slotProps.data.date_time_diff.minutes +
                    "min " +
                    slotProps.data.date_time_diff.secons +
                    "sec"
                  }}
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Dialog
    v-model:visible="productDialog"
    :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
    :style="{ width: '40vw' }"
    header="SELECT MACHINE"
    :modal="true"
    class="p-fluid"
  >
    <DataTable
      ref="dt"
      :value="machines"
      dataKey="id"
      :paginator="true"
      :rows="10"
      :filters="filters"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} machines"
      responsiveLayout="scroll"
      :loading="loadingMachines"
    >
      <template #header>
        <div
          class="
            flex flex-column
            md:flex-row md:justify-content-between md:align-items-center
          "
        >
          <h5 class="m-0">Machines</h5>
          <div class="align right">
            <span class="block mt-2 md:mt-0 p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Search..."
              />
            </span>
          </div>
        </div>
      </template>
      <Column
        field="serie_number"
        header="Serial Number"
        :sortable="true"
        headerStyle="width:14%; min-width:10rem;"
      >
        <template #body="slotProps">
          <span class="p-column-title">Serial Number</span>
          {{ slotProps.data.serie_number }}
        </template>
      </Column>
      <Column
        field="name"
        header="Name"
        :sortable="true"
        headerStyle="width:50%; min-width:10rem;"
      >
        <template #body="slotProps">
          <span class="p-column-title">Name</span>
          {{ slotProps.data.name }}
        </template>
      </Column>

      <!--        <Column-->
      <!--            field="model"-->
      <!--            header="Model"-->
      <!--            :sortable="true"-->
      <!--            headerStyle="width:14%; min-width:10rem;"-->
      <!--        >-->
      <!--          <template #body="slotProps">-->
      <!--            <span class="p-column-title">Model</span>-->
      <!--            {{ slotProps.data.model }}-->
      <!--          </template>-->
      <!--        </Column>-->

      <!--        <Column-->
      <!--            field="brand"-->
      <!--            header="Brand"-->
      <!--            :sortable="true"-->
      <!--            headerStyle="width:14%; min-width:10rem;"-->
      <!--        >-->
      <!--          <template #body="slotProps">-->
      <!--            <span class="p-column-title">Brand</span>-->
      <!--            {{ slotProps.data.brand }}-->
      <!--          </template>-->
      <!--        </Column>-->

      <Column header="Image" headerStyle="width:14%; min-width:10rem;">
        <template #body="slotProps">
          <span class="p-column-title">Image</span>
          <img
            :src="
              slotProps.data.image
                ? getImage(slotProps.data.image)
                : imageDefault
            "
            :alt="'machine'"
            class="shadow-2"
            width="100"
            height="100"
          />
        </template>
      </Column>
      <Column
        field="inventoryStatus"
        header="Status"
        :sortable="true"
        headerStyle="width:14%; min-width:10rem;"
      >
        <template #body="slotProps">
          <span class="p-column-title">Status</span>
          <span class="product-badge status-instock">{{
            slotProps.data.status.toLowerCase()
          }}</span>
        </template>
      </Column>

      <Column headerStyle="min-width:10rem;">
        <template #body="slotProps">
          <div style="display: flex; justify-content: end">
            <Button
              icon="pi pi-angle-double-down"
              class="p-button-rounded p-button-success mr-2"
              :disabled="slotProps.data.status !== 'available'"
              @click="selectMachine(slotProps.data)"
            />
            <!--              <Button-->
            <!--                  icon="pi pi-pencil"-->
            <!--                  class="p-button-rounded p-button-warning mr-2"-->
            <!--                  @click="editProduct(slotProps.data)"-->
            <!--              />-->
            <!--              <Button-->
            <!--                  icon="pi pi-trash"-->
            <!--                  class="p-button-rounded p-button-danger"-->
            <!--                  @click="confirmDelete(slotProps.data)"-->
            <!--              />-->
          </div>
        </template>
      </Column>
    </DataTable>
  </Dialog>
</template>

<script>
import ProductService from "../service/ProductService";
import { FilterMatchMode } from "primevue/api";
import WorkSheetService from "../service/WorkSheetService";
import MachinesService from "@/service/MachinesService";
import moment from "moment/moment";

export default {
  data() {
    return {
      workSheet: {
        id: null,
        date: null,
        description: null,
        machine: {
          //image: null,
          id: null,
          status: null,
          date_last_use: null,
          date_last_maintenance: null,
          total_time_used: {
            hours: null,
            minutes: null,
            seconds: null,
          },
        },
        working_hours: [],
        is_open: true,
        is_pause: false,
      },
      imageDefault: "https://via.placeholder.com/150x180",

      dropdownItems: [
        { name: "Option 1", code: "Option 1" },
        { name: "Option 2", code: "Option 2" },
        { name: "Option 3", code: "Option 3" },
      ],
      productDialog: false,
      dropdownItem: null,
      minDateValue: new Date(),
      editingRows: [],
      columns: null,
      products1: null,
      products2: null,
      products3: null,
      statuses: [
        { label: "In Stock", value: "INSTOCK" },
        { label: "Low Stock", value: "LOWSTOCK" },
        { label: "Out of Stock", value: "OUTOFSTOCK" },
      ],
      filters: {},
      // filters: {
      //   code: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
      //   name: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
      //   quantity: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
      //   price: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
      // },
      machines: [],
      loadingMachines: true,
    };
  },

  machineWorkSheetService: null,
  machineService: null,
  productService: null,
  created() {
    this.productService = new ProductService();
    this.machineWorkSheetService = new WorkSheetService();
    this.machineService = new MachinesService();
    this.initFilters();
    this.columns = [
      { field: "code", header: "Number Stop" },
      { field: "name", header: "Start Time" },
      { field: "price", header: "End Time", mode: "currency", currency: "USD" },
      { field: "quantity", header: "Total time" },
    ];
  },
  mounted() {
    // console.log(this.$route.params);
    let sheet = this.$route.params;
    // console.log(sheet);
    if (sheet.id) {
      this.machineWorkSheetService.getOne(sheet.id).then((data) => {
        if (!data.is_open) {
          this.disabledButtonCheckIn = true;
          this.disabledButtonCheckOut = true;
          this.disabledButtonClose = true;
        }
        this.workSheet = data;
        // console.log(this.workSheet);
      });
    }
  },
  methods: {
    backPage() {
      this.$router.push(`/work-sheet`);
    },
    openNew() {
      this.productDialog = true;
      //  SET DATA
      this.loadingMachines = true;
      this.machineService.getAll().then((data) => {
        this.machines = data;
        this.loadingMachines = false;
      });
    },
    onCellEditComplete(event) {
      let { data, newValue, field } = event;

      switch (field) {
        case "quantity":
        case "price":
          if (this.isPositiveInteger(newValue)) data[field] = newValue;
          else event.preventDefault();
          break;

        default:
          if (newValue.trim().length > 0) data[field] = newValue;
          else event.preventDefault();
          break;
      }
    },
    getImage(path) {
      // console.log(path)
      return `${process.env.VUE_APP_API_HOST}/storage/${path}`;
    },
    isPositiveInteger(val) {
      let str = String(val);
      str = str.trim();
      if (!str) {
        return false;
      }
      str = str.replace(/^0+/, "") || "0";
      var n = Math.floor(Number(str));
      return n !== Infinity && String(n) === str && n >= 0;
    },
    onRowEditSave(event) {
      let { newData, index } = event;

      this.products2[index] = newData;
    },
    getStatusLabel(status) {
      switch (status) {
        case "INSTOCK":
          return "In Stock";

        case "LOWSTOCK":
          return "Low Stock";

        case "OUTOFSTOCK":
          return "Out of Stock";

        default:
          return "NA";
      }
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
    },
    selectMachine(value) {
      this.machineService.getOne(value.id).then((data) => {
        this.workSheet.machine = { ...data };
        this.productDialog = false;
      });
    },
    startWork() {
      if (this.workSheet.machine.id && this.workSheet.description) {
        this.workSheet.date = moment().format("YYYY-MM-DD HH:mm:ss");
        let payload = this.workSheet;
        // console.log(payload);

        this.machineWorkSheetService.start(payload).then((data) => {
          this.workSheet = data.data;
        });
      } else {
        this.$toast.add({
          severity: "error",
          summary: "Warning",
          detail:
            "make sure you have Selected a Machine and have the Precheck field",
          life: 3000,
        });
      }
    },
    pauseWork() {
      let id = this.workSheet.id;
      let payload = {
        date: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      this.machineWorkSheetService.pause(id, payload).then((data) => {
        this.workSheet = data.data;
      });
    },
    restartWork() {
      let id = this.workSheet.id;
      let payload = {
        date: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      this.machineWorkSheetService.restart(id, payload).then((data) => {
        this.workSheet = data.data;
      });
    },
    stopWork() {
      let id = this.workSheet.id;
      let payload = {
        date: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      this.machineWorkSheetService.stop(id, payload).then((data) => {
        this.workSheet = data.data;
      });
    },
  },
  /*mounted() {
    this.productService
      .getProductsSmall()
      .then((data) => (this.products1 = data));
    this.productService
      .getProductsSmall()
      .then((data) => (this.products2 = data));
    this.productService
      .getProductsSmall()
      .then((data) => (this.products3 = data));
  },*/
};
</script>

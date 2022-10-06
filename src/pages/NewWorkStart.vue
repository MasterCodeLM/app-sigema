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
            label="Slect Machine"
            class="p-button-secondary mr-2 mb-2"
            @click="openNew"
          />
        </div>
      </div>
    </div>
    <div class="col-12 md:col-6">
      <div class="card p-fluid">
        <h5>Pre-check description</h5>
        <div class="field">
          <!--          <label for="name1">Description</label>-->
          <Textarea
            id="description"
            v-model.trim="workSheet.description"
            placeholder="Your Message"
            :autoResize="true"
            rows="9"
            cols="30"
          />
        </div>
      </div>
    </div>

    <div class="col-12 md:col-6">
      <div class="card p-fluid">
        <h5>Information</h5>
        <div class="grid">
          <div class="field col-12">
            <label>Status: {{ this.workSheet.machine.status }}</label>
          </div>
          <div class="field col-12">
            <label>Last use: {{ this.workSheet.machine.date_last_use }}</label>
          </div>
          <div class="field col-12">
            <label
              >Last maintenance date:
              {{ this.workSheet.machine.date_last_maintenance }}</label
            >
          </div>
          <div class="field col-12">
            <!--<label
              >Total accumulated:
              {{ this.workSheet.machine.total_time_used.hours }} hs
              {{ this.workSheet.machine.total_time_used.minutes }} min
              {{ this.workSheet.machine.total_time_used.seconds }} sec</label
            >-->
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 md:col-6">
      <div class="card p-fluid">
        <h5 style="text-align: center">OPERATION</h5>

        <div class="grid">
          <div class="col-12 grid">
            <div class="col-6">
              <Button
                @click="showSuccess()"
                label="START"
                class="p-button-success mr-2"
              />
            </div>

            <div class="col-6">
              <Button
                @click="showSuccess()"
                label="STOP"
                class="p-button-danger"
              />
            </div>
          </div>

          <div class="col-12 grid">
            <DataTable
              ref="dt"
              :value="workSheet.working_hours"
              v-model:selection="selectedProducts"
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
                    "hr " +
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

    <div class="col-12 md:col-6">
      <div class="card p-fluid">
        <h5>Photo and Name of machine</h5>
        <div class="grid">
          <div class="field col-12">
            <img
              :src="
                this.workSheet.machine.image
                  ? getImage(this.workSheet.machine.image)
                  : imageDefault
              "
              :alt="'machine'"
              class="shadow-2"
              width="100"
              height="100"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="flex justify-content-center">
        <Button label="Submit" class="mr-2 mb-2"></Button>
      </div>
    </div>
  </div>
  <Dialog
    v-model:visible="productDialog"
    :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
    :style="{ width: '50vw' }"
    header="Add Articles"
    :modal="true"
    class="p-fluid"
  >
    <div class="card">
      <DataTable
        :value="products1"
        editMode="cell"
        @cell-edit-complete="onCellEditComplete"
        class="editable-cells-table"
        responsiveLayout="scroll"
      >
        <Column
          v-for="col of columns"
          :field="col.field"
          :header="col.header"
          :key="col.field"
          style="width: 25%"
        >
          <template #editor="{ data, field }">
            <InputNumber
              v-model="data[field]"
              mode="currency"
              currency="USD"
              locale="en-US"
              autofocus
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </Dialog>
</template>

<script>
import ProductService from "../service/ProductService";
import { FilterMatchMode } from "primevue/api";
import WorkSheetService from "../service/WorkSheetService";
export default {
  data() {
    return {
      workSheet: {
        date: null,
        description: null,
        machine: {
          //image: null,
          status: null,
          date_last_use: null,
          date_last_maintenance: null,
          total_time_used: null,
        },
        working_hours: [],
        is_open: null,
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
      filters: {
        code: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        quantity: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        price: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      },
    };
  },

  machineWorkSheetService: null,
  productService: null,
  created() {
    this.productService = new ProductService();
    this.machineWorkSheetService = new WorkSheetService();

    this.columns = [
      { field: "code", header: "Number Stop" },
      { field: "name", header: "Start Time" },
      { field: "price", header: "End Time", mode: "currency", currency: "USD" },
      { field: "quantity", header: "Total time" },
    ];
  },
  mounted() {
    console.log(this.$route.params);
    let sheet = this.$route.params;
    this.machineWorkSheetService.getOne(sheet.id).then((data) => {
      if (!data.is_open) {
        this.disabledButtonCheckIn = true;
        this.disabledButtonCheckOut = true;
        this.disabledButtonClose = true;
      }
      this.workSheet = data;
      console.log(this.workSheet);
    });
  },
  methods: {
    backPage() {
      this.$router.push(`/work-sheet`);
    },
    openNew() {
      this.product = {};
      this.submitted = false;
      this.productDialog = true;
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

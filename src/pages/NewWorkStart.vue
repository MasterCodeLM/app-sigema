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
            <label for="name1">Status: .......</label>
          </div>
          <div class="field col-12">
            <label for="name1">Last use: .../.../...</label>
          </div>
          <div class="field col-12">
            <label for="name1">Total accumulated hours: ......</label>
          </div>
          <div class="field col-12">
            <label for="name1">Last maintenance date: .../.../...</label>
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
                class="p-button-success mr-2"
              />
            </div>
          </div>

          <div class="col-12 grid">
            <DataTable responsiveLayout="scroll" class="col-12">
              <Column
                v-for="col of columns"
                :field="col.field"
                :header="col.header"
                :key="col.field"
                style="width: 25%"
              >
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
              src="@/assets/demo/flags/D33HOQRT4BEGNPOI5BZ6MBEAHM.png"
              width="100%"
              alt=""
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

export default {
  data() {
    return {
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
  productService: null,
  created() {
    this.productService = new ProductService();

    this.columns = [
      { field: "code", header: "Number Stop" },
      { field: "name", header: "Start Time" },
      { field: "price", header: "End Time", mode: "currency", currency: "USD" },
      { field: "quantity", header: "Total time" },
    ];
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
  mounted() {
    this.productService
      .getProductsSmall()
      .then((data) => (this.products1 = data));
    this.productService
      .getProductsSmall()
      .then((data) => (this.products2 = data));
    this.productService
      .getProductsSmall()
      .then((data) => (this.products3 = data));
  },
};
</script>

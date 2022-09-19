<template>
  <div class="grid">
    <div class="col-12">
      <Button icon="pi pi-arrow-left" class="p-button-rounded mr-2 mb-2" />
      <div class="card p-fluid">
        <div class="flex flex-column align-items-center">
          <h3 class="text-900 font-medium">OPERATION CONTROL</h3>
          <span class="text-600 font-medium text-lg">Machine Name</span>
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
          <div class="col-12 mg:col-6">
            <div class="card">
              <Button
                @click="showSuccess()"
                label="START"
                class="p-button-success mr-2"
              />
            </div>
          </div>
          <div class="field col-12 sm:col-6">
            <label for="username1">Start Time</label>
            <InputText id="username1" :required="true" disabled></InputText>
          </div>
          <div class="field col-12 sm:col-6">
            <label for="username1">End Time</label>
            <InputText id="username1" :required="true" disabled></InputText>
          </div>
          <Divider layout="horizontal" align="center">
            <span class="p-tag">Badge</span>
          </Divider>

          <div class="field col-5">
            <label for="username1">Total Hours Worked Today</label>
            <InputText id="username1" :required="true" disabled></InputText>
            <br /><br />
            <label for="username1">Total Hours Left Today</label>
            <InputText id="username1" :required="true" disabled></InputText>
          </div>

          <div class="col-2">
            <Divider layout="vertical"> </Divider>
          </div>

          <div class="field col-5">
            <label for="username1">Total Hours Of Life Useful Remaining</label>
            <InputText id="username1" :required="true" disabled></InputText>
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
        <Column headerStyle="min-width:10rem;">
          <template #body="slotProps">
            <div style="display: flex; justify-content: end">
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger"
                @click="confirmDeleteProduct(slotProps.data)"
              />
            </div>
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
      { field: "code", header: "Serie" },
      { field: "name", header: "Description" },
      { field: "price", header: "Price", mode: "currency", currency: "USD" },
      { field: "quantity", header: "Quantity" },
      { field: "quantity", header: "Import" },
    ];
  },
  methods: {
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

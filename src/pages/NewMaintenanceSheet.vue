<template>
  <div class="grid">
    <div class="col-12">
      <Button icon="pi pi-arrow-left" class="p-button-rounded mr-2 mb-2" @click="backPage"/>
      <div class="card p-fluid">
        <div class="flex flex-column align-items-center">
          <h3 class="text-900 font-medium">JEX TECHNOLOGIES</h3>
          <span class="text-600 font-medium text-lg">Machine Name</span>
        </div>
      </div>
    </div>
    <div class="col-12 md:col-6">
      <div class="card p-fluid">
        <h5>Information</h5>
        <div class="grid">
          <div class="field col-12 sm:col-6">
            <label for="name1">Date</label>
            <Calendar
                :showIcon="true"
                :showButtonBar="true"
                v-model="calendarValue"
                :minDate="minDateValue"
            ></Calendar>
          </div>

          <div class="field col-12 sm:col-6">
            <label for="state">Maintenance Type</label>
            <Dropdown
                id="state"
                v-model="dropdownItem"
                :options="dropdownItems"
                optionLabel="name"
                placeholder="Select One"
            ></Dropdown>
          </div>
          <div class="field col-12">
            <label for="name1">Responsible</label>
            <InputText id="name1" type="text"/>
          </div>
          <div class="field col-12 sm:col-6">
            <label for="state">Supplier</label>
            <Dropdown
                id="state"
                v-model="dropdownItem"
                :options="dropdownItems"
                optionLabel="name"
                placeholder="Select One"
                :filter="true"
                :loading="false"
            ></Dropdown>
          </div>
          <div class="field col-12 sm:col-6">
            <label for="name1">Technical</label>
            <InputText id="name1" type="text"/>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 md:col-6">
      <div class="card p-fluid">
        <h5>Description</h5>
        <div class="field">
          <!--          <label for="name1">Description</label>-->
          <Textarea
              placeholder="Your Message"
              :autoResize="true"
              rows="12"
              cols="30"
          />
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="card">
        <h5>Details</h5>
        <div class="p-fluid formgrid grid">
          <div class="field col-12 md:col-6 lg:col-4 xl:col-3">
            <div class="flex flex-column sm:flex-row">
              <Button
                  label="Add Article"
                  class="p-button-secondary mr-2 mb-2"
                  @click="openNew"
              />
              <Button
                  label="Add Service"
                  class="p-button-secondary mr-2 mb-2"
                  @click="openNew"
              />
            </div>
          </div>
          <div
              class="
              field
              col-12
              md:col-6
              lg:col-4 lg:col-offset-2
              xl:col-3 xl:col-offset-6
            "
          >
            <div
                class="flex flex-column justify-content-center align-items-center"
            >
              <h3 class="text-900 text-5xl font-medium p-0 m-0">S/00.00</h3>
              <span class="text-600 text-md font-medium p-0">Total</span>
            </div>
          </div>
          <div class="field col-12">
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
import ProductService from "./../service/ProductService";
import {FilterMatchMode} from "primevue/api";

export default {
  data() {
    return {
      dropdownItems: [
        {name: "Option 1", code: "Option 1"},
        {name: "Option 2", code: "Option 2"},
        {name: "Option 3", code: "Option 3"},
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
        {label: "In Stock", value: "INSTOCK"},
        {label: "Low Stock", value: "LOWSTOCK"},
        {label: "Out of Stock", value: "OUTOFSTOCK"},
      ],
      filters: {
        code: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
        name: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
        quantity: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
        price: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
      },
    };
  },
  productService: null,
  created() {
    this.productService = new ProductService();

    this.columns = [
      {field: "code", header: "Serie"},
      {field: "name", header: "Description"},
      {field: "price", header: "Price", mode: "currency", currency: "USD"},
      {field: "quantity", header: "Quantity"},
      {field: "quantity", header: "Import"},
    ];
  },
  methods: {
    openNew() {
      this.product = {};
      this.submitted = false;
      this.productDialog = true;
    },
    onCellEditComplete(event) {
      let {data, newValue, field} = event;

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
      let {newData, index} = event;

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
    backPage() {
      this.$router.push(`/list-machine-maintenance`)
    }
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

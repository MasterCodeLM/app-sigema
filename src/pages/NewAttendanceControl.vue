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
          <h3 class="text-900 font-medium">ASSIST CONTROL</h3>
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="card">
        <Toast/>
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button
                  label="Check in"
                  class="p-button-success mr-2 mb-2"
                  @click="checkIn"
              />

              <Button
                  label="Check out"
                  class="p-button-danger mr-2 mb-2"
                  @click="checkOut"
              />
            </div>
          </template>

          <template v-slot:end>
            <Button
                label="Save Record" class="mr-2 mb-2"
                @click="closeSheet"
            ></Button>
          </template>
        </Toolbar>

        <DataTable
            ref="dt"
            :value="employeesList"
            v-model:selection="selectedProducts"
            dataKey="id"
            :paginator="true"
            :rows="10"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            responsiveLayout="scroll"
        >
          <template #header>
            <div
                class="
                flex flex-column
                md:flex-row md:justify-content-between md:align-items-center
              "
            >
              <h5 class="m-0">List</h5>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText
                    v-model="filters['global'].value"
                    placeholder="Search..."
                />
              </span>
            </div>
          </template>

          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

          <Column
              field="name"
              header="Name"
              :sortable="true"
              headerStyle="width:60%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Name</span>
              {{ slotProps.data.lastname + " " + slotProps.data.name }}
            </template>
          </Column>

          <Column
              field="check_in"
              header="Check in time"
              :sortable="true"
              headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Check in time</span>
              {{ slotProps.data.check_in }}
            </template>
          </Column>
          <Column
              field="check_out"
              header="Check out time"
              :sortable="true"
              headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Check out time</span>
              {{ slotProps.data.check_out }}
            </template>
          </Column>

          <Column
              field="status_working"
              header="Status"
              :sortable="true"
              headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Status</span>
              {{ slotProps.data.status_working }}
            </template>
          </Column>
        </DataTable>

        <Dialog
            v-model:visible="productDialog"
            :style="{ width: '450px' }"
            header="New Article Type"
            :modal="true"
            class="p-fluid"
        >
          <div class="field">
            <label for="name">Name</label>
            <InputText
                id="name"
                v-model.trim="product.name"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !product.name }"
            />
            <small class="p-invalid" v-if="submitted && !product.name"
            >Name is required.</small
            >
          </div>
          <template #footer>
            <Button
                label="Cancel"
                icon="pi pi-times"
                class="p-button-text p-button-danger"
                @click="hideDialog"
            />
            <Button
                label="Save"
                icon="pi pi-check"
                class="p-button-text"
                @click="saveProduct"
            />
          </template>
        </Dialog>

        <Dialog
            v-model:visible="deleteProductDialog"
            :style="{ width: '450px' }"
            header="Confirm"
            :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i
                class="pi pi-exclamation-triangle mr-3"
                style="font-size: 2rem"
            />
            <span v-if="product"
            >Are you sure you want to delete <b>{{ product.name }}</b
            >?</span
            >
          </div>
          <template #footer>
            <Button
                label="No"
                icon="pi pi-times"
                class="p-button-text"
                @click="deleteProductDialog = false"
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                class="p-button-text"
                @click="deleteProduct"
            />
          </template>
        </Dialog>

        <Dialog
            v-model:visible="deleteProductsDialog"
            :style="{ width: '450px' }"
            header="Confirm"
            :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i
                class="pi pi-exclamation-triangle mr-3"
                style="font-size: 2rem"
            />
            <span v-if="product"
            >Are you sure you want to delete the selected products?</span
            >
          </div>
          <template #footer>
            <Button
                label="No"
                icon="pi pi-times"
                class="p-button-text"
                @click="deleteProductsDialog = false"
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                class="p-button-text"
                @click="deleteSelectedProducts"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {FilterMatchMode} from "primevue/api";
//import ProductService from "../service/ProductService";
import AttendanceService from "../service/AttendanceService";
import moment from "moment/moment";

export default {
  data() {
    return {
      //products: null,
      employeesList: null,
      productDialog: false,
      deleteProductDialog: false,
      deleteProductsDialog: false,
      product: {},
      selectedProducts: [],
      filters: {},
      submitted: false,
      statuses: [
        {label: "INSTOCK", value: "instock"},
        {label: "LOWSTOCK", value: "lowstock"},
        {label: "OUTOFSTOCK", value: "outofstock"},
      ],
    };
  },
  sheetListService: null,
  //productService: null,
  created() {
    //this.productService = new ProductService();
    this.sheetListService = new AttendanceService();
    this.initFilters();
  },
  mounted() {
    // console.log(this.$route.params);
    let sheet = this.$route.params;

    //this.productService.getProducts().then((data) => (this.products = data));

    this.sheetListService
        .getOne(sheet.id)
        .then((data) => (this.employeesList = data.employees));
  },
  methods: {
    backPage() {
      this.$router.push(`/attendance-sheet`);
    },
    checkIn() {
      if (this.selectedProducts.length > 0) {
        let now = moment().format("HH:mm:ss");
        let attendance_sheet = this.$route.params;
        let employees = JSON.parse(JSON.stringify(this.employeesList))

        this.selectedProducts.map((employee) => {
          if (!employees[this.findIndexEmployeesById(employee.id)].check_in) {
            employees[this.findIndexEmployeesById(employee.id)].check_in = now;
          }
        });
        let payload = {employees}
        this.sheetListService
            .update(attendance_sheet.id, payload)
            .then((data) => {
              this.employeesList = data.data.employees;
              this.selectedProducts = [];
              this.$toast.add({
                severity: "success",
                summary: "Successful",
                detail: data.message,
                life: 3000,
              });
            });
      } else {
        this.$toast.add({
          severity: "error",
          summary: "Warning",
          detail: "You must select at least one employee ",
          life: 3000,
        });
      }
    },
    checkOut() {
      if (this.selectedProducts.length > 0) {
        let now = moment().format("HH:mm:ss");
        let attendance_sheet = this.$route.params;
        let employees = JSON.parse(JSON.stringify(this.employeesList))

        this.selectedProducts.map((employee) => {
          if (!employees[this.findIndexEmployeesById(employee.id)].check_out) {
            employees[this.findIndexEmployeesById(employee.id)].check_out = now;
          }
        });
        let payload = {employees}
        this.sheetListService
            .update(attendance_sheet.id, payload)
            .then((data) => {
              this.employeesList = data.data.employees;
              this.selectedProducts = [];
              this.$toast.add({
                severity: "success",
                summary: "Successful",
                detail: data.message,
                life: 3000,
              });
            });
      } else {
        this.$toast.add({
          severity: "error",
          summary: "Warning",
          detail: "You must select at least one employee ",
          life: 3000,
        });
      }
    },
    closeSheet() {
      let attendance_sheet = this.$route.params;
      let payload = {
        is_open: false
      }
      this.sheetListService
          .update(attendance_sheet.id, payload)
          .then((data) => {
            this.employeesList = data.data.employees;
            this.selectedProducts = [];
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: data.message,
              life: 3000,
            });
            this.$router.push(`/attendance-sheet`);
          });
    },

    formatCurrency(value) {
      if (value)
        return value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      return;
    },
    openNew() {
      this.product = {};
      this.submitted = false;
      this.productDialog = true;
    },
    hideDialog() {
      this.productDialog = false;
      this.submitted = false;
    },
    saveProduct() {
      this.submitted = true;
      if (this.product.name.trim()) {
        if (this.product.id) {
          this.product.inventoryStatus = this.product.inventoryStatus.value
              ? this.product.inventoryStatus.value
              : this.product.inventoryStatus;
          this.products[this.findIndexById(this.product.id)] = this.product;
          this.$toast.add({
            severity: "success",
            summary: "Successful",
            detail: "Product Updated",
            life: 3000,
          });
        } else {
          this.product.id = this.createId();
          this.product.code = this.createId();
          this.product.image = "product-placeholder.svg";
          this.product.inventoryStatus = this.product.inventoryStatus
              ? this.product.inventoryStatus.value
              : "INSTOCK";
          this.products.push(this.product);
          this.$toast.add({
            severity: "success",
            summary: "Successful",
            detail: "Product Created",
            life: 3000,
          });
        }
        this.productDialog = false;
        this.product = {};
      }
    },
    editProduct(product) {
      this.product = {...product};
      this.productDialog = true;
    },
    confirmDeleteProduct(product) {
      this.product = product;
      this.deleteProductDialog = true;
    },
    deleteProduct() {
      this.products = this.products.filter((val) => val.id !== this.product.id);
      this.deleteProductDialog = false;
      this.product = {};
      this.$toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Product Deleted",
        life: 3000,
      });
    },
    findIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id === id) {
          index = i;
          break;
        }
      }
      return index;
    },
    findIndexEmployeesById(id) {
      let index = -1;
      for (let i = 0; i < this.employeesList.length; i++) {
        if (this.employeesList[i].id === id) {
          index = i;
          break;
        }
      }
      return index;
    },
    createId() {
      let id = "";
      var chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    confirmDeleteSelected() {
      this.deleteProductsDialog = true;
    },
    deleteSelectedProducts() {
      this.products = this.products.filter(
          (val) => !this.selectedProducts.includes(val)
      );
      this.deleteProductsDialog = false;
      this.selectedProducts = null;
      this.$toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Products Deleted",
        life: 3000,
      });
    },
    initFilters() {
      this.filters = {
        global: {value: null, matchMode: FilterMatchMode.CONTAINS},
      };
    },
  },
};
</script>

<style scoped lang="scss">
@import "../assets/demo/badges.scss";
</style>

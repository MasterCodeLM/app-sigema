<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toast/>
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button
                  label="New"
                  icon="pi pi-plus"
                  class="p-button-success mr-2"
                  @click="openNew"
              />
              <!--              <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />-->
            </div>
          </template>

          <template v-slot:end>
            <Button
                label="Export"
                icon="pi pi-upload"
                class="p-button-help"
                @click="exportCSV($event)"
            />
          </template>
        </Toolbar>

        <DataTable
            ref="dt"
            :value="users"
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
              <h5 class="m-0">Users</h5>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText
                    v-model="filters['global'].value"
                    placeholder="Search..."
                />
              </span>
            </div>
          </template>

          <!--          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>-->
          <Column
              field="employee.name"
              header="Name"
              :sortable="true"
              headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Name</span>
              {{ slotProps.data.employee ? slotProps.data.employee.name : "" }}
            </template>
          </Column>

          <Column
              field="email"
              header="User"
              :sortable="true"
              headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">User</span>
              {{ slotProps.data.email }}
            </template>
          </Column>
          <Column
              field="role"
              header="Role"
              :sortable="true"
              headerStyle="width:14%; min-width:10rem;"
          >
            <!--            TODO:COLOR ROLE WITH DINAMIC VALUE-->
            <template #body="slotProps">
              <span class="p-column-title">Role</span>
              {{ slotProps.data.roles.length > 0 ? slotProps.data.roles[0].name : 'Without role' }}
            </template>
          </Column>
          <!--          <Column field="status" header="Status" :sortable="true" headerStyle="width:14%; min-width:10rem;">-->
          <!--            <template #body="slotProps">-->
          <!--              <span class="p-column-title">Status</span>-->
          <!--              <span :class="'product-badge status-' + (slotProps.data.status ? slotProps.data.status.toLowerCase() : '')">{{slotProps.data.status}}</span>-->
          <!--            </template>-->
          <!--          </Column>-->
          <Column headerStyle="min-width:10rem;">
            <template #body="slotProps">
              <div style="display: flex; justify-content: end">
                <InputSwitch v-model="slotProps.data.isActive" @click="toggleLocked(slotProps.data)"/>
                <!--                  <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning mr-2" @click="editProduct(slotProps.data)" />-->
                <!--                  <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDeleteProduct(slotProps.data)" />-->
              </div>
            </template>
          </Column>
        </DataTable>

        <Dialog
            v-model:visible="productDialog"
            :style="{ width: '500px' }"
            header="New User"
            :modal="true"
            class="p-fluid"
        >
          <div class="field">
            <label for="employee" class="mb-3">Employee</label>
            <Dropdown
                id="employee"
                v-model="user.employee"
                :options="employeeItems"
                optionLabel="name"
                placeholder="Select One"
                :filter="true"
                :loading="loadingEmployee"
                :class="{ 'p-invalid': submitted && !usser.employee }"
            ></Dropdown>
            <small class="p-invalid" v-if="submitted && !usser.employee"
            >Employee is required.</small
            >
          </div>
          <div class="field">
            <label for="role" class="mb-3">Role</label>
            <Dropdown
                id="role"
                v-model="user.role"
                :options="roleItems"
                optionLabel="name"
                placeholder="Select One"
                :filter="false"
                :loading="loadingRole"
                :class="{ 'p-invalid': submitted && !usser.role }"
            ></Dropdown>
            <small class="p-invalid" v-if="submitted && !usser.role"
            >Role is required.</small
            >
          </div>
          <div class="formgrid grid">
            <div class="field col">
              <label for="user">User</label>
              <InputText
                  id="user"
                  v-model.trim="user.email"
                  required="true"
                  disabled
                  autofocus
                  :class="{
                  'p-invalid': submittedAddBank && !user.email,
                }"
              />
            </div>
            <div class="field col">
              <label for="password">Password</label>
              <InputText
                  id="password"
                  v-model.trim="user.password"
                  required="true"
                  disabled
                  autofocus
                  :class="{
                  'p-invalid': submittedAddBank && !user.password,
                }"
              />
            </div>
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

        <!--        <Dialog v-model:visible="deleteProductsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">-->
        <!--          <div class="flex align-items-center justify-content-center">-->
        <!--            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />-->
        <!--            <span v-if="product">Are you sure you want to delete the selected products?</span>-->
        <!--          </div>-->
        <!--          <template #footer>-->
        <!--            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false"/>-->
        <!--            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />-->
        <!--          </template>-->
        <!--        </Dialog>-->
      </div>
    </div>
  </div>
</template>

<script>
import {FilterMatchMode} from "primevue/api";
//import ProductService from "../service/ProductService";
import UserService from "../service/UserService";
import EmployeesService from "../service/EmployeesService";
import RolesService from "../service/RolesService";

export default {
  data() {
    return {
      users: null,
      user: {
        email: null,
        password: null,
        employee: null,
        roles: [],
      },

      productDialog: false,
      deleteProductDialog: false,
      deleteProductsDialog: false,
      product: {},
      selectedProducts: null,
      filters: {},
      submitted: false,
      switchValue: false,
      statuses: [
        {label: "INSTOCK", value: "instock"},
        {label: "LOWSTOCK", value: "lowstock"},
        {label: "OUTOFSTOCK", value: "outofstock"},
      ],

      employeeItems: null,
      roleItems: null,

      loadingEmployee: true,
      loadingRole: true,
    };
  },
  userService: null,
  employeeService: null,
  roleService: null,

  created() {
    this.userService = new UserService();
    this.employeeService = new EmployeesService();
    this.roleService = new RolesService();
    this.initFilters();
  },
  watch: {
    "user.employee"(newValue) {
      if (newValue) {
        this.employeeService
            .getGenerateSafeCredentials(newValue.id)
            .then((data) => {
              this.user.email = data.data.email;
              this.user.password = data.data.password;
            });
      }
    },
  },
  mounted() {
    this.loading = true;
    this.userService.getAll().then((data) => (this.users = data));
    this.loading = false;
  },
  methods: {
    formatCurrency(value) {
      if (value)
        return value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      return;
    },
    openNew() {
      this.employeeService.getAllWithoutUser().then((data) => {
        this.employeeItems = data
        this.loadingEmployee = false;
      });
      this.roleService.getAll().then((data) => {
        this.roleItems = data
        this.loadingRole = false;
      });

      this.defaultObjects();
      this.product = {};
      this.submitted = false;
      this.productDialog = true;
    },
    hideDialog() {
      //this.defaultObjects();
      this.productDialog = false;
      this.submitted = false;
    },
    saveProduct() {
      this.submitted = true;
      if (this.validateFormUser()) {
        if (this.user.id) {
          const payload = this.user;
          //console.log(payload, this.article, this.article.id);
          //UPDATE
          this.userService.update(this.user.id, payload).then((data) => {
            this.users[this.findIndexById(data.data.id)] = data.data;
            console.log(data.data.id);
            console.log(this.findIndexById(data.data.id));
            //console.log(this.article.id);
            //console.log(this.findIndexById(this.article.id));
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: data.message,
              life: 3000,
            });
          });
        } else {
          // CREATE
          this.user.roles.push(this.user.role);
          const payload = this.user;
          // payload.roles.push(this.user.role);
          // console.log(payload);
          //payload.image="...";
          this.userService.create(payload).then((data) => {
            this.users.unshift(data.data);
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: data.message,
              life: 3000,
            });
          });
        }
        this.hideDialog();
        // this.productDialog = false;
        //this.defaultObjects();
      }
    },
    editProduct(user) {
      this.userService.getOne(user.id).then((data) => {
        this.user = {...data};
        this.productDialog = true;
      });
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
    validateFormUser() {
      return true;
      // return this.user.employee &&
      // this.user.email &&
      // this.user.password;
    },
    initFilters() {
      this.filters = {
        global: {value: null, matchMode: FilterMatchMode.CONTAINS},
      };
    },
    toggleLocked(data) {
      this.userService.delete(data.id).then((data) => {
        this.$toast.add({
          severity: "success",
          summary: "Successful",
          detail: data.message,
          life: 3000,
        });
      });
    },
    defaultObjects() {
      this.user = {
        email: null,
        password: null,
        employee: null,
        roles: []
      };
    },
  },
};
</script>

<style scoped lang="scss">
@import "../assets/demo/badges.scss";
</style>

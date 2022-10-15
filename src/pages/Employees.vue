<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toast />
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button
                label="New"
                icon="pi pi-plus"
                class="p-button-success mr-2"
                @click="openNew"
              />
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
          :value="employees"
          v-model:selection="selectedProducts"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
          responsiveLayout="scroll"
          :loading="loadingEmployees"
        >
          <template #header>
            <div
              class="
                flex flex-column
                md:flex-row md:justify-content-between md:align-items-center
              "
            >
              <h5 class="m-0">Employees</h5>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Search..."
                />
              </span>
            </div>
          </template>

          <Column
            field="name"
            header="Name"
            :sortable="true"
            headerStyle="width:22%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Name</span>
              {{ slotProps.data.name }}
            </template>
          </Column>
          <Column
            field="lastname"
            header="Last Name"
            :sortable="true"
            headerStyle="width:22%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Last Name</span>
              {{ slotProps.data.lastname }}
            </template>
          </Column>

          <Column
            field="document_type.name"
            header="Document Type"
            :sortable="true"
            headerStyle="width:5%; min-width:3rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Document Type</span>
              {{ slotProps.data.document_type.name }}
            </template>
          </Column>

          <Column
            field="document_number"
            header="Document Number"
            :sortable="true"
            headerStyle="width:8%; min-width:3rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Document Number</span>
              {{ slotProps.data.document_number }}
            </template>
          </Column>

          <!--          <Column-->
          <!--              field="age"-->
          <!--              header="Age"-->
          <!--              :sortable="true"-->
          <!--              headerStyle="width:14%; min-width:10rem;"-->
          <!--          >-->
          <!--            <template #body="slotProps">-->
          <!--              <span class="p-column-title">Age</span>-->
          <!--              {{ slotProps.data.age }}-->
          <!--            </template>-->
          <!--          </Column>-->

          <Column
            field="position.name"
            header="Title"
            :sortable="true"
            headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Title</span>
              {{ slotProps.data.position.name }}
            </template>
          </Column>

          <Column
            field="phone"
            header="Telephone"
            :sortable="true"
            headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Telephone</span>
              {{ slotProps.data.phone }}
            </template>
          </Column>

          <Column
            field="address"
            header="Address"
            :sortable="true"
            headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Address</span>
              {{ slotProps.data.address }}
            </template>
          </Column>

          <Column
            field="personal_email"
            header="Email"
            :sortable="true"
            headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Email</span>
              {{ slotProps.data.personal_email }}
            </template>
          </Column>

          <!--          <Column-->
          <!--              field="inventoryStatus"-->
          <!--              header="Status"-->
          <!--              :sortable="true"-->
          <!--              headerStyle="width:14%; min-width:10rem;"-->
          <!--          >-->
          <!--            <template #body="slotProps">-->
          <!--              <span class="p-column-title">Status</span>-->
          <!--              <span-->
          <!--                  :class="-->
          <!--                  'product-badge status-' +-->
          <!--                  (slotProps.data.inventoryStatus-->
          <!--                    ? slotProps.data.inventoryStatus.toLowerCase()-->
          <!--                    : '')-->
          <!--                "-->
          <!--              >{{ slotProps.data.inventoryStatus }}</span-->
          <!--              >-->
          <!--            </template>-->
          <!--          </Column>-->

          <Column headerStyle="min-width:10rem;">
            <template #body="slotProps">
              <div style="display: flex; justify-content: end">
                <Button
                  icon="pi pi-eye"
                  class="p-button-rounded p-button-info mr-2"
                  @click="viewEmployee(slotProps.data)"
                />
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-warning mr-2"
                  @click="editProduct(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger"
                  @click="confirmDelete(slotProps.data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>

        <Dialog
          v-model:visible="productDialog"
          :style="{ width: '600px' }"
          :header="
            !employee.id
              ? 'New Employee'
              : !isView
              ? 'Edit Employee'
              : 'Info Employee'
          "
          :modal="true"
          class="p-fluid"
        >
          <div class="formgrid grid">
            <div class="field col">
              <label for="doccumentType">Document Type</label>
              <Dropdown
                id="doccumentType"
                v-model="employee.document_type"
                :options="documentTypeItems"
                optionLabel="name"
                placeholder="Select One"
                :filter="false"
                :loading="false"
                :class="{ 'p-invalid': submitted && !employee.document_type }"
                :disabled="isView"
                autocomplete="off"
              >
              </Dropdown>
              <small
                class="p-invalid"
                v-if="submitted && !employee.document_type"
                >Document Type is required.</small
              >
            </div>

            <div class="field col">
              <label for="document_number">Document Number</label>
              <InputText
                id="document_number"
                v-model.trim="employee.document_number"
                required="true"
                autofocus
                :class="{
                  'p-invalid':
                    (submitted && !employee.document_number) ||
                    (submitted && employee.document_number.length < 8),
                }"
                :disabled="isView"
                autocomplete="off"
                @keypress="isNumber($event)"
              />
              <small
                class="p-invalid"
                v-if="submitted && !employee.document_number"
                >Document Number is required.</small
              >
              <br />
              <small
                class="p-invalid"
                v-if="
                  submitted &&
                  employee.document_number &&
                  employee.document_number.length < 8
                "
                >The document number must be at least 8 characters.</small
              >
            </div>
          </div>

          <div class="formgrid grid">
            <div class="field col">
              <label for="name">Name</label>
              <InputText
                id="name"
                v-model.trim="employee.name"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !employee.name }"
                :disabled="isView"
                autocomplete="off"
              />
              <small class="p-invalid" v-if="submitted && !employee.name"
                >Name is required.</small
              >
            </div>

            <div class="field col">
              <label for="lastname">Last Name</label>
              <InputText
                id="name"
                v-model.trim="employee.lastname"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !employee.lastname }"
                :disabled="isView"
                autocomplete="off"
              />
              <small class="p-invalid" v-if="submitted && !employee.lastname"
                >Last Name is required.</small
              >
            </div>
          </div>

          <div class="formgrid grid">
            <!--            <div class="field col-4">-->
            <!--              <label for="age">Age</label>-->
            <!--              &lt;!&ndash; <InputNumber id="age" v-model="product.quantity" integeronly />&ndash;&gt;-->
            <!--              <InputNumber-->
            <!--                id="age"-->
            <!--                v-model="inputNumberValue"-->
            <!--                showButtons-->
            <!--                :disabled="isView"-->
            <!--                :min="0"-->
            <!--                :useGrouping="false"-->
            <!--              />-->
            <!--            </div>-->

            <div class="field col">
              <label for="position">Title</label>
              <Dropdown
                id="position"
                v-model="employee.position"
                :options="positionItems"
                optionLabel="name"
                placeholder="Select One"
                :disabled="isView"
                :filter="false"
                :loading="false"
                :class="{ 'p-invalid': submitted && !employee.position }"
              >
              </Dropdown>
              <small class="p-invalid" v-if="submitted && !employee.position"
                >Title is required.</small
              >
            </div>
          </div>

          <div class="formgrid grid">
            <div class="field col">
              <label for="phone">Telephone</label>
              <InputText
                id="phone"
                v-model.trim="employee.phone"
                required="true"
                autofocus
                :disabled="isView"
                :class="{
                  'p-invalid':
                    (submitted && !employee.phone) ||
                    (submitted && employee.phone.length < 9),
                }"
                autocomplete="off"
                @keypress="isNumber($event)"
              />
              <small class="p-invalid" v-if="submitted && !employee.phone"
                >Telephone is required.</small
              >
              <small
                class="p-invalid"
                v-if="submitted && employee.phone && employee.phone.length < 9"
                >The Telephone must be at least 9 characters.</small
              >
            </div>

            <div class="field col">
              <label for="personal_email">Email</label>
              <InputText
                id="personal_email"
                v-model.trim="employee.personal_email"
                required="true"
                autofocus
                :class="{
                  'p-invalid':
                    (submitted && !employee.personal_email) ||
                    (submitted && !isEmail()),
                }"
                :disabled="isView"
                autocomplete="off"
              />
              <small
                class="p-invalid"
                v-if="submitted && !employee.personal_email"
                >Email is required.</small
              >
              <small
                class="p-invalid"
                v-if="submitted && employee.personal_email && !isEmail()"
                >The email must be a valid email address.</small
              >
            </div>
          </div>
          <div class="field">
            <label for="address">Address</label>
            <InputText
              id="address"
              v-model.trim="employee.address"
              required="true"
              autofocus
              :disabled="isView"
              :class="{ 'p-invalid': submitted && !employee.address }"
            />
            <small class="p-invalid" v-if="submitted && !employee.address"
              >Address is required.</small
            >
          </div>

          <div class="formgrid grid">
            <div class="field col">
              <label for="state">Native Language</label>
              <Dropdown
                id="state"
                v-model="employee.native_language"
                :disabled="isView"
                :options="dropdownLenguageItems"
                optionLabel="name"
                optionValue="value"
                placeholder="Select One"
                :class="{ 'p-invalid': submitted && !employee.native_language }"
              ></Dropdown>
              <small
                class="p-invalid"
                v-if="submitted && !employee.native_language"
                >Native language is required.</small
              >
            </div>
            <div class="field col">
              <label for="state">Type Personal</label>
              <Dropdown
                id="state"
                v-model="employee.type"
                :disabled="isView"
                :options="dropdownTypePersonalItems"
                optionLabel="name"
                optionValue="value"
                placeholder="Select One"
                :class="{ 'p-invalid': submitted && !employee.type }"
              ></Dropdown>
              <small class="p-invalid" v-if="submitted && !employee.type"
                >Type personal is required.</small
              >
            </div>
            <div class="field col">
              <label for="state">Turn of Entry</label>
              <Dropdown
                id="state"
                v-model="employee.turn"
                :disabled="isView"
                :options="dropdownTurnEntryItems"
                optionLabel="name"
                optionValue="value"
                placeholder="Select One"
                :class="{ 'p-invalid': submitted && !employee.turn }"
              ></Dropdown>
              <small class="p-invalid" v-if="submitted && !employee.turn"
                >Turn of entry is required.</small
              >
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
              v-if="!isView"
              label="Save"
              icon="pi pi-check"
              class="p-button-text"
              @click="saveProduct"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deleteDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i
              class="pi pi-exclamation-triangle mr-3"
              style="font-size: 2rem"
            />
            <span v-if="resource"
              >Are you sure you want to delete <b>{{ resource.name }}</b
              >?</span
            >
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteResource"
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
              >Are you sure you want to delete the selected employees?</span
            >
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteResource"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { FilterMatchMode } from "primevue/api";
import EmployeesService from "../service/EmployeesService";
import DocumentTypeServices from "../service/DocumentTypeServices";
import TitleService from "../service/TitleService";

export default {
  data() {
    return {
      dropdownLenguageItems: [
        { name: "English", value: "english" },
        { name: "Spanish", value: "spanish" },
      ],
      dropdownTypePersonalItems: [
        { name: "Permanent", value: "permanent" },
        { name: "Relay", value: "relay" },
      ],
      dropdownTurnEntryItems: [
        { name: "Day", value: "day" },
        { name: "Night", value: "night" },
      ],
      dropdownItem: null,
      employees: null,
      employee: {
        document_type: null,
        document_number: null,
        name: null,
        phone: null,
        position: null,
        personal_email: null,
        address: null,
        type: null,
        turn: null,
        native_language: null,
      },
      productDialog: false,
      deleteDialog: false,
      deleteProductsDialog: false,
      product: {},
      resource: {},
      selectedProducts: null,
      filters: {},
      submitted: false,
      message: null,
      //loading: false,
      statuses: [
        { label: "INSTOCK", value: "instock" },
        { label: "LOWSTOCK", value: "lowstock" },
        { label: "OUTOFSTOCK", value: "outofstock" },
      ],

      documentTypeItem: null,

      positionItems: null,

      documentTypeItems: null,
      loadingEmployees: true,
      isView: false,
    };
  },
  employeesService: null,
  documentTypeService: null,
  positionService: null,
  created() {
    this.employeesService = new EmployeesService();
    this.documentTypeService = new DocumentTypeServices();
    this.positionService = new TitleService();
    this.initFilters();
  },
  mounted() {
    //this.loading = true;
    this.employeesService.getAll().then((data) => {
      this.employees = data;
      this.loadingEmployees = false;
    });
    this.documentTypeService
      .getAll()
      .then((data) => (this.documentTypeItems = data));
    this.positionService.getAll().then((data) => (this.positionItems = data));

    //this.loading = false;
  },
  methods: {
    openNew() {
      this.isView = false;
      this.defaultObjects();
      //this.product = {};
      this.resource = {};
      this.submitted = false;
      this.productDialog = true;
    },
    hideDialog() {
      this.defaultObjects();
      this.productDialog = false;
      this.submitted = false;
    },
    saveProduct() {
      this.submitted = true;
      if (this.validateFormEmployee()) {
        if (this.employee.id) {
          //UPDATE
          const payload = this.employee;
          this.employeesService
            .update(this.employee.id, payload)
            .then((data) => {
              this.employees[this.findIndexById(data.data.id)] = data.data;
              this.$toast.add({
                severity: "success",
                summary: "Successful",
                detail: data.message,
                life: 3000,
              });
            });
        } else {
          // CREATE

          const payload = this.employee;
          console.log(payload);
          //payload.image="...";
          this.employeesService.create(payload).then((data) => {
            this.employees.unshift(data.data);
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: data.message,
              life: 3000,
            });
          });
        }
        this.productDialog = false;
        this.defaultObjects();
      }
    },
    viewEmployee(employee) {
      this.isView = true;
      this.employeesService.getOne(employee.id).then((data) => {
        this.employee = { ...data };
        this.productDialog = true;
      });
    },
    editProduct(employee) {
      this.isView = false;
      this.employeesService.getOne(employee.id).then((data) => {
        this.employee = { ...data };
        this.productDialog = true;
      });
    },
    confirmDelete(resource) {
      this.resource = resource;
      this.deleteDialog = true;
    },
    deleteResource() {
      this.deleteDialog = false;
      this.employeesService.delete(this.resource.id).then((data) => {
        this.employees = this.employees.filter(
          (val) => val.id !== this.resource.id
        );
        this.resource = {};
        this.$toast.add({
          severity: "success",
          summary: "Successful",
          detail: data.message,
          life: 3000,
        });
      });
    },
    findIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.employees.length; i++) {
        if (this.employees[i].id === id) {
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
    validateFormEmployee() {
      console.log(this.employee);
      return (
        this.employee.document_type &&
        this.employee.document_number &&
        this.employee.document_number.length >= 8 &&
        this.employee.name &&
        //this.employee.age &&
        this.employee.phone &&
        this.employee.phone.length >= 9 &&
        this.employee.position &&
        this.employee.personal_email &&
        this.employee.address &&
        this.employee.type &&
        this.employee.turn &&
        this.employee.native_language
      );
    },

    isNumber(evt) {
      evt = evt ? evt : window.event;
      let charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    isEmail() {
      return /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(
        this.employee.personal_email
      );
    },

    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
    },

    defaultObjects() {
      this.employee = {
        document_type: null,
        document_number: null,
        name: null,
        age: null,
        phone: null,
        position: null,
        personal_email: null,
        address: null,
        type: null,
        turn: null,
        native_language: null,
      };
    },
  },
};
</script>

<style scoped lang="scss">
@import "../assets/demo/badges.scss";
</style>

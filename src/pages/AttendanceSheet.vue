<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-fluid">
        <div class="flex flex-column align-items-center">
          <h3 class="text-900 font-medium">ATTENDANCES</h3>
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="card">
        <Toast />
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="fiel grid">
              <div style="vertical-align: inherit" class="px-2">
                <label>From the</label>

                <Calendar
                  :showIcon="true"
                  :showButtonBar="false"
                  v-model="start_date"
                  :maxDate="minDateValue"
                  dateFormat="yy-mm-dd"
                ></Calendar>
              </div>
              <div style="vertical-align: inherit" class="px-2">
                <label>Until the</label>
                <Calendar
                  :showIcon="true"
                  :showButtonBar="false"
                  v-model="end_date"
                  :maxDate="minDateValue"
                  dateFormat="yy-mm-dd"
                ></Calendar>
              </div>
            </div>
          </template>

          <template v-slot:end>
            <Button
              label="New Attendance Control"
              icon="pi pi-plus"
              class="p-button-success mr-2"
              @click="openNew"
            />
          </template>
        </Toolbar>

        <DataTable
          ref="dt"
          :value="sheetsAttendances"
          v-model:selection="selectedProducts"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} attendance sheets"
          responsiveLayout="scroll"
          :loading="loadingSheets"
        >
          <template #header>
            <div
              class="
                flex flex-column
                md:flex-row md:justify-content-between md:align-items-center
              "
            >
              <h5 class="m-0">LIST ATTENDACE SHEETS</h5>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Search..."
                />
              </span>
            </div>
          </template>

          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column
            field="date"
            header="Date"
            :sortable="true"
            headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Date</span>
              {{ slotProps.data.date }}
            </template>
          </Column>
          <Column
            field="responsible"
            header="Responsible"
            :sortable="true"
            headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Responsible</span>
              {{ slotProps.data.responsible }}
            </template>
          </Column>
          <Column
            field="is_open"
            header="Estado"
            :sortable="true"
            headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Estado</span>
              {{ slotProps.data.is_open ? "Open" : "Closed" }}
            </template>
          </Column>

          <Column headerStyle="min-width:10rem;">
            <template #body="slotProps">
              <div style="display: flex; justify-content: end">
                <Button
                  v-if="!slotProps.data.is_open"
                  icon="pi pi-eye"
                  class="p-button-rounded p-button-info mr-2"
                  @click="editProduct(slotProps.data)"
                />
                <Button
                  v-if="slotProps.data.is_open"
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-warning mr-2"
                  @click="editProduct(slotProps.data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>

        <Dialog v-model:visible="productDialog" :style="{ width: '1600px' }">
          <div class="content-section introduction">
            <div class="feature-intro">
              <h1>PickList New Attendance</h1>
              <p>Add the employees who will work the next shift to open</p>
            </div>
            <AppDemoActions />
          </div>

          <div class="content-section implementation">
            <div class="card">
              <PickList
                v-model="employees"
                listStyle="height:342px"
                dataKey="id"
              >
                <template #sourceheader>
                  Available
                  <div
                    class="
                      flex flex-column
                      md:flex-row
                      md:justify-content-between
                      md:align-items-center
                    "
                  >
                    <div class="field grid col-8">
                      <div class="field col-6 px-2">
                        <h5 class="m-0">
                          <h6>Filter by:</h6>

                          <Dropdown
                            id="state"
                            v-model="filter"
                            :options="articleTypeFilterItems"
                            optionLabel="name"
                            placeholder="Type employee"
                            :filter="false"
                            :loading="loadingArticleTypesFilter"
                            @change="filterByArticleType"
                          ></Dropdown>
                        </h5>
                      </div>

                      <div class="field col-6 px-2">
                        <h5 class="m-0">
                          <h6>Filter by:</h6>

                          <Dropdown
                            id="state"
                            v-model="filter"
                            :options="articleTypeFilterItems"
                            optionLabel="name"
                            placeholder="Turn"
                            :filter="false"
                            :loading="loadingArticleTypesFilter"
                            @change="filterByArticleType"
                          ></Dropdown>
                        </h5>
                      </div>
                    </div>
                    <div class="field col-4">
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
                <template #targetheader> Selected </template>
                <template #item="slotProps">
                  <div class="product-item">
                    <div class="product-list-detail">
                      <div class="grid">
                        <div class="col 6">
                          <h6 class="mb-2">
                            {{
                              slotProps.item.name + "" + slotProps.item.lastname
                            }}
                          </h6>
                        </div>
                        <div class="col 6">
                          <h6 class="mb-2">
                            {{ slotProps.item.document_type.name }}
                          </h6>
                        </div>
                        <div class="col 6">
                          <h6 class="mb-2">
                            {{ slotProps.item.document_type.name }}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </PickList>
            </div>
            <div class="flex justify-content-end">
              <Button
                label="Next"
                icon="pi pi-list"
                class="p-button-success mr-2"
                @click="nextPage"
              />
            </div>
          </div>
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
            <span v-if="attendanceSheet"
              >Are you sure you want to delete <b>{{ attendanceSheet.name }}</b
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
import { FilterMatchMode } from "primevue/api";
import AttendanceService from "../service/AttendanceService";
import moment from "moment/moment";
import EmployeesService from "../service/EmployeesService";
// import moment from "moment/moment";
// import ToastDoc from './ToastDoc';

export default {
  data() {
    return {
      employees: null,
      sheetsAttendances: null,
      productDialog: false,
      deleteDialog: false,
      deleteProductsDialog: false,
      product: {},
      attendanceSheet: {}, // One Resource ArticleType
      selectedProducts: null,
      filters: {},
      submitted: false,
      message: null,
      statuses: [
        { label: "INSTOCK", value: "instock" },
        { label: "LOWSTOCK", value: "lowstock" },
        { label: "OUTOFSTOCK", value: "outofstock" },
      ],
      loadingSheets: true,
      isView: false,

      start_date: moment().format("YYYY-MM-DD"),
      end_date: moment().format("YYYY-MM-DD"),
      minDateValue: new Date(),
    };
  },
  sheetAttendanceService: null,
  employeesService: null,
  created() {
    this.sheetAttendanceService = new AttendanceService();
    this.employeesService = new EmployeesService();
    this.initFilters();
  },
  mounted() {
    // let now = moment().format('YYYY-MM-DD')
    // this.start_date = moment().format('YYYY-MM-DD')
    // this.end_date = moment().format('YYYY-MM-DD')
    // this.minDateValue = new Date()
    let start_date = this.start_date;
    let end_date = this.end_date;
    this.sheetAttendanceService
      .getAllFilterDates(start_date, end_date)
      .then((data) => {
        this.sheetsAttendances = data;
        this.loadingSheets = false;
      });
  },
  watch: {
    start_date(value) {
      let start_date = moment(value).format("YYYY-MM-DD");
      let end_date = moment(this.end_date).format("YYYY-MM-DD");
      this.loadingSheets = true;
      this.sheetAttendanceService
        .getAllFilterDates(start_date, end_date)
        .then((data) => {
          this.sheetsAttendances = data;
          this.loadingSheets = false;
        });
      // console.log(start_date, end_date);
    },
    end_date(value) {
      let start_date = moment(this.start_date).format("YYYY-MM-DD");
      let end_date = moment(value).format("YYYY-MM-DD");
      this.loadingSheets = true;
      this.sheetAttendanceService
        .getAllFilterDates(start_date, end_date)
        .then((data) => {
          this.sheetsAttendances = data;
          this.loadingSheets = false;
        });
      // console.log(start_date, end_date);
    },
  },
  methods: {
    nextPage() {
      const payload = this.attendanceSheet;
      this.sheetAttendanceService.create(payload).then((data) => {
        this.sheetsAttendances.unshift(data.data);
        this.$router.push(`/new-attendance-control/${data.data.id}`);
      });
    },
    openNew() {
      this.isView = false;

      this.attendanceSheet = {};
      this.employeesService
        .getAll()
        .then((data) => (this.employees = [data, []]));
      console.log(this.employees);
      this.submitted = false;
      this.productDialog = true;
    },
    hideDialog() {
      this.productDialog = false;
      this.submitted = false;
    },
    saveProduct() {
      this.submitted = true;
      if (this.attendanceSheet.name.trim()) {
        if (this.attendanceSheet.id) {
          //UPDATE
          const id = this.attendanceSheet.id;
          const payload = this.attendanceSheet;
          this.articleTypesService.update(id, payload).then((data) => {
            this.articleTypes[this.findIndexById(id)] = data.data;
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: data.message,
              life: 3000,
            });
          });
        } else {
          // CREATE
          const payload = this.attendanceSheet;
          this.articleTypesService.create(payload).then((data) => {
            this.articleTypes.unshift(data.data);
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: data.message,
              life: 3000,
            });
          });
        }
        this.productDialog = false;
        this.attendanceSheet = {};
      }
    },
    viewArticleTypes(attendanceSheet) {
      this.isView = true;
      this.attendanceSheet = { ...attendanceSheet };
      this.productDialog = true;
    },
    editProduct(attendanceSheet) {
      this.$router.push(`/new-attendance-control/${attendanceSheet.id}`);

      /*this.isView = false;
      this.attendanceSheet = { ...attendanceSheet };
      this.productDialog = true;*/
    },
    confirmDelete(attendanceSheet) {
      this.attendanceSheet = attendanceSheet;
      this.deleteDialog = true;
    },
    deleteResource() {
      this.deleteDialog = false;
      this.articleTypesService.delete(this.attendanceSheet.id).then((data) => {
        this.articleTypes = this.articleTypes.filter(
          (val) => val.id !== this.attendanceSheet.id
        );
        this.attendanceSheet = {};
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
      for (let i = 0; i < this.articleTypes.length; i++) {
        if (this.articleTypes[i].id === id) {
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
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
    },
  },
};
</script>

<style scoped lang="scss">
@import "../assets/demo/badges.scss";
</style>

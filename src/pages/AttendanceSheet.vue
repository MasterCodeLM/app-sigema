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
        <Toast/>
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="grid">
              <label for="name1">Since</label>
              <Calendar
                  :showIcon="true"
                  :showButtonBar="true"
                  v-model="start_date"
                  :maxDate="minDateValue"
                  dateFormat="yy-mm-dd"
              ></Calendar>
              <label for="name1">Until</label>
              <Calendar
                  :showIcon="true"
                  :showButtonBar="true"
                  v-model="end_date"
                  :maxDate="minDateValue"
                  dateFormat="yy-mm-dd"
              ></Calendar>
            </div>
          </template>

          <template v-slot:end>
            <Button
                label="New Attendance Control"
                icon="pi pi-plus"
                class="p-button-success mr-2"
                @click="nextPage"
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Article Types"
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
              <h5 class="m-0">hojasssssssssssssss</h5>
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
              {{ slotProps.data.is_open ? 'Open' : 'Closed' }}
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

        <Dialog
            v-model:visible="productDialog"
            :style="{ width: '450px' }"
            :header="
            !attendanceSheet.id
              ? 'New Article Type'
              : !isView
              ? 'Edit Article Type'
              : 'Info Article Type'
          "
            :modal="true"
            class="p-fluid"
        >
          <div class="field">
            <label for="name">Name</label>
            <InputText
                id="name"
                v-model.trim="attendanceSheet.name"
                required="true"
                autofocus
                :disabled="isView"
                :class="{ 'p-invalid': submitted && !attendanceSheet.name }"
            />
            <small class="p-invalid" v-if="submitted && !attendanceSheet.name"
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
import {FilterMatchMode} from "primevue/api";
import AttendanceService from "../service/AttendanceService";
import moment from "moment/moment";
// import moment from "moment/moment";
// import ToastDoc from './ToastDoc';

export default {
  data() {
    return {
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
        {label: "INSTOCK", value: "instock"},
        {label: "LOWSTOCK", value: "lowstock"},
        {label: "OUTOFSTOCK", value: "outofstock"},
      ],
      loadingSheets: true,
      isView: false,

      start_date: null,
      end_date: null,
      minDateValue: null
    };
  },
  sheetAttendanceService: null,
  created() {
    this.sheetAttendanceService = new AttendanceService();
    this.initFilters();
  },
  mounted() {
    // let now = moment().format('YYYY-MM-DD')
    this.start_date = moment().format('YYYY-MM-DD')
    this.end_date = moment().format('YYYY-MM-DD')
    this.minDateValue =  new Date()
    this.sheetAttendanceService.getAll().then((data) => {
      this.sheetsAttendances = data;
      this.loadingSheets = false;
    });
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
      this.attendanceSheet = {...attendanceSheet};
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
        global: {value: null, matchMode: FilterMatchMode.CONTAINS},
      };
    },
  },
};
</script>

<style scoped lang="scss">
@import "../assets/demo/badges.scss";
</style>

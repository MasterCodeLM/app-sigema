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
              <Button
                label="Delete"
                icon="pi pi-trash"
                class="p-button-danger"
                @click="confirmDeleteSelected"
                :disabled="!selectedProducts || !selectedProducts.length"
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
          :value="machines"
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
              <h5 class="m-0">Machines</h5>
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
            field="name"
            header="Name"
            :sortable="true"
            headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Name</span>
              {{ slotProps.data.name }}
            </template>
          </Column>

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
            field="model"
            header="Model"
            :sortable="true"
            headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Model</span>
              {{ slotProps.data.model }}
            </template>
          </Column>

          <Column
            field="brand"
            header="Brand"
            :sortable="true"
            headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Brand</span>
              {{ slotProps.data.brand }}
            </template>
          </Column>

          <Column header="Image" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Image</span>
              <img
                :src="'images/product/' + slotProps.data.image"
                :alt="slotProps.data.image"
                class="shadow-2"
                width="100"
              />
            </template>
          </Column>

          <Column
            field="maximum_working_time"
            header="Daily Working Hours"
            :sortable="true"
            headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Daily Working Hours</span>
              {{ slotProps.data.maximum_working_time }}
            </template>
          </Column>

          <Column
            field="usefulLifehours"
            header="Useful Life Hours"
            :sortable="true"
            headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Useful Life Hours</span>
              {{ slotProps.data.price }}
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
              <span
                :class="
                  'product-badge status-' +
                  (slotProps.data.inventoryStatus
                    ? slotProps.data.inventoryStatus.toLowerCase()
                    : '')
                "
                >{{ slotProps.data.inventoryStatus }}</span
              >
            </template>
          </Column>

          <Column headerStyle="min-width:10rem;">
            <template #body="slotProps">
              <div style="display: flex; justify-content: end">
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
          :style="{ width: '900px' }"
          header="Machine Details"
          :modal="true"
          class="p-fluid"
        >
          <div class="formgrid grid">
            <div class="col-6">
              <div class="field">
                <label for="serialNumber">Serial Number</label>
                <InputText
                  id="serialNumber"
                  v-model.trim="product.serialNumber"
                  required="true"
                  autofocus
                  :class="{ 'p-invalid': submitted && !product.name }"
                />
                <small class="p-invalid" v-if="submitted && !product.name"
                  >Serial Number is required.</small
                >
              </div>

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

              <div class="formgrid grid">
                <div class="field col">
                  <label for="model">Model</label>
                  <InputText
                    id="model"
                    v-model.trim="product.model"
                    required="true"
                    autofocus
                    :class="{ 'p-invalid': submitted && !product.name }"
                  />
                  <small class="p-invalid" v-if="submitted && !product.name"
                    >Model is required.</small
                  >
                </div>

                <div class="field col">
                  <label for="brand">Brand</label>
                  <InputText
                    id="barnd"
                    v-model.trim="product.brand"
                    required="true"
                    autofocus
                    :class="{ 'p-invalid': submitted && !product.name }"
                  />
                  <small class="p-invalid" v-if="submitted && !product.name"
                    >Brand is required.</small
                  >
                </div>
              </div>

              <div class="formgrid grid">
                <div class="field col">
                  <label for="dailyWorkinghours">Daily Working Hours</label>
                  <!-- <InputNumber id="age" v-model="product.quantity" integeronly />-->
                  <InputNumber
                    id="age"
                    v-model="inputNumberValue"
                    showButtons
                    mode="decimal"
                  />
                </div>

                <div class="field col">
                  <label for="usefulLifehours">Useful Life Hours</label>
                  <!-- <InputNumber id="age" v-model="product.quantity" integeronly />-->
                  <InputNumber
                    id="age"
                    v-model="inputNumberValue"
                    showButtons
                    mode="decimal"
                    required="true"
                    autofocus
                    :class="{ 'p-invalid': submitted && !product.name }"
                  />
                  <small class="p-invalid" v-if="submitted && !product.name"
                    >Useful Life Hours is required.</small
                  >
                </div>
              </div>

              <div class="field">
                <h5>Spare Parts</h5>
                <MultiSelect
                  v-model="multiselectValue"
                  :options="multiselectValues"
                  optionLabel="name"
                  placeholder="Select Countries"
                  :filter="true"
                >
                  <template #value="slotProps">
                    <div
                      class="
                        inline-flex
                        align-items-center
                        py-1
                        px-2
                        bg-primary
                        text-primary
                        border-round
                        mr-2
                      "
                      v-for="option of slotProps.value"
                      :key="option.code"
                    >
                      <span
                        :class="'mr-2 flag flag-' + option.code.toLowerCase()"
                        style="width: 18px; height: 12px"
                      />
                      <div>{{ option.name }}</div>
                    </div>
                    <template
                      v-if="!slotProps.value || slotProps.value.length === 0"
                    >
                      <div class="p-1">Select Spare Parts</div>
                    </template>
                  </template>
                  <template #option="slotProps">
                    <div class="flex align-items-center">
                      <span
                        :class="
                          'mr-2 flag flag-' +
                          slotProps.option.code.toLowerCase()
                        "
                        style="width: 18px; height: 12px"
                      />
                      <div>{{ slotProps.option.name }}</div>
                    </div>
                  </template>
                </MultiSelect>
              </div>
            </div>

            <div class="grid field col">
              <!-- <div class="col-12"> -->
              <div class="card">
                <h5>Imagen</h5>
                <FileUpload
                  mode="basic"
                  name="demo[]"
                  url="./upload.php"
                  accept="image/*"
                  :maxFileSize="1000000"
                  @upload="onUpload"
                />
                <br /><br /><br /><br /><br /><br />
                <h5>Hoja Ténica</h5>
                <FileUpload
                  name="demo[]"
                  url="./upload.php"
                  @upload="onUpload"
                  :multiple="true"
                  accept="image/*"
                  :maxFileSize="1000000"
                />
              </div>
              <!-- </div> -->
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
              @click="deletetDialog = false"
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
import MachinesService from "../service/MachinesService";

export default {
  data() {
    return {
      machines: null,
      productDialog: false,
      deleteDialog: false,
      deleteProductsDialog: false,
      product: {},
      resource: {},
      selectedProducts: null,
      filters: {},
      submitted: false,
      message: null,
      loading: false,
      statuses: [
        { label: "INSTOCK", value: "instock" },
        { label: "LOWSTOCK", value: "lowstock" },
        { label: "OUTOFSTOCK", value: "outofstock" },
      ],
    };
  },
  machinesService: null,
  created() {
    this.machinesService = new MachinesService();
    this.initFilters();
  },
  mounted() {
    this.loading = true;
    this.machinesService.getAll().then((data) => (this.machines = data));
    this.loading = false;
  },
  methods: {
    onUpload() {
      this.$toast.add({
        severity: "info",
        summary: "Success",
        detail: "File Uploaded",
        life: 3000,
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
      this.product = { ...product };
      this.productDialog = true;
    },
    confirmDelete(resource) {
      this.resource = resource;
      this.deleteDialog = true;
    },
    deleteResource() {
      this.deleteDialog = false;
      this.machinesService.delete(this.resource.id).then((data) => {
        this.machines = this.machines.filter(
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

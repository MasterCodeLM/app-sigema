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
            :value="products"
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
              <h5 class="m-0">Suppliers</h5>
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
              field="ruc"
              header="RUC"
              :sortable="true"
              headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">RUC</span>
              {{ slotProps.data.name }}
            </template>
          </Column>

          <Column
              field="businessName"
              header="Business Name"
              :sortable="true"
              headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Business Name</span>
              {{ slotProps.data.name }}
            </template>
          </Column>
          <Column
              field="email"
              header="Email"
              :sortable="true"
              headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Email</span>
              {{ slotProps.data.name }}
            </template>
          </Column>
          <Column
              field="telephone"
              header="Telephone"
              :sortable="true"
              headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Telephone</span>
              {{ slotProps.data.name }}
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
              {{ slotProps.data.name }}
            </template>
          </Column>

          <Column
              field="bankingEntity"
              header="Banking Entity"
              :sortable="true"
              headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Banking Entity</span>
              {{ slotProps.data.name }}
            </template>
          </Column>

          <Column
              field="accountNumber"
              header="Account Number"
              :sortable="true"
              headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Account Number</span>
              {{ slotProps.data.name }}
            </template>
          </Column>

          <Column
              field="interbankCode"
              header="Interbank Code"
              :sortable="true"
              headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Interbank Code</span>
              {{ slotProps.data.name }}
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
                    @click="confirmDeleteProduct(slotProps.data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>

        <Dialog
            v-model:visible="productDialog"
            :style="{ width: '700px' }"
            header="Suppliers Details"
            :modal="true"
            class="p-fluid"
        >
          <!--  <div class="formgrid grid">-->

          <div class="formgrid grid">
            <div class="field col">
              <label for="bankingEntity">Document Type</label>
              <Dropdown
                  id="bankingEntity"
                  v-model="documentTypeItem"
                  :options="documentTypeItems"
                  optionLabel="name"
                  placeholder="Select One"
                  :filter="false"
                  :loading="false"
              ></Dropdown>
            </div>
            <div class="field col">
              <label for="ruc">Document Number</label>
              <InputText
                  id="ruc"
                  v-model.trim="product.ruc"
                  required="true"
                  autofocus
                  :class="{ 'p-invalid': submitted && !product.name }"
              />
              <small class="p-invalid" v-if="submitted && !product.name"
              >RUC is required.</small
              >
            </div>
          </div>
          <div class="field col">
            <label for="businessName">Business Name</label>
            <InputText
                id="businessName"
                v-model.trim="product.businessName"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !product.name }"
            />
            <small class="p-invalid" v-if="submitted && !product.name"
            >Business Name is required.</small
            >
          </div>


          <!-- </div> -->

          <div class="formgrid grid">
            <div class="field col">
              <label for="telephone">Telephone</label>
              <InputText
                  id="telephone"
                  v-model.trim="product.telephone"
                  required="true"
                  autofocus
                  :class="{ 'p-invalid': submitted && !product.name }"
              />
              <small class="p-invalid" v-if="submitted && !product.name"
              >Telephone is required.</small
              >
            </div>

            <div class="field col">
              <label for="email">Email</label>
              <InputText
                  id="email"
                  v-model.trim="product.email"
                  required="true"
                  autofocus
                  :class="{ 'p-invalid': submitted && !product.name }"
              />
              <small class="p-invalid" v-if="submitted && !product.name"
              >Email is required.</small
              >
            </div>
          </div>

          <div class="formgrid grid">
            <div class="field col-8">
              <label for="address">Address</label>
              <InputText
                  id="address"
                  v-model.trim="product.address"
                  required="true"
                  autofocus
                  :class="{ 'p-invalid': submitted && !product.name }"
              />
              <small class="p-invalid" v-if="submitted && !product.name"
              >Address is required.</small
              >
            </div>
            <div class="field col-4">
              <label for="bankingEntity">Supplier Type</label>
              <Dropdown
                  id="bankingEntity"
                  v-model="supplierTypeItem"
                  :options="supplierTypeItems"
                  optionLabel="name"
                  placeholder="Select One"
                  :filter="false"
                  :loading="false"
              ></Dropdown>
            </div>
          </div>

          <div class="card">
            <div class="formgrid grid">
              <div class="field col">
                <label for="bankingEntity">Banking Entity</label>
                <Dropdown
                    id="bankingEntity"
                    v-model="bankItem"
                    :options="bankItems"
                    optionLabel="name"
                    placeholder="Select One"
                    :filter="false"
                    :loading="false"
                ></Dropdown>
              </div>

              <div class="field col">
                <label for="accountNumber">Account Number</label>
                <InputText
                    id="accountNumber"
                    v-model.trim="product.accountNumber"
                    required="true"
                    autofocus
                    :class="{ 'p-invalid': submitted && !product.name }"
                />
                <small class="p-invalid" v-if="submitted && !product.name"
                >Account Number is required.</small
                >
              </div>

              <div class="field col">
                <label for="interbankCode">Interbank Code</label>
                <InputText
                    id="interbankCode"
                    v-model.trim="product.interbankCode"
                    required="true"
                    autofocus
                    :class="{ 'p-invalid': submitted && !product.name }"
                />
                <small class="p-invalid" v-if="submitted && !product.name"
                >Interbank Code is required.</small
                >
              </div>

              <div class="field col-1 flex justify-content-center align-items-center">
                <Button icon="pi pi-plus" class="p-button-secondary" style="margin-top:1.85rem"></Button>
              </div>

            </div>

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
            >Are you sure you want to delete the selected suppliers?</span
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
import ProductService from "../service/ProductService";
import SupplierTypeServices from "../service/SupplierTypeServices";
import DocumentTypeServices from "../service/DocumentTypeServices";
import BankServices from "../service/BankServices";


export default {
  data() {
    return {
      products: null,
      productDialog: false,
      deleteProductDialog: false,
      deleteProductsDialog: false,
      product: {},
      selectedProducts: null,
      filters: {},
      submitted: false,
      statuses: [
        {label: "INSTOCK", value: "instock"},
        {label: "LOWSTOCK", value: "lowstock"},
        {label: "OUTOFSTOCK", value: "outofstock"},
      ],

      documentTypeItem: null,
      supplierTypeItem: null,
      bankItem: null,

      documentTypeItems: null,
      supplierTypeItems: null,
      bankItems: null,
    };
  },
  productService: null,
  documentTypeService: null,
  supplierTypeService: null,
  bankService: null,
  created() {
    this.productService = new ProductService();
    this.documentTypeService = new DocumentTypeServices();
    this.supplierTypeService = new SupplierTypeServices();
    this.bankService = new BankServices();
    this.initFilters();
  },
  mounted() {
    this.productService.getProducts().then((data) => (this.products = data));
    this.documentTypeService.getAll().then((data) => (this.documentTypeItems = data));
    this.supplierTypeService.getAll().then((data) => (this.supplierTypeItems = data));
    this.bankService.getAll().then((data) => (this.bankItems = data));
  },
  methods: {
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

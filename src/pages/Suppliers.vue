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
            :value="suppliers"
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
              field="document_type.name"
              header="Document Type"
              :sortable="true"
              headerStyle="width:14%; min-width:10rem;"
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
              headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Document Number</span>
              {{ slotProps.data.document_number }}
            </template>
          </Column>

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
              field="email"
              header="Email"
              :sortable="true"
              headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Email</span>
              {{ slotProps.data.email }}
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
              <label for="documentType">Document Type</label>
              <Dropdown
                  id="documentType"
                  v-model="supplier.document_type"
                  :options="documentTypeItems"
                  optionLabel="name"
                  placeholder="Select One"
                  :filter="false"
                  :loading="false"
                  :class="{ 'p-invalid': submitted && !supplier.document_type }"
              ></Dropdown>
              <small class="p-invalid" v-if="submitted && !supplier.document_type"
              >Document Type is required.</small
              >
            </div>
            <div class="field col">
              <label for="ruc">Document Number</label>
              <InputText
                  id="ruc"
                  v-model.trim="supplier.document_number"
                  required="true"
                  autofocus
                  :class="{ 'p-invalid': submitted && !supplier.document_number }"
              />
              <small class="p-invalid" v-if="submitted && !supplier.document_number"
              >RUC is required.</small
              >
            </div>
          </div>
          <div class="field col">
            <label for="businessName">Business Name</label>
            <InputText
                id="businessName"
                v-model.trim="supplier.name"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !supplier.name }"
            />
            <small class="p-invalid" v-if="submitted && !supplier.name"
            >Business Name is required.</small
            >
          </div>


          <!-- </div> -->

          <div class="formgrid grid">
            <div class="field col">
              <label for="telephone">Telephone</label>
              <InputText
                  id="telephone"
                  v-model.trim="supplier.phone"
                  required="true"
                  autofocus
                  :class="{ 'p-invalid': submitted && !supplier.phone }"
              />
              <small class="p-invalid" v-if="submitted && !supplier.phone"
              >Telephone is required.</small
              >
            </div>

            <div class="field col">
              <label for="email">Email</label>
              <InputText
                  id="email"
                  v-model.trim="supplier.email"
                  required="true"
                  autofocus
                  :class="{ 'p-invalid': submitted && !supplier.email }"
              />
              <small class="p-invalid" v-if="submitted && !supplier.email"
              >Email is required.</small
              >
            </div>
          </div>

          <div class="formgrid grid">
            <div class="field col-8">
              <label for="address">Address</label>
              <InputText
                  id="address"
                  v-model.trim="supplier.address"
                  required="true"
                  autofocus
                  :class="{ 'p-invalid': submitted && !supplier.address }"
              />
              <small class="p-invalid" v-if="submitted && !supplier.address"
              >Address is required.</small
              >
            </div>
            <div class="field col-4">
              <label for="supplierType">Supplier Type</label>
              <Dropdown
                  id="supplierType"
                  v-model="supplier.supplier_type"
                  :options="supplierTypeItems"
                  optionLabel="name"
                  placeholder="Select One"
                  :filter="false"
                  :loading="false"
                  :class="{ 'p-invalid': submitted && !supplier.supplier_type }"
              ></Dropdown>
              <small class="p-invalid" v-if="submitted && !supplier.supplier_type"
              >Supplier Type is required.</small>
            </div>
          </div>

          <div class="card">
            <div class="formgrid grid">
              <div class="field col-4">
                <label for="bankingEntity">Banking Entity</label>
                <Dropdown
                    id="bankingEntity"
                    v-model="bankItem"
                    :options="bankItems"
                    optionLabel="name"
                    placeholder="Select One"
                    :filter="false"
                    :loading="false"
                    :class="{ 'p-invalid': submittedAddBank && !bankItem }"

                ></Dropdown>
                <small class="p-invalid" v-if="submittedAddBank && !bankItem"
                >Banking Entity is required.</small>
              </div>

              <div class="field col-3">
                <label for="accountNumber">Account Number</label>
                <InputText
                    id="accountNumber"
                    v-model.trim="bank.account_number"
                    required="true"
                    autofocus
                    :class="{ 'p-invalid': submittedAddBank && !bank.account_number }"
                />
                <small class="p-invalid" v-if="submittedAddBank && !bank.account_number"
                >Account Number is required.</small
                >
              </div>

              <div class="field col-4">
                <label for="interbankCode">Interbank Code</label>
                <InputText
                    id="interbankCode"
                    v-model.trim="bank.interbank_account_number"
                    required="true"
                    autofocus
                    :class="{ 'p-invalid': submittedAddBank && !bank.interbank_account_number }"
                />
                <small class="p-invalid" v-if="submittedAddBank && !bank.interbank_account_number"
                >Interbank Code is required.</small
                >
              </div>

              <div class="field col-1 flex justify-content-center align-items-center">
                <Button icon="pi pi-plus" class="p-button-secondary" style="margin-top:1.85rem"
                        @click="addBank"></Button>
              </div>

            </div>

            <div class="card">
              <DataTable
                  :value="supplier.banks"
                  responsiveLayout="scroll"
              >
                <Column
                    v-for="col of columns"
                    :field="col.field"
                    :header="col.header"
                    :key="col.field"
                    style="width: 25%"
                >
                </Column>

                <Column headerStyle="min-width:10rem;">
                  <template #body="slotProps">
                    <div style="display: flex; justify-content: end">
                      <Button
                          icon="pi pi-trash"
                          class="p-button-rounded p-button-danger"
                          @click="removeBank(slotProps.data)"
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
// import ProductService from "../service/ProductService";
import SupplierTypeServices from "../service/SupplierTypeServices";
import DocumentTypeServices from "../service/DocumentTypeServices";
import BankServices from "../service/BankServices";
import SupplierService from "../service/SupplierService";


export default {
  data() {
    return {
      suppliers: null,
      productDialog: false,
      deleteProductDialog: false,
      deleteProductsDialog: false,
      supplier: {
        document_type: null,
        document_number: null,
        name: null,
        phone: null,
        email: null,
        address: null,
        supplier_type: null,
        banks: []
      },
      bank: {
        id: null,
        name: null,
        account_number: null,
        interbank_account_number: null,
      },
      selectedProducts: null,
      filters: {},
      submitted: false,
      submittedAddBank: false,
      statuses: [
        {label: "INSTOCK", value: "instock"},
        {label: "LOWSTOCK", value: "lowstock"},
        {label: "OUTOFSTOCK", value: "outofstock"},
      ],
      columns: [
        {field: "name", header: "Bank Entity"},
        {field: "account_number", header: "Account Number"},
        {field: "interbank_account_number", header: "Interbank Code"},
      ],

      documentTypeItem: null,
      supplierTypeItem: null,
      bankItem: null,

      documentTypeItems: null,
      supplierTypeItems: null,
      bankItems: null,
    };
  },
  // productService: null,


  documentTypeService: null,
  supplierTypeService: null,
  bankService: null,
  supplierService: null,
  created() {
    // this.productService = new SupplierService();
    this.documentTypeService = new DocumentTypeServices();
    this.supplierTypeService = new SupplierTypeServices();
    this.bankService = new BankServices();
    this.supplierService = new SupplierService();
    this.initFilters();
  },
  mounted() {
    this.supplierService.getAll().then((data) => (this.suppliers = data));
    this.documentTypeService.getAll().then((data) => (this.documentTypeItems = data));
    this.supplierTypeService.getAll().then((data) => (this.supplierTypeItems = data));
    this.bankService.getAll().then((data) => (this.bankItems = data));
  },
  methods: {
    openNew() {
      this.default()
      this.submitted = false;
      this.productDialog = true;
    },
    hideDialog() {
      this.productDialog = false;
      this.submitted = false;
    },
    saveProduct() {
      this.submitted = true;
      if (this.validateFormSupplier()) {
        if (this.supplier.id) {
          //UPDATE
          // const id = this.resource.id;
          // const payload = this.resource;
          // this.articleTypesService.update(id, payload).then(data => {
          //   this.articleTypes[this.findIndexById(id)] = data.data;
          //   this.$toast.add({severity: 'success', summary: 'Successful', detail: data.message, life: 3000});
          // })
        } else {
          // CREATE
          const payload = this.supplier;
          this.supplierService.create(payload).then(data => {
            this.suppliers.push(data.data);
            this.$toast.add({severity: 'success', summary: 'Successful', detail: data.message, life: 3000});
          })
        }
        this.productDialog = false;
        this.default()
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
    findBankIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.supplier.banks.length; i++) {
        if (this.supplier.banks[i].id === id) {
          index = i;
          break;
        }
      }
      return index;
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
    addBank() {
      this.submittedAddBank = true;
      if (this.validateFormBank()) {
        if (this.findBankIndexById(this.bankItem.id) === -1) {
          // INSERT DATA
          this.bank = {...this.bank, ...this.bankItem}
          this.supplier.banks.push(this.bank)
        } else {
          this.$toast.add({
            severity: "error",
            summary: "Ooops!",
            detail: "bank already exists in the list.",
            life: 3000,
          });
        }
        // RESERT DATA
        this.bank = {}
        this.bankItem = null
        this.submittedAddBank = false;
      }
    },
    validateFormSupplier() {
      return this.supplier.document_type &&
          this.supplier.document_number &&
          this.supplier.name &&
          this.supplier.phone &&
          this.supplier.email &&
          this.supplier.address &&
          this.supplier.supplier_type
    },
    validateFormBank() {
      return this.bankItem &&
          this.bank.account_number &&
          this.bank.interbank_account_number
    },
    removeBank(data) {
      this.supplier.banks = this.supplier.banks.filter((val) => val.id !== data.id);
    },
    initFilters() {
      this.filters = {
        global: {value: null, matchMode: FilterMatchMode.CONTAINS},
      };
    },
    default() {
      this.supplier = {
        document_type: null,
        document_number: null,
        name: null,
        phone: null,
        email: null,
        address: null,
        supplier_type: null,
        banks: []
      }
      this.bank = {
        id: null,
        name: null,
        account_number: null,
        interbank_account_number: null,
      }
      this.bankItem = null
    }
  },
};
</script>

<style scoped lang="scss">
@import "../assets/demo/badges.scss";
</style>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-fluid">
        <div class="flex flex-column align-items-center">
          <h3 class="text-900 font-medium">INVENTORY</h3>
        </div>
      </div>
    </div>
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
          :value="articles"
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
              <div class="field col-12 sm:col-6">
                <h5 class="m-0">
                  Filter by:
                  <Dropdown
                    id="state"
                    v-model="dropdownItem"
                    :options="dropdownItems"
                    optionLabel="name"
                    placeholder="Select One"
                    :filter="true"
                    :loading="false"
                  ></Dropdown>
                </h5>
              </div>
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
            field="serialNumber"
            header="Serial Number"
            :sortable="true"
            headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Serial Number</span>
              {{ slotProps.data.name }}
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
            field="quantity"
            header="Quantity"
            :sortable="true"
            headerStyle="width:14%; min-width:8rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Quantity</span>
              {{ slotProps.data.quantity }}
            </template>
          </Column>
          <Column
            field="price"
            header="Price"
            :sortable="true"
            headerStyle="width:14%; min-width:8rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Price</span>
              {{ formatCurrency(slotProps.data.price) }}
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
          :style="{ width: '1000px' }"
          header="Article Details"
          :modal="true"
          class="p-fluid"
        >
          <div class="formgrid grid">
            <div class="col-6">
              <div class="formgrid grid">
                <div class="field col">
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

                <div class="field col">
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
              </div>

              <div class="formgrid grid">
                <div class="field col">
                  <label for="brand">Brand</label>
                  <InputText
                    id="brand"
                    v-model.trim="product.telephone"
                    required="true"
                    autofocus
                    :class="{ 'p-invalid': submitted && !product.name }"
                  />
                  <small class="p-invalid" v-if="submitted && !product.name"
                    >Brand is required.</small
                  >
                </div>

                <div class="field col">
                  <label for="model">Model</label>
                  <InputText
                    id="model"
                    v-model.trim="product.email"
                    required="true"
                    autofocus
                    :class="{ 'p-invalid': submitted && !product.name }"
                  />
                  <small class="p-invalid" v-if="submitted && !product.name"
                    >Model is required.</small
                  >
                </div>
              </div>

              <div class="formgrid grid">
                <div class="field col">
                  <label for="quantity">Quantity</label>
                  <!-- <InputNumber id="age" v-model="product.quantity" integeronly />-->
                  <InputNumber
                    id="quantity"
                    v-model="inputNumberValue"
                    showButtons
                    mode="decimal"
                  />
                </div>
                <div class="field col">
                  <label for="articleType">Article Type</label>
                  <Dropdown
                    id="articleType"
                    v-model="article.article_type"
                    :options="articleTypeItems"
                    optionLabel="name"
                    placeholder="Select One"
                    :filter="true"
                    :loading="false"
                    :class="{ 'p-invalid': submitted && !article.article_type }"
                  ></Dropdown>
                  <small
                    class="p-invalid"
                    v-if="submitted && !article.article_type"
                    >Article Type is required.</small
                  >
                </div>
              </div>

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
            </div>

            <div class="card col-6">
              <div class="formgrid grid">
                <div class="field col">
                  <label for="suppliers">Suppliers</label>
                  <Dropdown
                    id="Suppliers"
                    v-model="dropdownItem"
                    :options="dropdownItems"
                    optionLabel="name"
                    placeholder="Select One"
                    :filter="true"
                    :loading="false"
                  ></Dropdown>
                </div>

                <div class="field col">
                  <label for="price">Price</label>
                  <InputNumber
                    id="price"
                    v-model="product.price"
                    mode="currency"
                    currency="USD"
                    locale="en-US"
                  />
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
                  <!--
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
                  </Column>-->
                </DataTable>
              </div>
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
      </div>
    </div>
  </div>
</template>

<script>
import { FilterMatchMode } from "primevue/api";
import ArticlesService from "../service/ArticlesService";
import ArticleTypesService from "../service/ArticleTypesService";
export default {
  data() {
    return {
      articles: null,
      productDialog: false,
      deleteDialog: false,
      deleteProductsDialog: false,
      article: {
        serial_number: null,
        name: null,
        brand: null,
        model: null,
        quantity: null,
        article_type: null,
      },
      product: {},
      resource: {}, // One Resource Articles
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
      articleTypeItem: null,
      articleTypeItems: null,
    };
  },
  articlesService: null,
  articleTypeService: null,

  created() {
    this.articlesService = new ArticlesService();
    this.articleTypeService = new ArticleTypesService();
    this.initFilters();
  },
  mounted() {
    this.loading = true;
    this.articlesService.getAll().then((data) => (this.articles = data));
    this.articleTypeService
      .getAll()
      .then((data) => (this.articleTypeItems = data));
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
      this.resource = {};
      this.submitted = false;
      this.productDialog = true;
    },
    hideDialog() {
      this.productDialog = false;
      this.submitted = false;
    },
    saveProduct() {
      this.submitted = true;
      if (this.validateFormArticle()) {
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
        this.default();
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
      this.articlesService.delete(this.resource.id).then((data) => {
        this.articles = this.articles.filter(
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
    validateFormArticle() {
      return this.article.article_type;
    },

    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
    },
    default() {
      this.article = {
        article_type: {},
      };
    },
  },
};
</script>

<style scoped lang="scss">
@import "../assets/demo/badges.scss";
</style>

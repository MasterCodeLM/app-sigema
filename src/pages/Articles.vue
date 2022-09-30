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
          :loading="loadingArticles"
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
                :src="
                  slotProps.data.image
                    ? getImage(slotProps.data.image)
                    : imageDefault
                "
                :alt="'machine'"
                class="shadow-2"
                width="100"
                height="100"
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
                  icon="pi pi-eye"
                  class="p-button-rounded p-button-info mr-2"
                  @click="viewArticles(slotProps.data)"
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
          :style="{ width: '1000px' }"
          :header="
            !article.id
              ? 'New Article'
              : !isView
              ? 'Edit Article'
              : 'Info Article'
          "
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
                    v-model.trim="article.serial_number"
                    required="true"
                    :disabled="isView"
                    autofocus
                    :class="{
                      'p-invalid': submitted && !article.serial_number,
                    }"
                  />
                  <small
                    class="p-invalid"
                    v-if="submitted && !article.serial_number"
                    >Serial Number is required.</small
                  >
                </div>

                <div class="field col">
                  <label for="name">Name</label>
                  <InputText
                    id="name"
                    v-model.trim="article.name"
                    required="true"
                    autofocus
                    :disabled="isView"
                    :class="{ 'p-invalid': submitted && !article.name }"
                  />
                  <small class="p-invalid" v-if="submitted && !article.name"
                    >Name is required.</small
                  >
                </div>
              </div>

              <div class="formgrid grid">
                <div class="field col">
                  <label for="brand">Brand</label>
                  <InputText
                    id="brand"
                    v-model.trim="article.brand"
                    required="true"
                    autofocus
                    :disabled="isView"
                    :class="{ 'p-invalid': submitted && !article.brand }"
                  />
                  <small class="p-invalid" v-if="submitted && !article.brand"
                    >Brand is required.</small
                  >
                </div>

                <div class="field col">
                  <label for="model">Model</label>
                  <InputText
                    id="model"
                    v-model.trim="article.model"
                    required="true"
                    autofocus
                    :disabled="isView"
                    :class="{ 'p-invalid': submitted && !article.model }"
                  />
                  <small class="p-invalid" v-if="submitted && !article.model"
                    >Model is required.</small
                  >
                </div>
              </div>

              <div class="formgrid grid">
                <div class="field col">
                  <label for="quantity">Quantity</label>
                  <InputNumber
                    id="quantity"
                    v-model="article.quantity"
                    showButtons
                    :disabled="isView"
                    :min="0"
                    :useGrouping="false"
                    :class="{ 'p-invalid': submitted && !article.quantity }"
                  />
                  <small class="p-invalid" v-if="submitted && !article.quantity"
                    >Quantity is required.</small
                  >
                </div>

                <div class="field col">
                  <label for="articleType">Article Type</label>
                  <Dropdown
                    id="articleType"
                    v-model="article.article_type"
                    :options="articleTypeItems"
                    optionLabel="name"
                    placeholder="Select One"
                    :disabled="isView"
                    :filter="true"
                    :loading="loadingArticleTypes"
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
                <img
                  id="blah"
                  :disabled="isView"
                  :src="
                    !this.article.image
                      ? imageDefault
                      : isFile(this.article.image)
                      ? getImageObjectUrl(this.article.image)
                      : getImage(this.article.image)
                  "
                  alt="your image"
                  width="150"
                  height="180"
                />
                <FileUpload
                  mode="basic"
                  name="demo[]"
                  url="./upload.php"
                  accept="image/*"
                  :disabled="isView"
                  :maxFileSize="5000000"
                  @input="onUploadImage"
                />
                <h5>Technical Sheet</h5>
                <FileUpload
                  mode="basic"
                  accept="application/pdf"
                  :disabled="isView"
                  :maxFileSize="5000000"
                  @input="onUploadFile"
                />
              </div>
            </div>

            <div class="card">
              <div v-if="!isView" class="formgrid grid">
                <div class="field col">
                  <label for="supplierRef">Suppliers</label>
                  <Dropdown
                    id="supplierRef"
                    v-model="supplierRefItem"
                    :options="supplierRefItems"
                    optionLabel="name"
                    placeholder="Select One"
                    :filter="true"
                    :loading="loadingSuppliers"
                    :class="{
                      'p-invalid': submittedAddSuppliersRef && !supplierRefItem,
                    }"
                  ></Dropdown>
                  <small
                    class="p-invalid"
                    v-if="submittedAddSuppliersRef && !supplierRefItem"
                    >Supplier Ref is required.</small
                  >
                </div>

                <div class="field col-3">
                  <label for="price">Price</label>
                  <InputNumber
                    id="price"
                    v-model="supplier_ref.price"
                    mode="currency"
                    currency="PEN"
                    locale="es-PE"
                    :class="{
                      'p-invalid':
                        submittedAddSuppliersRef && !supplier_ref.price,
                    }"
                  />
                  <small
                    class="p-invalid"
                    v-if="submittedAddSuppliersRef && !supplier_ref.price"
                    >Price is required.</small
                  >
                </div>
                <div
                  class="
                    field
                    col-2
                    flex
                    justify-content-center
                    align-items-center
                  "
                >
                  <Button
                    icon="pi pi-plus"
                    class="p-button-secondary"
                    style="margin-top: 1.8rem"
                    @click="addSpullierRef"
                  ></Button>
                </div>
              </div>
              <div class="card">
                <DataTable :value="article.suppliers" responsiveLayout="scroll">
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
                        currency="PEN"
                        locale="es-PE"
                        autofocus
                      />
                    </template>
                  </Column>

                  <Column v-if="!isView" headerStyle="min-width:10rem;">
                    <template #body="slotProps">
                      <div style="display: flex; justify-content: end">
                        <Button
                          icon="pi pi-trash"
                          class="p-button-rounded p-button-danger"
                          @click="removeSupplierRef(slotProps.data)"
                        />
                      </div>
                    </template>
                  </Column>
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
              >Are you sure you want to delete the selected Articles?</span
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
import ArticlesService from "../service/ArticlesService";
import ArticleTypesService from "../service/ArticleTypesService";
import SupplierService from "../service/SupplierService";
import ImageService from "@/service/ImageService";
import FileService from "@/service/FileService";

export default {
  data() {
    return {
      articles: null,
      productDialog: false,
      deleteDialog: false,
      deleteProductsDialog: false,
      article: {
        // serial_number: null,
        //image: null,
        // technical_sheet:null,
        name: null,
        brand: null,
        model: null,
        quantity: null,
        article_type: null,
        suppliers: [],
      },
      supplier_ref: {
        id: null,
        name: null,
        price: null,
      },
      product: {},
      resource: {}, // One Resource Articles
      selectedProducts: null,
      filters: {},
      submitted: false,
      message: null,

      // loading: false,
      loadingArticleTypes: true,
      loadingSuppliers: true,

      statuses: [
        { label: "INSTOCK", value: "instock" },
        { label: "LOWSTOCK", value: "lowstock" },
        { label: "OUTOFSTOCK", value: "outofstock" },
      ],
      submittedAddSuppliersRef: false,
      columns: [
        { field: "name", header: "Supplier" },
        { field: "price", header: "Price" },
      ],
      articleTypeItem: null,
      supplierRefItem: null,

      articleTypeItems: null,
      supplierRefItems: null,
      loadingArticles: true,
      isView: false,

      imageDefault: "https://via.placeholder.com/150x180",
    };
  },
  articlesService: null,
  articleTypeService: null,
  supplierRefService: null,
  imageService: null,
  fileService: null,
  created() {
    this.articlesService = new ArticlesService();
    this.articleTypeService = new ArticleTypesService();
    this.supplierRefService = new SupplierService();
    this.imageService = new ImageService();
    this.fileService = new FileService();
    this.initFilters();
  },
  mounted() {
    //this.loading = true;
    this.articlesService.getAll().then((data) => {
      this.articles = data;
      this.loadingArticles = false;
    });
    this.articleTypeService
      .getAll()
      .then((data) => (this.articleTypeItems = data));
    this.supplierRefService
      .getAll()
      .then((data) => (this.supplierRefItems = data));
    //this.loading = false;
  },
  methods: {
    formatCurrency(value) {
      if (value)
        return value.toLocaleString("es-PE", {
          style: "currency",
          currency: "PER",
        });
      return;
    },
    openNew() {
      this.isView = false;
      this.defaultObjects();
      this.articleTypeService.getAll().then((data) => {
        this.articleTypeItems = data;
        this.loadingArticleTypes = false;
      });
      this.supplierRefService.getAll().then((data) => {
        this.supplierRefItems = data;
        this.loadingSuppliers = false;
      });
      this.resource = {};
      this.submitted = false;
      this.productDialog = true;
    },
    hideDialog() {
      this.defaultObjects();
      this.productDialog = false;
      this.submitted = false;
    },
    async saveProduct() {
      this.submitted = true;

      if (this.validateFormArticle()) {
        if (this.article.id) {
          if (this.isFile(this.article.image)) {
            let formdataImage = new FormData();
            formdataImage.append(
              "image",
              this.article.image,
              this.article.image
            );
            await this.imageService.upload(formdataImage).then((data) => {
              this.article.image = data.path;
            });
          }
          if (this.isFile(this.article.technical_sheet)) {
            let formdataFile = new FormData();
            formdataFile.append(
              "file",
              this.article.technical_sheet,
              this.article.technical_sheet
            );
            await this.fileService.upload(formdataFile).then((data) => {
              this.article.technical_sheet = data.path;
            });
          }
          const payload = this.article;
          //UPDATE
          this.articlesService.update(this.article.id, payload).then((data) => {
            this.articles[this.findIndexById(data.data.id)] = data.data;
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: data.message,
              life: 3000,
            });
          });
        } else {
          // CREATE

          if (this.isFile(this.article.image)) {
            let formdataImage = new FormData();
            formdataImage.append(
              "image",
              this.article.image,
              this.article.image
            );
            await this.imageService.upload(formdataImage).then((data) => {
              this.article.image = data.path;
            });
          }
          if (this.isFile(this.article.technical_sheet)) {
            let formdataFile = new FormData();
            formdataFile.append(
              "file",
              this.article.technical_sheet,
              this.article.technical_sheet
            );
            await this.fileService.upload(formdataFile).then((data) => {
              this.article.technical_sheet = data.path;
            });
          }
          const payload = this.article;
          // console.log(payload);
          //payload.image="...";
          this.articlesService.create(payload).then((data) => {
            this.articles.unshift(data.data);
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
    viewArticles(article) {
      this.isView = true;
      this.articlesService.getOne(article.id).then((data) => {
        this.article = { ...data };
        this.productDialog = true;
        this.loadingArticleTypes = false;
      });
    },
    editProduct(article) {
      this.isView = false;
      this.articlesService.getOne(article.id).then((data) => {
        this.article = { ...data };
        this.productDialog = true;
        this.loadingSuppliers = false;
        this.loadingArticleTypes = false;
      });
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
      for (let i = 0; i < this.articles.length; i++) {
        if (this.articles[i].id === id) {
          index = i;
          break;
        }
      }
      return index;
    },
    findSupplierRefIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.article.suppliers.length; i++) {
        if (this.article.suppliers[i].id === id) {
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
    addSpullierRef() {
      this.submittedAddSuppliersRef = true;
      if (this.validateFormSupplierRef()) {
        if (this.findSupplierRefIndexById(this.supplierRefItem.id) === -1) {
          // INSERT DATA
          this.supplier_ref = { ...this.supplier_ref, ...this.supplierRefItem };
          this.article.suppliers.push(this.supplier_ref);
        } else {
          this.$toast.add({
            severity: "error",
            summary: "Ooops!",
            detail: "supplier already exists in the list.",
            life: 3000,
          });
        }
        // RESERT DATA
        this.supplier_ref = {};
        this.supplierRefItem = null;
        this.submittedAddSuppliersRef = false;
      }
    },
    validateFormArticle() {
      console.log(this.article);
      return (
        this.article.article_type &&
        this.article.name &&
        this.article.brand &&
        this.article.model &&
        this.article.quantity
      );
    },
    validateFormSupplierRef() {
      return this.supplierRefItem && this.supplier_ref.price;
    },
    removeSupplierRef(data) {
      this.article.suppliers = this.article.suppliers.filter(
        (val) => val.id !== data.id
      );
    },
    getImage(path) {
      return `${process.env.VUE_APP_API_HOST}/storage/${path}`;
    },
    isFile(value) {
      if (value) {
        return typeof value === "object";
      }
      return false;
    },
    getImageObjectUrl(file) {
      return URL.createObjectURL(file);
    },
    onUploadImage(event) {
      const [file] = event.target.files;
      if (file) {
        this.article.image = file;
      }
    },
    onUploadFile(event) {
      const [file] = event.target.files;
      if (file) {
        this.article.technical_sheet = file;
      }
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
    },
    defaultObjects() {
      this.article = {
        // serial_number: null,
        //image: null,
        // technical_sheet:null,
        name: null,
        brand: null,
        model: null,
        quantity: null,
        article_type: null,
        suppliers: [],
      };
    },
  },
};
</script>

<style scoped lang="scss">
@import "../assets/demo/badges.scss";
</style>

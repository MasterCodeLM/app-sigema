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
          <h3 class="text-900 font-medium">JEX TECHNOLOGIES</h3>
          <Button
              label="Select Machine"
              class="p-button-secondary mr-2 mb-2"
              @click="openNewSelectMachine"
          />
        </div>
      </div>
    </div>
    <Dialog
        v-model:visible="machineDialog"
        :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
        :style="{ width: '40vw' }"
        header="SELECT MACHINE"
        :modal="true"
        class="p-fluid"
    >
      <DataTable
          ref="dt"
          :value="machines"
          dataKey="id"
          :paginator="true"
          :rows="5"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} machines"
          responsiveLayout="scroll"
          :loading="loadingMachines"
      >
        <template #header>
          <div
              class="
              flex flex-column
              md:flex-row md:justify-content-between md:align-items-center
            "
          >
            <h5 class="m-0">Machines</h5>
            <div class="align right">
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText
                    v-model="filters['global'].value"
                    placeholder="Search..."
                /><!--"filters['global'].value"-->
              </span>
            </div>
          </div>
        </template>
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
            field="name"
            header="Name"
            :sortable="true"
            headerStyle="width:50%; min-width:10rem;"
        >
          <template #body="slotProps">
            <span class="p-column-title">Name</span>
            {{ slotProps.data.name }}
          </template>
        </Column>

        <!--        <Column-->
        <!--            field="model"-->
        <!--            header="Model"-->
        <!--            :sortable="true"-->
        <!--            headerStyle="width:14%; min-width:10rem;"-->
        <!--        >-->
        <!--          <template #body="slotProps">-->
        <!--            <span class="p-column-title">Model</span>-->
        <!--            {{ slotProps.data.model }}-->
        <!--          </template>-->
        <!--        </Column>-->

        <!--        <Column-->
        <!--            field="brand"-->
        <!--            header="Brand"-->
        <!--            :sortable="true"-->
        <!--            headerStyle="width:14%; min-width:10rem;"-->
        <!--        >-->
        <!--          <template #body="slotProps">-->
        <!--            <span class="p-column-title">Brand</span>-->
        <!--            {{ slotProps.data.brand }}-->
        <!--          </template>-->
        <!--        </Column>-->

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
            field="inventoryStatus"
            header="Status"
            :sortable="true"
            headerStyle="width:14%; min-width:10rem;"
        >
          <template #body="slotProps">
            <span class="p-column-title">Status</span>
            <span class="product-badge status-instock">{{
                slotProps.data.status.toLowerCase()
              }}</span>
          </template>
        </Column>

        <Column headerStyle="min-width:4rem;">
          <template #body="slotProps">
            <div style="display: flex; justify-content: end">
              <Button
                  icon="pi pi-angle-double-down"
                  class="p-button-rounded p-button-success mr-2"
                  :disabled="slotProps.data.status !== 'available'"
                  @click="selectMachine(slotProps.data)"
              />
              <!--              <Button-->
              <!--                  icon="pi pi-pencil"-->
              <!--                  class="p-button-rounded p-button-warning mr-2"-->
              <!--                  @click="editProduct(slotProps.data)"-->
              <!--              />-->
              <!--              <Button-->
              <!--                  icon="pi pi-trash"-->
              <!--                  class="p-button-rounded p-button-danger"-->
              <!--                  @click="confirmDelete(slotProps.data)"-->
              <!--              />-->
            </div>
          </template>
        </Column>
      </DataTable>
    </Dialog>
    <div class="col-12 md:col-6">
      <div class="card p-fluid">
        <h5>Information</h5>
        <div class="grid">
          <div class="field col-12 sm:col-4">
            <label for="name1">Date</label>
            <Calendar
                :showIcon="true"
                :showButtonBar="true"
                v-model="maintenanceSheet.date"
                :minDate="minDateValue"
                dateFormat="yy-mm-dd"
            ></Calendar>
          </div>

          <div class="field col-12 sm:col-5">
            <label for="state">Maintenance Type</label>
            <Dropdown
                id="state"
                v-model="maintenanceSheet.maintenanceTye"
                :options="maintenanceTypeItems"
                optionLabel="name"
                placeholder="Select One"
                :loading="maintenanceTypeItemsLoading"
            ></Dropdown>
          </div>
          <div class="field col-12 sm:col-3">
            <label for="name1">Ref invoice number</label>
            <InputText id="name1" type="text"/>
          </div>
          <div class="field col-12 sm:col-9">
            <label for="name1">Responsible</label>
            <InputText v-model="maintenanceSheet.responsible" id="name1" type="text"/>
          </div>
          <div class="field col-12 sm:col-3">
            <label for="quantity">New hours of udefullife</label>
            <InputNumber
                id="quantity"
                v-model="maintenanceSheet.maximum_working_time"
                showButtons
                :disabled="isView"
                :min="0"
                :useGrouping="false"
                :class="{ 'p-invalid': submitted && !article.quantity }"
            />
            <!--v-model="article.quantity"-->
          </div>
          <div class="field col-12 sm:col-6">
            <label for="state">Supplier</label>
            <Dropdown
                id="state"
                v-model="maintenanceSheet.supplier"
                :options="supplierItems"
                optionLabel="name"
                placeholder="Select One"
                :filter="true"
                :loading="supplierItemsLoading"
            ></Dropdown>
          </div>
          <div class="field col-12 sm:col-6">
            <label for="name1">Technical</label>
            <InputText v-model="maintenanceSheet.technical" id="name1" type="text"/>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 md:col-6">
      <div class="card p-fluid">
        <h5>Machine Data</h5>
        <div class="grid">
          <div class="field col-12 sm:col-2">
            <label for="name1">Serial Number</label>
            <InputText v-model="maintenanceSheet.machine.serie_number" id="name1" type="text" disabled/>
          </div>

          <div class="field col-12 sm:col-3">
            <label for="name1">Name</label>
            <InputText v-model="maintenanceSheet.machine.name" id="name1" type="text" disabled/>
          </div>
          <div class="field col-12 sm:col-2">
            <label for="name1">Brand</label>
            <InputText v-model="maintenanceSheet.machine.brand" id="name1" type="text" disabled/>
          </div>
          <div class="field col-12 sm:col-2">
            <label for="name1">Model</label>
            <InputText v-model="maintenanceSheet.machine.model" id="name1" type="text" disabled/>
          </div>

          <div class="field col-12 sm:col-3">
            <label for="name1">Last Maintenance Date</label>
            <InputText v-model="maintenanceSheet.machine.date_last_maintenance" id="name1" type="text" disabled/>
          </div>
        </div>
      </div>
      <div class="card p-fluid">
        <h5>Description</h5>
        <div class="field">
          <!--          <label for="name1">Description</label>-->
          <Textarea
              v-model="maintenanceSheet.description"
              placeholder="Your Message"
              :autoResize="true"
              rows="3"
              cols="30"
          />
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="card">
        <h5>Details</h5>
        <div class="p-fluid formgrid grid">
          <div class="field col-12 md:col-6 lg:col-4 xl:col-3">
            <div class="flex flex-column sm:flex-row">
              <Button
                  label="Add Article"
                  class="p-button-secondary mr-2 mb-2"
                  @click="openNewAddSparePart"
              />
              <Button
                  label="Add Service"
                  class="p-button-secondary mr-2 mb-2"
                  @click="openNewAddService"
              />
            </div>
          </div>
          <div
              class="
              field
              col-12
              md:col-6
              lg:col-4 lg:col-offset-2
              xl:col-3 xl:col-offset-6
            "
          >
            <div
                class="flex flex-column justify-content-center align-items-center"
            >
              <h3 class="text-900 text-5xl font-medium p-0 m-0">S/00.00</h3>
              <span class="text-600 text-md font-medium p-0">Total</span>
            </div>
          </div>
          <div class="field col-12">
            <DataTable
                :value="maintenanceSheet.detail"
                editMode="cell"
                @cell-edit-complete="onCellEditComplete"
                class="editable-cells-table"
                responsiveLayout="scroll"
            >
              <Column
                  v-for="col of columnsDetailGeneral"
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
      </div>
    </div>
    <div class="col-12">
      <div class="flex justify-content-center">
        <Button label="Submit" class="mr-2 mb-2"></Button>
      </div>
    </div>
  </div>
  <Dialog
      v-model:visible="addSparePartDialog"
      :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
      :style="{ width: '80vw' }"
      header="Add Sapare Parts"
      :modal="true"
      class="p-fluid"
  >
    <div class="grid">
      <div class="col-12 md:col-6">
        <div class="card p-fluid">
          <h5>Search spare part in inventory</h5>
          <div class="grid">
            <div class="field col-12">
              <DataTable
                  ref="dt"
                  :value="articles"
                  dataKey="id"
                  :paginator="true"
                  :rows="2"
                  :filters="filters"
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                  :rowsPerPageOptions="[5, 10, 25]"
                  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Articles"
                  responsiveLayout="scroll"
                  :loading="loadingArticles"
              ><!--:value="articles"-->
                <template #header>
                  <div
                      class="
                      flex flex-column
                      md:flex-row
                      md:justify-content-between
                      md:align-items-center
                    "
                  >
                    <div class="field col-12 sm:col-6">
                      <h5 class="m-0">
                        Filter by:
                        <Dropdown
                            id="state"
                            v-model="filter"
                            :options="articleTypeFilterItems"
                            optionLabel="name"
                            placeholder="Select One"
                            :filter="false"
                            :loading="loadingArticleTypesFilter"
                            @change="filterByArticleType"
                        ></Dropdown>
                      </h5>
                    </div>
                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                      <i class="pi pi-search"/>
                      <InputText
                          v-model="filters['global'].value"
                          placeholder="Search..."
                      />
                    </span>
                  </div>
                </template>
                <Column
                    field="name"
                    header="Serail Number"
                    :sortable="true"
                    headerStyle="width:14%; min-width:12rem;"
                >
                  <template #body="slotProps">
                    <span class="p-column-title">Serail Number</span>
                    {{ slotProps.data.serie_number }}
                  </template>
                </Column>
                <Column
                    field="name"
                    header="Name"
                    :sortable="true"
                    headerStyle="width:14%; min-width:12rem;"
                >
                  <template #body="slotProps">
                    <span class="p-column-title">Name</span>
                    {{ slotProps.data.name }}
                  </template>
                </Column>

                <Column
                    header="Image"
                    headerStyle="width:14%; min-width:10rem;"
                >
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
                    headerStyle="width:14%; min-width:10rem;"
                >
                  <template #body="slotProps">
                    <span class="p-column-title">Quantity</span>
                    {{ slotProps.data.quantity }}
                  </template>
                </Column>
                <Column headerStyle="min-width:1rem;">
                  <template #body="slotProps">
                    <div style="display: flex; justify-content: end">
                      <Button
                          icon="pi pi-angle-double-right"
                          class="p-button-rounded p-button-info mr-2"
                          @click="setArticle(slotProps.data)"
                      />
                    </div>
                  </template>
                </Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 md:col-6">
        <div class="card p-fluid">
          <h5>Add Spare part inventory / Add Spare part Buy</h5>
          <div class="grid">
            <div class="field col-12 sm:col-5">
              <label for="name1">Serail number</label>
              <InputText v-model="article.serie_number" id="name1" type="text"/>
            </div>
            <div class="field col-12 sm:col-4">
              <label for="name1">Nombre</label>
              <InputText v-model="article.name" id="name1" type="text"/>
            </div>
            <div class="field col-12 sm:col-3">
              <label for="name1">Brand</label>
              <InputText v-model="article.brand" id="name1" type="text"/>
            </div>

            <div class="field col-12 sm:col-5">
              <label for="name1">Model</label>
              <InputText v-model="article.model" id="name1" type="text"/>
            </div>
            <div class="field col-12 sm:col-3">
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
              <!--v-model="article.quantity"-->
            </div>
            <div class="field col-12 sm:col-3">
              <label for="quantity">Price</label>
              <InputNumber
                  id="price"
                  v-model="article.price"
                  mode="currency"
                  currency="PEN"
                  locale="es-PE"
                  :class="{
                  'p-invalid': submittedAddSuppliersRef && !supplier_ref.price,
                }"
              />
            </div>
            <!--v-model="supplier_ref.price"-->
            <div class="field col-12 sm:col-1">
              <Button
                  icon="pi pi-plus"
                  class="p-button-secondary"
                  style="margin-top: 1.8rem"
                  @click="addArticle"
              ></Button>
            </div>
            <div class="field col-12 sm:col-12">
              <div class="card">
                <DataTable
                    :value="listArticles"
                    responsiveLayout="scroll">
                  <!--:value="article.suppliers"-->
                  <Column
                      v-for="col of columnsDetailSparePart"
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

                  <Column v-if="!isView" headerStyle="min-width:4rem;">
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
        </div>
      </div>
      <div class="flex justify-content-end">
        <Button
            label="Add"
            icon="pi pi-download"
            class="p-button-success mr-2"
            @click="addArticleInDetail"
        />
      </div>
    </div>
  </Dialog>

  <Dialog
      v-model:visible="addServiceDialog"
      :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
      :style="{ width: '50vw' }"
      header="Add Service"
      :modal="true"
      class="p-fluid"
  >
    <div class="col-12 md:col-12">
      <div class="card p-fluid">
        <h5>Add Cost Of Service</h5>
        <div class="grid">
          <div class="field col-12 sm:col-8">
            <label for="name1">Description</label>
            <InputText v-model="service.description" id="name1" type="text"/>
          </div>
          <div class="field col-12 sm:col-3">
            <label for="quantity">Price</label>
            <InputNumber
                v-model="service.price"
                id="price"
                mode="currency"
                currency="PEN"
                locale="es-PE"
                :class="{
                'p-invalid': submittedAddSuppliersRef && !supplier_ref.price,
              }"
            />
          </div>
          <!--v-model="supplier_ref.price"-->
          <div class="field col-12 sm:col-1">
            <Button
                icon="pi pi-plus"
                class="p-button-secondary"
                style="margin-top: 1.8rem"
                @click="addService()"
            ></Button>
          </div>
          <div class="field col-12 sm:col-12">
            <div class="card">
              <DataTable
                  :value="listService"
                  responsiveLayout="scroll">
                <!--                :value="article.suppliers"-->
                <Column
                    v-for="col of columnsDetailService"
                    :field="col.field"
                    :header="col.header"
                    :key="col.field"
                    style="width: 75%"
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

                <Column v-if="!isView" headerStyle="min-width:4rem;">
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
      </div>
    </div>
    <div class="field col-12 sm:col-3">
      <div class="flex justify-content-end">
        <Button
            label="Add"
            icon="pi pi-download"
            class="p-button-success mr-2"
            @click="addServiceInDetail()"
        />
      </div>
    </div>
  </Dialog>
</template>

<script>
import ProductService from "./../service/ProductService";
import {FilterMatchMode} from "primevue/api";
import MachinesService from "@/service/MachinesService";
import ArticleTypesService from "../service/ArticleTypesService";
import ArticlesService from "@/service/ArticlesService";
import SupplierService from "@/service/SupplierService";
import MaintenanceTypeService from "@/service/MaintenanceTypeService";

export default {
  data() {
    return {
      maintenanceSheet: {
        date: null,
        responsible: null,
        technical: null,
        maintenanceTye: {},
        supplier: {},
        machine: {},
        detail: []
      },
      dropdownItems: [
        {name: "Option 1", code: "Option 1"},
        {name: "Option 2", code: "Option 2"},
        {name: "Option 3", code: "Option 3"},
      ],
      machines: [],
      articles: [],
      machineDialog: false,
      addSparePartDialog: false,
      addServiceDialog: false,
      loadingMachines: true,
      loadingArticles: true,
      loadingArticleTypesFilter: true,
      imageDefault: "https://via.placeholder.com/150x180",
      dropdownItem: null,
      minDateValue: new Date(),
      editingRows: [],
      columnsDetailGeneral: null,
      columnsDetailSparePart: null,
      columnsDetailService: null,
      products1: null,
      products2: null,
      products3: null,
      statuses: [
        {label: "In Stock", value: "INSTOCK"},
        {label: "Low Stock", value: "LOWSTOCK"},
        {label: "Out of Stock", value: "OUTOFSTOCK"},
      ],
      filters: {
        code: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
        name: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
        quantity: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
        price: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
      },

      service: {
        description: null,
        price: null
      },
      listService: [],

      article: {
        serie_number: null,
        name: null,
        brand: null,
        model: null,
        quantity: null,
        price: null,
      },
      listArticles: [],


      articleTypeFilterItems: null,

      supplierItems: null,
      supplierItemsLoading: true,
      maintenanceTypeItems: null,
      maintenanceTypeItemsLoading: true
    };
  },
  machineService: null,
  articleService: null,
  articleTypeService: null,
  productService: null,
  supplierService: null,
  maintenanceTypeService: null,
  created() {
    this.initFilters();
    this.productService = new ProductService();
    this.machineService = new MachinesService();
    this.articleService = new ArticlesService();
    this.articleTypeService = new ArticleTypesService();
    this.supplierService = new SupplierService();
    this.maintenanceTypeService = new MaintenanceTypeService();
    this.columnsDetailGeneral = [
      {field: "code", header: "Serie"},
      {field: "description", header: "Description"},
      {field: "price", header: "Price", mode: "currency", currency: "PEN"},
      {field: "quantity", header: "Quantity"},
      {field: "quantity", header: "Import"},
    ];
    this.columnsDetailSparePart = [
      {field: "serie_number", header: "Serie"},
      {field: "name", header: "Name"},
      {field: "price", header: "Price", mode: "currency", currency: "PEN"},
      {field: "quantity", header: "Quantity"},
      {field: "quantity", header: "Import"},
    ];
    this.columnsDetailService = [
      {field: "description", header: "Description"},
      {field: "price", header: "Price", mode: "currency", currency: "PEN"},
      // {field: "quantity", header: "Import"},
    ];
  },
  mounted() {
    this.supplierService.getAll()
        .then((data) => {
          this.supplierItems = data
          this.supplierItemsLoading = false
        });
    this.maintenanceTypeService.getAll()
        .then((data) => {
          this.maintenanceTypeItems = data
          this.maintenanceTypeItemsLoading = false
        });
  },
  methods: {
    openNewSelectMachine() {
      this.machineDialog = true;
      //  SET DATA
      this.loadingMachines = true;
      this.machineService.getAll().then((data) => {
        this.machines = data;
        this.loadingMachines = false;
      });
    },
    openNewAddSparePart() {
      this.product = {};
      this.submitted = false;
      this.addSparePartDialog = true;
      this.loadingArticles = true;
      this.articleService.getAll().then((data) => {
        this.articles = data;
        this.loadingArticles = false;
      });
      this.articleTypeService.getAll().then((data) => {
        this.articleTypeFilterItems = data;
        this.articleTypeFilterItems.unshift({
          id: 1,
          name: "All",
        });
        this.loadingArticleTypesFilter = false;
        this.filter = {
          id: 1,
          name: "All",
        };
      });
    },
    openNewAddService() {
      this.product = {};
      this.submitted = false;
      this.addServiceDialog = true;
    },
    onCellEditComplete(event) {
      let {data, newValue, field} = event;

      switch (field) {
        case "quantity":
        case "price":
          if (this.isPositiveInteger(newValue)) data[field] = newValue;
          else event.preventDefault();
          break;

        default:
          if (newValue.trim().length > 0) data[field] = newValue;
          else event.preventDefault();
          break;
      }
    },
    isPositiveInteger(val) {
      let str = String(val);
      str = str.trim();
      if (!str) {
        return false;
      }
      str = str.replace(/^0+/, "") || "0";
      var n = Math.floor(Number(str));
      return n !== Infinity && String(n) === str && n >= 0;
    },
    onRowEditSave(event) {
      let {newData, index} = event;

      this.products2[index] = newData;
    },
    getStatusLabel(status) {
      switch (status) {
        case "INSTOCK":
          return "In Stock";

        case "LOWSTOCK":
          return "Low Stock";

        case "OUTOFSTOCK":
          return "Out of Stock";

        default:
          return "NA";
      }
    },
    getImage(path) {
      // console.log(path)
      return `${process.env.VUE_APP_API_HOST}/storage/${path}`;
    },
    filterByArticleType(data) {
      let article_type = data.value;
      this.loadingArticles = true;
      this.articles = this.articlesAll.filter(
          (val) => val.article_type.id === article_type.id
      );
      if (article_type.id === 1) this.articles = this.articlesAll;
      this.loadingArticles = false;
    },
    initFilters() {
      this.filters = {
        global: {value: null, matchMode: FilterMatchMode.CONTAINS},
      };
    },
    selectMachine(value) {
      this.machineService.getOne(value.id).then((data) => {
        this.maintenanceSheet.machine = {...data};
        this.machineDialog = false;
      });
    },
    backPage() {
      this.$router.push(`/maintenance-sheet`);
    },
    addService() {
      //  TODO:VALIDATE FIELDS EMPTY
      this.service.quantity = 1;
      this.listService.push(this.service)
      this.service = {}
    },
    addServiceInDetail() {
      //  TODO:VALIDATE FIELDS EMPTY TABLE
      // console.log(this.listService);
      this.listService.map((service) => (this.maintenanceSheet.detail.push(service)))
      this.addServiceDialog = false;
    },
    setArticle(value) {
      this.article = {
        serie_number: value.serie_number,
        name: value.name,
        brand: value.brand,
        model: value.model,
      }
    },
    addArticle() {
      //  TODO:VALIDATE FIELDS EMPTY
      // this.service.quantity = 1;
      this.listArticles.push(this.article)
      this.article = {}
    },
    addArticleInDetail() {
      //  TODO:VALIDATE FIELDS EMPTY TABLE
      // console.log(this.listService);
      this.listArticles.map((service) => (this.maintenanceSheet.detail.push(service)))
      this.addSparePartDialog = false;
    }
  },
  /*mounted() {
    this.productService
      .getProductsSmall()
      .then((data) => (this.products1 = data));
    this.productService
      .getProductsSmall()
      .then((data) => (this.products2 = data));
    this.productService
      .getProductsSmall()
      .then((data) => (this.products3 = data));
  },*/
};
</script>

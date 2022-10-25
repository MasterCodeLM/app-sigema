<template>
  <Toast />
  <div class="grid">
    <div class="col-12">
      <div class="card p-fluid">
        <div class="flex flex-column align-items-center">
          <h3 class="text-900 font-medium">MAINTENANCES REPORT</h3>
        </div>
      </div>
    </div>
    <div class="col-12 md:col-3">
      <div class="card p-fluid h-full">
        <h5>OPTIONS</h5>
        <div class="field">
          <label>From the: </label>
          <Calendar
            :showIcon="true"
            :showButtonBar="false"
            v-model="start_date"
            :maxDate="minDateValue"
            dateFormat="yy-mm-dd"
          ></Calendar>
        </div>
        <div class="field">
          <label> Until the: </label>
          <Calendar
            :showIcon="true"
            :showButtonBar="false"
            v-model="end_date"
            :maxDate="minDateValue"
            dateFormat="yy-mm-dd"
          ></Calendar>
        </div>
        <div class="field">
          <label> Type: </label>
          <Dropdown
            id="state"
            :disabled="isView"
            :filter="false"
            :options="dropdownReportType"
            optionLabel="name"
            optionValue="value"
            placeholder="Select One"
          ></Dropdown>
          <!--v-model="employee.native_language"
          <small
                class="p-invalid"
                v-if="submitted && !employee.native_language"
                >Native language is required.</small
              >-->
        </div>
        <div class="field" style="border-top: 1px solid silver"></div>
        <div class="field">
          <h5>Order by</h5>
          <div class="field-radiobutton">
            <RadioButton
              v-model="order"
              inputId="order1"
              name="N° Serie"
              value="serie_number"
            />
            <label for="city1">Serieal Number</label>
          </div>
          <div class="field-radiobutton">
            <RadioButton
              v-model="order"
              inputId="order2"
              name="Machine"
              value="machine"
            />
            <label for="city1">Machine</label>
          </div>
          <div class="field-radiobutton">
            <RadioButton
              v-model="order"
              inputId="order2"
              name="Amount"
              value="amount"
            />
            <label for="city1">Amount</label>
          </div>
          <div class="field-radiobutton">
            <RadioButton
              v-model="order"
              inputId="order1"
              name="N° of maintenances"
              value="maintenances_number"
            />
            <label for="city1">N° of maintenances</label>
          </div>
        </div>
        <div class="field">
          <Button
            label="Generate report"
            icon="pi pi-file-pdf"
            class="p-button-outlined p-button-danger"
            @click="openNew"
          />
        </div>
      </div>
    </div>
    <div class="col-12 md:col-9">
      <div class="card p-fluid h-full">
        <h5>REPORT</h5>
        <div
          class="col-12"
          style="
            border-top: 1px solid silver;
            border-right: 1px solid silver;
            border-bottom: 1px solid silver;
            border-left: 1px solid silver;
            height: 92%;
            width: 100%;
          "
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      order: null,
      start_date: moment().format("YYYY-MM-DD"),
      end_date: moment().format("YYYY-MM-DD"),
      dropdownReportType: [
        { name: "Abstarct", value: "abstarct" },
        { name: "Detailed", value: "detailed" },
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
};
</script>

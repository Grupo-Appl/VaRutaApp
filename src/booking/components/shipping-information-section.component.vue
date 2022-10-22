<template>
  <div>
    <div class="card">
      <!-- Toolbar Section -->
      <pv-toolbar class="mb-4">
        <template #start>
          <pv-button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew"></pv-button>
          <pv-button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected"
                     :disabled="!selectedShipments || !selectedShipments.length"></pv-button>
        </template>
        <template #end>
          <pv-button label="Export" icon="pi pi-download" class="p-button-help"
                     @click="exportToCSV($event)"></pv-button>
        </template>
      </pv-toolbar>

      <!-- Data Table Section -->
      <pv-data-table ref="dt" :value="shipments"
                     v-model:selection="selectedShipments"
                     dataKey="id"
                     :paginator="true"
                     :rows="10"
                     :filters="filters"
                     paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                     :rowsPerPageOptions="[5, 10, 25]"
                     currentPageReportTemplate="Showing {first} to {last} of {totalRecords} shipments"
                     responsiveLayout="scroll">

        <template #header>

          <div class="table-header flex flex-column md:flex-row md:justify-content-between">
            <h5 class="mb-2 md:m-0 p-as-md-center text-xl">Manage Shipments</h5>
            <span class="p-input-icon-left">
              <i class="pi pi-search"></i>
              <pv-input-text v-model="filters['global'].value" placeholder="Search..."></pv-input-text>
            </span>
          </div>
        </template>

        <pv-column selectionMode="multiple" style="width: 3rem" :exportable="false"></pv-column>
        <pv-column field="id" header="Id" :sortable="true" style="min-width: 5rem"></pv-column>
        <pv-column field="date" header="Date" :sortable="true" style="min-width: 8rem"></pv-column>
        <pv-column field="destiny" header="Destiny" :sortable="true" style="min-width: 8rem"></pv-column>
        <pv-column field="description" header="Description" :sortable="true" style="min-width: 16rem"></pv-column>
        <pv-column field="weight" header="weight" :sortable="true" style="min-width: 5rem"></pv-column>
        <pv-column field="quantity" header="Quantity" :sortable="true" style="min-width: 5rem"></pv-column>
        <pv-column field="freight" header="Freight" :sortable="true" style="min-width: 5rem"></pv-column>
        <pv-column field="senderId" header="Sender" :sortable="true" style="min-width: 5rem"></pv-column>

        <pv-column :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <pv-button icon="pi pi-pencil" class="p-button-text p-button-rounded"
                       @click="editShipping(slotProps.data)"></pv-button>
            <pv-button icon="pi pi-trash" class="p-button-text p-button-rounded"
                       @click="confirmDeleteShipping(slotProps.data)"></pv-button>
          </template>
        </pv-column>

      </pv-data-table>

      <!-- Add/Edit Shipping Dialog -->
      <pv-dialog
          v-model:visible="shippingDialog"
          :style="{ width: '450px'}"
          header="Shipping Information"
          :modal="true"
          class="p-fluid">

         <span class="p-float-label">
            <pv-calendar inputId="basic" v-model="shipping.date" autocomplete="off" dateFormat="dd-mm-yy"/>
            <label for="freight">Date</label>
            <small class="p-error" v-if="submitted && !shipping.date">
              Date is required
            </small>
          </span>

        <div class="field mt-3">
          <label for="freight">Destination</label>
          <pv-dropdown v-model="selectedDestination"
                       :options="destinations"
                       optionLabel="name"
                       optionValue="id"
                       placeholder="Select a destination" />
          <small class="p-error" v-if="submitted && !shipping.destinyId ">
            Destination is required
          </small>
          <br>
          <label for="freight">Sender</label>
          <pv-dropdown v-model="selectedSender"
                       :options="senders"
                       optionLabel="name"
                       optionValue="id"
                       placeholder="Select a sender" />
          <small class="p-error" v-if="submitted && !shipping.senderId">
            Sender is required
          </small>

          <br>
          <label for="freight">Consignee</label>
          <pv-dropdown v-model="selectedConsignee"
                       :options="consignees"
                       optionLabel="name"
                       optionValue="id"
                       placeholder="Select a consignee" />
          <small class="p-error" v-if="submitted && !shipping.consigneeId ">
            Consignee is required
          </small>
<br>
          <span class="p-float-label">
            <pv-input-text type="text"
                           v-model.trim="shipping.description"
                           required="true"
                           autofocus
                           :class="{'p-invalid': submitted && !shipping.description}"/>
            <label for="description">Description</label>
            <small class="p-error" v-if="submitted && !shipping.description">
              Description is required
            </small>
          </span>

          <br>
          <span class="p-float-label">
            <pv-input-text type="text"
                           v-model.trim="shipping.weight"
                           required="true"
                           autofocus
                           :class="{'p-invalid': submitted && !shipping.weight}"/>
            <label for="weight">Weight</label>
            <small class="p-error" v-if="submitted && !shipping.weight">
              Weight is required
            </small>
          </span>

          <br>
          <span class="p-float-label">
            <pv-input-text type="text"
                           v-model.trim="shipping.quantity"
                           required="true"
                           autofocus
                           :class="{'p-invalid': submitted && !shipping.quantity}"/>
            <label for="quantity">Quantity</label>
            <small class="p-error" v-if="submitted && !shipping.quantity">
              Cantidad is required
            </small>
          </span>

          <br>
          <span class="p-float-label">
            <pv-input-text type="text"
                           v-model.trim="shipping.freight"
                           required="true"
                           autofocus
                           :class="{'p-invalid': submitted && !shipping.freight}"/>
            <label for="freight">Freight</label>
            <small class="p-error" v-if="submitted && !shipping.freight">
              Freight is required
            </small>
          </span>

        </div>

        <template #footer>
          <pv-button :label="'Cancel'.toUpperCase()" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
          <pv-button :label="'Save'.toUpperCase()" icon="pi pi-check" class="p-button-text" @click="saveShipping"/>
        </template>

      </pv-dialog>


      <!-- Delete Shipping Confirmation Dialog -->
      <pv-dialog v-model:visible="deleteShippingDialog" :style="{width: '450px'}"
                 header="Confirm" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
          <span v-if="shipping">
            Are you sure you want to delete <b>{{ shipping.description }}</b>?
          </span>
        </div>
        <template #footer>
          <pv-button :label="'No'.toUpperCase()"
                     icon="pi pi-times"
                     class="p-button-text"
                     @click="deleteShippingDialog = false"/>
          <pv-button :label="'Yes'.toUpperCase()"
                     icon="pi pi-check"
                     class="p-button-text"
                     @click="deleteShipping"/>
        </template>
      </pv-dialog>


      <!-- Delete Selected Shipments Confirmation Dialog -->
      <pv-dialog
          v-model:visible="deleteShipmentsDialog"
          :style="{ width: '450px'}"
          header="Confirm"
          :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3"
             style="font-size: 2rem"/>
          <span v-if="selectedShipments">Are you sure you want to delete the selected shipments?</span>
        </div>
        <template #footer>
          <pv-button :label="'No'.toUpperCase()"
                     icon="pi pi-times"
                     class="p-button-text"
                     @click="deleteShipmentsDialog = false"/>
          <pv-button :label="'Yes'.toUpperCase()"
                     icon="pi pi-check"
                     class="p-button-text"
                     @click="deleteSelectedShipments"/>
        </template>
      </pv-dialog>

    </div>
  </div>
</template>

<script>
import {FilterMatchMode} from "primevue/api";
import {ShipmentsApiService} from "@/booking/services/shipments-api.service";

import {SendersApiService} from "../../profiles/services/Senders-api.service";
import {ConsigneesApiService} from "../../profiles/services/consignees-api.service";
import {DestinationsApiService} from "../../handling/services/Destinations-api.service";

export default {
  description: "shipping-list.component",
  data() {
    return {
      shipments: [],
      shippingDialog: false,
      deleteShippingDialog: false,
      deleteShipmentsDialog: false,
      shipping: {},
      selectedShipments: null,
      filters: {},
      submitted: false,
      shipmentsService: null,

      sendersService: null,
      selectedSender:null,
      senders: [],

      consigneeService: null,
      selectedConsignee:null,
      consignees: [],

      destinationService: null,
      selectedDestination:null,
      destinations: []
    };
  },
  created() {

    this.destinationService = new DestinationsApiService();
    this.destinationService.getAll().then((response) => {
      this.destinations = response.data;
      console.log(this.senders);
    });

    this.sendersService = new SendersApiService();
    this.sendersService.getAll().then((response) => {
      this.senders = response.data;
      console.log(this.senders);
    });

    this.consigneeService = new ConsigneesApiService();
    this.consigneeService.getAll().then((response) => {
      this.consignees = response.data;
      console.log(this.consignees);
    });

    this.shipmentsService = new ShipmentsApiService();
    this.shipmentsService.getAll().then((response) => {
      this.shipments = response.data;
      console.log(this.shipments);
      this.shipments.forEach((shipping) => this.getDisplayableShipping(shipping));
      console.log(this.shipments);
    });
    this.initFilters();
  },

  methods: {

    getDisplayableShipping(shipping) {
      return shipping;
    },

    getStorableShipping(displayableShipping) {
      return {
        id: displayableShipping.id,
        description: displayableShipping.description,
        freight: displayableShipping.freight,
        quantity: displayableShipping.quantity,
        weight: displayableShipping.weight,
        date: displayableShipping.date,
        destinyId: displayableShipping.destinyId,
        senderId: displayableShipping.senderId,
        consigneeId: displayableShipping.consigneeId
      };
    },

    openNew() {
      this.shipping = {};
      this.submitted = false;
      this.shippingDialog = true;
    },

    hideDialog() {
      this.shippingDialog = false;
      this.submitted = false;
    },

    findIndexById(id) {
      console.log(`current id: ${id}`);
      return this.shipments.findIndex((shipping) => shipping.id === id);
    },

    saveShipping() {
      this.submitted = true;
      if (this.shipping.description.trim()) {
        if (this.shipping.id) {
          this.shipping.senderId = this.selectedSender;
          this.shipping.consigneeId = this.selectedConsignee;
          this.shipping.destinyId = this.selectedDestination;

          console.log(this.shipping);
          this.shipping = this.getStorableShipping(this.shipping);
          this.shipmentsService.update(this.shipping.id, this.shipping)
              .then((response) => {
                console.log(response.data.id);
                this.shipments[this.findIndexById(response.data.id)] =
                    this.getDisplayableShipping(response.data);
                this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Shipping Updated', life: 3000});
                console.log(response);
              });
        } else {
          this.shipping.id = 0;
          this.shipping.senderId = this.selectedSender;
          this.shipping.consigneeId = this.selectedConsignee;
          this.shipping.destinyId = this.selectedDestination;

          console.log(this.shipping);
          this.shipping = this.getStorableShipping(this.shipping);
          this.shipmentsService.create(this.shipping).then((response) => {
            this.shipping = this.getDisplayableShipping(response.data);
            this.shipments.push(this.shipping);
            this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Shipping Created', life: 3000});
            console.log(response);
          });
        }
        this.shippingDialog = false;
        this.shipping = {};
      }
    },

    editShipping(shipping) {
      console.log(shipping);
      this.shipping = {...shipping};
      console.log(this.shipping);
      this.shippingDialog = true;
    },

    confirmDeleteShipping(shipping) {
      this.shipping = shipping;
      this.deleteShippingDialog = true;
    },

    deleteShipping() {
      this.shipmentsService.delete(this.shipping.id).then((response) => {
        this.shipments = this.shipments.filter((t) => t.id !== this.shipping.id);
        this.deleteShippingDialog = false;
        this.shipping = {};
        this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Shipping Deleted', life: 3000});
        console.log(response);
      });
    },

    exportToCSV() {
      this.$refs.dt.exportCSV();
    },

    confirmDeleteSelected() {
      this.deleteShipmentsDialog = true;
    },

    deleteSelectedShipments() {
      this.selectedShipments.forEach((shipping) => {
        this.shipmentsService.delete(shipping.id).then((response) => {
          this.shipments = this.shipments.filter((t) => t.id !== this.shipping.id);
          console.log(response);
        });
      });
      this.deleteShipmentsDialog = false;
    },

    initFilters() {
      this.filters = {global: {value: null, matchMode: FilterMatchMode.CONTAINS}};
    }

  }
}
</script>

<style scoped>
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>

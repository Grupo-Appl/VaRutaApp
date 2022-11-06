<template>
  <div>
    <div class="card">
      <!-- Toolbar Section -->
      <pv-toolbar class="mb-4">
        <template #start>
          <pv-button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew"></pv-button>
          <pv-button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected"
                     :disabled="!selectedConsignees || !selectedConsignees.length"></pv-button>
        </template>
        <template #end>
          <pv-button label="Export" icon="pi pi-download" class="p-button-help"
                     @click="exportToCSV($event)"></pv-button>
        </template>
      </pv-toolbar>

      <!-- Data Table Section -->
      <pv-data-table ref="dt" :value="consignees"
                     v-model:selection="selectedConsignees"
                     dataKey="id"
                     :paginator="true"
                     :rows="10"
                     :filters="filters"
                     paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                     :rowsPerPageOptions="[5, 10, 25]"
                     currentPageReportTemplate="Showing {first} to {last} of {totalRecords} consignees"
                     responsiveLayout="scroll">

        <template #header>

          <div class="table-header flex flex-column md:flex-row md:justify-content-between">
            <h5 class="mb-2 md:m-0 p-as-md-center text-xl">Manage Consignees</h5>
            <span class="p-input-icon-left">
              <i class="pi pi-search"></i>
              <pv-input-text v-model="filters['global'].value" placeholder="Search..."></pv-input-text>
            </span>
          </div>
        </template>

        <pv-column selectionMode="multiple" style="width: 3rem" :exportable="false"></pv-column>
        <pv-column field="id" header="Id" :sortable="true" style="min-width: 12rem"></pv-column>
        <pv-column field="name" header="Name" :sortable="true" style="min-width: 16rem"></pv-column>
        <pv-column field="dni" header="Dni" :sortable="true" style="min-width: 16rem"></pv-column>
        <pv-column field="address" header="Address" :sortable="true" style="min-width: 16rem"></pv-column>

        <pv-column :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <pv-button icon="pi pi-pencil" class="p-button-text p-button-rounded"
                       @click="editConsignee(slotProps.data)"></pv-button>
            <pv-button icon="pi pi-trash" class="p-button-text p-button-rounded"
                       @click="confirmDeleteConsignee(slotProps.data)"></pv-button>
          </template>
        </pv-column>

      </pv-data-table>

      <!-- Add/Edit Consignee Dialog -->
      <pv-dialog
          v-model:visible="consigneeDialog"
          :style="{ width: '450px'}"
          header="Consignee Information"
          :modal="true"
          class="p-fluid">
        <div class="field mt-3">
          <span class="p-float-label">
            <pv-input-text type="text"
                           v-model.trim="consignee.name"
                           required="true"
                           autofocus
                           :class="{'p-invalid': submitted && !consignee.name}"/>
            <label for="name">Name</label>
            <small class="p-error" v-if="submitted && !consignee.name">
              Name is required
            </small>
          </span>
        </div>
        <br>
        <div class="field mt-3">
          <span class="p-float-label">
            <pv-input-text type="text"
                           v-model.trim="consignee.dni"
                           required="true"
                           autofocus
                           :class="{'p-invalid': submitted && !consignee.dni}"/>
            <label for="dni">Dni</label>
            <small class="p-error" v-if="submitted && !consignee.dni">
              D.N.I is required
            </small>
          </span>
        </div>
        <br>
        <div class="field mt-3">
          <span class="p-float-label">
            <pv-input-text type="text"
                           v-model.trim="consignee.address"
                           required="true"
                           autofocus
                           :class="{'p-invalid': submitted && !consignee.address}"/>
            <label for="address">Address</label>
            <small class="p-error" v-if="submitted && !consignee.address">
              Address is required
            </small>
          </span>
        </div>

        <template #footer>
          <pv-button :label="'Cancel'.toUpperCase()" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
          <pv-button :label="'Save'.toUpperCase()" icon="pi pi-check" class="p-button-text" @click="saveConsignee"/>
        </template>

      </pv-dialog>


      <!-- Delete Consignee Confirmation Dialog -->
      <pv-dialog v-model:visible="deleteConsigneeDialog" :style="{width: '450px'}"
                 header="Confirm" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
          <span v-if="consignee">
            Are you sure you want to delete <b>{{ consignee.name }}</b>?
          </span>
        </div>
        <template #footer>
          <pv-button :label="'No'.toUpperCase()"
                     icon="pi pi-times"
                     class="p-button-text"
                     @click="deleteConsigneeDialog = false"/>
          <pv-button :label="'Yes'.toUpperCase()"
                     icon="pi pi-check"
                     class="p-button-text"
                     @click="deleteConsignee"/>
        </template>
      </pv-dialog>


      <!-- Delete Selected Consignees Confirmation Dialog -->
      <pv-dialog
          v-model:visible="deleteConsigneesDialog"
          :style="{ width: '450px'}"
          header="Confirm"
          :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3"
             style="font-size: 2rem"/>
          <span v-if="selectedConsignees">Are you sure you want to delete the selected consignees?</span>
        </div>
        <template #footer>
          <pv-button :label="'No'.toUpperCase()"
                     icon="pi pi-times"
                     class="p-button-text"
                     @click="deleteConsigneesDialog = false"/>
          <pv-button :label="'Yes'.toUpperCase()"
                     icon="pi pi-check"
                     class="p-button-text"
                     @click="deleteSelectedConsignees"/>
        </template>
      </pv-dialog>

    </div>
  </div>
</template>

<script>
import {FilterMatchMode} from "primevue/api";
import {ConsigneesApiService} from "@/profiles/services/consignees-api.service";

export default {
  name: "consignee-list.component",
  data() {
    return {
      consignees: [],
      consigneeDialog: false,
      deleteConsigneeDialog: false,
      deleteConsigneesDialog: false,
      consignee: {},
      selectedConsignees: null,
      filters: {},
      submitted: false,
      consigneesService: null
    };
  },
  created() {
    this.consigneesService = new ConsigneesApiService();
    this.consigneesService.getAll().then((response) => {
      this.consignees = response.data;
      console.log(this.consignees);
      this.consignees.forEach((consignee) => this.getDisplayableConsignee(consignee));
      console.log(this.consignees);
    });
    this.initFilters();
  },

  methods: {

    getDisplayableConsignee(consignee) {
      return consignee;
    },

    getStorableConsignee(displayableConsignee) {
      return {
        id: displayableConsignee.id,
        name: displayableConsignee.name,
        dni: displayableConsignee.dni,
        address: displayableConsignee.address
      };
    },

    openNew() {
      this.consignee = {};
      this.submitted = false;
      this.consigneeDialog = true;
    },

    hideDialog() {
      this.consigneeDialog = false;
      this.submitted = false;
    },

    findIndexById(id) {
      console.log(`current id: ${id}`);
      return this.consignees.findIndex((consignee) => consignee.id === id);
    },

    saveConsignee() {
      this.submitted = true;
      if (this.consignee.name.trim()) {
        if (this.consignee.id) {
          console.log(this.consignee);
          this.consignee = this.getStorableConsignee(this.consignee);
          this.consigneesService.update(this.consignee.id, this.consignee)
              .then((response) => {
                console.log(response.data.id);
                this.consignees[this.findIndexById(response.data.id)] =
                    this.getDisplayableConsignee(response.data);
                this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Consignee Updated', life: 3000});
                console.log(response);
              });
        } else {
          this.consignee.id = 0;
          console.log(this.consignee);
          this.consignee = this.getStorableConsignee(this.consignee);
          this.consigneesService.create(this.consignee).then((response) => {
            this.consignee = this.getDisplayableConsignee(response.data);
            this.consignees.push(this.consignee);
            this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Consignee Created', life: 3000});
            console.log(response);
          });
        }
        this.consigneeDialog = false;
        this.consignee = {};
      }
    },

    editConsignee(consignee) {
      console.log(consignee);
      this.consignee = {...consignee};
      console.log(this.consignee);
      this.consigneeDialog = true;
    },

    confirmDeleteConsignee(consignee) {
      this.consignee = consignee;
      this.deleteConsigneeDialog = true;
    },

    deleteConsignee() {
      this.consigneesService.delete(this.consignee.id).then((response) => {
        this.consignees = this.consignees.filter((t) => t.id !== this.consignee.id);
        this.deleteConsigneeDialog = false;
        this.consignee = {};
        this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Consignee Deleted', life: 3000});
        console.log(response);
      });
    },

    exportToCSV() {
      this.$refs.dt.exportCSV();
    },

    confirmDeleteSelected() {
      this.deleteConsigneesDialog = true;
    },

    deleteSelectedConsignees() {
      this.selectedConsignees.forEach((consignee) => {
        this.consigneesService.delete(consignee.id).then((response) => {
          this.consignees = this.consignees.filter((t) => t.id !== this.consignee.id);
          console.log(response);
        });
      });
      this.deleteConsigneesDialog = false;
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

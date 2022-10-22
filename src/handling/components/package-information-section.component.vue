<template>
  <div>
    <div class="card">
      <!-- Toolbar Section -->
      <pv-toolbar class="mb-4">
        <template #start>
          <pv-button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew"></pv-button>
          <pv-button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected"
                     :disabled="!selectedPackages || !selectedPackages.length"></pv-button>
        </template>
        <template #end>
          <pv-button label="Export" icon="pi pi-download" class="p-button-help"
                     @click="exportToCSV($event)"></pv-button>
        </template>
      </pv-toolbar>

      <!-- Data Table Section -->
      <pv-data-table ref="dt" :value="packages"
                     v-model:selection="selectedPackages"
                     dataKey="id"
                     :paginator="true"
                     :rows="10"
                     :filters="filters"
                     paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                     :rowsPerPageOptions="[5, 10, 25]"
                     currentPageReportTemplate="Showing {first} to {last} of {totalRecords} packages"
                     responsiveLayout="scroll">

        <template #header>

          <div class="table-header flex flex-column md:flex-row md:justify-content-between">
            <h5 class="mb-2 md:m-0 p-as-md-center text-xl">Manage Packages</h5>
            <span class="p-input-icon-left">
              <i class="pi pi-search"></i>
              <pv-input-text v-model="filters['global'].value" placeholder="Search..."></pv-input-text>
            </span>
          </div>
        </template>

        <pv-column selectionMode="multiple" style="width: 3rem" :exportable="false"></pv-column>
        <pv-column field="id" header="Id" :sortable="true" style="min-width: 12rem"></pv-column>
        <pv-column field="name" header="Name" :sortable="true" style="min-width: 16rem"></pv-column>


        <pv-column :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <pv-button icon="pi pi-pencil" class="p-button-text p-button-rounded"
                       @click="editPackage(slotProps.data)"></pv-button>
            <pv-button icon="pi pi-trash" class="p-button-text p-button-rounded"
                       @click="confirmDeletePackage(slotProps.data)"></pv-button>
          </template>
        </pv-column>

      </pv-data-table>

      <!-- Add/Edit Package Dialog -->
      <pv-dialog
          v-model:visible="packageDialog"
          :style="{ width: '450px'}"
          header="Package Information"
          :modal="true"
          class="p-fluid">
        <div class="field mt-3">
          <span class="p-float-label">
            <pv-input-text type="text"
                           v-model.trim="package.name"
                           required="true"
                           autofocus
                           :class="{'p-invalid': submitted && !package.name}"/>
            <label for="name">Name</label>
            <small class="p-error" v-if="submitted && !package.name">
              Name is required
            </small>
          </span>
        </div>

        <template #footer>
          <pv-button :label="'Cancel'.toUpperCase()" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
          <pv-button :label="'Save'.toUpperCase()" icon="pi pi-check" class="p-button-text" @click="savePackage"/>
        </template>

      </pv-dialog>


      <!-- Delete Package Confirmation Dialog -->
      <pv-dialog v-model:visible="deletePackageDialog" :style="{width: '450px'}"
                 header="Confirm" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
          <span v-if="package">
            Are you sure you want to delete <b>{{ package.name }}</b>?
          </span>
        </div>
        <template #footer>
          <pv-button :label="'No'.toUpperCase()"
                     icon="pi pi-times"
                     class="p-button-text"
                     @click="deletePackageDialog = false"/>
          <pv-button :label="'Yes'.toUpperCase()"
                     icon="pi pi-check"
                     class="p-button-text"
                     @click="deletePackage"/>
        </template>
      </pv-dialog>


      <!-- Delete Selected Packages Confirmation Dialog -->
      <pv-dialog
          v-model:visible="deletePackagesDialog"
          :style="{ width: '450px'}"
          header="Confirm"
          :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3"
             style="font-size: 2rem"/>
          <span v-if="selectedPackages">Are you sure you want to delete the selected packages?</span>
        </div>
        <template #footer>
          <pv-button :label="'No'.toUpperCase()"
                     icon="pi pi-times"
                     class="p-button-text"
                     @click="deletePackagesDialog = false"/>
          <pv-button :label="'Yes'.toUpperCase()"
                     icon="pi pi-check"
                     class="p-button-text"
                     @click="deleteSelectedPackages"/>
        </template>
      </pv-dialog>

    </div>
  </div>
</template>

<script>
import {FilterMatchMode} from "primevue/api";
import {PackagesApiService} from "@/handling/services/packages-api.service";

export default {
  name: "package-list.component",
  data() {
    return {
      packages: [],
      packageDialog: false,
      deletePackageDialog: false,
      deletePackagesDialog: false,
      package: {},
      selectedPackages: null,
      filters: {},
      submitted: false,
      packagesService: null
    };
  },
  created() {
    this.packagesService = new PackagesApiService();
    this.packagesService.getAll().then((response) => {
      this.packages = response.data;
      console.log(this.packages);
      this.packages.forEach((packet) => this.getDisplayablePackage(packet));
      console.log(this.packages);
    });
    this.initFilters();
  },

  methods: {

    getDisplayablePackage(packet) {
      return packet;
    },

    getStorablePackage(displayablePackage) {
      return {
        id: displayablePackage.id,
        name: displayablePackage.name
      };
    },

    openNew() {
      this.package = {};
      this.submitted = false;
      this.packageDialog = true;
    },

    hideDialog() {
      this.packageDialog = false;
      this.submitted = false;
    },

    findIndexById(id) {
      console.log(`current id: ${id}`);
      return this.packages.findIndex((packet) => packet.id === id);
    },

    savePackage() {
      this.submitted = true;
      if (this.package.name.trim()) {
        if (this.package.id) {
          console.log(this.package);
          this.package = this.getStorablePackage(this.package);
          this.packagesService.update(this.package.id, this.package)
              .then((response) => {
                console.log(response.data.id);
                this.packages[this.findIndexById(response.data.id)] =
                    this.getDisplayablePackage(response.data);
                this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Package Updated', life: 3000});
                console.log(response);
              });
        } else {
          this.package.id = 0;
          console.log(this.package);
          this.package = this.getStorablePackage(this.package);
          this.packagesService.create(this.package).then((response) => {
            this.package = this.getDisplayablePackage(response.data);
            this.packages.push(this.package);
            this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Package Created', life: 3000});
            console.log(response);
          });
        }
        this.packageDialog = false;
        this.package = {};
      }
    },

    editPackage(packet) {
      console.log(packet);
      this.package = {...packet};
      console.log(this.package);
      this.packageDialog = true;
    },

    confirmDeletePackage(packet) {
      this.package = packet;
      this.deletePackageDialog = true;
    },

    deletePackage() {
      this.packagesService.delete(this.package.id).then((response) => {
        this.packages = this.packages.filter((t) => t.id !== this.package.id);
        this.deletePackageDialog = false;
        this.package = {};
        this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Package Deleted', life: 3000});
        console.log(response);
      });
    },

    exportToCSV() {
      this.$refs.dt.exportCSV();
    },

    confirmDeleteSelected() {
      this.deletePackagesDialog = true;
    },

    deleteSelectedPackages() {
      this.selectedPackages.forEach((packet) => {
        this.packagesService.delete(packet.id).then((response) => {
          this.packages = this.packages.filter((t) => t.id !== this.package.id);
          console.log(response);
        });
      });
      this.deletePackagesDialog = false;
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

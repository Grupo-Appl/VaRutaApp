<template>
  <div>
    <div class="card">
      <!-- Toolbar Section -->
      <pv-toolbar class="mb-4">
        <template #start>
          <pv-button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew"></pv-button>
          <pv-button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected"
                     :disabled="!selectedDocuments || !selectedDocuments.length"></pv-button>
        </template>
        <template #end>
          <pv-button label="Export" icon="pi pi-download" class="p-button-help"
                     @click="exportToCSV($event)"></pv-button>
        </template>
      </pv-toolbar>

      <!-- Data Table Section -->
      <pv-data-table ref="dt" :value="documents"
                     v-model:selection="selectedDocuments"
                     dataKey="id"
                     :paginator="true"
                     :rows="10"
                     :filters="filters"
                     paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                     :rowsPerPageOptions="[5, 10, 25]"
                     currentPageReportTemplate="Showing {first} to {last} of {totalRecords} documents"
                     responsiveLayout="scroll">

        <template #header>

          <div class="table-header flex flex-column md:flex-row md:justify-content-between">
            <h5 class="mb-2 md:m-0 p-as-md-center text-xl">Manage Documents</h5>
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
                       @click="editDocument(slotProps.data)"></pv-button>
            <pv-button icon="pi pi-trash" class="p-button-text p-button-rounded"
                       @click="confirmDeleteDocument(slotProps.data)"></pv-button>
          </template>
        </pv-column>

      </pv-data-table>

      <!-- Add/Edit Document Dialog -->
      <pv-dialog
          v-model:visible="documentDialog"
          :style="{ width: '450px'}"
          header="Document Information"
          :modal="true"
          class="p-fluid">
        <div class="field mt-3">
          <span class="p-float-label">
            <pv-input-text type="text"
                           v-model.trim="document.name"
                           required="true"
                           autofocus
                           :class="{'p-invalid': submitted && !document.name}"/>
            <label for="name">Name</label>
            <small class="p-error" v-if="submitted && !document.name">
              Name is required
            </small>
          </span>
        </div>

        <template #footer>
          <pv-button :label="'Cancel'.toUpperCase()" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
          <pv-button :label="'Save'.toUpperCase()" icon="pi pi-check" class="p-button-text" @click="saveDocument"/>
        </template>

      </pv-dialog>


      <!-- Delete Document Confirmation Dialog -->
      <pv-dialog v-model:visible="deleteDocumentDialog" :style="{width: '450px'}"
                 header="Confirm" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
          <span v-if="document">
            Are you sure you want to delete <b>{{ document.name }}</b>?
          </span>
        </div>
        <template #footer>
          <pv-button :label="'No'.toUpperCase()"
                     icon="pi pi-times"
                     class="p-button-text"
                     @click="deleteDocumentDialog = false"/>
          <pv-button :label="'Yes'.toUpperCase()"
                     icon="pi pi-check"
                     class="p-button-text"
                     @click="deleteDocument"/>
        </template>
      </pv-dialog>


      <!-- Delete Selected Documents Confirmation Dialog -->
      <pv-dialog
          v-model:visible="deleteDocumentsDialog"
          :style="{ width: '450px'}"
          header="Confirm"
          :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3"
             style="font-size: 2rem"/>
          <span v-if="selectedDocuments">Are you sure you want to delete the selected documents?</span>
        </div>
        <template #footer>
          <pv-button :label="'No'.toUpperCase()"
                     icon="pi pi-times"
                     class="p-button-text"
                     @click="deleteDocumentsDialog = false"/>
          <pv-button :label="'Yes'.toUpperCase()"
                     icon="pi pi-check"
                     class="p-button-text"
                     @click="deleteSelectedDocuments"/>
        </template>
      </pv-dialog>

    </div>
  </div>
</template>

<script>
import {FilterMatchMode} from "primevue/api";
import {DocumentsApiService} from "@/varuta/services/documents-api.service";

export default {
  name: "document-list.component",
  data() {
    return {
      documents: [],
      documentDialog: false,
      deleteDocumentDialog: false,
      deleteDocumentsDialog: false,
      document: {},
      selectedDocuments: null,
      filters: {},
      submitted: false,
      documentsService: null
    };
  },
  created() {
    this.documentsService = new DocumentsApiService();
    this.documentsService.getAll().then((response) => {
      this.documents = response.data;
      console.log(this.documents);
      this.documents.forEach((document) => this.getDisplayableDocument(document));
      console.log(this.documents);
    });
    this.initFilters();
  },

  methods: {

    getDisplayableDocument(document) {
      return document;
    },

    getStorableDocument(displayableDocument) {
      return {
        id: displayableDocument.id,
        name: displayableDocument.name
      };
    },

    openNew() {
      this.document = {};
      this.submitted = false;
      this.documentDialog = true;
    },

    hideDialog() {
      this.documentDialog = false;
      this.submitted = false;
    },

    findIndexById(id) {
      console.log(`current id: ${id}`);
      return this.documents.findIndex((document) => document.id === id);
    },

    saveDocument() {
      this.submitted = true;
      if (this.document.name.trim()) {
        if (this.document.id) {
          console.log(this.document);
          this.document = this.getStorableDocument(this.document);
          this.documentsService.update(this.document.id, this.document)
              .then((response) => {
                console.log(response.data.id);
                this.documents[this.findIndexById(response.data.id)] =
                    this.getDisplayableDocument(response.data);
                this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Document Updated', life: 3000});
                console.log(response);
              });
        } else {
          this.document.id = 0;
          console.log(this.document);
          this.document = this.getStorableDocument(this.document);
          this.documentsService.create(this.document).then((response) => {
            this.document = this.getDisplayableDocument(response.data);
            this.documents.push(this.document);
            this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Document Created', life: 3000});
            console.log(response);
          });
        }
        this.documentDialog = false;
        this.document = {};
      }
    },

    editDocument(document) {
      console.log(document);
      this.document = {...document};
      console.log(this.document);
      this.documentDialog = true;
    },

    confirmDeleteDocument(document) {
      this.document = document;
      this.deleteDocumentDialog = true;
    },

    deleteDocument() {
      this.documentsService.delete(this.document.id).then((response) => {
        this.documents = this.documents.filter((t) => t.id !== this.document.id);
        this.deleteDocumentDialog = false;
        this.document = {};
        this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Document Deleted', life: 3000});
        console.log(response);
      });
    },

    exportToCSV() {
      this.$refs.dt.exportCSV();
    },

    confirmDeleteSelected() {
      this.deleteDocumentsDialog = true;
    },

    deleteSelectedDocuments() {
      this.selectedDocuments.forEach((document) => {
        this.documentsService.delete(document.id).then((response) => {
          this.documents = this.documents.filter((t) => t.id !== this.document.id);
          console.log(response);
        });
      });
      this.deleteDocumentsDialog = false;
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

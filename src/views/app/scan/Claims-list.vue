<template>
  <div>
    <Card noborder>
      <Modal
        title="Edit Claim"
        label=""
        labelClass="btn-small"
        ref="modal2"
        centered sizeClass="max-w-5xl"
      >
        <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <VueSelect v-if="!view" label="Appointment ID"
            ><vSelect :on-change="handleAppointmentChange(currentClaim.AppointmentID)" :options="allAppointments.map(a => a.AppointmentID)" v-model="currentClaim.AppointmentID"
          /></VueSelect>
          <Textinput
            v-else
            label="Appointment"
            type="text"
            :modelValue="currentClaim.AppointmentID"
            name="appointment"
            isReadonly="true"
          />
          <Textinput
            label="Account Holder"
            type="text"
            :modelValue="currentPatient.map(p => `${p.Firstnames} ${p.Surname}`)"
            placeholder="------"
            name="account_holder"
            :isReadonly="true"
          />
          <Textinput
            label="Dependant"
            type="text"
            :modelValue="currentDependant.map(p => `${p.FirstNames} ${p.Surname}`)"
            placeholder="-------"
            name="dependant"
            :isReadonly="true"
          />
          <Textinput
            label="Date Scheduled"
            type="text"
            :modelValue="allAppointments.filter(a => a.AppointmentID == currentClaim.AppointmentID).map(a => a.DateScheduled)[0]"
            placeholder="------"
            name="ds"
            :isReadonly="true"
          />
        </div>

        <VueSelect v-if="!view" label="Procedures"
          ><vSelect :options="allProcedures.map(a => a.Name)" v-model="currentClaim.Procedures" multiple
        /></VueSelect>
        <Textinput
          v-else
          label="Procedures"
          type="text"
          :modelValue="allProcedures.filter(p => currentClaim.procedures.map(p => p.ProcedureID).includes(p.ProcedureID)).map(p => p.Name)"
          placeholder="--------"
          name="procedures"
          :isReadonly="view"
        />

        <Textinput
          label="Notes"
          type="text"
          v-model="currentClaim.Notes"
          placeholder="-------"
          name="notes"
          :isReadonly="view"
        />

        <template v-if="!view" v-slot:footer>
          <Button
            text="Submit"
            btnClass="btn-dark "
            @click="updateClaim()"
          />
        </template>
        <template v-else v-slot:footer>
          <Button
            text="Close"
            btnClass="btn-dark "
            @click="$refs.modal2.closeModal()"
          />
        </template>
      </Modal>

      <div
        class="md:flex pb-6 md:space-y-0 space-y-3 justify-between items-center"
      >
        <h6>Claims List</h6>
        <InputGroup
          v-model="searchTerm"
          placeholder="Search"
          type="text"
          prependIcon="heroicons-outline:search"
          merged
        />
      </div>
      <vue-good-table
        class="-mx-6"
        :columns="columns"
        styleClass=" vgt-table  table-head   v-middle striped lesspadding2 listview"
        :rows="this.$store.state.claim.claims"
        :pagination-options="{
          enabled: true,
          perPage: perpage,
        }"
        :sort-options="{
          enabled: false,
        }"
        :search-options="{
          enabled: true,
          externalQuery: searchTerm,
        }"
      >
        <template v-slot:table-row="props">
          <span v-if="props.column.field == 'ClaimID'">
            <div class="flex space-x-3 items-center text-left">
              <div class="flex-none">
                <div
                  class="h-10 w-10 rounded-full text-sm bg-[#E0EAFF] dark:bg-slate-700 flex flex-col items-center justify-center font-medium -tracking-[1px]"
                >
                  CM
                </div>
              </div>
              <div
                class="flex-1 font-medium text-sm leading-4 whitespace-nowrap"
              >
                {{ props.row.ClaimID }}
              </div>
            </div>
          </span>
          <span
            v-if="props.column.field == 'AppointmentID'"
            class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
          >
            {{ props.row.AppointmentID }}
          </span>
          <div
            v-if="props.column.field == 'action'"
            class="action-btn text-end mr-3"
          >
            <Dropdown classMenuItems=" w-[140px]">
              <div class="text-xl">
                <Icon icon="heroicons-outline:dots-vertical" />
              </div>
              <template v-slot:menus>
                <MenuItem v-for="(item, i) in actions" :key="i">
                  <div
                    @click="item.doit(props.row)"
                    :class="`
                
                  ${
                    item.name === 'delete'
                      ? 'bg-danger-500 text-danger-500 bg-opacity-30  hover:bg-opacity-100 hover:text-white'
                      : 'hover:bg-slate-900 hover:text-white'
                  }
                   w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center `"
                  >
                    <span class="text-base"><Icon :icon="item.icon" /></span>
                    <span>{{ item.name }}</span>
                  </div>
                </MenuItem>
              </template>
            </Dropdown>
          </div>
        </template>
        <template #pagination-bottom="props">
          <div class="py-4 px-3 justify-center flex">
            <Pagination
              :total="$store.state.claim.claims.length"
              :current="current"
              :per-page="perpage"
              :pageRange="pageRange"
              @page-changed="current = $event"
              :pageChanged="props.pageChanged"
              :perPageChanged="props.perPageChanged"
            />
          </div>
        </template>
      </vue-good-table>
    </Card>
  </div>
</template>
<script>
import Card from '@/components/Card';
import Dropdown from '@/components/Dropdown';
import Icon from '@/components/Icon';
import Pagination from '@/components/Pagination';
import ProgressBar from '@/components/ProgressBar';
import Modal from '@/components/Modal/Modal';
import Textinput from "@/components/Textinput";
import Button from "@/components/Button";
import VueSelect from "@/components/Select/VueSelect";
import FromGroup from "@/components/FromGroup";
import InputGroup from "@/components/InputGroup";
import vSelect from "vue-select";
import { useToast } from "vue-toastification";
import { MenuItem } from '@headlessui/vue';
import { advancedTable } from '../../../constant/basic-tablle-data';
import { mapGetters } from 'vuex';

export default {
  components: {
    Pagination,
    Dropdown,
    Icon,
    MenuItem,
    Card,
    ProgressBar,
    Modal,
    Textinput,
    Button,
    VueSelect,
    FromGroup,
    vSelect,
    InputGroup
  },

  data() {
    return {
      advancedTable,
      current: 1,
      perpage: 10,
      pageRange: 10,
      view: false,
      currentClaim: {},
      currentPatient: {},
      currentDependant: {},
      searchTerm: "",
      actions: [
        {
          name: 'view',
          icon: 'heroicons:eye',
          doit: (data) => {
            data.Procedures = this.allProcedures.filter(p => data.procedures.map(pr => pr.ProcedureID).includes(p.ProcedureID)).map(p => p.Name)
            this.currentPatient = this.allPatients.filter(p => p.PatientID == this.allAppointments.filter(a => a.AppointmentID == data.AppointmentID).map(a => a.PatientID)[0]);
            this.currentDependant = this.allDependants.filter(p => p.DependantID == this.allAppointments.filter(a => a.AppointmentID == data.AppointmentID).map(a => a.DependantID)[0]);

            this.view = true;
            this.currentClaim = data;
            this.$refs.modal2.openModal();
          },
        },
        {
          name: 'edit',
          icon: 'heroicons:pencil-square',
          doit: (data) => {
            data.Procedures = this.allProcedures.filter(p => data.procedures.map(pr => pr.ProcedureID).includes(p.ProcedureID)).map(p => p.Name)
            this.currentPatient = this.allPatients.filter(p => p.PatientID == this.allAppointments.filter(a => a.AppointmentID == data.AppointmentID).map(a => a.PatientID)[0]);
            this.currentDependant = this.allDependants.filter(p => p.DependantID == this.allAppointments.filter(a => a.AppointmentID == data.AppointmentID).map(a => a.DependantID)[0]);

            this.view = false;
            this.currentClaim = data;
            this.$refs.modal2.openModal();
          },
        },
        {
          name: 'delete',
          icon: 'heroicons-outline:trash',
          doit: (data) => {
            const toast = useToast();
            this.$store.dispatch('deleteClaim', data)
            .then(response => {
              toast.success(response.data.message, {
                timeout: 2000,
              });    
            },
            error => {
              toast.error((error.response && error.response.data) ||
                    error.message ||
                    error.toString(), {
                  timeout: 2000,
                });   
            })
          },
        },
      ],

      columns: [
        {
          label: 'Claim Number',
          field: 'ClaimID',
        },

        {
          label: 'Appointment ID',
          field: 'AppointmentID',
        },

        {
          label: 'Action',
          field: 'action',
        },
      ],
    };
  },

  computed: {
    ...mapGetters([
      "activeData",
      "allClaims",
      "allAppointments",
      "allPatients",
      "allDependants",
      "allProcedures"
    ])
  },

  methods: {
    updateClaim(){
      const toast = useToast();
      this.currentClaim.procedures = this.allProcedures.filter(p => this.currentClaim.Procedures.includes(p.Name)).map(p => {ProcedureID: p.ProcedureID})
      this.$store.dispatch('updateClaim', this.currentClaim)
      .then(response => {
        this.$refs.modal2.closeModal();
        toast.success(response.data.message, {
          timeout: 2000,
        });    
      },
      error => {
        this.$refs.modal2.closeModal();
        toast.error((error.response && error.response.data) ||
              error.data.message ||
              error.toString(), {
            timeout: 2000,
          });   
      })
    },

    handleAppointmentChange(AppointmentID) {
      this.currentPatient = this.allPatients.filter(p => p.PatientID == this.allAppointments.filter(a => a.AppointmentID == AppointmentID).map(a => a.PatientID)[0]);
      this.currentDependant = this.allDependants.filter(p => p.DependantID == this.allAppointments.filter(a => a.AppointmentID == AppointmentID).map(a => a.DependantID)[0]);
    }
  },

  mounted(){
    this.$emitter.on('search', () => {
      this.searchTerm = this.activeData.searchTerm
    })
  }
};
</script>
<style lang="scss">
.listview {
  th {
    @apply last:text-end;
  }
}
</style>

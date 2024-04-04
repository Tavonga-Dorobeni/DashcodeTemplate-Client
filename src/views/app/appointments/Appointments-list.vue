<template>
  <div>
    <Card noborder>
      <Modal
        title="Edit Appointment"
        label=""
        labelClass="btn-small"
        ref="modal2"
        centered sizeClass="max-w-5xl"
      >
        <h5 class="pb-5">Appointment Details</h5>
        <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <FromGroup v-if="!view" label="Date Scheduled" name="d1">
            <flat-pickr
              v-model="currentAppointment.DateScheduled"
              class="form-control"
              id="d1"
              placeholder="yyyy, dd M"
            />
          </FromGroup>
          <Textinput
            v-else
            label="Date Scheduled"
            type="text"
            v-model="currentAppointment.DateScheduled"
            placeholder="Enter Date Scheduled"
            name="date_scheduled"
            isReadonly="true"
          />
          <VueSelect v-if="!view" label="Attending Doctor"
            ><vSelect :options="allUsers.map(u => `${u.firstname} ${u.lastname}`)" v-model="currentAppointment.Doctor"
          /></VueSelect>
          <Textinput
            v-else
            label="Attending Doctor"
            type="text"
            :modelValue="allUsers.filter(u => u.id == currentAppointment.AttendingDoctor).map(p => `${p.firstname.charAt(0)}. ${p.lastname}`)[0]"
            name="doc"
            isReadonly="true"
          />
        </div>
        <Textinput
          label="Notes"
          type="text"
          v-model="currentAppointment.Notes"
          placeholder="Enter Notes"
          name="notes"
          :isReadonly="view"
        />
        <h5 class="pb-5">Patient Details</h5>
        <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <VueSelect v-if="!view" label="Account Holder"
            ><vSelect @change="handlePatientChange(currentAppointment.Patient)" :options="allPatients.map(p => `${p.Firstnames} ${p.Surname} -${p.MembershipNo}`)" v-model="currentAppointment.Patient"
          /></VueSelect>
          <Textinput
            v-else
            label="Account Holder"
            type="text"
            :modelValue="allPatients.filter(p => p.PatientID == currentAppointment.PatientID).map(p => `${p.Firstnames.charAt(0)}. ${p.Surname}`)[0]"
            name="acc_holder"
            isReadonly="true"
          />
          <VueSelect v-if="!view" label="Dependant"
            ><vSelect @change="handleDependantChange(currentAppointment.Dependant)" :options="allDependants.filter(d => d.PatientID == currentAppointment.PatientID).map(p => `${p.FirstNames} ${p.Surname}`)" v-model="currentAppointment.Dependant"
          /></VueSelect>
          <Textinput
            v-else
            label="Dependant"
            type="text"
            :modelValue="allDependants.filter(d => d.DependantID == currentAppointment.DependantID).map(p => `${p.FirstNames.charAt(0)}. ${p.Surname}`)[0]"
            name="dependant"
            isReadonly="true"
          />
        </div>

        <div v-if="currentAppointment.PatientID && !currentAppointment.DependantID" class="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <Textinput
            label="Membership Number"
            type="text"
            v-model="patient.MembershipNo"
            placeholder="Enter Membership Number"
            name="membership_number"
            isReadonly="true"
          />
          <Textinput
            label="Title"
            type="text"
            v-model="patient.Title"
            placeholder="Enter Title"
            name="title"
            isReadonly="true"
          />
          <Textinput
            label="Insurance Plan"
            type="text"
            v-model="patient.Plan"
            placeholder="Enter Insurance Plan"
            name="plan"
            isReadonly="true"
          />
          <Textinput
            label="Gender"
            type="text"
            v-model="patient.Gender"
            placeholder="Enter Gender"
            name="gender"
            isReadonly="true"
          />
          <Textinput
            label="Marital Status"
            type="text"
            v-model="patient.MaritalStatus"
            placeholder="Enter Marital Status"
            name="marital_status"
            isReadonly="true"
          />
          <Textinput
            label="Firstnames"
            type="text"
            v-model="patient.Firstnames"
            placeholder="Enter Firtsnames"
            name="firstnames"
            isReadonly="true"
          />
          <Textinput
            label="Surname"
            type="text"
            v-model="patient.Surname"
            placeholder="Enter Surname"
            name="surname"
            isReadonly="true"
          />
          <Textinput
            label="DOB"
            type="text"
            v-model="patient.DOB"
            placeholder="DOB"
            name="dob"
            isReadonly="true"
          />
          <Textinput
            label="ID Number"
            type="text"
            v-model="patient.IDNumber"
            placeholder="Enter ID Number"
            name="id"
            isReadonly="true"
          />
          <Textinput
            label="Email"
            type="text"
            v-model="patient.Email"
            placeholder="Enter Email"
            name="email"
            isReadonly="true"
          />
          <Textinput
            label="Cell Number"
            type="text"
            v-model="patient.CellNumber"
            placeholder="Enter Cell Number"
            name="cell"
            isReadonly="true"
          />
          <Textinput
            label="Physical Adress"
            type="text"
            v-model="patient.PhysicalAddress"
            placeholder="Enter Physical Address"
            name="physical_add"
            isReadonly="true"
          />
          <Textinput
            label="Postal Address"
            type="text"
            v-model="patient.PostalAddress"
            placeholder="Enter Postal Address"
            name="postal_add"
            isReadonly="true"
          />
        </div>

        <div v-else class="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <Textinput
            label="FirstNames"
            type="text"
            v-model="dependant.FirstNames"
            placeholder="Enter Firtsnames"
            name="firstnames"
            isReadonly="true"
          />
          <Textinput
            label="Surname"
            type="text"
            v-model="dependant.Surname"
            placeholder="Enter Surname"
            name="surname"
            isReadonly="true"
          />
          <FromGroup label="DOB" name="d1">
            <flat-pickr
              v-model="dependant.DOB"
              class="form-control"
              id="d1"
              placeholder="yyyy, dd M"
              isReadonly="true"
            />
          </FromGroup>
          <Textinput
            label="Gender"
            type="text"
            v-model="dependant.Gender"
            placeholder="Enter Gender"
            name="id"
            isReadonly="true"
          />
          <Textinput
            label="ID Number"
            type="text"
            v-model="dependant.IDNumber"
            placeholder="Enter ID Number"
            name="id"
            isReadonly="true"
          />
          <Textinput
            label="Relationship"
            type="text"
            v-model="dependant.Relationship"
            placeholder="Enter Relationship with Account Holder"
            name="relationship"
            isReadonly="true"
          />
        </div>

        <h5 class="pt-5">Medical History</h5>

        <div v-if="currentAppointment.PatientID && !currentAppointment.DependantID" class="grid lg:grid-cols-3 grid-cols-1 gap-5 pt-5">
          <Checkbox v-model="patient.Diabetes" :checked="patient.Diabetes" label="Diabetes" disabled />
          <Checkbox v-model="patient.Hypertension" :checked="patient.Hypertension" label="Hypertension" disabled />
          <Checkbox v-model="patient.Arthritis" :checked="patient.Arthritis" label="Arthritis" disabled />
          <Checkbox v-model="patient.Asthma" :checked="patient.Asthma" label="Asthma" disabled />
          <Checkbox v-model="patient.BoneProblems" :checked="patient.BoneProblems" label="BoneProblems" disabled />
          <Checkbox v-model="patient.HeartProblems" :checked="patient.HeartProblems" label="HeartProblems" disabled />
          <Checkbox v-model="patient.Cancer" :checked="patient.Cancer" label="Cancer" disabled />
          <Checkbox v-model="patient.RenalOrKidneyDisease" :checked="patient.RenalOrKidneyDisease" label="RenalOrKidneyDisease" disabled />
          <Checkbox v-model="patient.AbdominalProblems" :checked="patient.AbdominalProblems" label="AbdominalProblems" disabled />
          <Checkbox v-model="patient.Orthodontics" :checked="patient.Orthodontics" label="Orthodontics" disabled />
        </div>

        <div v-else class="grid lg:grid-cols-3 grid-cols-1 gap-5 pt-5">
          <Checkbox v-model="dependant.Diabetes" :checked="dependant.Diabetes" label="Diabetes" disabled />
          <Checkbox v-model="dependant.Hypertension" :checked="dependant.Hypertension" label="Hypertension" disabled />
          <Checkbox v-model="dependant.Arthritis" :checked="dependant.Arthritis" label="Arthritis" disabled />
          <Checkbox v-model="dependant.Asthma" :checked="dependant.Asthma" label="Asthma" disabled />
          <Checkbox v-model="dependant.BoneProblems" :checked="dependant.BoneProblems" label="BoneProblems" disabled />
          <Checkbox v-model="dependant.HeartProblems" :checked="dependant.HeartProblems" label="HeartProblems" disabled />
          <Checkbox v-model="dependant.Cancer" :checked="dependant.Cancer" label="Cancer" disabled />
          <Checkbox v-model="dependant.RenalOrKidneyDisease" :checked="dependant.RenalOrKidneyDisease" label="RenalOrKidneyDisease" disabled />
          <Checkbox v-model="dependant.AbdominalProblems" :checked="dependant.AbdominalProblems" label="AbdominalProblems" disabled />
          <Checkbox v-model="dependant.Orthodontics" :checked="dependant.Orthodontics" label="Orthodontics" disabled />
        </div>

        <template v-if="!view" v-slot:footer>
          <Button
            text="Submit"
            btnClass="btn-dark "
            @click="updateAppointment()"
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
        <h6>Appointments List</h6>
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
        :rows="this.$store.state.appointment.appointments"
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
          <span v-if="props.column.field == 'AppointmentID'">
            <div class="flex space-x-3 items-center text-left">
              <div class="flex-none">
                <div
                  class="h-10 w-10 rounded-full text-sm bg-[#E0EAFF] dark:bg-slate-700 flex flex-col items-center justify-center font-medium -tracking-[1px]"
                >
                  AP
                </div>
              </div>
              <span
                class="inline-block text-center space-x-1 bg-success-500 bg-opacity-[0.16] min-w-[110px] text-success-500 text-xs font-normal px-2 py-1 rounded-full"
              >
                {{ props.row.AppointmentID }}
              </span>
            </div>
          </span>

          <span
            v-if="props.column.field == 'PatientID'"
            class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
          >
            {{ allPatients.filter(p => p.PatientID == props.row.PatientID).map(p => p.Firstnames + " " + p.Surname)[0] }}
          </span>
          <span
            v-if="props.column.field == 'AttendingDoctor'"
            class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
          >
            {{ allUsers.filter(u => u.id == props.row.AttendingDoctor).map(u => u.firstname + " " + u.lastname)[0] }}
          </span>
          <span
            v-if="props.column.field == 'DateScheduled'"
            class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
          >
            {{ props.row.DateScheduled}}
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
              :total="$store.state.appointment.appointments.length"
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
import Checkbox from "@/components/Checkbox";
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
    InputGroup,
    Checkbox
  },

  data() {
    return {
      advancedTable,
      current: 1,
      perpage: 10,
      pageRange: 10,
      view: false,
      currentAppointment: {},
      patient: {},
      dependant: {},
      searchTerm: "",
      gender: ["Male", "Female"],
      actions: [
        {
          name: 'view',
          icon: 'heroicons:eye',
          doit: (data) => {
            data.Patient = this.allPatients.filter(s => s.PatientID == data.PatientID).map(p => `${p.Firstnames} ${p.Surname} -${p.MembershipNo}`)[0]
            data.Dependant = this.allDependants.filter(s => s.DependantID == data.DependantID).map(p => `${p.FirstNames} ${p.Surname}`)[0]
            
            this.patient = this.allPatients.filter(s => s.PatientID == data.PatientID)[0]
            this.dependant = this.allDependants.filter(s => s.DependantID == data.DependantID)[0]

            this.view = true;
            this.currentAppointment = data;
            this.$refs.modal2.openModal();
          },
        },
        {
          name: 'edit',
          icon: 'heroicons:pencil-square',
          doit: (data) => {
            data.Patient = this.allPatients.filter(s => s.PatientID == data.PatientID).map(p => `${p.Firstnames} ${p.Surname} -${p.MembershipNo}`)[0]
            data.Dependant = this.allDependants.filter(s => s.DependantID == data.DependantID).map(p => `${p.FirstNames} ${p.Surname}`)[0]
            
            this.patient = this.allPatients.filter(s => s.PatientID == data.PatientID)[0]
            this.dependant = this.allDependants.filter(s => s.DependantID == data.DependantID)[0]

            this.view = false;
            this.currentAppointment = data;
            this.$refs.modal2.openModal();
          },
        },
        // {
        //   name: 'calibrate',
        //   icon: 'heroicons-outline:wrench',
        //   doit: (data) => {
        //     this.$store.commit('setActiveData', data);
        //     this.$router.push({ name: 'calibration' });
        //   },
        // },
        {
          name: 'delete',
          icon: 'heroicons-outline:trash',
          doit: (data) => {
            const toast = useToast();
            this.$store.dispatch('deleteAppointment', data)
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
          label: 'Appointment No.',
          field: 'AppointmentID',
        },

        {
          label: 'Account Holder',
          field: 'PatientID',
        },

        {
          label: 'Dependant',
          field: 'DependantID',
        },
        {
          label: 'Date Scheduled',
          field: 'DateScheduled',
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
      "allAppointments",
      "allPatients",
      "allDependants",
      "allUsers"
    ])
  },

  methods: {
    updateAppointment(){
      const toast = useToast();
      this.currentAppointment.PatientID = this.allPatients.filter(p => p.MembershipNo == this.currentAppointment.Patient.split("-")[1]).map(p => p.PatientID)[0]
      this.currentAppointment.DependantID = this.currentAppointment.Dependant ? this.allDependants.filter(p => p.FirstNames == this.currentAppointment.Dependant.split(" ")[0] && p.Surname == this.currentAppointment.Dependant.split(" ")[1]).map(p => p.DependantID)[0] : 0
      this.currentAppointment.AttendingDoctor =this.allUsers.filter(p => p.firstname == this.currentAppointment.Doctor.split(" ")[0] && p.lastname == this.currentAppointment.Doctor.split(" ")[1]).map(p => p.id)[0]
      this.$store.dispatch('updateAppointment', this.currentAppointment)
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
    handlePatientChange(Patient) {
      this.patient = this.allPatients.filter(p => p.MembershipNo == Patient.split("-")[1])[0]
      this.dependant = {}
    },
    handleDependantChange(Dependant) {
      this.dependant = this.allDependants.filter(p => p.FirstNames == Dependant.split(" ")[0] && p.Surname == Dependant.split(" ")[1])[0]
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

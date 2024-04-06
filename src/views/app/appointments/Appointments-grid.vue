<template>
  <div class="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
    <Card bodyClass="p-6" v-for="(item, i) in appointments" :key="i">
      <!-- header -->
      <header class="flex justify-between items-end">
        <div class="flex space-x-4 items-center">
          <div class="flex-none">
            <div
              class="h-10 w-10 rounded-md text-lg bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-200 flex flex-col items-center justify-center font-normal capitalize"
            >
              AP
            </div>
          </div>
          <div class="font-medium text-base leading-6">
            <div
              class="dark:text-slate-200 text-slate-900 max-w-[160px] truncate"
            >
              Appointment
            </div>
          </div>
        </div>
        <div v-if="!currentUser.roles.includes('PATIENT')">
          <Dropdown classMenuItems=" w-[130px]">
            <span
              class="text-lg inline-flex flex-col items-center justify-center h-8 w-8 rounded-full bg-gray-500-f7 dark:bg-slate-900 dark:text-slate-400"
              ><Icon icon="heroicons-outline:dots-vertical"
            /></span>
            <template v-slot:menus>
              <MenuItem v-for="(mneu, i) in actions" :key="i">
                <div
                  @click="mneu.doit(item)"
                  :class="`
                
                  ${'hover:bg-slate-900 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 hover:text-white'}
                   w-full border-b border-b-gray-500 border-opacity-10   px-4 py-2 text-sm dark:text-slate-300  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center  capitalize `"
                >
                  <span class="text-base"><Icon :icon="mneu.icon" /></span>
                  <span>{{ mneu.name }}</span>
                </div>
              </MenuItem>
            </template>
          </Dropdown>
        </div>
      </header>
      <!-- description -->
      <div class="text-slate-600 dark:text-slate-400 text-sm pt-4">
        <b>{{ item.AppointmentID }}</b>
      </div>
      <div class="text-slate-600 dark:text-slate-400 text-sm pt-4 pb-3">
        <b>Account Holder: </b> {{ patients.filter(p => p.PatientID == item.PatientID).map(p => p.Firstnames + " " + p.Surname)[0] }} <br/>
        <b>Dependant: </b> {{ dependants.filter(d => d.DependantID == item.DependantID).map(d => d.FirstNames + " " + d.Surname)[0] }} <br/>
      </div>
      <!--  date -->
      <div class="flex space-x-4">
        <!-- start date -->
        <div>
          <span class="block date-label">Date Created</span>
          <span class="block date-text">{{ item.createdAt }}</span>
        </div>
        <!-- end date -->
        <div>
          <span class="block date-label">Date Scheduled</span>
          <span class="block date-text">{{ item.DateScheduled }}</span>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4 mt-3">
        <div
          class="text-slate-400 dark:text-slate-400 text-sm font-normal"
        >
          Attending Doctor:
        </div>
        <div class="text-right">
          <span
            class="inline-block text-center space-x-1 bg-success-500 bg-opacity-[0.16] min-w-[110px] text-success-500 text-xs font-normal px-2 py-1 rounded-full"
          >
            {{ users.filter(u => u.id == item.AttendingDoctor).map(p => p.firstname.charAt(0) + ". " + p.lastname)[0]}}
          </span>
        </div>
      </div>
    </Card>
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
          ><vSelect :options="users.map(u => `${u.firstname} ${u.lastname}`)" v-model="currentAppointment.Doctor"
        /></VueSelect>
        <Textinput
          v-else
          label="Attending Doctor"
          type="text"
          :modelValue="users.filter(u => u.id == currentAppointment.AttendingDoctor).map(p => `${p.firstname.charAt(0)}. ${p.lastname}`)[0]"
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
        <VueSelect v-if="!view" label="Account Holder Membership No"
          ><vSelect @change="handlePatientChange(currentAppointment.MembershipNo)" :options="patients.map(p => p.MembershipNo)" v-model="currentAppointment.MembershipNo"
        /></VueSelect>
        <Textinput
          v-else
          label="Account Holder"
          type="text"
          :modelValue="patients.filter(p => p.PatientID == currentAppointment.PatientID).map(p => `${p.Firstnames.charAt(0)}. ${p.Surname} - ${p.MembershipNo}`)[0]"
          name="acc_holder"
          placeholder="-----"
          isReadonly="true"
        />
        <VueSelect v-if="!view" label="Dependant"
          ><vSelect @change="handleDependantChange(currentAppointment.Dependant)" :options="patient_dependants.map(p => `${p.FirstNames} ${p.Surname}`)" v-model="currentAppointment.Dependant"
        /></VueSelect>
        <Textinput
          v-else
          label="Dependant"
          type="text"
          :modelValue="dependants.filter(d => d.DependantID == currentAppointment.DependantID).map(p => `${p.FirstNames.charAt(0)}. ${p.Surname}`)[0]"
          name="dependant"
          isReadonly="true"
        />
      </div>
      <div v-if="view? currentAppointment.DependantID == 0 : currentAppointment.MembershipNo && !currentAppointment.Dependant" class="grid lg:grid-cols-2 grid-cols-1 gap-5">
        <Textinput
          label="Title"
          type="text"
          v-model="patient.value.Title"
          placeholder="Enter Title"
          name="title"
          isReadonly="true"
        />
        <Textinput
          label="Insurance Plan"
          type="text"
          v-model="patient.value.Plan"
          placeholder="Enter Insurance Plan"
          name="plan"
          isReadonly="true"
        />
        <Textinput
          label="Gender"
          type="text"
          v-model="patient.value.Gender"
          placeholder="Enter Gender"
          name="gender"
          isReadonly="true"
        />
        <Textinput
          label="Marital Status"
          type="text"
          v-model="patient.value.MaritalStatus"
          placeholder="Enter Marital Status"
          name="marital_status"
          isReadonly="true"
        />
        <Textinput
          label="Firstnames"
          type="text"
          v-model="patient.value.Firstnames"
          placeholder="Enter Firtsnames"
          name="firstnames"
          isReadonly="true"
        />
        <Textinput
          label="Surname"
          type="text"
          v-model="patient.value.Surname"
          placeholder="Enter Surname"
          name="surname"
          isReadonly="true"
        />
        <Textinput
          label="DOB"
          type="text"
          v-model="patient.value.DOB"
          placeholder="DOB"
          name="dob"
          isReadonly="true"
        />
        <Textinput
          label="ID Number"
          type="text"
          v-model="patient.value.IDNumber"
          placeholder="Enter ID Number"
          name="id"
          isReadonly="true"
        />
        <Textinput
          label="Email"
          type="text"
          v-model="patient.value.Email"
          placeholder="Enter Email"
          name="email"
          isReadonly="true"
        />
        <Textinput
          label="Cell Number"
          type="text"
          v-model="patient.value.CellNumber"
          placeholder="Enter Cell Number"
          name="cell"
          isReadonly="true"
        />
        <Textinput
          label="Physical Adress"
          type="text"
          v-model="patient.value.PhysicalAddress"
          placeholder="Enter Physical Address"
          name="physical_add"
          isReadonly="true"
        />
        <Textinput
          label="Postal Address"
          type="text"
          v-model="patient.value.PostalAddress"
          placeholder="Enter Postal Address"
          name="postal_add"
          isReadonly="true"
        />
      </div>

      <div v-else class="grid lg:grid-cols-2 grid-cols-1 gap-5">
        <Textinput
          label="FirstNames"
          type="text"
          v-model="dependant.value.FirstNames"
          placeholder="Enter Firtsnames"
          name="firstnames"
          isReadonly="true"
        />
        <Textinput
          label="Surname"
          type="text"
          v-model="dependant.value.Surname"
          placeholder="Enter Surname"
          name="surname"
          isReadonly="true"
        />
        <Textinput
          label="DOB"
          type="text"
          v-model="dependant.value.DOB"
          placeholder="Enter DOB"
          name="dob"
          isReadonly="true"
        />
        <Textinput
          label="Gender"
          type="text"
          v-model="dependant.value.Gender"
          placeholder="Enter Gender"
          name="id"
          isReadonly="true"
        />
        <Textinput
          label="ID Number"
          type="text"
          v-model="dependant.value.IDNumber"
          placeholder="Enter ID Number"
          name="id"
          isReadonly="true"
        />
        <Textinput
          label="Relationship"
          type="text"
          v-model="dependant.value.Relationship"
          placeholder="Enter Relationship with Account Holder"
          name="relationship"
          isReadonly="true"
        />
      </div>

      <h5 class="pt-5">Medical History</h5>

      <div v-if="view? patient.value && currentAppointment.DependantID == 0 : patient.value && currentAppointment.MembershipNo && !currentAppointment.Dependant" class="grid lg:grid-cols-3 grid-cols-1 gap-5 pt-5">
        <Checkbox :checked="patient.value?.Diabetes" label="Diabetes" disabled />
        <Checkbox :checked="patient.value?.Hypertension" label="Hypertension" disabled />
        <Checkbox :checked="patient.value?.Arthritis" label="Arthritis" disabled />
        <Checkbox :checked="patient.value?.Asthma" label="Asthma" disabled />
        <Checkbox :checked="patient.value?.BoneProblems" label="BoneProblems" disabled />
        <Checkbox :checked="patient.value?.HeartProblems" label="HeartProblems" disabled />
        <Checkbox :checked="patient.value?.Cancer" label="Cancer" disabled />
        <Checkbox :checked="patient.value?.RenalOrKidneyDisease" label="RenalOrKidneyDisease" disabled />
        <Checkbox :checked="patient.value?.AbdominalProblems" label="AbdominalProblems" disabled />
        <Checkbox :checked="patient.value?.Orthodontics" label="Orthodontics" disabled />
      </div>

      <div v-if="view? dependant.value && currentAppointment.DependantID > 0 : dependant.value && currentAppointment.Dependant" class="grid lg:grid-cols-3 grid-cols-1 gap-5 pt-5">
        <Checkbox :checked="dependant.value?.Diabetes" label="Diabetes" disabled />
        <Checkbox :checked="dependant.value?.Hypertension" label="Hypertension" disabled />
        <Checkbox :checked="dependant.value?.Arthritis" label="Arthritis" disabled />
        <Checkbox :checked="dependant.value?.Asthma" label="Asthma" disabled />
        <Checkbox :checked="dependant.value?.BoneProblems" label="BoneProblems" disabled />
        <Checkbox :checked="dependant.value?.HeartProblems" label="HeartProblems" disabled />
        <Checkbox :checked="dependant.value?.Cancer" label="Cancer" disabled />
        <Checkbox :checked="dependant.value?.RenalOrKidneyDisease" label="RenalOrKidneyDisease" disabled />
        <Checkbox :checked="dependant.value?.AbdominalProblems" label="AbdominalProblems" disabled />
        <Checkbox :checked="dependant.value?.Orthodontics" label="Orthodontics" disabled />
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
  </div>
</template>
<script setup>
import Card from '@/components/Card';
import Dropdown from '@/components/Dropdown';
import Icon from '@/components/Icon';
import Modal from '@/components/Modal/Modal';
import Textinput from "@/components/Textinput";
import Button from "@/components/Button";
import VueSelect from "@/components/Select/VueSelect";
import FromGroup from "@/components/FromGroup";
import Checkbox from "@/components/Checkbox";
import vSelect from "vue-select";
import { useToast } from "vue-toastification";
import { MenuItem } from '@headlessui/vue';
import { computed, ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
const store = useStore();
const router = useRouter();

const currentUser = computed(() => store.state.auth.user);
const Patient = computed(() => store.getters.allPatients.filter(p => p.Firstnames == currentUser.value.firstname && p.Surname == currentUser.value.lastname)[0]);
const appointments = computed(() => currentUser.value.roles.includes('PATIENT') ? store.getters.allAppointments.filter(a => a.PatientID == Patient.value.PatientID) : store.getters.allAppointments);
const patients = computed(() => store.getters.allPatients);
const dependants = computed(() => store.getters.allDependants);
const users = computed(() => store.getters.allUsers);
const patient_dependants = computed(() => store.getters.allDependants.filter(d => d.PatientID == currentPatientID.value?.PatientID));

let patient = reactive({});
let dependant = reactive({});
let currentPatientID = reactive({});

let view = ref(false);
let currentAppointment = ref({});
const modal2 = ref(null)

const totalDate = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffDays = endDate.getDate() - startDate.getDate();
  return diffDays;
};

const actions = ref([
  {
    name: 'view',
    icon: 'heroicons:eye',
    doit: (data) => {
      data.MembershipNo = store.getters.allPatients.filter(s => s.PatientID == data.PatientID).map(p => p.MembershipNo)[0]
      data.Dependant = store.getters.allDependants.filter(s => s.DependantID == data.DependantID).map(p => `${p.FirstNames} ${p.Surname}`)[0]
      
      patient.value = store.getters.allPatients.filter(s => s.PatientID == data.PatientID)[0]
      dependant.value = store.getters.allDependants.filter(s => s.DependantID == data.DependantID)[0]
      currentPatientID.value = store.getters.allPatients.filter(p => p.MembershipNo == data.MembershipNo)[0]

      view.value = true;
      currentAppointment.value = data;
      modal2.value.openModal();
    },
  },
  {
    name: 'Edit',
    icon: 'heroicons-outline:pencil-alt',
    doit: (data) => {
      data.MembershipNo = store.getters.allPatients.filter(s => s.PatientID == data.PatientID).map(p => p.MembershipNo)[0]
      data.Dependant = store.getters.allDependants.filter(s => s.DependantID == data.DependantID).map(p => `${p.FirstNames} ${p.Surname}`)[0]
      
      patient.value = store.getters.allPatients.filter(s => s.PatientID == data.PatientID)[0]
      dependant.value = store.getters.allDependants.filter(s => s.DependantID == data.DependantID)[0]
      currentPatientID.value = store.getters.allPatients.filter(p => p.MembershipNo == data.MembershipNo)[0]
      
      view.value = false;
      currentAppointment.value = data;
      modal2.value.openModal();
    },
  },
  // {
  //   name: 'Calibrate',
  //   icon: 'heroicons-outline:wrench',
  //   doit: (data) => {
  //     store.commit('setActiveData', data);
  //     router.push({ name: 'calibration' });
  //   },
  // },
  {
    name: 'Delete',
    icon: 'heroicons-outline:trash',
    doit: (data) => {
      const toast = useToast();
      store.dispatch('deleteAppointment', data)
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
]);

const updateAppointment = () => {
  const toast = useToast();
  currentAppointment.value.PatientID = currentPatientID.value.PatientID
  currentAppointment.value.DependantID = currentAppointment.value.Dependant ? dependants.value.filter(d => currentAppointment.value.Dependant?.includes(d.FirstNames) && currentAppointment.value.Dependant?.includes(d.Surname)).map(p => p.DependantID)[0] : 0
  currentAppointment.value.AttendingDoctor = users.value.filter(u => currentAppointment.value.Doctor?.includes(u.firstname) && currentAppointment.value.Doctor?.includes(u.lastname)).map(u => u.id)[0]
  store.dispatch('updateAppointment', currentAppointment.value)
  .then(response => {
    modal2.value.closeModal();
    toast.success(response.data.message, {
      timeout: 2000,
    });    
  },
  error => {
    modal2.value.closeModal();
    toast.error((error.response && error.response.data) ||
        error.data.message ||
        error.toString(), {
      timeout: 2000,
    });   
  })
}

const handlePatientChange = (MembershipNo) => {
  currentPatientID.value = patients.value.filter(p => p.MembershipNo == MembershipNo)[0]
  patient.value = patients.value.filter(p => p.MembershipNo == MembershipNo)[0]
  dependant.value = {}
}
const handleDependantChange = (Dependant) => {
  dependant.value = dependants.value.filter(d => Dependant?.includes(d.FirstNames) && Dependant?.includes(d.Surname))[0]
}
</script>
<style lang="scss" scoped>
.date-label {
  @apply text-xs text-slate-400 dark:text-slate-400 mb-1;
}
.date-text {
  @apply text-xs text-slate-600 dark:text-slate-300 font-medium;
}
</style>

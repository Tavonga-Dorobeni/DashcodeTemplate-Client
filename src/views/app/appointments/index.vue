<template>
  <div>
    <div class="flex flex-wrap justify-between items-center mb-4">
      <Breadcrumb />

      <div
        class="md:flex md:space-x-4 md:justify-end items-center"
        :class="width < 768 ? 'space-x-rb' : ''"
      >
        <Button
          icon="heroicons:list-bullet"
          text="List view"
          :btnClass="`${
            fillter === 'list'
              ? 'bg-slate-900 dark:bg-slate-700  text-white'
              : ' bg-white dark:bg-slate-800 dark:text-slate-300'
          }   h-min text-sm font-normal`"
          iconClass=" text-lg"
          @click="fillter = 'list'"
          :isLoading="isSkeletion2"
          :isDisabled="isSkeletion"
        />
        <Button
          icon="heroicons-outline:view-grid"
          text="Grid view"
          :btnClass="`${
            fillter === 'grid'
              ? 'bg-slate-900 dark:bg-slate-700 text-white'
              : ' bg-white dark:bg-slate-800 dark:text-slate-300'
          }   h-min text-sm font-normal`"
          iconClass=" text-lg"
          @click="fillter = 'grid'"
          :isLoading="isSkeletion"
          :isDisabled="isSkeletion2"
        />
        <Modal
          title="New Appointment"
          label="➕ Add Appointment"
          labelClass="btn-dark dark:bg-green-800  h-min text-sm font-normal"
          ref="modal2"
          centered sizeClass="max-w-5xl"
        >
          <form class="space-y-4">
            <h5 class="pb-5">Appointment Details</h5>
            <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
              <FromGroup label="Date Scheduled" name="d1">
                <flat-pickr
                  v-model="appointment.DateScheduled"
                  class="form-control"
                  id="d1"
                  placeholder="yyyy, dd M"
                />
              </FromGroup>
              <VueSelect label="Attending Doctor"
                ><vSelect :options="users.map(u => `${u.firstname} ${u.lastname}`)" v-model="appointment.Doctor"
              /></VueSelect>
            </div>
            <Textinput
              label="Notes"
              type="text"
              v-model="appointment.Notes"
              placeholder="Enter Notes"
              name="notes"
            />
            <h5 class="pb-5">Patient Details</h5>
            <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
              <!-- <Textinput
                label="Account Holder Membership Number"
                type="text"
                v-model="appointment.MembershipNo"
                placeholder="Enter Membership Number"
                name="acc_membership_number"
                
              /> -->
              <VueSelect label="Account Holder Membership No." 
                ><vSelect :on-change="handlePatientChange(appointment.MembershipNo)" :options="patients.map(p => p.MembershipNo)" v-model="appointment.MembershipNo"
              /></VueSelect>
              <VueSelect label="Dependant"
                ><vSelect :on-change="handleDependantChange(appointment.Dependant)" :options="patient_dependants.map(p => `${p.FirstNames} ${p.Surname}`)" v-model="appointment.Dependant"
              /></VueSelect>
            </div>
            <div v-if="appointment.MembershipNo && !appointment.Dependant" class="grid lg:grid-cols-2 grid-cols-1 gap-5">
              <Textinput
                label="Title"
                type="text"
                :modelValue="patient.value?.Title"
                placeholder="Enter Title"
                name="title"
                isReadonly="true"
              />
              <Textinput
                label="Insurance Plan"
                type="text"
                :modelValue="patient.value?.Plan"
                placeholder="Enter Insurance Plan"
                name="plan"
                isReadonly="true"
              />
              <Textinput
                label="Gender"
                type="text"
                :modelValue="patient.value?.Gender"
                placeholder="Enter Gender"
                name="gender"
                isReadonly="true"
              />
              <Textinput
                label="Marital Status"
                type="text"
                :modelValue="patient.value?.MaritalStatus"
                placeholder="Enter Marital Status"
                name="marital_status"
                isReadonly="true"
              />
              <Textinput
                label="Firstnames"
                type="text"
                :modelValue="patient.value?.Firstnames"
                placeholder="Enter Firtsnames"
                name="firstnames"
                isReadonly="true"
              />
              <Textinput
                label="Surname"
                type="text"
                :modelValue="patient.value?.Surname"
                placeholder="Enter Surname"
                name="surname"
                isReadonly="true"
              />
              <Textinput
                label="DOB"
                type="text"
                :modelValue="patient.value?.DOB"
                placeholder="DOB"
                name="dob"
                isReadonly="true"
              />
              <Textinput
                label="ID Number"
                type="text"
                :modelValue="patient.value?.IDNumber"
                placeholder="Enter ID Number"
                name="id"
                isReadonly="true"
              />
              <Textinput
                label="Email"
                type="text"
                :modelValue="patient.value?.Email"
                placeholder="Enter Email"
                name="email"
                isReadonly="true"
              />
              <Textinput
                label="Cell Number"
                type="text"
                :modelValue="patient.value?.CellNumber"
                placeholder="Enter Cell Number"
                name="cell"
                isReadonly="true"
              />
              <Textinput
                label="Physical Adress"
                type="text"
                :modelValue="patient.value?.PhysicalAddress"
                placeholder="Enter Physical Address"
                name="physical_add"
                isReadonly="true"
              />
              <Textinput
                label="Postal Address"
                type="text"
                :modelValue="patient.value?.PostalAddress"
                placeholder="Enter Postal Address"
                name="postal_add"
                isReadonly="true"
              />
            </div>

            <div v-else class="grid lg:grid-cols-2 grid-cols-1 gap-5">
              <Textinput
                label="FirstNames"
                type="text"
                :modelValue="dependant.value?.FirstNames"
                placeholder="Enter Firtsnames"
                name="firstnames"
                isReadonly="true"
              />
              <Textinput
                label="Surname"
                type="text"
                :modelValue="dependant.value?.Surname"
                placeholder="Enter Surname"
                name="surname"
                isReadonly="true"
              />
              <Textinput
                label="DOB"
                type="text"
                :modelValue="dependant.value?.DOB"
                placeholder="Enter DOB"
                name="dob"
                isReadonly="true"
              />
              <Textinput
                label="Gender"
                type="text"
                :modelValue="dependant.value?.Gender"
                placeholder="Enter Gender"
                name="id"
                isReadonly="true"
              />
              <Textinput
                label="ID Number"
                type="text"
                :modelValue="dependant.value?.IDNumber"
                placeholder="Enter ID Number"
                name="id"
                isReadonly="true"
              />
              <Textinput
                label="Relationship"
                type="text"
                :modelValue="dependant.value?.Relationship"
                placeholder="Enter Relationship with Account Holder"
                name="relationship"
                isReadonly="true"
              />
            </div>

            <h5 class="pt-5">Medical History</h5>

            <div v-if="patient.value && appointment.MembershipNo && !appointment.Dependant" class="grid lg:grid-cols-3 grid-cols-1 gap-5 pt-5">
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

            <div v-if="dependant.value && appointment.Dependant" class="grid lg:grid-cols-3 grid-cols-1 gap-5 pt-5">
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
          </form>
          <template v-slot:footer>
            <Button
              text="Submit"
              btnClass="btn-dark "
              @click="handleNew(appointment); $refs.modal2.closeModal()"
            />
          </template>
        </Modal>
      </div>
    </div>
    <GridSkletion :count="appointments.length" v-if="isSkeletion" />
    <TableSkeltion :count="appointments.length" v-if="isSkeletion2" />
    <Grid v-if="fillter === 'grid' && !isSkeletion" />
    <List v-if="fillter === 'list' && !isSkeletion2" />

    <AppointmentAddmodal />
    <updateModal />
  </div>
</template>

<script setup>
import Breadcrumb from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import GridSkletion from "@/components/Skeleton/Project-grid";
import TableSkeltion from "@/components/Skeleton/Table";
import Modal from '@/components/Modal/Modal';
import Textinput from "@/components/Textinput";
import VueSelect from "@/components/Select/VueSelect";
import FromGroup from "@/components/FromGroup";
import Checkbox from "@/components/Checkbox";
import vSelect from "vue-select";
import { useToast } from "vue-toastification";
import { computed, ref, reactive, watch, onMounted, defineEmits } from "vue";
import AppointmentAddmodal from "./AddAppointment";
import updateModal from "./EditAppointment";
import List from "./Appointments-list";
import Grid from "./Appointments-grid";
import { useStore } from "vuex";
import { useEmitter } from "@/mitt";

const {emitter} = useEmitter();
const store = useStore();

let fillter = ref("grid");
const openAppointment = () => {
  store.dispatch("openAppointment");
};

let appointment = reactive({});
let patient = reactive({});
let dependant = reactive({});
let currentPatientID = reactive({});

const width = ref(0);
const handleResize = () => {
  width.value = window.innerWidth;
};

const handleEmit = () => {
  fillter.value = "list";
  setTimeout(() => {
    emitter.emit('search')
  }, 500);
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();

  emitter.on('notification', () => {
    handleEmit();
  })
});

const appointments = computed(() => store.getters.allAppointments);
const patients = computed(() => store.getters.allPatients);
const dependants = computed(() => store.getters.allDependants);
const users = computed(() => store.getters.allUsers);
const patient_dependants = computed(() => store.getters.allDependants.filter(d => d.PatientID == currentPatientID.value?.PatientID));

const isSkeletion = ref(true);
const isSkeletion2 = ref(null);
setTimeout(() => {
  isSkeletion.value = false;
  isSkeletion2.value = false;
}, 1000);

const toast = useToast();
const handleNew = (new_appointment) => {
  new_appointment.PatientID = currentPatientID.value.PatientID
  new_appointment.DependantID = new_appointment.Dependant ? dependants.value.filter(d => new_appointment.Dependant?.includes(d.FirstNames) && new_appointment.Dependant?.includes(d.Surname)).map(p => p.DependantID)[0] : 0
  new_appointment.AttendingDoctor = users.value.filter(u => new_appointment.Doctor?.includes(u.firstname) && new_appointment.Doctor?.includes(u.lastname)).map(u => u.id)[0]
  store.dispatch("createAppointment", new_appointment)
  .then(data =>{
    appointment = {}
    // use vue-toast-notification app use
    toast.success(data.data.message, {
        timeout: 2000,
      });          
  },
  error => {
    appointment = {}
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

// watch fillter with switch case
watch(
    fillter, () => {
    switch (fillter.value) {
      case "grid":
        fillter.value = "grid";
        isSkeletion.value = true;
        setTimeout(() => {
          isSkeletion.value = false;
        }, 1000);

        break;
      case "list":
        fillter.value = "list";
        isSkeletion2.value = true;
        setTimeout(() => {
          isSkeletion2.value = false;
        }, 1000);
        break;
      default:
        fillter.value = "grid";
        break;
    }
  }
);
</script>
<style lang=""></style>

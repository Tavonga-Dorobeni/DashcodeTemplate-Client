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
          title="New Patient"
          label="➕ Add Patient"
          labelClass="btn-dark dark:bg-green-800  h-min text-sm font-normal"
          ref="modal2"
          centered sizeClass="max-w-5xl"
        >
          <form class="space-y-4">
            <h5 class="pb-5">Details</h5>
            <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
              <Textinput
                label="Membership Number"
                type="text"
                v-model="patient.MembershipNo"
                placeholder="Enter Membership Number"
                name="membership_number"
              />
              <Textinput
                label="Title"
                type="text"
                v-model="patient.Title"
                placeholder="Enter Title"
                name="title"
              />
              <VueSelect label="Insurance Plan"
                ><vSelect :options="plan" v-model="patient.Plan"
              /></VueSelect>
              <VueSelect label="Gender"
                ><vSelect :options="gender" v-model="patient.Gender"
              /></VueSelect>
              <VueSelect label="Marital Status"
                ><vSelect :options="marital_status" v-model="patient.MaritalStatus"
              /></VueSelect>
              <Textinput
                label="Firstnames"
                type="text"
                v-model="patient.Firstnames"
                placeholder="Enter Firtsnames"
                name="firstnames"
              />
              <Textinput
                label="Surname"
                type="text"
                v-model="patient.Surname"
                placeholder="Enter Surname"
                name="surname"
              />
              <FromGroup label="DOB" name="d1">
                <flat-pickr
                  v-model="patient.DOB"
                  class="form-control"
                  id="d1"
                  placeholder="yyyy, dd M"
                />
              </FromGroup>
              <Textinput
                label="ID Number"
                type="text"
                v-model="patient.IDNumber"
                placeholder="Enter ID Number"
                name="id"
              />
              <Textinput
                label="Email"
                type="text"
                v-model="patient.Email"
                placeholder="Enter Email"
                name="email"
              />
              <Textinput
                label="Cell Number"
                type="text"
                v-model="patient.CellNumber"
                placeholder="Enter Cell Number"
                name="cell"
              />
              <Textinput
                label="Physical Adress"
                type="text"
                v-model="patient.PhysicalAddress"
                placeholder="Enter Physical Address"
                name="physical_add"
              />
              <Textinput
                label="Postal Address"
                type="text"
                v-model="patient.PostalAddress"
                placeholder="Enter Postal Address"
                name="postal_add"
              />
            </div>

            <h5 class="pt-5">Medical History</h5>

            <div class="grid lg:grid-cols-3 grid-cols-1 gap-5 pt-5">
              <Checkbox v-model="patient.Diabetes" :checked="patient.Diabetes" label="Diabetes" />
              <Checkbox v-model="patient.Hypertension" :checked="patient.Hypertension" label="Hypertension" />
              <Checkbox v-model="patient.Arthritis" :checked="patient.Arthritis" label="Arthritis" />
              <Checkbox v-model="patient.Asthma" :checked="patient.Asthma" label="Asthma" />
              <Checkbox v-model="patient.BoneProblems" :checked="patient.BoneProblems" label="BoneProblems" />
              <Checkbox v-model="patient.HeartProblems" :checked="patient.HeartProblems" label="HeartProblems" />
              <Checkbox v-model="patient.Cancer" :checked="patient.Cancer" label="Cancer" />
              <Checkbox v-model="patient.RenalOrKidneyDisease" :checked="patient.RenalOrKidneyDisease" label="RenalOrKidneyDisease" />
              <Checkbox v-model="patient.AbdominalProblems" :checked="patient.AbdominalProblems" label="AbdominalProblems" />
              <Checkbox v-model="patient.Orthodontics" :checked="patient.Orthodontics" label="Orthodontics" />
            </div>
          </form>
          <template v-slot:footer>
            <Button
              text="Submit"
              btnClass="btn-dark "
              @click="handleNew(patient); $refs.modal2.closeModal()"
            />
          </template>
        </Modal>
      </div>
    </div>
    <GridSkletion :count="patients.length" v-if="isSkeletion" />
    <TableSkeltion :count="patients.length" v-if="isSkeletion2" />
    <Grid v-if="fillter === 'grid' && !isSkeletion" />
    <List v-if="fillter === 'list' && !isSkeletion2" />

    <PatientAddmodal />
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
import { computed, ref, watch, onMounted, defineEmits } from "vue";
import PatientAddmodal from "./AddPatient";
import updateModal from "./EditPatient";
import List from "./Patients-list";
import Grid from "./Patients-grid";
import { useStore } from "vuex";
import { useEmitter } from "@/mitt";

const {emitter} = useEmitter();
const store = useStore();

let fillter = ref("grid");
const openPatient = () => {
  store.dispatch("openPatient");
};

let patient = {};

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

const patients = computed(() => store.getters.allPatients);
const plan = ["Premium", "Platinum", "Gold", "Diamond"];
const gender = ["Male", "Female"];
const marital_status = ["Single", "Married"];

const isSkeletion = ref(true);
const isSkeletion2 = ref(null);
setTimeout(() => {
  isSkeletion.value = false;
  isSkeletion2.value = false;
}, 1000);

const toast = useToast();
const handleNew = (new_patient) => {
  store.dispatch("createPatient", new_patient)
  .then(data =>{
    patient = {}
    // use vue-toast-notification app use
    toast.success(data.data.message, {
        timeout: 2000,
      });          
  },
  error => {
    patient = {}
    toast.error((error.response && error.response.data) ||
          error.data.message ||
          error.toString(), {
        timeout: 2000,
      });   
  })
}

// watch fillter with switch case
watch(fillter, () => {
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
});
</script>
<style lang=""></style>

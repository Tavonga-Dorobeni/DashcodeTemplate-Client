<template>
  <div>
    <div class="flex flex-wrap justify-between items-center mb-4">
      <Breadcrumb />

      <div
        v-if="!currentUser.roles.includes('PATIENT')"
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
          title="New Dependant"
          label="➕ Add Dependant"
          labelClass="btn-dark dark:bg-green-800  h-min text-sm font-normal"
          ref="modal2"
          centered sizeClass="max-w-5xl"
        >
          <form class="space-y-4">
            <h5 class="pb-5">Details</h5>
            <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
              <VueSelect label="Account Holder"
                ><vSelect :options="patients.map(p => p.MembershipNo)" v-model="dependant.PatientID"
              /></VueSelect>
              <Textinput
                label="FirstNames"
                type="text"
                v-model="dependant.FirstNames"
                placeholder="Enter Firtsnames"
                name="firstnames"
              />
              <Textinput
                label="Surname"
                type="text"
                v-model="dependant.Surname"
                placeholder="Enter Surname"
                name="surname"
              />
              <FromGroup label="DOB" name="d1">
                <flat-pickr
                  v-model="dependant.DOB"
                  class="form-control"
                  id="d1"
                  placeholder="yyyy, dd M"
                />
              </FromGroup>
              <VueSelect label="Gender"
                ><vSelect :options="gender" v-model="dependant.Gender"
              /></VueSelect>
              <Textinput
                label="ID Number"
                type="text"
                v-model="dependant.IDNumber"
                placeholder="Enter ID Number"
                name="id"
              />
              <Textinput
                label="Relationship"
                type="text"
                v-model="dependant.Relationship"
                placeholder="Enter Relationship with Account Holder"
                name="relationship"
              />
            </div>

            <h5 class="pt-5">Medical History</h5>

            <div class="grid lg:grid-cols-3 grid-cols-1 gap-5 pt-5">
              <Checkbox v-model="dependant.Diabetes" :checked="dependant.Diabetes" label="Diabetes" />
              <Checkbox v-model="dependant.Hypertension" :checked="dependant.Hypertension" label="Hypertension" />
              <Checkbox v-model="dependant.Arthritis" :checked="dependant.Arthritis" label="Arthritis" />
              <Checkbox v-model="dependant.Asthma" :checked="dependant.Asthma" label="Asthma" />
              <Checkbox v-model="dependant.BoneProblems" :checked="dependant.BoneProblems" label="BoneProblems" />
              <Checkbox v-model="dependant.HeartProblems" :checked="dependant.HeartProblems" label="HeartProblems" />
              <Checkbox v-model="dependant.Cancer" :checked="dependant.Cancer" label="Cancer" />
              <Checkbox v-model="dependant.RenalOrKidneyDisease" :checked="dependant.RenalOrKidneyDisease" label="RenalOrKidneyDisease" />
              <Checkbox v-model="dependant.AbdominalProblems" :checked="dependant.AbdominalProblems" label="AbdominalProblems" />
              <Checkbox v-model="dependant.Orthodontics" :checked="dependant.Orthodontics" label="Orthodontics" />
            </div>
          </form>
          <template v-slot:footer>
            <Button
              text="Submit"
              btnClass="btn-dark "
              @click="handleNew(dependant); $refs.modal2.closeModal()"
            />
          </template>
        </Modal>
      </div>
    </div>
    <GridSkletion :count="dependants.length" v-if="isSkeletion" />
    <TableSkeltion :count="dependants.length" v-if="isSkeletion2" />
    <Grid v-if="fillter === 'grid' && !isSkeletion" />
    <List v-if="fillter === 'list' && !isSkeletion2" />

    <DependantAddmodal />
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
import DependantAddmodal from "./AddDependant";
import updateModal from "./EditDependant";
import List from "./Dependants-list";
import Grid from "./Dependants-grid";
import { useStore } from "vuex";
import { useEmitter } from "@/mitt";

const {emitter} = useEmitter();
const store = useStore();

let fillter = ref("grid");
const openDependant = () => {
  store.dispatch("openDependant");
};

let dependant = {};

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

const currentUser = computed(() => store.state.auth.user);
const dependants = computed(() => store.getters.allDependants);
const patients = computed(() => store.getters.allPatients);
const gender = ["Male", "Female"];

const isSkeletion = ref(true);
const isSkeletion2 = ref(null);
setTimeout(() => {
  isSkeletion.value = false;
  isSkeletion2.value = false;
}, 1000);

const toast = useToast();
const handleNew = (new_dependant) => {
  new_dependant.PatientID = patients.value.filter(p => p.MembershipNo == new_dependant.PatientID).map(p => p.PatientID)[0]
  store.dispatch("createDependant", new_dependant)
  .then(data =>{
    dependant = {}
    // use vue-toast-notification app use
    toast.success(data.data.message, {
        timeout: 2000,
      });          
  },
  error => {
    dependant = {}
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

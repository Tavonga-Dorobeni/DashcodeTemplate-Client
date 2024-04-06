<template>
  <div class="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
    <Card bodyClass="p-6" v-for="(item, i) in dependants" :key="i">
      <!-- header -->
      <header class="flex justify-between items-end">
        <div class="flex space-x-4 items-center">
          <div class="flex-none">
            <div
              class="h-10 w-10 rounded-md text-lg bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-200 flex flex-col items-center justify-center font-normal capitalize"
            >
              {{ item.FirstNames.charAt(0) + item.Surname.charAt(0) }}
            </div>
          </div>
          <div class="font-medium text-base leading-6">
            <div
              class="dark:text-slate-200 text-slate-900 max-w-[160px] truncate"
            >
              {{ item.Surname + " " + item.FirstNames.charAt(0)}}
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
        <b>{{ item.IDNumber }}</b>
      </div>
      <div class="text-slate-600 dark:text-slate-400 text-sm pt-4 pb-3">
        <b>DOB: </b> {{ item.DOB }} <br/>
        <b>Relationship: </b> {{ item.Relationship }} <br/>
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
          <span class="block date-label">Date Updated</span>
          <span class="block date-text">{{ item.updatedAt }}</span>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4 mt-3">
        <div
          class="text-slate-400 dark:text-slate-400 text-sm font-normal"
        >
          Account Holder:
        </div>
        <div class="text-right">
          <span
            class="inline-block text-center space-x-1 bg-success-500 bg-opacity-[0.16] min-w-[110px] text-success-500 text-xs font-normal px-2 py-1 rounded-full"
          >
            {{ patients.filter(p => p.PatientID == item.PatientID).map(p => p.Firstnames.charAt(0)) + ". " + patients.filter(p => p.PatientID == item.PatientID).map(p => p.Surname)}}
          </span>
        </div>
      </div>
    </Card>
    <Modal
      title="Edit Dependant"
      label=""
      labelClass="btn-small"
      ref="modal2"
      centered sizeClass="max-w-5xl"
    >
      <h5 class="pb-5">Details</h5>
      <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
        <VueSelect v-if="!view" label="Account Holder"
          ><vSelect :options="patients.map(p => p.MembershipNo)" v-model="currentDependant.PatientID"
        /></VueSelect>
        <Textinput
          v-else
          label="Account Holder"
          type="text"
          :value="patients.filter(p => p.PatientID == currentDependant.PatientID).map(p => p.MembershipNo)"
          name="account_holder"
          isReadonly="true"
        />
        <Textinput
          label="FirstNames"
          type="text"
          v-model="currentDependant.FirstNames"
          placeholder="Enter Firtsnames"
          name="firstnames"
          :isReadonly="view"
        />
        <Textinput
          label="Surname"
          type="text"
          v-model="currentDependant.Surname"
          placeholder="Enter Surname"
          name="surname"
          :isReadonly="view"
        />
        <FromGroup v-if="!view" label="DOB" name="d1">
          <flat-pickr
            v-model="currentDependant.DOB"
            class="form-control"
            id="d1"
            placeholder="yyyy, dd M"
          />
        </FromGroup>
        <Textinput
          v-else
          label="DOB"
          :modelValue="currentDependant.DOB.substring(0, 10)"
          name="dob"
          isReadonly="true"
        />
        <VueSelect v-if="!view" label="Gender"
          ><vSelect :options="gender" v-model="currentDependant.Gender"
        /></VueSelect>
        <Textinput
          v-else
          label="Gender"
          type="text"
          v-model="currentDependant.Gender"
          name="gender"
          isReadonly="true"
        />
        <Textinput
          label="ID Number"
          type="text"
          v-model="currentDependant.IDNumber"
          placeholder="Enter ID Number"
          name="id"
          :isReadonly="view"
        />
        <Textinput
          label="Relationship"
          type="text"
          v-model="currentDependant.Relationship"
          placeholder="Enter Relationship with Account Holder"
          name="relationship"
          :isReadonly="view"
        />
      </div>

      <h5 class="pt-5">Medical History</h5>

      <div class="grid lg:grid-cols-3 grid-cols-1 gap-5 pt-5">
        <Checkbox v-model="currentDependant.Diabetes" :checked="currentDependant.Diabetes" :disabled="view" label="Diabetes" />
        <Checkbox v-model="currentDependant.Hypertension" :checked="currentDependant.Hypertension" :disabled="view" label="Hypertension" />
        <Checkbox v-model="currentDependant.Arthritis" :checked="currentDependant.Arthritis" :disabled="view" label="Arthritis" />
        <Checkbox v-model="currentDependant.Asthma" :checked="currentDependant.Asthma" :disabled="view" label="Asthma" />
        <Checkbox v-model="currentDependant.BoneProblems" :checked="currentDependant.BoneProblems" :disabled="view" label="BoneProblems" />
        <Checkbox v-model="currentDependant.HeartProblems" :checked="currentDependant.HeartProblems" :disabled="view" label="HeartProblems" />
        <Checkbox v-model="currentDependant.Cancer" :checked="currentDependant.Cancer" :disabled="view" label="Cancer" />
        <Checkbox v-model="currentDependant.RenalOrKidneyDisease" :checked="currentDependant.RenalOrKidneyDisease" :disabled="view" label="RenalOrKidneyDisease" />
        <Checkbox v-model="currentDependant.AbdominalProblems" :checked="currentDependant.AbdominalProblems" :disabled="view" label="AbdominalProblems" />
        <Checkbox v-model="currentDependant.Orthodontics" :checked="currentDependant.Orthodontics" :disabled="view" label="Orthodontics" />
      </div>

      <template v-if="!view" v-slot:footer>
        <Button
          text="Submit"
          btnClass="btn-dark "
          @click="updateDependant()"
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
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
const store = useStore();
const router = useRouter();

const currentUser = computed(() => store.state.auth.user);
const Patient = computed(() => store.getters.allPatients.filter(p => p.Firstnames == currentUser.value.firstname && p.Surname == currentUser.value.lastname)[0]);
const dependants = computed(() => currentUser.value.roles.includes('PATIENT') ? store.getters.allDependants.filter(d => d.PatientID == Patient.value.PatientID) : store.getters.allDependants);
const patients = computed(() => store.getters.allPatients);
const gender = ["Male", "Female"];

let view = ref(false);
let currentDependant = ref({});
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
      // data.ToolType = store.getters.allToolTypes.filter(s => s.ToolTypeID == data.ToolTypeID).map(s => s.Description)[0]
      // data.Section = store.getters.allSections.filter(s => s.SectionID == data.SectionID).map(s => s.Description)[0]
      // data.Location = store.getters.allLocations.filter(s => s.LocationID == data.LocationID).map(s => s.Description)[0]
      view.value = true;
      currentDependant.value = data;
      modal2.value.openModal();
    },
  },
  {
    name: 'Edit',
    icon: 'heroicons-outline:pencil-alt',
    doit: (data) => {
      // data.ToolType = store.getters.allToolTypes.filter(s => s.ToolTypeID == data.ToolTypeID).map(s => s.Description)[0]
      // data.Section = store.getters.allSections.filter(s => s.SectionID == data.SectionID).map(s => s.Description)[0]
      // data.Location = store.getters.allLocations.filter(s => s.LocationID == data.LocationID).map(s => s.Description)[0]
      view.value = false;
      currentDependant.value = data;
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
      store.dispatch('deleteDependant', data)
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

const updateDependant = () => {
  const toast = useToast();
  currentDependant.value.PatientID = patients.value.filter(p => p.MembershipNo == currentDependant.value.PatientID).map(p => p.PatientID)[0]
  store.dispatch('updateDependant', currentDependant.value)
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
</script>
<style lang="scss" scoped>
.date-label {
  @apply text-xs text-slate-400 dark:text-slate-400 mb-1;
}
.date-text {
  @apply text-xs text-slate-600 dark:text-slate-300 font-medium;
}
</style>

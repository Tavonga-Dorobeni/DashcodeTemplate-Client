<template>
  <div class="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
    <Card bodyClass="p-6" v-for="(item, i) in patients" :key="i">
      <!-- header -->
      <header class="flex justify-between items-end">
        <div class="flex space-x-4 items-center">
          <div class="flex-none">
            <div
              class="h-10 w-10 rounded-md text-lg bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-200 flex flex-col items-center justify-center font-normal capitalize"
            >
              {{ item.Firstnames.charAt(0) + item.Surname.charAt(0) }}
            </div>
          </div>
          <div class="font-medium text-base leading-6">
            <div
              class="dark:text-slate-200 text-slate-900 max-w-[160px] truncate"
            >
              {{ item.Title + " " + item.Surname + " " + item.Firstnames.charAt(0)}}
            </div>
          </div>
        </div>
        <div>
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
        <b>Cell Number: </b> {{ item.CellNumber }} <br/>
        <b>Email: </b> {{ item.Email }} <br/>
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
          Membership No:
        </div>
        <div class="text-right">
          <span
            class="inline-block text-center space-x-1 bg-success-500 bg-opacity-[0.16] min-w-[110px] text-success-500 text-xs font-normal px-2 py-1 rounded-full"
          >
            {{ item.MembershipNo}}
          </span>
        </div>
      </div>
    </Card>
    <Modal
      title="Edit Patient"
      label=""
      labelClass="btn-small"
      ref="modal2"
      centered sizeClass="max-w-5xl"
    >
      <h5 class="pb-5">Details</h5>
      <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
        <Textinput
          label="Membership Number"
          type="text"
          v-model="currentPatient.MembershipNo"
          placeholder="Enter Membership Number"
          name="membership_number"
          :isReadonly="view"
        />
        <Textinput
          label="Title"
          type="text"
          v-model="currentPatient.Title"
          placeholder="Enter Title"
          name="title"
          :isReadonly="view"
        />
        <VueSelect v-if="!view" label="Insurance Plan"
          ><vSelect :options="plan" v-model="currentPatient.Plan"
        /></VueSelect>
        <Textinput
          v-else
          label="Insurance Plan"
          type="text"
          v-model="currentPatient.Plan"
          name="plan"
          isReadonly="true"
        />
        <VueSelect v-if="!view" label="Gender"
          ><vSelect :options="gender" v-model="currentPatient.Gender"
        /></VueSelect>
        <Textinput
          v-else
          label="Gender"
          type="text"
          v-model="currentPatient.Gender"
          name="gender"
          isReadonly="true"
        />
        <VueSelect v-if="!view" label="Marital Status"
          ><vSelect :options="marital_status" v-model="currentPatient.MaritalStatus"
        /></VueSelect>
        <Textinput
          v-else
          label="Marital Status"
          type="text"
          v-model="currentPatient.MaritalStatus"
          name="marital_status"
          isReadonly="true"
        />
        <Textinput
          label="Firstnames"
          type="text"
          v-model="currentPatient.Firstnames"
          placeholder="Enter Firtsnames"
          name="firstnames"
          :isReadonly="view"
        />
        <Textinput
          label="Surname"
          type="text"
          v-model="currentPatient.Surname"
          placeholder="Enter Surname"
          name="surname"
          :isReadonly="view"
        />
        <FromGroup v-if="!view" label="DOB" name="d1">
          <flat-pickr
            v-model="currentPatient.DOB"
            class="form-control"
            id="d1"
            placeholder="yyyy, dd M"
          />
        </FromGroup>
        <Textinput
          v-else
          label="DOB"
          :modelValue="currentPatient.DOB.substring(0, 10)"
          name="dob"
          isReadonly="true"
        />
        <Textinput
          label="ID Number"
          type="text"
          v-model="currentPatient.IDNumber"
          placeholder="Enter ID Number"
          name="id"
          :isReadonly="view"
        />
        <Textinput
          label="Email"
          type="text"
          v-model="currentPatient.Email"
          placeholder="Enter Email"
          name="email"
          :isReadonly="view"
        />
        <Textinput
          label="Cell Number"
          type="text"
          v-model="currentPatient.CellNumber"
          placeholder="Enter Cell Number"
          name="cell"
          :isReadonly="view"
        />
        <Textinput
          label="Physical Adress"
          type="text"
          v-model="currentPatient.PhysicalAddress"
          placeholder="Enter Physical Address"
          name="physical_add"
          :isReadonly="view"
        />
        <Textinput
          label="Postal Address"
          type="text"
          v-model="currentPatient.PostalAddress"
          placeholder="Enter Postal Address"
          name="postal_add"
          :isReadonly="view"
        />
      </div>

      <h5 class="pt-5">Medical History</h5>

      <div class="grid lg:grid-cols-3 grid-cols-1 gap-5 pt-5">
        <Checkbox v-model="currentPatient.Diabetes" :checked="currentPatient.Diabetes" :disabled="view" label="Diabetes" />
        <Checkbox v-model="currentPatient.Hypertension" :checked="currentPatient.Hypertension" :disabled="view" label="Hypertension" />
        <Checkbox v-model="currentPatient.Arthritis" :checked="currentPatient.Arthritis" :disabled="view" label="Arthritis" />
        <Checkbox v-model="currentPatient.Asthma" :checked="currentPatient.Asthma" :disabled="view" label="Asthma" />
        <Checkbox v-model="currentPatient.BoneProblems" :checked="currentPatient.BoneProblems" :disabled="view" label="BoneProblems" />
        <Checkbox v-model="currentPatient.HeartProblems" :checked="currentPatient.HeartProblems" :disabled="view" label="HeartProblems" />
        <Checkbox v-model="currentPatient.Cancer" :checked="currentPatient.Cancer" :disabled="view" label="Cancer" />
        <Checkbox v-model="currentPatient.RenalOrKidneyDisease" :checked="currentPatient.RenalOrKidneyDisease" :disabled="view" label="RenalOrKidneyDisease" />
        <Checkbox v-model="currentPatient.AbdominalProblems" :checked="currentPatient.AbdominalProblems" :disabled="view" label="AbdominalProblems" />
        <Checkbox v-model="currentPatient.Orthodontics" :checked="currentPatient.Orthodontics" :disabled="view" label="Orthodontics" />
      </div>

      <template v-if="!view" v-slot:footer>
        <Button
          text="Submit"
          btnClass="btn-dark "
          @click="updatePatient()"
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

const patients = computed(() => store.getters.allPatients);
const plan = ["Premium", "Platinum", "Gold", "Diamond"];
const gender = ["Male", "Female"];
const marital_status = ["Single", "Married"];
// const sections = computed(() => store.getters.allSections);
// const tool_types = computed(() => store.getters.allToolTypes);
// const locations = computed(() => store.getters.allLocations);

let view = ref(false);
let currentPatient = ref({});
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
      currentPatient.value = data;
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
      currentPatient.value = data;
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
      store.dispatch('deletePatient', data)
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

const updatePatient = () => {
  const toast = useToast();
  store.dispatch('updatePatient', currentPatient.value)
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

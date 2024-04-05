<template>
  <div class="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
    <Card bodyClass="p-6" v-for="(item, i) in claims" :key="i">
      <!-- header -->
      <header class="flex justify-between items-end">
        <div class="flex space-x-4 items-center">
          <div class="flex-none">
            <div
              class="h-10 w-10 rounded-md text-lg bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-200 flex flex-col items-center justify-center font-normal capitalize"
            >
              CM
            </div>
          </div>
          <div class="font-medium text-base leading-6">
            <div
              class="dark:text-slate-200 text-slate-900 max-w-[160px] truncate"
            >
              Claim
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
      <div class="text-slate-600 dark:text-slate-400 text-sm pt-4 pb-3">
        <b>Amount: </b> $ {{ item.Amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2}) }} <br/>
        <b>Account Holder: </b> {{ patients.filter(p => p.PatientID == appointments.filter(a => a.AppointmentID == item.AppointmentID).map(a => a.PatientID)[0]).map(p => p.Firstnames + " " + p.Surname)[0] }} <br/>
        <b>Dependant: </b> {{ dependants.filter(p => p.DependantID == appointments.filter(a => a.AppointmentID == item.AppointmentID).map(a => a.DependantID)[0]).map(p => p.FirstNames + " " + p.Surname)[0] }} <br/>
      </div>
      <!--  date -->
      <div class="flex space-x-4">
        <!-- start date -->
        <div>
          <span class="block date-label">Date Created</span>
          <span class="block date-text">{{ item.createdAt.substring(0, 10) }}</span>
        </div>
        <!-- end date -->
        <div>
          <span class="block date-label">Date Updated</span>
          <span class="block date-text">{{ item.updatedAt.substring(0, 10) }}</span>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4 mt-3">
        <div
          class="text-slate-400 dark:text-slate-400 text-sm font-normal"
        >
          Status:
        </div>
        <div class="text-right">
          <span
            v-if="item.Status == 'Flagged'"
            class="inline-block text-center space-x-1 bg-warning-500 bg-opacity-[0.16] min-w-[110px] text-warning-500 text-xs font-normal px-2 py-1 rounded-full"
          >
            Flagged
          </span>
          <span
            v-if="item.Status == 'Verified'"
            class="inline-block text-center space-x-1 bg-success-500 bg-opacity-[0.16] min-w-[110px] text-success-500 text-xs font-normal px-2 py-1 rounded-full"
          >
            Verified
          </span>
          <span
            v-if="item.Status == 'Paid'"
            class="inline-block text-center space-x-1 bg-primary-500 bg-opacity-[0.16] min-w-[110px] text-primary-500 text-xs font-normal px-2 py-1 rounded-full"
          >
            Paid
          </span>
          <span
            v-if="item.Status != 'Paid' && item.Status != 'Flagged' && item.Status != 'Verified'"
            class="inline-block text-center space-x-1 bg-secondary-500 bg-opacity-[0.16] min-w-[110px] text-secondary-500 text-xs font-normal px-2 py-1 rounded-full"
          >
            Pending
          </span>
        </div>
      </div>
    </Card>
    <Modal
      :title="view? 'View Claim' : confirmation? 'Confirm Payment' : ''"
      label=""
      labelClass="btn-small"
      ref="modal2"
      centered sizeClass="max-w-5xl"
    >
      <form v-if="view && !confirmation" class="space-y-4">
        <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <Textinput
            label="Appointment ID"
            type="text"
            :modelValue="currentClaim.AppointmentID"
            placeholder="------"
            name="app_id"
            isReadonly
          />
          <Textinput
            label="Account Holder"
            type="text"
            :modelValue="currentPatient.value?.map(p => `${p.Firstnames} ${p.Surname}`)"
            placeholder="------"
            name="account_holder"
            isReadonly
          />
          <Textinput
            label="Dependant"
            type="text"
            :modelValue="currentDependant.value?.map(p => `${p.FirstNames} ${p.Surname}`)"
            placeholder="-------"
            name="dependant"
            isReadonly
          />
          <Textinput
            label="Date Scheduled"
            type="text"
            :modelValue="appointments.filter(a => a.AppointmentID == currentClaim.AppointmentID).map(a => a.DateScheduled)[0]"
            placeholder="------"
            name="ds"
            isReadonly
          />
        </div>

        <p class="mt-2" >Procedures: </p>

        <span
          v-for="(item, i) in currentClaim.Procedures" :key="i"
          class="inline-block text-center space-x-1 bg-success-500 bg-opacity-[0.16] min-w-[110px] text-success-500 text-xs font-normal px-2 py-1 rounded-full my-3 mr-2"
        >
          {{ item }}
        </span>

        <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <Textinput
            label="Notes"
            type="text"
            v-model="currentClaim.Notes"
            placeholder="-------"
            name="notes"
            isReadonly
          />     
          
          <Textinput
            label="Claim Amount ($)"
            type="text"
            :modelValue="currentClaim.Amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2})"
            placeholder="-------"
            name="amount"
            isReadonly
          />  
        </div>        
      </form>

      <form v-if="!view && confirmation && currentClaim.Status == 'Verified'" style="height: 350px;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 10px;">
          <span class="pt-12">
            <img
              src="@/assets/images/all-img/verified.png"
              alt=""
              class="mt-10 ml-20 pl-10"
              style="height: 150px;"
            />
            <div class="text-xl font-medium text-slate-900 mb-2 text-center">
              Are you sure you want to confirm payment?
            </div>
          </span>          
        </div>      
      </form>

      <form v-if="!view && confirmation && currentClaim.Status != 'Verified'" style="height: 350px;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 10px;">
          <span class="pt-12">
            <img
              src="@/assets/images/all-img/flagged.jpg"
              alt=""
              class="mt-10 ml-20 pl-10"
              style="height: 150px;"
            />
            <div class="text-xl font-medium text-slate-900 mb-2 text-center">
              You cannot confirm payment for this claim!
            </div>
          </span>          
        </div>      
      </form>

      <template v-if="(view && !confirmation) || (confirmation && currentClaim.Status != 'Verified')" v-slot:footer>
        <Button
          text="Close"
          btnClass="btn-dark "
          @click="close()"
        />
      </template>
      <template v-if="!view && confirmation && currentClaim.Status == 'Verified'" v-slot:footer>
        <Button
          text="Confirm"
          btnClass="btn-dark "
          @click="updateClaim()"
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
import vSelect from "vue-select";
import { useToast } from "vue-toastification";
import { MenuItem } from '@headlessui/vue';
import { computed, ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
const store = useStore();
const router = useRouter();

const claims = computed(() => store.getters.allClaims);
const appointments = computed(() => store.getters.allAppointments);
const patients = computed(() => store.getters.allPatients);
const dependants = computed(() => store.getters.allDependants);
const procedures = computed(() => store.getters.allProcedures);

let view = ref(false);
let confirmation = ref(false);
let currentClaim = ref({});
let currentPatient = reactive({});
let currentDependant = reactive({});
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
      data.Procedures = procedures.value.filter(p => data.procedures.map(pr => pr.ProcedureID).includes(p.ProcedureID)).map(p => p.Name)
      currentPatient.value = patients.value.filter(p => p.PatientID == appointments.value.filter(a => a.AppointmentID == data.AppointmentID).map(a => a.PatientID)[0]);
      currentDependant.value = dependants.value.filter(p => p.DependantID == appointments.value.filter(a => a.AppointmentID == data.AppointmentID).map(a => a.DependantID)[0]);
      view.value = true;
      confirmation.value = false;
      currentClaim.value = data;
      modal2.value.openModal();
    },
  },
  {
    name: 'Payment',
    icon: 'heroicons-outline:pencil-alt',
    doit: (data) => {
      view.value = false;
      confirmation.value = true;
      currentClaim.value = data;
      modal2.value.openModal();
    },
  },
  {
    name: 'Delete',
    icon: 'heroicons-outline:trash',
    doit: (data) => {
      const toast = useToast();
      store.dispatch('deleteClaim', data)
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

const close = () => {
  modal2.value.closeModal();
}

const updateClaim = () => {
  const toast = useToast();
  modal2.value.closeModal();
  currentClaim.value.Status = 'Paid'
  store.dispatch('updateClaim', currentClaim.value)
  .then(response => {
    toast.success(response.data.message, {
      timeout: 2000,
    });    
  },
  error => {
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

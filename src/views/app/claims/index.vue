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
          title="New Claim"
          label="➕ Add Claim"
          labelClass="btn-dark dark:bg-green-800  h-min text-sm font-normal"
          ref="modal2"
          centered sizeClass="max-w-5xl"
        >
          <form v-if="!view && !flagged && !verified" class="space-y-4">
            <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
              <VueSelect label="Appointment ID"
                ><vSelect :on-change="handleAppointmentChange(claim.AppointmentID)" :options="appointments.map(a => a.AppointmentID)" v-model="claim.AppointmentID"
              /></VueSelect>
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
                :modelValue="appointments.filter(a => a.AppointmentID == claim.AppointmentID).map(a => a.DateScheduled)[0]"
                placeholder="------"
                name="ds"
                isReadonly
              />
            </div>

            <VueSelect label="Procedures"
              ><vSelect :on-change="handleProceduresChange(claim.Procedures)" :options="procedures.map(a => a.Name)" v-model="claim.Procedures" multiple
            /></VueSelect>

            <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
              <Textinput
                label="Notes"
                type="text"
                v-model="claim.Notes"
                placeholder="-------"
                name="notes"
              />     
              
              <Textinput
                label="Claim Amount ($)"
                type="text"
                :modelValue="claimAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2})"
                placeholder="-------"
                name="amount"
                isReadonly
              />  
            </div>
          </form>
          <form v-if="view && !flagged && !verified" style="height: 350px;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 10px;">
              <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
                <span class="pt-12 mt-6">
                  <div class="text-xl font-medium text-slate-900 mb-2">
                    QR-Code Verification
                  </div>
                  <b class="text-sm text-slate-800">Ask patient to follow the steps below:</b>      
                  <p class="text-sm text-slate-800">1. Login to the Patient Portal <br/> 2. Scan the QR code <br/> 3. Verify or Flag the generated claim.</p>         
                </span>
                <span v-if="!loading">
                  <qrcode-vue :value="JSON.stringify(claim)" :size="300" level="H" />
                </span>
                <span v-else>
                  <img
                    src="@/assets/images/all-img/loader.gif"
                    alt=""
                    class="mt-10 object-cover rounded-full"
                  />
                </span>          
              </div>
            </div>
          </form>
          <form v-if="flagged && !verified" style="height: 350px;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 10px;">
              <span class="pt-12">
                <img
                  src="@/assets/images/all-img/flagged.jpg"
                  alt=""
                  class="mt-10 ml-2"
                  style="height: 150px;"
                />
                <div class="text-xl font-medium text-slate-900 mb-2 text-center">
                  Claim was Flagged!
                </div>
              </span>          
            </div>
          </form>
          <form v-if="!flagged && verified" style="height: 350px;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 10px;">
              <span class="pt-12">
                <img
                  src="@/assets/images/all-img/verified.png"
                  alt=""
                  class="mt-10 ml-2"
                  style="height: 150px;"
                />
                <div class="text-xl font-medium text-slate-900 mb-2 text-center">
                  Claim was Verified!
                </div>
              </span>           
            </div>
          </form>

          <template v-slot:footer>
            <Button
              v-if="!view && !flagged && !verified"
              text="Submit"
              btnClass="btn-dark "
              @click="handleNew(claim)"
            />
            <Button
              v-if="view && !flagged && !verified"
              text="Cancel"
              btnClass="btn-dark "
              @click="handleCancel()"
            />
            <!-- <Button
              text="Submit"
              btnClass="btn-dark "
              @click="handleNew(claim); $refs.modal2.closeModal()"
            /> -->
          </template>
        </Modal>
      </div>
    </div>
    <GridSkletion :count="claims.length" v-if="isSkeletion" />
    <TableSkeltion :count="claims.length" v-if="isSkeletion2" />
    <Grid v-if="fillter === 'grid' && !isSkeletion" />
    <List v-if="fillter === 'list' && !isSkeletion2" />

    <ClaimAddmodal />
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
import QrcodeVue from 'qrcode.vue'
import vSelect from "vue-select";
import { useToast } from "vue-toastification";
import { computed, ref, reactive, watch, onMounted, defineEmits } from "vue";
import ClaimAddmodal from "./AddClaim";
import updateModal from "./EditClaim";
import List from "./Claims-list";
import Grid from "./Claims-grid";
import { useStore } from "vuex";
import { useEmitter } from "@/mitt";

const {emitter} = useEmitter();
const store = useStore();

let fillter = ref("grid");
const openClaim = () => {
  store.dispatch("openClaim");
};

let view = ref(false);
let loading = ref(false);
let flagged = ref(false);
let verified = ref(false);
let claim = ref({});
let claimAmount = ref(0);
let currentPatient = reactive({});
let currentDependant = reactive({});

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

const handleAppointmentChange = (AppointmentID) => {
  currentPatient.value = patients.value.filter(p => p.PatientID == appointments.value.filter(a => a.AppointmentID == AppointmentID).map(a => a.PatientID)[0]);
  currentDependant.value = dependants.value.filter(p => p.DependantID == appointments.value.filter(a => a.AppointmentID == AppointmentID).map(a => a.DependantID)[0]);
}

const handleProceduresChange = (Procedures) => {
  claimAmount.value = procedures.value.filter(p => Procedures?.includes(p.Name)).map(p => p.Price).reduce((a, b) => a + b, 0);
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();

  emitter.on('notification', () => {
    handleEmit();
  })

  emitter.on('qrcode_detected', () => {
    loading.value = true;
    flagged.value = false;
    verified.value = false
  })

  emitter.on('claim_flagged', () => {
    loading.value = false;
    flagged.value = true;
    verified.value = false
  })

  emitter.on('claim_verified', () => {
    loading.value = false;
    flagged.value = false;
    verified.value = true
  })
});

const claims = computed(() => store.getters.allClaims);
const appointments = computed(() => store.getters.allAppointments);
const patients = computed(() => store.getters.allPatients);
const dependants = computed(() => store.getters.allDependants);
const procedures = computed(() => store.getters.allProcedures);

const isSkeletion = ref(true);
const isSkeletion2 = ref(null);
setTimeout(() => {
  isSkeletion.value = false;
  isSkeletion2.value = false;
}, 1000);

const toast = useToast();
const handleNew = (new_claim) => {
  claim.value.Amount = claimAmount.value;
  view.value = true;
  // store.dispatch("register", new_claim)
  // claim.value.procedures = procedures.value.filter(p => claim.value.Procedures.includes(p.Name)).map(p => {ProcedureID: p.ProcedureID})
  // .then(data =>{
  //   // use vue-toast-notification app use
  //   toast.success(data.data.message, {
  //       timeout: 2000,
  //     });
  // },
  // error => {
  //   toast.error((error.response && error.response.data) ||
  //         error.data.message ||
  //         error.toString(), {
  //       timeout: 2000,
  //     });
  // })
}

const handleCancel = () => {
  view.value = false;
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

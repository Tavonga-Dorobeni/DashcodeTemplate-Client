<template>
  <div>
    <div class="justify-between items-center mb-4">
      <Breadcrumb />
      {{ devices.map(d => d.label) }}
      <select v-model="selectedDevice">
        <option
          v-for="device in devices"
          :key="device.label"
          :value="device"
        >
          {{ device.label }}
        </option>
      </select>
      <div v-if="view" class="md:space-x-4 items-center">
        <form class="space-y-4">
          <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <Textinput
              label="Appointment ID"
              type="text"
              :modelValue="claim.AppointmentID"
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
              :modelValue="appointments.filter(a => a.AppointmentID == claim.AppointmentID).map(a => a.DateScheduled)[0]"
              placeholder="------"
              name="ds"
              isReadonly
            />
          </div>

          <p class="mt-2" >Procedures: </p>

          <span
            v-for="(item, i) in claim.Procedures" :key="i"
            class="inline-block text-center space-x-1 bg-success-500 bg-opacity-[0.16] min-w-[110px] text-success-500 text-xs font-normal px-2 py-1 rounded-full my-3 mr-2"
          >
            {{ item }}
          </span>

          <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <Textinput
              label="Notes"
              type="text"
              v-model="claim.Notes"
              placeholder="-------"
              name="notes"
              isReadonly
            />     
            
            <Textinput
              label="Claim Amount ($)"
              type="text"
              :modelValue="claim.Amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2})"
              placeholder="-------"
              name="amount"
              isReadonly
            />  
          </div>
        </form>        

        <div
          class="mt-6 md:flex md:space-x-4 md:justify-end items-center"
          :class="width < 768 ? 'space-x-rb' : ''"
        >
          <Button
            text="Re-scan"
            btnClass="btn-dark "
            @click="rescan()"
          />  
          <Button
            text="Flag"
            btnClass="btn-danger "
            @click="flagClaim()"
          />
          <Button
            text="Verify"
            btnClass="btn-success "
            @click="verifyClaim()"
          />
        </div>
      </div>

      <div v-else>
        <!-- <p>
          Modern mobile phones often have a variety of different cameras installed (e.g. front, rear,
          wide-angle, infrared, desk-view). The one picked by default is sometimes not the best choice.
          If you want fine-grained control, which camera is used, you can enumerate all installed
          cameras and then pick the one you need based on it's device ID:

          <select v-model="selectedDevice">
            <option
              v-for="device in devices"
              :key="device.label"
              :value="device"
            >
              {{ device.label }}
            </option>
          </select>
        </p>

        <p>
          Detected codes are visually highlighted in real-time. Use the following dropdown to change the
          flavor:

          <select v-model="trackFunctionSelected">
            <option
              v-for="option in trackFunctionOptions"
              :key="option.text"
              :value="option"
            >
              {{ option.text }}
            </option>
          </select>
        </p>

        <p>
          By default only QR-codes are detected but a variety of other barcode formats are also
          supported. You can select one or multiple but the more you select the more expensive scanning
          becomes: <br />

          <span
            v-for="option in Object.keys(barcodeFormats)"
            :key="option"
            class="barcode-format-checkbox"
          >
            <input
              type="checkbox"
              v-model="barcodeFormats[option]"
              :id="option"
            />
            <label :for="option">{{ option }}</label>
          </span>
        </p>

        <p class="error">{{ error }}</p>

        <p class="decode-result">
          Last result: <b>{{ result }}</b>
        </p> -->

        <div>
          <qrcode-stream
            :constraints="{ deviceId: selectedDevice.deviceId }"
            :track="trackFunctionSelected.value"
            :formats="selectedBarcodeFormats"
            @error="onError"
            @detect="onDetect"
            @init="onInit"
            v-if="selectedDevice !== null"
          />
          <p
            v-else
            class="error"
          >
            No cameras on this device
          </p>
        </div>
      </div>
    </div>
    <qrcode-stream @detect="onDetect"></qrcode-stream>
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
let claim = ref({});
let claimAmount = ref(0);
let currentPatient = reactive({});
let currentDependant = reactive({});

const selectedDevice = ref(null)
const devices = ref([])

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

// const onDetect = (Codes) => {
//   console.log(Codes[0].rawValue)
//   claim.value = JSON.parse(Codes)
// }

const result = ref('')

function onDetect(detectedCodes) {
  console.log(detectedCodes)
  result.value = JSON.stringify(detectedCodes.map((code) => code.rawValue))
  claim.value = detectedCodes[0].rawValue
  view.value = true
}

async function onInit(){
  devices.value = (await navigator.mediaDevices.enumerateDevices()).filter(
    ({ kind }) => kind === 'videoinput'
  )

  if (devices.value.length > 0) {
    selectedDevice.value = devices.value[devices.value.length - 1]
  }
}

onMounted(async() => {
  window.addEventListener("resize", handleResize);
  handleResize();

  emitter.on('notification', () => {
    handleEmit();
  });

  navigator.permissions.query({name: 'camera'})
  .then((permissionObj) => {
    console.log(permissionObj.state);
    if(permissionObj.state == 'denied'){
      navigator.getUserMedia({ video: true })
    }
  })
  .catch((error) => {
    console.log('Got error :', error);
  });

  devices.value = (await navigator.mediaDevices.enumerateDevices()).filter(
    ({ kind }) => kind === 'videoinput'
  )

  if (devices.value.length > 0) {
    selectedDevice.value = devices.value[0]
  }
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


/*** track functons ***/

function paintOutline(detectedCodes, ctx) {
  for (const detectedCode of detectedCodes) {
    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

    ctx.strokeStyle = 'red'

    ctx.beginPath()
    ctx.moveTo(firstPoint.x, firstPoint.y)
    for (const { x, y } of otherPoints) {
      ctx.lineTo(x, y)
    }
    ctx.lineTo(firstPoint.x, firstPoint.y)
    ctx.closePath()
    ctx.stroke()
  }
}
function paintBoundingBox(detectedCodes, ctx) {
  for (const detectedCode of detectedCodes) {
    const {
      boundingBox: { x, y, width, height }
    } = detectedCode

    ctx.lineWidth = 2
    ctx.strokeStyle = '#007bff'
    ctx.strokeRect(x, y, width, height)
  }
}
function paintCenterText(detectedCodes, ctx) {
  for (const detectedCode of detectedCodes) {
    const { boundingBox, rawValue } = detectedCode

    const centerX = boundingBox.x + boundingBox.width / 2
    const centerY = boundingBox.y + boundingBox.height / 2

    const fontSize = Math.max(12, (50 * boundingBox.width) / ctx.canvas.width)

    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.textAlign = 'center'

    ctx.lineWidth = 3
    ctx.strokeStyle = '#35495e'
    ctx.strokeText(detectedCode.rawValue, centerX, centerY)

    ctx.fillStyle = '#5cb984'
    ctx.fillText(rawValue, centerX, centerY)
  }
}
const trackFunctionOptions = [
  { text: 'nothing (default)', value: undefined },
  { text: 'outline', value: paintOutline },
  { text: 'centered text', value: paintCenterText },
  { text: 'bounding box', value: paintBoundingBox }
]
const trackFunctionSelected = ref(trackFunctionOptions[1])

/*** barcode formats ***/

const barcodeFormats = ref({
  aztec: false,
  code_128: false,
  code_39: false,
  code_93: false,
  codabar: false,
  databar: false,
  databar_expanded: false,
  data_matrix: false,
  dx_film_edge: false,
  ean_13: false,
  ean_8: false,
  itf: false,
  maxi_code: false,
  micro_qr_code: false,
  pdf417: false,
  qr_code: true,
  rm_qr_code: false,
  upc_a: false,
  upc_e: false,
  linear_codes: false,
  matrix_codes: false
})
const selectedBarcodeFormats = computed(() => {
  return Object.keys(barcodeFormats.value).filter((format) => barcodeFormats.value[format])
})

/*** error handling ***/

const error = ref('')

function onError(err) {
  error.value = `[${err.name}]: `

  if (err.name === 'NotAllowedError') {
    error.value += 'you need to grant camera access permission'
  } else if (err.name === 'NotFoundError') {
    error.value += 'no camera on this device'
  } else if (err.name === 'NotSupportedError') {
    error.value += 'secure context required (HTTPS, localhost)'
  } else if (err.name === 'NotReadableError') {
    error.value += 'is the camera already in use?'
  } else if (err.name === 'OverconstrainedError') {
    error.value += 'installed cameras are not suitable'
  } else if (err.name === 'StreamApiNotSupportedError') {
    error.value += 'Stream API is not supported in this browser'
  } else if (err.name === 'InsecureContextError') {
    error.value +=
      'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
  } else {
    error.value += err.message
  }
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

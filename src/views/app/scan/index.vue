<template>
  <div>
    <div class="justify-between items-center mb-4">
      <Breadcrumb />
      <div
        class="md:flex md:space-x-4 md:justify-end items-center"
        :class="width < 768 ? 'space-x-rb' : ''"
      >
        <select v-model="selectedDevice">
          <option
            v-for="device in devices"
            :key="device.label"
            :value="device"
          >
            {{ device.label }}
          </option>
        </select>
      </div>

      {{ cnsl }}

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
              :modelValue="currentPatient?.map(p => `${p.Firstnames} ${p.Surname}`)"
              placeholder="------"
              name="account_holder"
              isReadonly
            />
            <Textinput
              label="Dependant"
              type="text"
              :modelValue="currentDependant?.map(p => `${p.FirstNames} ${p.Surname}`)"
              placeholder="-------"
              name="dependant"
              isReadonly
            />
            <Textinput
              label="Date Scheduled"
              type="text"
              :modelValue="allAppointments.filter(a => a.AppointmentID == claim.AppointmentID).map(a => a.DateScheduled)[0]"
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
            @click="flagClaim(claim)"
          />
          <Button
            text="Verify"
            btnClass="btn-success "
            @click="verifyClaim(claim)"
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
            :formats="selectedBarcodeFormats"
            @error="onError"
            @detect="onDetect"
            @init="onInit"
            v-if="selectedDevice !== null"
          />
        </div>
      </div>
    </div>
    <!-- <qrcode-stream @detect="onDetect"></qrcode-stream> -->
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import Modal from '@/components/Modal/Modal';
import Textinput from "@/components/Textinput";
import VueSelect from "@/components/Select/VueSelect";
import FromGroup from "@/components/FromGroup";
import QrcodeVue from 'qrcode.vue'
import vSelect from "vue-select";
import { useToast } from "vue-toastification";
import { mapGetters } from 'vuex';

export default {
  components: {
    Breadcrumb,
    Modal,
    Textinput,
    Button,
    VueSelect,
    FromGroup,
    vSelect,
    QrcodeVue
  },

  data() {
    return {
      cnsl: null,
      fillter: "grid",
      view: false,
      claim: {},
      currentPatient: {},
      currentDependant: {},
      selectedDevice: null,
      devices: [],
      width: 0,
      isSkeletion: true,
      isSkeletion2: null,
      // trackFunctionOptions: [
      //   { text: 'nothing (default)', value: undefined },
      //   { text: 'outline', value: this.paintOutline() },
      //   { text: 'centered text', value: this.paintCenterText() },
      //   { text: 'bounding box', value: this.paintBoundingBox() }
      // ],
      // trackFunctionSelected: this.trackFunctionOptions[1],
      barcodeFormats: {
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
      },
      error: ''
    };
  },

  computed: {
    ...mapGetters([
      "activeData",
      "allClaims",
      "allAppointments",
      "allPatients",
      "allDependants",
      "allProcedures"
    ]),

    selectedBarcodeFormats() {
      return Object.keys(this.barcodeFormats).filter((format) => this.barcodeFormats[format])
    }
  },

  methods: {
    openClaim() {
      this.$store.dispatch("openClaim");
    },

    handleResize() {
      this.width = window.innerWidth;
    },

    handleEmit() {
      this.fillter = "list";
      setTimeout(() => {
        this.$emitter.emit('search')
      }, 500);
    },

    handleAppointmentChange(AppointmentID) {
      this.currentPatient = this.allPatients.filter(p => p.PatientID == this.allAppointments.filter(a => a.AppointmentID == AppointmentID).map(a => a.PatientID)[0]);
      this.currentDependant = this.allDependants.filter(p => p.DependantID == this.allAppointments.filter(a => a.AppointmentID == AppointmentID).map(a => a.DependantID)[0]);
    },

    onDetect(detectedCodes) {
      this.cnsl = detectedCodes
      this.result = JSON.stringify(detectedCodes.map((code) => code.rawValue))
      this.claim = detectedCodes[0].rawValue
      console.log(claim)
      this.view = true
      this.handleAppointmentChange(this.claim.AppointmentID)

      this.$socket.client.emit('qrcode_detected', {});
    },

    async onInit(){
      this.devices = (await navigator.mediaDevices.enumerateDevices()).filter(
        ({ kind }) => kind === 'videoinput'
      )

      if (this.devices.length > 0) {
        this.selectedDevice = this.devices[this.devices.length - 1]
      }
    },

    rescan() {
      this.claim = {};
      this.currentPatient = {};
      this.currentDependant = {};
      this.view = false;
    },

    flagClaim(newClaim) {
      newClaim.Status = "Flagged"
      newClaim.procedures = this.allProcedures.filter(p => newClaim.Procedures.includes(p.Name)).map(p => p.ProcedureID)
      this.$store.dispatch("createClaim", newClaim)
      .then(data =>{
        const toast = useToast();
        // use vue-toast-notification app use
        this.$socket.client.emit('socketreq', {
          commit: 'newClaim',
          data: response.data
        });
        this.claim = {};
        this.currentPatient = {};
        this.currentDependant = {};
        this.view = false;
        toast.success(data.data.message, {
            timeout: 2000,
          });
      },
      error => {
        const toast = useToast();
        toast.error((error.response && error.response.data) ||
            error.data.message ||
            error.toString(), {
          timeout: 2000,
        });
        this.claim = {};
        this.currentPatient = {};
        this.currentDependant = {};
        this.view = false;
      })
    },

    verifyClaim(newClaim) {
      newClaim.Status = "Verified"
      newClaim.procedures = this.allProcedures.filter(p => newClaim.Procedures.includes(p.Name)).map(p => p.ProcedureID)
      this.$store.dispatch("createClaim", newClaim)
      .then(data =>{
        const toast = useToast();
        // use vue-toast-notification app use
        this.$socket.client.emit('socketreq', {
          commit: 'newClaim',
          data: response.data
        });
        this.claim = {};
        this.currentPatient = {};
        this.currentDependant = {};
        this.view = false;
        toast.success(data.data.message, {
            timeout: 2000,
          });
      },
      error => {
        const toast = useToast();
        toast.error((error.response && error.response.data) ||
            error.data.message ||
            error.toString(), {
          timeout: 2000,
        });
        this.claim = {};
        this.currentPatient = {};
        this.currentDependant = {};
        this.view = false;
      })
    },

    /*** track functons ***/

    paintOutline(detectedCodes, ctx) {
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
    },

    paintBoundingBox(detectedCodes, ctx) {
      for (const detectedCode of detectedCodes) {
        const {
          boundingBox: { x, y, width, height }
        } = detectedCode

        ctx.lineWidth = 2
        ctx.strokeStyle = '#007bff'
        ctx.strokeRect(x, y, width, height)
      }
    },

    paintCenterText(detectedCodes, ctx) {
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
    },

    onError(err) {
      this.error = `[${err.name}]: `

      if (err.name === 'NotAllowedError') {
        this.error += 'you need to grant camera access permission'
      } else if (err.name === 'NotFoundError') {
        this.error += 'no camera on this device'
      } else if (err.name === 'NotSupportedError') {
        this.error += 'secure context required (HTTPS, localhost)'
      } else if (err.name === 'NotReadableError') {
        this.error += 'is the camera already in use?'
      } else if (err.name === 'OverconstrainedError') {
        this.error += 'installed cameras are not suitable'
      } else if (err.name === 'StreamApiNotSupportedError') {
        this.error += 'Stream API is not supported in this browser'
      } else if (err.name === 'InsecureContextError') {
        this.error +=
          'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
      } else {
        this.error += err.message
      }
    }
  },

  async mounted(){
    setTimeout(() => {
      this.isSkeletion = false;
      this.isSkeletion2 = false;
    }, 1000),

    this.$emitter.on('notification', () => {
      this.handleEmit();
    })

    window.addEventListener("resize", this.handleResize());
    this.handleResize();

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

    this.devices = (await navigator.mediaDevices.enumerateDevices()).filter(
      ({ kind }) => kind === 'videoinput'
    )

    if (this.devices.length > 0) {
      this.selectedDevice = this.devices[this.devices.length - 1]
    }
  },

  watch: {
    fillter: function(newValue) {
      switch (newValue) {
        case "grid":
          this.fillter = "grid";
          this.isSkeletion = true;
          setTimeout(() => {
            this.isSkeletion = false;
          }, 1000);

          break;
        case "list":
          this.fillter = "list";
          this.isSkeletion2 = true;
          setTimeout(() => {
            this.isSkeletion2 = false;
          }, 1000);
          break;
        default:
          this.fillter = "grid";
          break;
      }
    },
  }
};
</script>

<!-- <script setup>

import { computed, ref, reactive, watch, onMounted, defineEmits } from "vue";
import { useStore } from "vuex";
import { useEmitter } from "@/mitt";

const {emitter} = useEmitter();
const store = useStore();

let fillter = ref("grid");


let view = ref(false);
let claim = ref({});
let claimAmount = ref(0);
let currentPatient = reactive({});
let currentDependant = reactive({});

const selectedDevice = ref(null)
const devices = ref([])

const width = ref(0);






const result = ref('')



onMounted(async() => {

});

const isSkeletion = ref(true);
const isSkeletion2 = ref(null);


</script> -->
<style lang=""></style>

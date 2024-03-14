<template>
  <div>
    <Card noborder>
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

      <div
        class="md:flex pb-6 md:space-y-0 space-y-3 justify-between items-center"
      >
        <h6>Patients List</h6>
        <InputGroup
          v-model="searchTerm"
          placeholder="Search"
          type="text"
          prependIcon="heroicons-outline:search"
          merged
        />
      </div>
      <vue-good-table
        class="-mx-6"
        :columns="columns"
        styleClass=" vgt-table  table-head   v-middle striped lesspadding2 listview"
        :rows="this.$store.state.patient.patients"
        :pagination-options="{
          enabled: true,
          perPage: perpage,
        }"
        :sort-options="{
          enabled: false,
        }"
        :search-options="{
          enabled: true,
          externalQuery: searchTerm,
        }"
      >
        <template v-slot:table-row="props">
          <span v-if="props.column.field == 'MembershipNo'">
            <div class="flex space-x-3 items-center text-left">
              <div class="flex-none">
                <div
                  class="h-10 w-10 rounded-full text-sm bg-[#E0EAFF] dark:bg-slate-700 flex flex-col items-center justify-center font-medium -tracking-[1px]"
                >
                  {{
                    props.row.Firstnames.charAt(0) +
                    props.row.Surname.charAt(0)
                  }}
                </div>
              </div>
              <span
                v-if="props.column.field == 'MembershipNo'"
                class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
              >
                <span
                  class="inline-block text-center space-x-1 bg-success-500 bg-opacity-[0.16] min-w-[110px] text-success-500 text-xs font-normal px-2 py-1 rounded-full"
                >
                  {{ props.row.MembershipNo}}
                </span>
              </span>
            </div>
          </span>

          <span
            v-if="props.column.field == 'Firstnames'"
            class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
          >
            {{ props.row.Firstnames }}
          </span>
          <span
            v-if="props.column.field == 'Surname'"
            class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
          >
            {{ props.row.Surname }}
          </span>
          <span
            v-if="props.column.field == 'Plan'"
            class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
          >
            {{ props.row.Plan}}
          </span>
          <div
            v-if="props.column.field == 'action'"
            class="action-btn text-end mr-3"
          >
            <Dropdown classMenuItems=" w-[140px]">
              <div class="text-xl">
                <Icon icon="heroicons-outline:dots-vertical" />
              </div>
              <template v-slot:menus>
                <MenuItem v-for="(item, i) in actions" :key="i">
                  <div
                    @click="item.doit(props.row)"
                    :class="`
                
                  ${
                    item.name === 'delete'
                      ? 'bg-danger-500 text-danger-500 bg-opacity-30  hover:bg-opacity-100 hover:text-white'
                      : 'hover:bg-slate-900 hover:text-white'
                  }
                   w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center `"
                  >
                    <span class="text-base"><Icon :icon="item.icon" /></span>
                    <span>{{ item.name }}</span>
                  </div>
                </MenuItem>
              </template>
            </Dropdown>
          </div>
        </template>
        <template #pagination-bottom="props">
          <div class="py-4 px-3 justify-center flex">
            <Pagination
              :total="$store.state.patient.patients.length"
              :current="current"
              :per-page="perpage"
              :pageRange="pageRange"
              @page-changed="current = $event"
              :pageChanged="props.pageChanged"
              :perPageChanged="props.perPageChanged"
            />
          </div>
        </template>
      </vue-good-table>
    </Card>
  </div>
</template>
<script>
import Card from '@/components/Card';
import Dropdown from '@/components/Dropdown';
import Icon from '@/components/Icon';
import Pagination from '@/components/Pagination';
import ProgressBar from '@/components/ProgressBar';
import Modal from '@/components/Modal/Modal';
import Textinput from "@/components/Textinput";
import Button from "@/components/Button";
import VueSelect from "@/components/Select/VueSelect";
import FromGroup from "@/components/FromGroup";
import InputGroup from "@/components/InputGroup";
import Checkbox from "@/components/Checkbox";
import vSelect from "vue-select";
import { useToast } from "vue-toastification";
import { MenuItem } from '@headlessui/vue';
import { advancedTable } from '../../../constant/basic-tablle-data';
import { mapGetters } from 'vuex';

export default {
  components: {
    Pagination,
    Dropdown,
    Icon,
    MenuItem,
    Card,
    ProgressBar,
    Modal,
    Textinput,
    Button,
    VueSelect,
    FromGroup,
    vSelect,
    InputGroup,
    Checkbox
  },

  data() {
    return {
      advancedTable,
      current: 1,
      perpage: 10,
      pageRange: 10,
      view: false,
      currentPatient: {},
      searchTerm: "",
      plan: ["Premium", "Platinum", "Gold", "Diamond"],
      gender: ["Male", "Female"],
      marital_status: ["Single", "Married"],
      actions: [
        {
          name: 'view',
          icon: 'heroicons:eye',
          doit: (data) => {
            this.view = true;
            this.currentPatient = data;
            this.$refs.modal2.openModal();
          },
        },
        {
          name: 'edit',
          icon: 'heroicons:pencil-square',
          doit: (data) => {
            this.view = false;
            this.currentPatient = data;
            this.$refs.modal2.openModal();
          },
        },
        // {
        //   name: 'calibrate',
        //   icon: 'heroicons-outline:wrench',
        //   doit: (data) => {
        //     this.$store.commit('setActiveData', data);
        //     this.$router.push({ name: 'calibration' });
        //   },
        // },
        {
          name: 'delete',
          icon: 'heroicons-outline:trash',
          doit: (data) => {
            const toast = useToast();
            this.$store.dispatch('deletePatient', data)
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
      ],

      columns: [
        {
          label: 'Membership Number',
          field: 'MembershipNo',
        },

        {
          label: 'Firstnames',
          field: 'Firstnames',
        },

        {
          label: 'Surname',
          field: 'Surname',
        },
        {
          label: 'Plan',
          field: 'Plan',
        },
        {
          label: 'Action',
          field: 'action',
        },
      ],
    };
  },

  computed: {
    ...mapGetters([
      "allSections",
      "allToolTypes",
      "allLocations",
      "activeData"
    ])
  },

  methods: {
    updatePatient(){
      const toast = useToast();
      this.$store.dispatch('updatePatient', this.currentPatient)
      .then(response => {
        this.$refs.modal2.closeModal();
        toast.success(response.data.message, {
          timeout: 2000,
        });    
      },
      error => {
        this.$refs.modal2.closeModal();
        toast.error((error.response && error.response.data) ||
              error.data.message ||
              error.toString(), {
            timeout: 2000,
          });   
      })
    }
  },

  mounted(){
    this.$emitter.on('search', () => {
      this.searchTerm = this.activeData.searchTerm
    })
  }
};
</script>
<style lang="scss">
.listview {
  th {
    @apply last:text-end;
  }
}
</style>

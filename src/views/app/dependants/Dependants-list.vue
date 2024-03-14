<template>
  <div>
    <Card noborder>
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

      <div
        class="md:flex pb-6 md:space-y-0 space-y-3 justify-between items-center"
      >
        <h6>Dependants List</h6>
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
        :rows="this.$store.state.dependant.dependants"
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
          <span v-if="props.column.field == 'PatientID'">
            <div class="flex space-x-3 items-center text-left">
              <div class="flex-none">
                <div
                  class="h-10 w-10 rounded-full text-sm bg-[#E0EAFF] dark:bg-slate-700 flex flex-col items-center justify-center font-medium -tracking-[1px]"
                >
                  {{
                    allPatients.filter(p => p.PatientID == props.row.PatientID).map(p => p.Firstnames)[0].charAt(0) +
                    allPatients.filter(p => p.PatientID == props.row.PatientID).map(p => p.Surname)[0].charAt(0)
                  }}
                </div>
              </div>
              <span
                class="inline-block text-center space-x-1 bg-success-500 bg-opacity-[0.16] min-w-[110px] text-success-500 text-xs font-normal px-2 py-1 rounded-full"
              >
                {{ allPatients.filter(p => p.PatientID == props.row.PatientID).map(p => p.MembershipNo)[0] }}
              </span>
            </div>
          </span>

          <span
            v-if="props.column.field == 'FirstNames'"
            class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
          >
            {{ props.row.FirstNames }}
          </span>
          <span
            v-if="props.column.field == 'Surname'"
            class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
          >
            {{ props.row.Surname }}
          </span>
          <span
            v-if="props.column.field == 'DOB'"
            class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
          >
            {{ props.row.DOB}}
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
              :total="$store.state.dependant.dependants.length"
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
      currentDependant: {},
      searchTerm: "",
      gender: ["Male", "Female"],
      actions: [
        {
          name: 'view',
          icon: 'heroicons:eye',
          doit: (data) => {
            // data.PatientID = this.allPatients.filter(p => p.MembershipNo == data.PatientID).map(p => p.PatientID)[0]
            this.view = true;
            this.currentDependant = data;
            this.$refs.modal2.openModal();
          },
        },
        {
          name: 'edit',
          icon: 'heroicons:pencil-square',
          doit: (data) => {
            // data.PatientID = this.allPatients.filter(p => p.MembershipNo == data.PatientID).map(p => p.PatientID)[0]
            this.view = false;
            this.currentDependant = data;
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
            this.$store.dispatch('deleteDependant', data)
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
          label: 'Account Holder',
          field: 'PatientID',
        },

        {
          label: 'First Names',
          field: 'FirstNames',
        },

        {
          label: 'Surname',
          field: 'Surname',
        },
        {
          label: 'DOB',
          field: 'DOB',
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
      "allDependants",
      "allPatients",
      "allLocations",
      "activeData"
    ])
  },

  methods: {
    updateDependant(){
      const toast = useToast();
      this.currentDependant.PatientID = this.allPatients.filter(p => p.MembershipNo == this.currentDependant.PatientID).map(p => p.PatientID)[0]
      this.$store.dispatch('updateDependant', this.currentDependant)
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

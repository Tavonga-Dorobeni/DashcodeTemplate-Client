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
          title="New Procedure"
          label="➕ Add Procedure"
          labelClass="btn-dark dark:bg-green-800  h-min text-sm font-normal"
          ref="modal2"
          centered sizeClass="max-w-5xl"
        >
          <form class="space-y-4">
            <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
              <Textinput
                label="Name"
                type="text"
                v-model="procedure.Name"
                placeholder="Enter Name"
                name="name"
              />
              <Textinput
                label="Price"
                type="number"
                v-model="procedure.Price"
                placeholder="Enter Price"
                name="price"
              />
            </div>
          </form>
          <template v-slot:footer>
            <Button
              text="Submit"
              btnClass="btn-dark "
              @click="handleNew(procedure); $refs.modal2.closeModal()"
            />
          </template>
        </Modal>
      </div>
    </div>
    <GridSkletion :count="procedures.length" v-if="isSkeletion" />
    <TableSkeltion :count="procedures.length" v-if="isSkeletion2" />
    <Grid v-if="fillter === 'grid' && !isSkeletion" />
    <List v-if="fillter === 'list' && !isSkeletion2" />

    <ProcedureAddmodal />
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
import { useToast } from "vue-toastification";
import { computed, ref, watch, onMounted, defineEmits } from "vue";
import ProcedureAddmodal from "./AddProcedure";
import updateModal from "./EditProcedure";
import List from "./Procedures-list";
import Grid from "./Procedures-grid";
import { useStore } from "vuex";
import { useEmitter } from "@/mitt";

const {emitter} = useEmitter();
const store = useStore();

let fillter = ref("grid");
const openProcedure = () => {
  store.dispatch("openProcedure");
};

let procedure = {};

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

const procedures = computed(() => store.getters.allProcedures);

const isSkeletion = ref(true);
const isSkeletion2 = ref(null);
setTimeout(() => {
  isSkeletion.value = false;
  isSkeletion2.value = false;
}, 1000);

const toast = useToast();
const handleNew = (new_procedure) => {
  store.dispatch("createProcedure", new_procedure)
  .then(data =>{
    procedure = {}
    // use vue-toast-notification app use
    toast.success(data.data.message, {
        timeout: 2000,
      });          
  },
  error => {
    procedure = {}
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

<template>
  <div>
    <Breadcrumb />
    <div v-if="currentUser.roles.includes('PATIENT')" class="space-y-5 profile-page">
      <div
        class="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]"
      >
        <div
          class="bg-slate-900 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"
        ></div>
        <div class="profile-box flex-none md:text-start text-center">
          <div class="md:flex items-end md:space-x-6">
            <div class="flex-none">
              <div
                class="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative"
              >
                <img
                  src="@/assets/images/users/avatar.png"
                  alt=""
                  class="w-full h-full object-cover rounded-full"
                />
                <router-link
                  to=""
                  class="absolute right-2 h-8 w-8 bg-slate-50 text-slate-600 rounded-full shadow-sm flex flex-col items-center justify-center md:top-[140px] top-[100px]"
                  ><Icon icon="heroicons:pencil-square" />
                </router-link>
              </div>
            </div>
            <div class="flex-1">
              <div
                class="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]"
              >
                {{ Patient.Title + '. ' + Patient.Firstnames.charAt(0) + Patient.Surname}}
              </div>
              <div class="text-sm font-light text-slate-600 dark:text-slate-400">
                Name
              </div>
            </div>
          </div>
        </div>
        <!-- end profile box -->
        <div
          class="profile-info-500 md:flex md:text-start text-center flex-1 max-w-[516px] md:space-y-0 space-y-4"
        >
          <div class="flex-1">
            <div
              class="text-base text-slate-900 dark:text-slate-300 font-medium mb-1"
            >
              {{ Patient.MembershipNo }}
            </div>
            <div class="text-sm text-slate-600 font-light dark:text-slate-300">
              Membership Number
            </div>
          </div>
          <!-- end single -->
          <div class="flex-1">
            <div
              class="text-base text-slate-900 dark:text-slate-300 font-medium mb-1"
            >
              {{ Patient.Plan }}
            </div>
            <div class="text-sm text-slate-600 font-light dark:text-slate-300">
              Plan
            </div>
          </div>
          <!-- end single -->
        </div>
        <!-- profile info-500 -->
      </div>

      <h5 class="pb-5">Details</h5>
      <div class="grid lg:grid-cols-3 grid-cols-1 gap-5">
        <Textinput
          label="Membership Number"
          type="text"
          v-model="Patient.MembershipNo"
          placeholder="Enter Membership Number"
          name="membership_number"
          isReadonly
        />
        <Textinput
          label="Title"
          type="text"
          v-model="Patient.Title"
          placeholder="Enter Title"
          name="title"
          isReadonly
        />
        <Textinput
          label="Plan"
          type="text"
          v-model="Patient.Plan"
          placeholder="Enter Plan"
          name="plan"
          isReadonly
        />
        <Textinput
          label="Gender"
          type="text"
          v-model="Patient.Gender"
          placeholder="Enter Gender"
          name="gender"
          isReadonly
        />
        <Textinput
          label="Marital Status"
          type="text"
          v-model="Patient.MaritalStatus"
          placeholder="Enter Marital Status"
          name="marital_status"
          isReadonly
        />
        <Textinput
          label="Firstnames"
          type="text"
          v-model="Patient.Firstnames"
          placeholder="Enter Firtsnames"
          name="firstnames"
          isReadonly
        />
        <Textinput
          label="Surname"
          type="text"
          v-model="Patient.Surname"
          placeholder="Enter Surname"
          name="surname"
          isReadonly
        />
        <Textinput
          label="DOB"
          type="text"
          v-model="Patient.DOB"
          placeholder="Enter DOB"
          name="dob"
          isReadonly
        />
        <Textinput
          label="ID Number"
          type="text"
          v-model="Patient.IDNumber"
          placeholder="Enter ID Number"
          name="id"
          isReadonly
        />
        <Textinput
          label="Email"
          type="text"
          v-model="Patient.Email"
          placeholder="Enter Email"
          name="email"
          isReadonly
        />
        <Textinput
          label="Cell Number"
          type="text"
          v-model="Patient.CellNumber"
          placeholder="Enter Cell Number"
          name="cell"
          isReadonly
        />
        <Textinput
          label="Physical Adress"
          type="text"
          v-model="Patient.PhysicalAddress"
          placeholder="Enter Physical Address"
          name="physical_add"
          isReadonly
        />
        <Textinput
          label="Postal Address"
          type="text"
          v-model="Patient.PostalAddress"
          placeholder="Enter Postal Address"
          name="postal_add"
          isReadonly
        />
      </div>

      <h5 class="pt-5">Medical History</h5>

      <div class="grid lg:grid-cols-4 grid-cols-1 gap-5 pt-5">
        <Checkbox v-if="Patient.Diabetes" :checked="Patient.Diabetes" disabled label="Diabetes" />
        <Checkbox v-if="Patient.Hypertension" :checked="Patient.Hypertension" disabled label="Hypertension" />
        <Checkbox v-if="Patient.Arthritis" :checked="Patient.Arthritis" disabled label="Arthritis" />
        <Checkbox v-if="Patient.Asthma" :checked="Patient.Asthma" disabled label="Asthma" />
        <Checkbox v-if="Patient.BoneProblems" :checked="Patient.BoneProblems" disabled label="BoneProblems" />
        <Checkbox v-if="Patient.HeartProblems" :checked="Patient.HeartProblems" disabled label="HeartProblems" />
        <Checkbox v-if="Patient.Cancer" :checked="Patient.Cancer" disabled label="Cancer" />
        <Checkbox v-if="Patient.RenalOrKidneyDisease" :checked="Patient.RenalOrKidneyDisease" disabled label="RenalOrKidneyDisease" />
        <Checkbox v-if="Patient.AbdominalProblems" :checked="Patient.AbdominalProblems" disabled label="AbdominalProblems" />
        <Checkbox v-if="Patient.Orthodontics" :checked="Patient.Orthodontics" disabled label="Orthodontics" />
      </div>
    </div>
    <div v-if="!currentUser.roles.includes('PATIENT')" class="grid grid-cols-12 gap-5 mb-5">
      <div class="2xl:col-span-3 lg:col-span-4 col-span-12">
        <div
          class="bg-no-repeat bg-cover bg-center p-4 rounded-[6px] relative"
          :style="{
            backgroundImage:
              'url(' + require(`@/assets/images/all-img/widget-bg-1.png`) + ')',
          }"
        >
          <div class="max-w-[169px]">
            <div class="text-xl font-medium text-slate-900 mb-2">
              Welcome to your MIFP
            </div>
            <p class="text-sm text-slate-800">Dashboard</p>
          </div>
          <div
            class="absolute top-1/2 -translate-y-1/2 right-6 mt-2 h-12 w-12 bg-white text-slate-900 rounded-full text-xs font-medium flex flex-col items-center justify-center"
          >
          </div>
        </div>
      </div>
      <div class="2xl:col-span-9 lg:col-span-8 col-span-12">
        <Card bodyClass="p-4">
          <div class="grid md:grid-cols-3 col-span-1 gap-4">
            <div
              class="py-[18px] px-4 rounded-[6px]"
              v-for="(item, i) in statistics"
              :class="item.bg"
              :key="i"
            >
              <div class="flex items-center space-x-6">
                <div class="flex-none">
                  <apexchart
                    type="area"
                    height="48"
                    width="48"
                    :options="item.name.chartOptions"
                    :series="item.name.series"
                  />
                </div>
                <div class="flex-1">
                  <div
                    class="text-slate-800 dark:text-slate-300 text-sm mb-1 font-medium"
                  >
                    {{ item.title }}
                  </div>
                  <div
                    class="text-slate-900 dark:text-white text-lg font-medium"
                  >
                    {{ item.count }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
    <div v-if="!currentUser.roles.includes('PATIENT')" class="grid grid-cols-12 gap-5">
      <div class="lg:col-span-8 col-span-12">
        <Card>
          <div class="legend-ring">
            <apexchart
              type="bar"
              height="400"
              :options="
                this.$store.state.isDark
                  ? columnCharthomeDark.chartOptions
                  : columnCharthome.chartOptions
              "
              :series="columnCharthome.series"
            />
          </div>
        </Card>
      </div>
      <div class="lg:col-span-4 col-span-12">
        <Card title="overview">
          <template #header>
            <DropEvent />
          </template>
          <apexchart
            type="radialBar"
            :height="window.width > 768 ? 350 : 250"
            :options="
              this.$store.state.isDark
                ? MultipleRadialbarsDark.chartOptions
                : MultipleRadialbars.chartOptions
            "
            :series="MultipleRadialbars.series"
          />
        </Card>
      </div>
    </div>
  </div>
</template>
<script>
import Card from '@/components/Card';
import {
  gearradil,
  gearradilDark,
  MultipleRadialbars,
  MultipleRadialbarsDark,
} from '../../constant/appex-chart';
import CompanyTable from './Analytics-Component/CompanyTable';
import {
  columnCharthome,
  columnCharthomeDark,
  shapeLine1,
  shapeLine2,
  shapeLine3,
  mostSales,
} from './Analytics-Component/data';
import DropEvent from './Analytics-Component/DropEvent';
import Map from './Analytics-Component/Map';
import SelectMonth from './Analytics-Component/SelectMonth';
import Breadcrumb from './Analytics-Component/Breadcrumbs';
import window from '@/mixins/window';
import Textinput from "@/components/Textinput";
import Checkbox from "@/components/Checkbox";
import { mapGetters } from 'vuex';

export default {
  mixins: [window],
  components: {
    Card,
    CompanyTable,
    Map,
    DropEvent,
    SelectMonth,
    Breadcrumb,
    Textinput,
    Checkbox
  },
  data() {
    return {
      columnCharthome,
      columnCharthomeDark,
      MultipleRadialbars,
      MultipleRadialbarsDark,
      gearradil,
      gearradilDark,
      mostSales,
      fillterMap: 'usa',
      statistics: [
        {
          name: shapeLine1,
          title: 'Verified Claims',
          count: '564',
          bg: 'bg-[#E5F9FF] dark:bg-slate-900	',
        },
        {
          name: shapeLine2,
          title: 'Flagged Claims',
          count: '78',
          bg: 'bg-[#FFEDE5] dark:bg-slate-900	',
        },
        {
          name: shapeLine3,
          title: 'Paid Claims',
          count: '2,170',
          bg: 'bg-[#EAE5FF] dark:bg-slate-900	',
        },
      ],
      activity: [
        {
          id: 1,
          img: require('@/assets/images/users/user-1.jpg'),
        },
        {
          id: 2,
          img: require('@/assets/images/users/user-2.jpg'),
        },
        {
          id: 3,
          img: require('@/assets/images/users/user-3.jpg'),
        },
        {
          id: 4,
          img: require('@/assets/images/users/user-4.jpg'),
        },
        {
          id: 5,
          img: require('@/assets/images/users/user-5.jpg'),
        },
        {
          id: 6,
          img: require('@/assets/images/users/user-6.jpg'),
        },
        {
          id: 7,
          img: require('@/assets/images/users/user-1.jpg'),
        },
        {
          id: 6,
          img: require('@/assets/images/users/user-2.jpg'),
        },
        {
          id: 7,
          img: require('@/assets/images/users/user-2.jpg'),
        },
      ],
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

    currentUser() {
      return this.$store.state.auth.user;
    },
    Patient(){
      return this.allPatients.filter(p => p.Firstnames == this.currentUser.firstname && p.Surname == this.currentUser.lastname)[0]
    },
    Dependants(){
      return this.allDependants.filter(d => d.PatientID == this.Patient.PatientID)
    },
    Appointments(){
      return this.allAppointments.filter(a => a.PatientID == this.Patient.PatientID)
    },
    Claims(){
      return this.allClaims.filter(c => this.Appointments.map(a => a.AppointmentID).includes(c.AppointmentID))
    }
  },
};
</script>
<style lang=""></style>

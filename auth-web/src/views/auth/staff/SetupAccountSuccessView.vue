<template>
  <v-container>
    <div class="view-container text-center">
      <article>
        <div class="group">
          <v-icon size="48" class="mb-6">mdi-check</v-icon>
        </div>
        <h1 class="mb-5">Account successfully created</h1>
        <p class="mb-9">
          The Director Search account <span class="font-italic">{{accountName}}</span> has successfully been created. <br>
          An email has been sent to <span class="font-italic">{{accountEmail}}</span> containing instructions <br>
          on how to access their new account.</p>
        <v-btn
          large
          color="primary"
          class="mt-3 font-weight-medium"
          @click="goToDashboard"
          data-test="ok-button"
        >Back to Staff Dashboard</v-btn>
      </article>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Invitation } from '@/models/Invitation'
import OrgModule from '@/store/modules/org'
import { Organization } from '@/models/Organization'
import { Pages } from '@/util/constants'
import { getModule } from 'vuex-module-decorators'
import { mapState } from 'vuex'

@Component({
  computed: {
    ...mapState('org', ['currentOrganization', 'sentInvitations'])
  }
})
export default class SetupAccountSuccessView extends Vue {
  private orgStore = getModule(OrgModule, this.$store)
  private readonly currentOrganization!: Organization
  private readonly sentInvitations!: Invitation[]
  private accountEmail: string = ''

  @Prop({ default: '' }) accountName: string

  private async mounted () {
    this.accountEmail = (this.sentInvitations?.length && this.sentInvitations[this.sentInvitations.length - 1].recipientEmail) ? this.sentInvitations[this.sentInvitations.length - 1].recipientEmail : ''
  }

  goToDashboard () {
    this.$router.push({ path: Pages.STAFF_DASHBOARD })
  }
}
</script>

<style lang="scss" scoped>
  article {
    flex: 1 1 auto;
    margin: 0 auto;
    max-width: 60rem;
  }
</style>

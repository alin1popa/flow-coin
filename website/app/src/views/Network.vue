<template>
  <div class="network">
    <Panel title="Switch network" class="panel" margin="10px">
      <p>
        Select the network and the deployed contract which you'd like to use.
        <br/><br/>
        Please make sure to also switch to the correct network in Metamask.
      </p>
      <div class="network__type">
        <input type="radio" id="mainnet" name="ordertype" v-model="network" v-on:change="changed" value="mainnet"/>
        <label for="mainnet">MainNet ({{this.ADDRESS_MAINNET}})</label>
        <br/><br/>
        <input type="radio" id="ropsten" name="ordertype" v-model="network" v-on:change="changed" value="ropsten" />
        <label for="ropsten">Ropsten ({{this.ADDRESS_ROPSTEN}})</label>
      </div>
      <br/><br/>
    </Panel>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Panel from '@/components/Panel.vue';
import { ContractService } from '@/services/ContractService';
import { StateManager } from '@/services/StateManager';
import { Loader } from '@/services/Loader.ts';
import * as Helper from '@/helpers/Utils.ts';

@Component({
  components: {
    Panel,
  },
  mounted() {
    Loader.GetInstance().LoadApp();
  },
})
export default class Generate extends Vue {
  private ADDRESS_ROPSTEN = '0x1988a16caa08e4908c15de8ff37e21aed2904c20';
  private ADDRESS_MAINNET = '0x1988a16caa08e4908c15de8ff37e21aed2904c21';

  private state = StateManager.GetInstance().GetState();
  private network: string = this.state.contractAddress === this.ADDRESS_ROPSTEN ? 'ropsten' : 'mainnet';

  public changed() {
    StateManager.GetInstance().ResetState();

    switch (this.network) {
      case 'ropsten':
        this.state.contractAddress = this.ADDRESS_ROPSTEN;
        break;
      case 'mainnet':
        this.state.contractAddress = this.ADDRESS_MAINNET;
        break;
    }

    this.state.appLoaded = false;
    Loader.GetInstance().LoadApp();
  }
}
</script>

<style scoped>
.panel {
  min-height: 0;
  max-width: 600px;
  margin: 0 auto;
  color: #5498FF;
  margin-bottom: 30px;
}

.panel:first-of-type {
  margin-top: 30px;
}

p {
  padding: 10px 30px;
  font-weight: bold;
}

.network__type {
  font-weight: bold;
}

</style>
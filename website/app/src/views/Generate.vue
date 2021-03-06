<template>
  <div class="generate">
    <Panel title="Generate flowcoin" class="panel" margin="10px">
      <p>
        Click the button below to generate 1x FC to your account.
        <br/><br/>
        Note: The flowcoins are generated free of charge, you will only pay the transaction mining cost.You can click the button any number of times. 
        
        Flowcoin is available to be generated in a maximum quantity of <span class="number">{{supplyLimit}}</span> tokens. Currently, there are <span class="number">{{totalSupply}}/{{supplyLimit}}</span> tokens already generated. When all tokens will be generated, the button below will stop working. 

        <br/><br/>
        If the transaction fails, try activating advanced gas settings in Metamask; then make sure that you set up a gas price higher than 0 when signing the transaction.
      </p>
      <button v-on:click="generateClicked()" v-bind:disabled="totalSupply>=supplyLimit">Generate</button>
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
    ContractService.UpdateTotalSupply();
  },
})
export default class Generate extends Vue {
  private state = StateManager.GetInstance().GetState();

  get totalSupply() {
    return this.state.totalSupply / Math.pow(10, Helper.Utils.TOKEN_DECIMALS);
  }

  get supplyLimit() {
    return this.state.supplyLimit / Math.pow(10, Helper.Utils.TOKEN_DECIMALS);
  }

  public generateClicked() {
    ContractService.Generate();
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

button {
  background: none;
  border: 1px solid white;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 20px;
}

button:hover {
  border: 1px solid rgb(200, 200, 200);
  color: rgb(200, 200, 200);
}

button:disabled {
  border: 1px solid rgb(100, 100, 100);
  color: rgb(100, 100, 100);

  cursor: not-allowed;
}

.number {
  color: #41D8E8;
}

</style>
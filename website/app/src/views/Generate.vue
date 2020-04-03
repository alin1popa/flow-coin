<template>
  <div class="generate">
    <Panel title="Generate flowcoin" class="panel" margin="10px">
      <p>
        Click the button below to generate 100x FC to your account.
        <br/><br/>
        Note: The flowcoins are generated free of charge but you will pay the transaction costs. Flowcoin is available to be generated in unlimited quantity. You can click the button any number of times.
      </p>
      <button v-on:click="generateClicked()">Generate</button>
    </Panel>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Panel from '@/components/Panel.vue';
import { ContractService } from '@/services/ContractService';

@Component({
  components: {
    Panel,
  },
})
export default class Generate extends Vue {
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

</style>
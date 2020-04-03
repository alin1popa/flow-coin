<template>
  <div class="about">
    <Panel title="Flowcoin" class="panel" margin="10px">
      <p>
        Flowcoin is a <a href="https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/token/ERC20">standard ERC-20 token</a> with a built-in <a href="https://en.wikipedia.org/wiki/Decentralized_exchange">decentralized exchange</a> directly in the <a href="https://github.com/ethereum/wiki/wiki/White-Paper">smart contract</a>.
      </p>
    </Panel>

    <Panel title="How it works" class="panel" margin="10px">
      <p>
        Flowcoin's smart contract contains:
        <ul>
          <li>ERC-20 Standard Token interface</li>
          <li>Interface for placing and interacting with orders</li>
          <li>Interface for market price trading</li>
        </ul>
        <br/><br/>
        Tech stack:
        <ul>
          <li><a href="https://solidity.readthedocs.io/en/v0.5.11/">Solidity 0.5.11</a></li>
          <li><a href="https://vuejs.org">Vue JS</a></li>
          <li><a href="https://www.typescriptlang.org/">Typescript</a></li>
          <li><a href="https://github.com/ethers-io/ethers.js/">ethers.js</a></li>
        </ul>
      </p>
    </Panel>

    <Panel title="About" class="panel" margin="10px">
      <p>
        Created by <a href="http://alinpopa.eu/">Alin Popa</a><br/>
        Fully open source on <a href="https://github.com/alin1popa/flow-coin">Github</a>
      </p>
    </Panel>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Panel from '@/components/Panel.vue';

@Component({
  components: {
    Panel,
  },
})
export default class About extends Vue {}
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

a {
  color: #41D8E8;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

ul li {
  margin-top: 5px;
}

a:hover {
  color: rgb(55, 185, 199);
}
</style>
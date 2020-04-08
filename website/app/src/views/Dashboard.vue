<template>
  <div class="wrapper">
    <div class="dashboard row" v-if=appLoaded>
      <div class="col-xs-12
                  col-sm-12
                  col-md-4 col" id="dashboard__orderbook">
        <Panel title="Order book" class="box" id="panel-orderbook">
          <Orderbook/>
        </Panel>
      </div>
      <div class="col-xs-12
                  col-sm-12
                  col-md-8 col">
        <div class="row">
          <div class="col-xs-12
                      col-sm-6
                      col-md-6 col" id="dashboard__placeorder">
            <Panel title="New order" class="box" id="panel-placeorder">
              <PlaceOrder/>
            </Panel>
          </div>
          <div class="col-xs-12
                      col-sm-6
                      col-md-6 col" id="dashboard__myorders">
            <Panel title="Active orders" class="box" id="panel-myorders">
              <MyOrders/>
            </Panel>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12
                      col-sm-12
                      col-md-12 col" id="dashboard__console">
            <Panel title="Log info" class="box" id="panel-history">
              <Console/>
            </Panel>
          </div>
        </div>
      </div>
    </div>
    <div class="dashboard row" v-if=metamaskNotFound>
      <Panel title="Install Metamask to continue" class="dashboard__error-panel" margin="10px">
        <p>
        The Metamask injected provider was not detected in your browser. Please install the Metamask browser extension to continue.
        <br/><br/>
        When prompted, allow the FC app to connect to your account. This allows the app to query the state of the blockchain, listen for contract events, and send transactions. You will still be prompted to sign any outgoing transaction.
        </p>
        <img src="metamask.PNG" height="400" alt="Metamask connect example"/>
        <p>After you connect the app with the Metamask account, refresh your browser for the changes to take effect.</p>
      </Panel>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Panel from '@/components/Panel.vue';
import Orderbook from '@/components/Orderbook.vue';
import MyOrders from '@/components/MyOrders.vue';
import PlaceOrder from '@/components/PlaceOrder.vue';
import Console from '@/components/Console.vue';
import { StateManager } from '@/services/StateManager.ts';
import { Loader } from '@/services/Loader.ts';

@Component({
  components: {
    Panel,
    Orderbook,
    MyOrders,
    PlaceOrder,
    Console,
  },
  mounted() {
    Loader.GetInstance().LoadApp();
  },
})
export default class Dashboard extends Vue {
  private state = StateManager.GetInstance().GetState();

  get appLoaded(): boolean {
    return this.state.appLoaded;
  }

  get metamaskNotFound(): boolean {
    return this.state.metamaskNotFound;
  }
}
</script>

<style scoped>
.dashboard {
  height: 100%;
}
.col {
  padding: 0;
}
.row {
  margin-left: 0;
  margin-right: 0;
}

.dashboard__error-panel {
    min-height: 0;
    max-width: 600px;
    margin: 0 auto;
    color: #5498FF;
    margin-bottom: 30px;
}

.dashboard__error-panel:first-of-type {
  margin-top: 30px;
}

.dashboard__error-panel p {
  padding: 10px 30px;
  font-weight: bold;
}

#dashboard__orderbook {
  height: calc(100vh - 60px);
  min-height: 680px;
}

#dashboard__placeorder,
#dashboard__myorders,
#dashboard__console {
  height: calc(50vh - 30px);
  min-height: 340px;
}

</style>

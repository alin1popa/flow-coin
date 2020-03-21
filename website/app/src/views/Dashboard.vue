<template>
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
}
</script>

<style scoped>
.dashboard {
  height: 100%;
}
.col {
  padding: 0;
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

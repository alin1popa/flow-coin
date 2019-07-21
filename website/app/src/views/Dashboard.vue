<template>
  <div class="dashboard row">
    <div class="col-xs-12
                col-sm-12
                col-md-4 col">
      <Panel color="red" title="Order book" class="box" id="panel-orderbook">
        <Orderbook/>
      </Panel>
    </div>
    <div class="col-xs-12
                col-sm-12
                col-md-8 col">
      <div class="row">
        <div class="col-xs-12
                    col-sm-6
                    col-md-6 col">
          <Panel color="purple" title="asda" class="box" id="panel-placeorder">
            <Orderbook/>
          </Panel>
        </div>
        <div class="col-xs-12
                    col-sm-6
                    col-md-6 col">
          <Panel color="lightblue" title="asda" class="box" id="panel-myorders">
            <MyOrders/>
          </Panel>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12
                    col-sm-12
                    col-md-12 col">
          <Panel color="lightgreen" title="asda" class="box" id="panel-history">
            <Orderbook/>
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

@Component({
  components: {
    Panel,
    Orderbook,
    MyOrders,
  },
})
export default class Dashboard extends Vue {}
</script>

<style scoped>
.dashboard {
  height: 100%;
  background-color: blue;
}
.col {
  padding: 0;
}
</style>

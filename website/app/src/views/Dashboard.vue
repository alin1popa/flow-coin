<template>
  <div class="dashboard row">
    <div class="col-xs-12
                col-sm-12
                col-md-4">
      <Panel msg="red" class="box" id="panel-orderbook"/>
    </div>
    <div class="col-xs-12
                col-sm-12
                col-md-8">
      <div class="row">
        <div class="col-xs-12
                    col-sm-6
                    col-md-6">
          <Panel msg="purple" class="box" id="panel-placeorder"/>
        </div>
        <div class="col-xs-12
                    col-sm-6
                    col-md-6">
          <Panel msg="lightblue" class="box" id="panel-myorders"/>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12
                    col-sm-12
                    col-md-12">
          <Panel msg="lightgreen" class="box" id="panel-history"/>
        </div>
      </div>
    </div>
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
export default class Dashboard extends Vue {}
</script>

<style scoped>
.dashboard {
  height: 100%;
  background-color: blue;
}
.row div {
  padding: 0;
}
</style>

<template>
  <div class="myorders">
    <p>My balance: {{ balance }}</p>
    {{ state.val }}

    <div class="myorders__list">
      <div class="myorders__item" v-for="order in myorders" v-bind:key="order.id">
        <span class="myorders__item__type">{{ order.type + "s" }}</span> 
        <span class="myorders__item__quantity">{{ order.quantity }} FC</span>
        <span class="myorders__item__rate">@ {{ order.rate }} ETH/FC</span>
        <span class="myorders__item__action"><button v-on:click="actionClicked(order)">Action</button></span>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { Order } from '@/models/Order';
import { OrderType } from '@/constants/OrderType';
import { ContractService } from '@/services/ContractService';
import { StateManager } from '@/services/StateManager';

@Component<MyOrders>({
  mounted() {
    const x = new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    x.then(() => {
      // this.$set(this.cs, 'val', 'duuuude');
      this.state.val = 'duuuuuuude';
    });
  },
})
export default class MyOrders extends Vue {
  private info: string = '';

  private state = StateManager.GetInstance().GetState();

  get balance(): number {
    return ContractService.GetBalance();
  }

  get myorders(): Order[] {
    return ContractService.GetActiveOrders();
  }

  public actionClicked(order: Order) {
    alert(JSON.stringify(order));
  }
}
</script>

<style scoped>
.myorders {
  color: black;
  background-color: navajowhite;
  height: calc(100% - 40px);
}

.myorders__list {
  background-color: lightblue;
}

.myorders__item span {
  display: inline-block;
}

.myorders__item__address {
  background-color: limegreen;
  width: 35%;
}

.myorders__item__type {
  background-color: rebeccapurple;
  width: 15%;
}

.myorders__item__quantity {
  background-color: olive;
  width: 10%;
}

.myorders__item__rate {
  background-color: orchid;
  width: 25%;
}

.myorders__item__action {
  background-color: teal;
  width: 15%;
}
</style>

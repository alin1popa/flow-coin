<template>
  <div class="component">
    <p>My balance: {{ balance }}</p>

    <ul id="example-1">
      <li v-for="order in activeOrders" v-bind:key="order.id">
        {{ order.address }} wants to {{ order.type }} {{ order.quantity }} at a rate of {{ order.rate }} for a total of {{ order.total }}
      </li>
    </ul>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { Order } from '@/models/Order';
import { OrderType } from '@/models/OrderType';
import { ContractService } from '@/services/ContractService';

@Component
export default class Orderbook extends Vue {
  get balance(): number {
    return ContractService.GetBalance();
  }

  get activeOrders(): Order[] {
    return ContractService.GetActiveOrders();
  }
}
</script>

<style scoped>
.component {
  color: black;
  background-color: navajowhite;
  height: calc(100% - 40px);
}
</style>

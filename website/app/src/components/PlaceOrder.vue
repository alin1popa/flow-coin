<template>
  <div class="place-order" v-bind:class="{'place-order--buy': isBuyOrder, 'place-order--sell': !isBuyOrder}">
    <p>Current balance: {{ balance }}</p>

    <div class="place-order__requesttype">
      <input type="radio" id="market" name="requesttype" v-model="isMarketPrice" value="market"/>
      <label for="market">Market price</label>
      <input type="radio" id="regular" name="requesttype" v-model="isMarketPrice" value="" />
      <label for="regular">Limit order</label>
    </div>

    <div class="place-order__ordertype">
      <input type="radio" id="buy" name="ordertype" v-model="isBuyOrder" value="buy"/>
      <label for="buy" class="buy_label">buy</label>
      <input type="radio" id="sell" name="ordertype" v-model="isBuyOrder" value="" />
      <label for="sell" class="sell_label">sell</label>
    </div>

    <div class="place-order__fields">
      <div class="place-order__group">
        <label for="amount">Amount:</label>
        <input id="amount" type="number" name="amount" v-model="amount"/>
      </div>

      <div v-if=!isMarketPrice class="place-order__group">
        <label for="price">Price:</label>
        <input id="price" type="number" name="ratio" v-model="ratio"/>
      </div>

      <div class="place-order__group">
        <span class="place-order__disclaimer">Your order: {{ disclaimerText }}</span>
      </div>

      <div class="place-order__group">
        <button class="place-order__action" name="submit" value="submit" v-bind:disabled="isLoading" v-on:click="submitOrder()">{{ !isLoading ? 'Place Order' : 'Pending...'}}</button>
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
import { Request } from '@/models/Request';
import { RequestType } from '../constants/RequestType';
import { parseEther, bigNumberify } from 'ethers/utils';

@Component<PlaceOrder>({
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

export default class PlaceOrder extends Vue {
  private ratio: number = 1;
  private amount: number = 1;
  private isBuyOrder: string = "buy";
  private isMarketPrice: string = "market";
  private isLoading: boolean = false;

  private info: string = '';

  private state = StateManager.GetInstance().GetState();

  get orderTitle(): string {
    if (!this.isMarketPrice) {
      return 'Place fixed price order';
    } else {
      return 'Place market price order';
    }
  }

  get disclaimerText(): string {
    if (!this.isMarketPrice) {
      return `I want to ${
        this.isBuyOrder ? 'buy' : 'sell'
        } ${this.amount}x FC at ${this.ratio} ethers each`;
    } else {
      return `I want to ${
        this.isBuyOrder ? 'buy' : 'sell'
        } ${this.amount}x FC at the best current market price`;
    }
  }

  get balance(): number {
    return ContractService.GetBalance();
  }

  public submitOrder() {
    this.isLoading = true;

    const request = new Request(
      this.isBuyOrder ? OrderType.BUY : OrderType.SELL,
      this.isMarketPrice ? RequestType.MARKET : RequestType.REGULAR,
      bigNumberify(this.amount.toString()),
      parseEther(this.ratio.toString()),
    );

    ContractService.PlaceOrderRequest(request);
    this.isLoading = false; // TODO this should be a .then()
  }
}
</script>

<style scoped>
.place-order {
  color: rgba(255, 255, 255, 0.753);
  font-weight: bold;
  height: calc(50vh - 30px);
}

.place-order div {
  margin-bottom: 20px;
}

.place-order__fields label {
  width: 80px;
  display: inline-block;
  text-align: left;
}

.place-order__fields input {
  width: 100px;
}

.place-order__group {
  margin-bottom: 15px;
}

.place-order__disclaimer {
  font-size: 12px;
  padding-left: 5px;
  padding-right: 5px;
}

.sell_label {
  background-color: #47FFAE;
  color: #313132;
  border-radius: 3px;
  width: 50px;
  display: inline-block;
}

.buy_label {
  background-color: #41D8E8;
  color: #313132;
  border-radius: 3px;
  width: 50px;
  display: inline-block;
}

.place-order--buy .place-order__ordertype,
.place-order--buy .place-order__fields {
  color: #41D8E8;
}

.place-order--sell .place-order__ordertype,
.place-order--sell .place-order__fields {
  color: #47FFAE;
}

.place-order__action { 
  background: none;
  border: 1px solid white;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
}

</style>


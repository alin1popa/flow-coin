<template>
  <div class="place-order" v-bind:class="{'place-order--buy': isBuyOrder, 'place-order--sell': !isBuyOrder}">
    <p>Current balance: {{ balance }} FC</p>

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
        <input id="amount" type="number" name="amount" min=1 v-model="amount"/>
      </div>

      <div v-if=!isMarketPrice class="place-order__group">
        <label for="price">Price:</label>
        <input id="price" type="number" name="ratio" min=1 v-model="ratio"/>
        <select id="unit" name="unit" v-model="unit">
          <option value="wei">wei</option>
          <option value="kwei">kwei</option>
          <option value="mwei">mwei</option>
          <option value="gwei">gwei</option>
          <option value="ether">ether</option>
        </select>
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
import { parseUnits, bigNumberify } from 'ethers/utils';
import * as Helper from '@/helpers/Utils';

@Component<PlaceOrder>({
  mounted() {
    ContractService.UpdateBalance();
  },
})
export default class PlaceOrder extends Vue {
  private ratio: number = 1;
  private unit: string = 'wei';
  private amount: number = 1;
  private isBuyOrder: string = 'buy';
  private isMarketPrice: string = '';
  private isLoading: boolean = false;

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
        } ${this.amount / Math.pow(10, Helper.Utils.TOKEN_DECIMALS)}x FC for ${this.ratio} ${this.unit} per FC`;
    } else {
      return `I want to ${
        this.isBuyOrder ? 'buy' : 'sell'
        } ${this.amount}x FC at the best current market price`;
    }
  }

  get balance(): string {
    return (this.state.selfBalance.toNumber() / Math.pow(10, Helper.Utils.TOKEN_DECIMALS)).toString();
  }

  public submitOrder() {
    const request = new Request(
      this.isBuyOrder ? OrderType.BUY : OrderType.SELL,
      this.isMarketPrice ? RequestType.MARKET : RequestType.REGULAR,
      bigNumberify(this.amount.toString()),
      parseUnits(this.ratio.toString(), this.unit),
    );

    this.isLoading = true;
    ContractService.PlaceOrderRequest(request)
      .catch(() => {
        Helper.Utils.LogText('Order failed');
      })
      .finally(() => {
        ContractService.UpdateBalance();
        this.isLoading = false;
      });
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

.place-order__action:hover {
  border: 1px solid rgb(200, 200, 200);
  color: rgb(200, 200, 200);
}

.place-order__action:disabled {
  cursor: not-allowed;
  color: gray;
  border: 1px solid gray;
}

#amount {
  width: 180px;
}

#price {
  width: 100px;
}

#unit {
  width: 70px;
  margin-left: 10px;
  height: 21px;
}

</style>


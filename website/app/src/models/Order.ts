import { OrderType } from '@/constants/OrderType';
import { BigNumber } from 'ethers/utils';

export class Order {
    constructor(
        public address: string,
        public type: OrderType,
        public quantity: BigNumber,
        public rate: BigNumber,
    ) {}

    get id(): string {
        return this.type + this.address + this.rate.toString() + this.quantity.toString();
    }

    /**
     * Comparison with other orders in state array
     */
    public equalTo(other: Order) {
        return this.address === other.address &&
            this.rate.eq(other.rate) &&
            this.type === other.type;
    }

    /**
     * Comparison with other orders in state array
     */
    public greaterThan(other: Order) {
        if (this.rate.gt(other.rate)) {
            return true;
        } else if (this.rate.lt(other.rate)) {
            return false;
        } else {
            return this.address >= other.address;
        }
    }
}

export interface Orderbook {
    sellOrders: Order[];
    buyOrders: Order[];
}

import { OrderType } from '@/constants/OrderType';

export class Order {
    constructor(
        public address: string,
        public type: OrderType,
        public quantity: number,
        public rate: number,
    ) {}

    get total(): number {
        return this.quantity * this.rate;
    }

    get id(): string {
        return this.type + this.address + this.rate.toString() + this.quantity.toString();
    }
}

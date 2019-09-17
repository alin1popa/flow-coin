import { OrderType } from '@/constants/OrderType';
import { RequestType } from '@/constants/RequestType';

export class Request {
    constructor(
        public orderType: OrderType,
        public requestType: RequestType,
        public quantity: number,
        public rate: number,
    ) {}
}

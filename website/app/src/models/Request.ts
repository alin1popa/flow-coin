import { OrderType } from './OrderType';
import { RequestType } from './RequestType';

export class Request {
    constructor(
        public orderType: OrderType,
        public requestType: RequestType,
        public quantity: number,
        public rate: number,
    ) {}
}

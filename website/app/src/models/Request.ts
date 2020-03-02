import { OrderType } from '@/constants/OrderType';
import { RequestType } from '@/constants/RequestType';
import { BigNumber } from 'ethers/utils';

export class Request {
    constructor(
        public orderType: OrderType,
        public requestType: RequestType,
        public quantity: BigNumber,
        public rate: BigNumber,
    ) {}
}

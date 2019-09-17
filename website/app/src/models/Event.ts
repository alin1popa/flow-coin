import { EventType } from '@/constants/EventType';
import { BigNumber } from 'ethers/utils';

export class Event {
    constructor(
        public eventType: EventType,
        public address?: string,
        public ratio?: BigNumber,
        public amount?: BigNumber,
    ) {}
}

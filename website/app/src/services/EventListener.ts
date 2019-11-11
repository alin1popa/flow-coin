import { Event } from '@/models/Event';
import { EthereumHelper } from '@/helpers/EthereumHelper';
import { StateManager, IAppState } from '@/services/StateManager';
import { EventType } from '@/constants/EventType';
import { Utils } from '@/helpers/Utils';
import { Order } from '@/models/Order';
import { OrderType } from '@/constants/OrderType';

/**
 * @description Event manager
 * Assumes state and provider are already initialized
 */
export class EventListener {
    public static GetInstance(): EventListener {
        if (!EventListener.instance) {
            EventListener.instance = new EventListener();
        }

        return EventListener.instance;
    }

    private static instance: EventListener;

    private constructor() {}

    public async Initialize() {
        const state = StateManager.GetInstance().GetState();

        // get curret block number
        const latestBlock = await state.provider.getBlockNumber();

        // process past events
        const eventLogs: any[] = await EthereumHelper.GetEventHistory(state.provider, latestBlock);
        const eventHistory: Event[] = eventLogs.map((log) => EthereumHelper.ClassifyEventByTopic(state.contract, log));
        eventHistory.forEach((event: Event) => this.ProcessEvent(event, state));

        // tslint:disable-next-line
        console.log(state.buyOrders[1].greaterThan(state.buyOrders[0]));

        // tslint:disable-next-line
        console.log(JSON.stringify(eventLogs));

        // set up event listeners for future events
        state.provider.resetEventsBlock(latestBlock + 1);
        this.SetUpEventListeners(state.contract);
    }

    private ProcessBuyEvent(event: Event, state: IAppState) {
        const order = new Order(event.address!, OrderType.BUY, event.amount!, event.ratio!);
        Utils.OrderInsertOrUpdate(order, state.buyOrders);
        state.buyOrders.splice(0, 0);
    }

    private ProcessSellEvent(event: Event, state: IAppState) {
        const order = new Order(event.address!, OrderType.SELL, event.amount!, event.ratio!);
        Utils.OrderInsertOrUpdate(order, state.sellOrders);
        state.sellOrders.splice(0, 0);
    }

    private ProcessEvent(event: Event, state: IAppState) {
        switch (event.eventType) {
            case EventType.BUY:
                this.ProcessBuyEvent(event, state);
                break;
            case EventType.SELL:
                this.ProcessSellEvent(event, state);
                break;
        }
    }

    private SetUpEventListeners(contract: any) {
        contract.on('Sell', (ratio: any, amount: any, address: any) => {
            const event = new Event(EventType.SELL, address, ratio, amount);
            const state = StateManager.GetInstance().GetState();

            // tslint:disable-next-line
            console.log(JSON.stringify(event));

            this.ProcessSellEvent(event, state);
        });

        contract.on('Buy', (ratio: any, amount: any, address: any) => {
            const event = new Event(EventType.BUY, address, ratio, amount);
            const state = StateManager.GetInstance().GetState();

            // tslint:disable-next-line
            console.log(JSON.stringify(event));

            this.ProcessBuyEvent(event, state);
        });
    }
}

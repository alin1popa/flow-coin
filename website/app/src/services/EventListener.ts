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
        Utils.LogText('Initializing event listener service...');
        const state = StateManager.GetInstance().GetState();

        // get curret block number
        const latestBlock = await state.provider.getBlockNumber();
        Utils.LogText('Latest ethereum block found: ' + latestBlock);

        // process past events
        Utils.LogText('Processing past event history...');
        const eventLogs: any[] = await EthereumHelper.GetEventHistory(state.provider, latestBlock);
        const eventHistory: Event[] = eventLogs.map((log) => EthereumHelper.ClassifyEventByTopic(state.contract, log));
        eventHistory.forEach((event: Event) => this.ProcessEvent(event, state));
        Utils.LogText('Processed ' + eventHistory.length + ' events');

        Utils.LogText('Last 10 logs: ' + JSON.stringify(eventHistory.slice(-10)));

        // set up event listeners for future events
        Utils.LogText('Resetting events starting at block ' + (latestBlock + 1));
        state.provider.resetEventsBlock(latestBlock + 1);
        this.SetUpEventListeners(state.contract);
        Utils.LogText('Event listener service initialized successfully');
    }

    private AddOrderToOwnOrdersIfNecessary(order: Order, state: IAppState) {
        if (order.address === state.ownAddress) {
            Utils.OrderInsertOrUpdate(order, state.ownOrders);
        }
    }

    private ProcessBuyEvent(event: Event, state: IAppState) {
        const order = new Order(event.address!, OrderType.BUY, event.amount!, event.ratio!);
        Utils.OrderInsertOrUpdate(order, state.buyOrders);
        state.buyOrders.splice(0, 0);

        this.AddOrderToOwnOrdersIfNecessary(order, state);
    }

    private ProcessSellEvent(event: Event, state: IAppState) {
        const order = new Order(event.address!, OrderType.SELL, event.amount!, event.ratio!);
        Utils.OrderInsertOrUpdate(order, state.sellOrders);
        state.sellOrders.splice(0, 0);

        this.AddOrderToOwnOrdersIfNecessary(order, state);
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

            Utils.LogText('New event: ' + JSON.stringify(event));

            this.ProcessSellEvent(event, state);
        });

        contract.on('Buy', (ratio: any, amount: any, address: any) => {
            const event = new Event(EventType.BUY, address, ratio, amount);
            const state = StateManager.GetInstance().GetState();

            Utils.LogText('New event: ' + JSON.stringify(event));

            this.ProcessBuyEvent(event, state);
        });
    }
}

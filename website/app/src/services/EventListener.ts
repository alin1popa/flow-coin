import { Event } from '@/models/Event';
import { EthereumHelper } from '@/helpers/EthereumHelper';
import { StateManager, IAppState } from '@/services/StateManager';
import { EventType } from '@/constants/EventType';

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

        // set up event listeners for future events
        state.provider.resetEventsBlock(latestBlock + 1);
        this.SetUpEventListeners(state.contract);
    }

    private ProcessBuyEvent(event: Event, state: IAppState) {
        // TODO
    }

    private ProcessSellEvent(event: Event, state: IAppState) {
        // TODO
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
        contract.on('Sell', (a: any, b: any, c: any) => {
            // tslint:disable-next-line
            console.log(JSON.stringify({a, b, c}));

            const event = new Event(EventType.SELL, a, b, c);
            const state = StateManager.GetInstance().GetState();

            this.ProcessSellEvent(event, state);
        });

        contract.on('Buy', (a: any, b: any, c: any) => {
            // tslint:disable-next-line
            console.log(JSON.stringify({a, b, c}));

            const event = new Event(EventType.BUY, a, b, c);
            const state = StateManager.GetInstance().GetState();

            this.ProcessBuyEvent(event, state);
        });
    }
}

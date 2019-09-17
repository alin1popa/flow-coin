import { Event } from '@/models/Event';
import { EthereumHelper } from '@/helpers/EthereumHelper';
import { StateManager } from '@/services/StateManager';

/**
 * @description Event manager
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

        // TODO
        const maxBlock = 100000;

        const eventLogs: any[] = await EthereumHelper.GetEventHistory(state.provider, maxBlock);
        const eventHistory: Event[] = eventLogs.map((log) => EthereumHelper.ClassifyEventByTopic(state.contract, log));
    }
}

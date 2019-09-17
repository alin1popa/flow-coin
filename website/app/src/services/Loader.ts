import { Event } from '@/models/Event';
import { EthereumHelper } from '@/helpers/EthereumHelper';
import { StateManager } from '@/services/StateManager';
import { EventListener } from '@/services/EventListener';

/**
 * @description Global loader service
 */
export class Loader {
    public static GetInstance(): Loader {
        if (!Loader.instance) {
            Loader.instance = new Loader();
        }

        return Loader.instance;
    }

    private static instance: Loader;

    private constructor() {}

    public async LoadApp() {
        const state = StateManager.GetInstance().GetState();

        state.provider = EthereumHelper.GetInjectedProvider();
        state.contract = EthereumHelper.GetReadWriteContract();

        const eventListener = EventListener.GetInstance();
        await eventListener.Initialize();
    }
}

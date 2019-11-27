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
        // setup state
        const state = StateManager.GetInstance().GetState();
        if (state.appLoaded) {
            return;
        }

        // tslint:disable-next-line
        console.log("Initialized state");

        try {
            // setup provider and contract
            state.provider = EthereumHelper.GetInjectedProvider();
            state.signer = EthereumHelper.GetSigner(state.provider);
            state.contract = EthereumHelper.GetReadWriteContract(state.signer);
            state.ownAddress = await EthereumHelper.GetCurrentUserAddress(state.signer);

            // tslint:disable-next-line
            console.log("Initialized contract");

            // process events and setup listeners
            const eventListener = EventListener.GetInstance();
            await eventListener.Initialize();

            // tslint:disable-next-line
            console.log("Initialized events");

            state.appLoaded = true;
        } catch (e) {
            // tslint:disable-next-line
            console.log(e);
        }
    }
}

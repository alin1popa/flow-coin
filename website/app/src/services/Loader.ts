import { Event } from '@/models/Event';
import { EthereumHelper } from '@/helpers/EthereumHelper';
import { StateManager } from '@/services/StateManager';
import { EventListener } from '@/services/EventListener';
import { Utils } from '@/helpers/Utils';

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

        Utils.LogText('Initialized state');

        try {
            // setup provider and contract
            state.provider = EthereumHelper.GetInjectedProvider();
            state.signer = EthereumHelper.GetSigner(state.provider);
            state.contract = EthereumHelper.GetReadWriteContract(state.signer);
            state.ownAddress = await EthereumHelper.GetCurrentUserAddress(state.signer);

            Utils.LogText('Initialized contract');

            // process events and setup listeners
            const eventListener = EventListener.GetInstance();
            await eventListener.Initialize();

            Utils.LogText('Initialized events');

            state.appLoaded = true;
        } catch (e) {
            Utils.LogText(e);
            if (e.message === 'METAMASK_NOT_FOUND' || e.message.startsWith('unknown account')) {
                state.metamaskNotFound = true;
            }
        }
    }
}

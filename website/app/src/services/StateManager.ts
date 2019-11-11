import { Order } from '@/models/Order';

/**
 * @description State interface
 */
export interface IAppState {
    val: string;
    contract: any;
    provider: any;
    signer: any;
    appLoaded: boolean;
    buyOrders: Order[];
    sellOrders: Order[];
    ownAddress: string;
    ownOrders: Order[];
}

/**
 * @description App state manager and single source of truth
 */
export class StateManager {
    public static GetInstance(): StateManager {
        if (!StateManager.instance) {
            StateManager.instance = new StateManager();
        }

        return StateManager.instance;
    }

    private static instance: StateManager;

    private state: IAppState = {
        val: 'asdasd',
        contract: null,
        provider: null,
        signer: null,
        appLoaded: false,
        buyOrders: [],
        sellOrders: [],
        ownOrders: [],
        ownAddress: '',
    };

    private constructor() {}

    public GetState(): IAppState {
        return this.state;
    }
}

import { Order } from '@/models/Order';
import { BigNumber, bigNumberify } from 'ethers/utils';

/**
 * @description Log object
 */
export interface ILog {
    time: string;
    id: number;
    text: string;
}

/**
 * @description State interface
 */
export interface IAppState {
    contract: any;
    provider: any;
    signer: any;
    appLoaded: boolean;
    buyOrders: Order[];
    sellOrders: Order[];
    ownAddress: string;
    ownOrders: Order[];
    logs: ILog[];
    selfBalance: BigNumber;
    totalSupply: number;
    supplyLimit: number;
    metamaskNotFound: boolean;
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
        contract: null,
        provider: null,
        signer: null,
        appLoaded: false,
        buyOrders: [],
        sellOrders: [],
        ownOrders: [],
        ownAddress: '',
        logs: [],
        selfBalance: bigNumberify(0),
        totalSupply: 0,
        supplyLimit: 0,
        metamaskNotFound: false,
    };

    private constructor() {}

    public GetState(): IAppState {
        return this.state;
    }
}

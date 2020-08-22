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
    contractAddress: string;
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
        contractAddress: '0x1988a16caa08e4908c15de8ff37e21aed2904c20',
    };

    private constructor() {}

    public GetState(): IAppState {
        return this.state;
    }

    public ResetState() {
        this.state.contract = null;
        this.state.provider = null;
        this.state.signer = null;
        this.state.appLoaded = false;
        this.state.buyOrders = [];
        this.state.sellOrders = [];
        this.state.ownOrders = [];
        this.state.ownAddress = '';
        this.state.logs = [];
        this.state.selfBalance = bigNumberify(0);
        this.state.totalSupply = 0;
        this.state.supplyLimit = 0;
        this.state.metamaskNotFound = false;
    }
}

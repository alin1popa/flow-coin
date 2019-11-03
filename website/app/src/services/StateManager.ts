/**
 * @description State interface
 */
export interface IAppState {
    val: string;
    contract: any;
    provider: any;
    appLoaded: boolean;
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
        appLoaded: false,
    };

    private constructor() {}

    public GetState(): IAppState {
        return this.state;
    }
}

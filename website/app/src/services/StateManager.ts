/**
 * @description State interface
 */
export interface IAppState {
    val: string;
    contract: any;
    provider: any;
}

/**
 * @description App state manager
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
    };

    private constructor() {}

    public GetState(): IAppState {
        return this.state;
    }
}

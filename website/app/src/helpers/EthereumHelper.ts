import { ethers } from 'ethers';
import { EventType } from '@/constants/EventType';
import { Event } from '@/models/Event';
import { Utils } from '@/helpers/Utils';
import { IAppState, StateManager } from '@/services/StateManager';
// tslint:disable-next-line
const abi = require('@/assets/contract_abi.json');

/**
 * Type placeholders because Web3's official types are currently broken
 */
interface IEthereumProvider {
    enable: () => void;
}

interface IWeb3Instance {
    currentProvider: any;
}

interface IWindowWithInjectedProvider {
    ethereum?: IEthereumProvider;
    web3?: IWeb3Instance;
}

interface IEthereumEvent {
    topics: string;
    data: any;
}

export class EthereumHelper {
    /**
     * @description Returns the currently selected contract address
     */
    public static GetContractAddress() {
        const state = StateManager.GetInstance().GetState();
        return state.contractAddress;
    }

    /**
     * @description Gets contract object from a read-only provider
     * @param network Ethereum network, e.g. "ropsten"
     */
    public static GetReadOnlyContract(network: string) {
        const provider = ethers.getDefaultProvider(network);
        const contractAddress = this.GetContractAddress();
        const contract = new ethers.Contract(contractAddress, abi, provider);

        return contract;
    }

    /**
     * @description Gets web3 provider injected by Metamask
     */
    public static GetInjectedProvider() {
        const windowWithInjectedProvider = window as IWindowWithInjectedProvider;

        let injectedProvider;
        if (windowWithInjectedProvider.ethereum !== undefined) {
            windowWithInjectedProvider.ethereum.enable();
            injectedProvider = windowWithInjectedProvider.ethereum;
        } else if (windowWithInjectedProvider.web3 !== undefined) {
            injectedProvider = windowWithInjectedProvider.web3.currentProvider;
        } else {
            Utils.LogText('ERROR: Injected Web3 not found');
            Utils.LogText('Please install MetaMask and allow the dApp to interact with your address.');

            throw new Error('METAMASK_NOT_FOUND');
        }

        const provider = new ethers.providers.Web3Provider(injectedProvider);

        return provider;
    }

    /**
     * @description Gets signer from provider
     */
    public static GetSigner(provider: any) {
        const signer = provider.getSigner(0);

        return signer;
    }

    /**
     * @description Gets current user's address from injected signer
     */
    public static async GetCurrentUserAddress(signer: any) {
        const address = await signer.getAddress();

        return address;
    }

    /**
     * @description Gets read-write contract using specified signer
     */
    public static GetReadWriteContract(signer: any) {
        const contractAddress = this.GetContractAddress();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        return contract;
    }

    /**
     * @description Gets balance of account
     */
    public static GetBalanceOfAccount(contract: any, address: string) {
        return contract.balanceOf(address);
    }

    /**
     * @description Gets event history on contract, from the 0th block up to maxBlock
     * @param provider contract provider
     * @param maxBlock the latest block to fetch events for
     */
    public static async GetEventHistory(provider: any, maxBlock: number | string) {
        return await provider.getLogs({
            fromBlock: 0,
            toBlock: maxBlock,
            address: this.GetContractAddress(),
          });
    }

    /**
     * @description Classifies event by event topic
     * @param contract contract to base events on
     * @param event the event to classify
     */
    public static ClassifyEventByTopic(contract: any, event: IEthereumEvent): Event {
        let eventType: EventType;
        let eventData: any;

        switch (event.topics[0]) {
            case contract.interface.events.Sell.topic:
                eventType = EventType.SELL;
                eventData = contract.interface.events.Sell.decode(event.data, event.topics);
                return new Event(
                    eventType,
                    eventData[2],
                    eventData[0],
                    eventData[1],
                );
            case contract.interface.events.Buy.topic:
                eventType = EventType.BUY;
                eventData = contract.interface.events.Buy.decode(event.data, event.topics);
                return new Event(
                    eventType,
                    eventData[2],
                    eventData[0],
                    eventData[1],
                );
            default:
                eventType = EventType.UNKOWN;
                return new Event(eventType);
        }
    }
}

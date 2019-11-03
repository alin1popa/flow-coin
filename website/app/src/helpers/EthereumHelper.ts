import { ethers } from 'ethers';
import { EventType } from '@/constants/EventType';
import { Event } from '@/models/Event';
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
    public static CONTRACT_ADDRESS = '0x1988a16caa08e4908c15de8ff37e21aed2904c20';

    /**
     * @description Gets contract object from a read-only provider
     * @param network Ethereum network, e.g. "ropsten"
     */
    public static GetReadOnlyContract(network: string) {
        const provider = ethers.getDefaultProvider(network);
        const contractAddress = this.CONTRACT_ADDRESS;
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
            // TODO throw error

            // tslint:disable-next-line
            console.log('ERROR: Injected Web3 not found');
            // tslint:disable-next-line
            console.log('Please install MetaMask and allow the dApp to interact with your address.');
        }

        const provider = new ethers.providers.Web3Provider(injectedProvider);

        return provider;
    }

    /**
     * @description Gets read-write contract using specified provider
     */
    public static GetReadWriteContract(provider: any) {
        const signer = provider.getSigner(0);
        const contractAddress = this.CONTRACT_ADDRESS;
        const contract = new ethers.Contract(contractAddress, abi, signer);

        // console.log(contract.interface.events.Sell.topic);
        // console.log(contract.interface.events.Buy.topic);

        // let event = contract.interface.events.Sell;
        // provider.getLogs({
        //     fromBlock: 0,
        //     toBlock: 'latest',
        //     address: contract.address,
        //   }).then((logs) => {
        //     logs.map((log) => {
                // console.log(log.topics + ' ' + log.data);
                // console.log(contract.interface.events.Sell.decode(log.data, log.topics)[0].toString());
                // console.log(contract.interface.events.Sell.decode(log.data, log.topics)[1].toString());
                // console.log(contract.interface.events.Sell.decode(log.data, log.topics)[2].toString());
        //     });
        //   });

        // contract.on('Sell', (a, b, c) => {
        //     // tslint:disable-next-line
        //     console.log(JSON.stringify({a, b, c}));
        // });

        return contract;
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
            address: this.CONTRACT_ADDRESS,
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

        switch (event.topics) {
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

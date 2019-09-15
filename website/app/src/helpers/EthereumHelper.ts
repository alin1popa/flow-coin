import { ethers } from 'ethers';
// tslint:disable-next-line
const abi = require('@/assets/contract_abi.json');

/**
 * Type placeholders because Web3's official types are currently broken
 */
interface _IEthereumProvider {
    enable: () => void;
}

interface _IWeb3Instance {
    currentProvider: any;
}

interface _IWindowWithInjectedProvider {
    ethereum?: _IEthereumProvider;
    web3?: _IWeb3Instance;
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

    public static GetReadWriteContract() {
        const windowWithInjectedProvider = window as _IWindowWithInjectedProvider;

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
        const signer = provider.getSigner(0);
        const contractAddress = this.CONTRACT_ADDRESS;
        const contract = new ethers.Contract(contractAddress, abi, signer);

        return contract;
    }
}

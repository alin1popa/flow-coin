import { Order } from '@/models/Order';
import { OrderType } from '@/constants/OrderType';
import { Request } from '@/models/Request';
import { RequestType } from '@/constants/RequestType';
import { PriceHistory, PriceAtMoment } from '@/models/PriceHistory';
import { EthereumHelper } from '@/helpers/EthereumHelper';
import { StateManager, IAppState } from '@/services/StateManager';
import { ethers } from 'ethers';

export class ContractService {
    /**
     * @description Gets current account's balance
     * @returns number
     */
    public static GetBalance(): number {
        // TODO
        // https://github.com/ethers-io/ethers.js/issues/308

        const state = StateManager.GetInstance().GetState();
        // const contract = EthereumHelper.GetReadWriteContract(state.provider);
        const contract = state.contract;

        contract.balanceOf('0x005E647155bCfd6BE6B6B158CF880909b3B51863')
        .then((value: number) => alert(value));

        return 420.68;
    }

    /**
     * @description Gets current account's active orders
     * @returns Order[]
     */
    public static GetActiveOrders(): Order[] {
        // TODO
        return [];
    }

    /**
     * @description Places an order request
     * @param request Request
     */
    public static async PlaceOrderRequest(request: Request) {
        // TODO
        const state = StateManager.GetInstance().GetState();
        // const contract = EthereumHelper.GetReadWriteContract(state.provider);
        const contract = state.contract;

        const weiAmount = ethers.utils.parseEther(request.rate.toString());

        const overrides = {
            value: weiAmount.mul(request.quantity),
        };
        const tx = await contract.placeBuyOrder(weiAmount, request.quantity, overrides);
        // tslint:disable-next-line
        console.log(tx.hash);

        await tx.wait();
        state.val = 'MINED';
    }

    /**
     * @description Gets all active orders for all accounts
     * @returns Order[]
     */
    public static GetOrderbook(state: IAppState): Order[] {
        // TODO

        return state.buyOrders.concat(state.sellOrders);
    }

    /**
     * @description Gets settlement price for past transactions
     * @returns PriceHistory
     */
    public static GetPriceHistory(): PriceHistory {
        // TODO
        return [
            new PriceAtMoment(new Date(), 0.6, 20),
            new PriceAtMoment(new Date(Date.now() - 24 * 60 * 60 * 1000), 0.5, 25),
        ];
    }
}

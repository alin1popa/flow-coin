import { Order } from '@/models/Order';
import { OrderType } from '@/constants/OrderType';
import { Request } from '@/models/Request';
import { RequestType } from '@/constants/RequestType';
import { PriceHistory, PriceAtMoment } from '@/models/PriceHistory';
import { EthereumHelper } from '@/helpers/EthereumHelper';
import { StateManager } from '@/services/StateManager';

export class ContractService {
    /**
     * @description Gets current account's balance
     * @returns number
     */
    public static GetBalance(): number {
        // TODO
        // https://github.com/ethers-io/ethers.js/issues/308

        const state = StateManager.GetInstance().GetState();
        const contract = EthereumHelper.GetReadWriteContract(state.provider);

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
        return [
            new Order('0x123456', OrderType.BUY, 25, 0.3),
            new Order('0x123456', OrderType.SELL, 10, 0.8),
            new Order('0x123456', OrderType.BUY, 50, 0.2),
        ];
    }

    /**
     * @description Places an order request
     * @param request Request
     */
    public static PlaceOrderRequest(request: Request): void {
        // TODO
    }

    /**
     * @description Gets all active orders for all accounts
     * @returns Order[]
     */
    public static GetOrderbook(): Order[] {
        // TODO
        return [
            new Order('0x000001', OrderType.BUY, 70, 0.4),
            new Order('0x999999', OrderType.BUY, 25, 0.3),
            new Order('0x999999', OrderType.SELL, 50, 2.5),
            new Order('0x123456', OrderType.BUY, 25, 0.3),
            new Order('0x123456', OrderType.SELL, 10, 0.8),
            new Order('0x123456', OrderType.BUY, 50, 0.2),
        ];
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

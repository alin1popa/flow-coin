import { Order } from '@/models/Order';
import { OrderType } from '@/models/OrderType';

export class ContractService {
    /**
     * @description Gets current account's balance
     * @returns number
     */
    public static GetBalance(): number {
        // TODO
        return 420.68;
    }

    /**
     * @description Gets current account's active orders
     * @returns Order[]
     */
    public static GetActiveOrders(): Order[] {
        return [
            new Order('0x123456', OrderType.BUY, 25, 0.3),
            new Order('0x123456', OrderType.SELL, 10, 0.8),
            new Order('0x123456', OrderType.BUY, 50, 0.2),
        ];
    }
}

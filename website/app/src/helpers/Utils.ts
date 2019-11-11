import { Order } from '@/models/Order';

export class Utils {
    public static OrderInsertOrUpdate(order: Order, array: Order[]) {
        let left = 0;
        let right = array.length;
        let mid;
        let index = 0;

        while (right > left) {
            mid = Math.floor((left + right) / 2);

            if (mid >= array.length) {
                index = array.length;
                break;
            }

            if (order.equalTo(array[mid])) {
                index = mid;
                break;
            }

            if (order.greaterThan(array[mid])) {
                left = mid + 1;
            } else {
                right = mid;
            }

            index = right;
        }

        if (index < array.length && index >= 0 && order.equalTo(array[index])) {
            array[index] = order;
        } else {
            array.splice(index, 0, order);
        }
    }
}

import { Order } from '@/models/Order';

export class Utils {
    public static OrderInsertOrUpdate(order: Order, array: Order[]) {
        // tslint:disable-next-line
        console.log("INSERTING");
        // tslint:disable-next-line
        console.log(order);
        // tslint:disable-next-line
        console.log(order.rate.toString());

        let left = 0;
        let right = array.length;
        let mid;
        let index = 0;

        while (right > left) {
            mid = Math.floor((left + right) / 2);
            // tslint:disable-next-line
            console.log(left, mid, right, index);

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
            // tslint:disable-next-line
            console.log("update", index);
        } else {
            array.splice(index, 0, order);
            // tslint:disable-next-line
            console.log("insertnew", index);
        }
    }
}

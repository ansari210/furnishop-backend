import { orderStatus } from "../constants/OrderStatus";
import Order from "../models/orders";
import { orderCancelledTemplate } from "../templates/order-cancelled";
import {
    findAccessoriesLocallyService,
    findBedVariantWithProductNameByIdService,
} from "./accessories-services";
import { sendEmailWithTemplate } from "./email-services";

//create order
export const createOrderService = async (order: any) => {
    if (order?.orderItems && order?.orderItems?.length > 0) {
        const test = order.orderItems.map(async (orderItem: any) => {
            const bedVariantWithProductName =
                await findBedVariantWithProductNameByIdService(
                    orderItem?.bedId,
                    orderItem._id
                );

            if (bedVariantWithProductName) {
                const data = findAccessoriesLocallyService(
                    bedVariantWithProductName as any,
                    orderItem?.headboard,
                    orderItem?.feet,
                    orderItem?.mattress,
                    orderItem?.color,
                    orderItem?.storage
                );

                console.log({ total: data?.totalPrice });

                return {
                    name: data?.name,
                    categories: data?.categories,
                    image: data?.variant?.image,
                    quantity: orderItem?.quantity,
                    price: data?.totalPrice * Number(orderItem?.quantity),
                    accessories: {
                        size: data?.size,
                        headboard: data?.headboard,
                        mattress: data?.mattress,
                        color: data?.color,
                        storage: data?.storage,
                        feet: data?.feet,
                    },
                };
            }
        });

        order.orderItems = await Promise.all(test);

        order.totalPrice = order.orderItems.reduce(
            (acc: any, item: any) => acc + item.price,
            0
        );

        const newOrder = await Order.create(order);
        return newOrder;
    }
};

//get order by id
export const getOrderByIdService = async (id: string) => {
    const order = await Order.findById(id);
    return order;
};

//get all orders
export const getAllOrdersService = async () => {
    const orders = await Order.find().sort("-createdAt");
    return orders;
};

//update order
export const updateOrderService = async (id: string, order: any) => {
    const updatedOrder = await Order.findByIdAndUpdate(id, order, {
        new: true,
    });
    return updatedOrder;
};

//delete order
export const deleteOrderService = async (id: string) => {
    const deletedOrder = await Order.findByIdAndDelete(id);
    return deletedOrder;
};

//update order status
export const updateOrderStatusService = async (id: string, status: string) => {
    const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { ["payment.status"]: status },
        { new: true }
    );

    if (status === orderStatus.Cancelled) {
        const template = orderCancelledTemplate({
            orderId: updatedOrder?.orderId as any,
            orderAt: updatedOrder?.createdAt as any,
            orderItems: updatedOrder?.orderItems as any,
            totalPrice: updatedOrder?.totalPrice || 0,
            shippingPrice: 0,
        });
        const email = await sendEmailWithTemplate(
            updatedOrder?.user?.email as any,
            template,
            "Order Cancelled"
        );
    }

    return updatedOrder;
};

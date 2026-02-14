import orderModel from "../models/order.model.js";
import shopModel from "../models/shop.model.js";
import userModel from "../models/user.model.js";

export async function placeOrder(req, res) {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;
    if (!cartItems || cartItems.length == 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }
    if (
      !deliveryAddress.text ||
      !deliveryAddress.latitude ||
      !deliveryAddress.longitude
    ) {
      return res.status(400).json({ message: "Address is required." });
    }

    const groupItemsByShop = {};

    cartItems.forEach((item) => {
      const shopId = item.shop;
      if (!groupItemsByShop[shopId]) {
        groupItemsByShop[shopId] = [];
      }
      groupItemsByShop[shopId].push(item);
    });

    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await shopModel.findById(shopId).populate("owner");
        if (!shop) {
          return res.status(400).json({ message: `Shop is not found.` });
        }
        const items = groupItemsByShop[shopId];
        const subTotal = items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0,
        );
        return {
          shop: shop._id,
          owner: shop.owner._id,
          subtotal: subTotal,
          shopOrderItems: items.map((i) => ({
            item: i.id,
            price: i.price,
            quantity: i.quantity,
            name: i.name,
          })),
        };
      }),
    );

    const newOrder = await orderModel.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    });

    return res.status(200).json(newOrder);
  } catch (error) {
    return res.status(500).json({ message: `Place order error : ${error}` });
  }
}

export async function getMyOrders(req, res) {
  try {
    const user = await userModel.findById(req.userId);
    if (user.role == "user") {
      const orders = await orderModel
        .find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("shopOrders.owner", "name email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price");

      return res.status(200).json(orders);
    } else if (user.role == "owner") {
      const orders = await orderModel
        .find({ "shopOrders.owner": req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("user")
        .populate("shopOrders.shopOrderItems.item", "name image price");

      const filteredOrders = orders.map((order) => ({
        _id: order._id,
        paymentMethod: order.paymentMethod,
        user: order.user,
        shopOrders: order.shopOrders.find((o) => o.owner._id == req.userId),
        createdAt: order.createdAt,
        deliveryAddress: order.deliveryAddress
      }));

      return res.status(200).json(filteredOrders);
    }
  } catch (error) {
    return res.status(500).json({ message: `Get order error : ${error}` });
  }
}

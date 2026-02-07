import itemModel from "../models/item.model.js";
import shopModel from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export async function addItem(req, res) {
  try {
    const { name, category, foodType, price } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({ message: "Missing fields" });
    }
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    const shop = await shopModel.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(400).json({ message: `Shop not found` });
    }
    const item = await itemModel.create({
      name,
      category,
      foodType,
      price,
      image,
      shop: shop._id,
    });
    shop.items.push(item._id);
    await shop.save();
    await shop.populate([
      { path: "owner" },
      { path: "items", options: { sort: { updatedAt: -1 } } },
    ]);

    return res.status(201).json(shop);
  } catch (error) {
    return res.status(500).json({ message: `Add item error : ${error}` });
  }
}

// edit item
export async function editItem(req, res) {
  try {
    const itemId = req.params.itemId;
    const { name, category, foodType, price } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    const item = await itemModel.findByIdAndUpdate(
      itemId,
      {
        name,
        category,
        foodType,
        price,
        image,
      },
      { new: true },
    );

    if (!item) {
      return res.status(400).json({ message: "Item not found to edit" });
    }
    const shop = await shopModel.findOne({ owner: req.userId }).populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });
    return res.status(200).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error during editing item : ${error}` });
  }
}

// get one item
export async function getItmeByID(req, res) {
  try {
    const itemId = req.params.itemId;
    const item = await itemModel.findById(itemId);
    if (!item) {
      return res.status(400).json({ message: `Item not found` });
    }
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ message: `Item finding error : ${error}` });
  }
}

// delete item
export async function deleteItem(req, res) {
  const itemId = req.params.itemId;
  try {
    const item = await itemModel.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(400).json({ message: "Item not found." });
    }
    const shop = await shopModel.findOne({ owner: req.userId });
    shop.items = await shop.items.filter((i) => i !== item._id);
    await shop.save();
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });
    return res.status(200).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error during deleting item : ${error}` });
  }
}

// get items by there city
export async function getItemByCity(req, res) {
  try {
    const { city } = req.params;
    if (!city) {
      return res.status(400).json({ message: `City is required.` });
    }
    const shops = await shopModel.find({
        city: { $regex: new RegExp(`^${city}$`, "i") },
      })
      .populate("items");
    if (!shops) {
      return res.status(400).json({ message: `Shops not found.` });
    }
    const shopIds = shops.map((shop) => shop._id);

    const items = await itemModel.find({ shop: { $in: shopIds } });

    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: `Get item by city : ${error}` });
  }
}

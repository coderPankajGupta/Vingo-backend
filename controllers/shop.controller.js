import shopModel from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export async function createEditShop(req, res) {
  const { name, city, state, address } = req.body;
  try {
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    let shop = await shopModel.findOne({ owner: req.userId });
    if (!shop) {
      shop = await shopModel.create({
        name,
        city,
        state,
        address,
        image,
        owner: req.userId,
      });
    } else {
      shop = await shopModel.findByIdAndUpdate(
        shop._id,
        {
          name,
          city,
          state,
          address,
          image,
          owner: req.userId,
        },
        { new: true },
      );
    }

    await shop.populate("owner items");
    return res.status(201).json(shop);
  } catch (error) {
    return res.status(500).json({ message: `Create shop error ${error}` });
  }
}

export async function getMyShop(req, res) {
  try {
    const shop = await shopModel
      .findOne({ owner: req.userId })
      .populate("owner")
      .populate({
        path: "items",
        options: { sort: { updatedAt: -1 } },
      });
    if (!shop) {
      return null;
    }
    return res.status(200).json(shop);
  } catch (error) {
    return res.status(500).json({ message: `Get my shop error ${error}` });
  }
}

export async function getShopByCity(req,res) {
  const {city} = req.params
  try {
    const shops = await shopModel.find({
      city : {$regex: new RegExp(`^${city}$`,"i")}
    }).populate('items')
    if(!shops) {
      return res.status(400).json({message:`Shops not found.`})
    }
    return res.status(200).json(shops)
  } catch (error) {
    return res.status(500).json({ message: `Get shop by city error : ${error}` });
  }
}
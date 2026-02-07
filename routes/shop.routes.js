import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { createEditShop, getMyShop, getShopByCity } from "../controllers/shop.controller.js";
import { upload } from "../middleware/multer.js";

const shopRouter = express.Router();

shopRouter.post("/create-edit", isAuth, upload.single("image"), createEditShop);
shopRouter.get("/get-my", isAuth, getMyShop);
shopRouter.get("/get-by-city/:city", isAuth, getShopByCity);

export default shopRouter;

import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import {
  addItem,
  deleteItem,
  editItem,
  getItemByCity,
  getItmeByID,
} from "../controllers/item.controller.js";
import { upload } from "../middleware/multer.js";

const itemRouter = express.Router();

itemRouter.post("/add-item", isAuth, upload.single("image"), addItem);
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image"), editItem);
itemRouter.get("/get-by-id/:itemId", isAuth, getItmeByID);
itemRouter.get("/delete/:itemId", isAuth, deleteItem);
itemRouter.get("/get-by-city/:city", isAuth, getItemByCity);

export default itemRouter;

import express from "express";
import { CartController } from "./cart.controller";

const router = express.Router();

router.post("/", CartController.addToCart);

// Changed /user/:userId to /user/:email
router.get("/user/:email", CartController.getMyCart);

router.patch("/:id", CartController.updateCartItemQuantity);
router.delete("/:id", CartController.removeFromCart);

export const cartRoutes = router;

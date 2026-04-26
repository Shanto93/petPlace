import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { CartServices } from "./cart.services";

const addToCart = catchAsync(async (req: Request, res: Response) => {
  const result = await CartServices.addToCart(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tossed in cart successfully!",
    data: result,
  });
});

const getMyCart = catchAsync(async (req: Request, res: Response) => {
  // Fetching the email from the URL parameter instead of userId
  const { email } = req.params;
  const result = await CartServices.getMyCart(email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cart retrieved",
    data: result,
  });
});

const updateCartItemQuantity = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const result = await CartServices.updateCartItemQuantity(id, quantity);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Cart updated",
      data: result,
    });
  },
);

const removeFromCart = catchAsync(async (req: Request, res: Response) => {
  const result = await CartServices.removeFromCart(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Item removed",
    data: result,
  });
});

export const CartController = {
  addToCart,
  getMyCart,
  updateCartItemQuantity,
  removeFromCart,
};

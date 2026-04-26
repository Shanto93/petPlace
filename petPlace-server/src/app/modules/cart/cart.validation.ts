import { z } from "zod";

const addToCartValidation = z.object({
  body: z.object({
    userId: z.string({ message: "User ID is required" }), // Make sure this says userId
    itemId: z.string({ message: "Item ID is required" }),
    quantity: z.number().int().positive().default(1),
  }),
});

const updateCartValidation = z.object({
  body: z.object({
    quantity: z
      .number()
      .int()
      .nonnegative({ message: "Quantity must be 0 or more" }),
  }),
});

export const CartValidation = { addToCartValidation, updateCartValidation };

import { prisma } from "../../shared/prisma";

const addToCart = async (payload: {
  userId: string;
  itemId: string;
  quantity: number;
}) => {
  let actualUserUuid = payload.userId;

  // 1. SMART CHECK: If the userId is just a number (e.g., "12"), we need to convert it to the UUID
  if (!actualUserUuid.includes("-") && !isNaN(Number(actualUserUuid))) {
    // Find the matching profile based on the Integer User ID
    const userRecord = await prisma.user.findUnique({
      where: { id: Number(actualUserUuid) },
      include: { authenticatedUser: true },
    });

    if (!userRecord || !userRecord.authenticatedUser) {
      throw new Error(
        "Could not find matching AuthenticatedUser profile in the database.",
      );
    }

    // Assign the correct UUID!
    actualUserUuid = userRecord.authenticatedUser.id;
  }

  // 2. Check if this exact item is already in THIS specific user's cart
  const existingCartItem = await prisma.cartItem.findFirst({
    where: {
      userId: actualUserUuid, // Using the guaranteed UUID
      itemId: payload.itemId,
    },
  });

  // 3. If it exists, just increase the quantity
  if (existingCartItem) {
    return await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity + payload.quantity },
      include: { item: true },
    });
  }

  // 4. If it doesn't exist, create a new cart entry
  return await prisma.cartItem.create({
    data: {
      userId: actualUserUuid, // Using the guaranteed UUID
      itemId: payload.itemId,
      quantity: payload.quantity,
    },
    include: { item: true },
  });
};

const getMyCart = async (userId: string) => {
  let actualUserUuid = userId;

  // 1. SMART CHECK: If the userId is just a number (e.g., "12"), convert it to the UUID
  if (!actualUserUuid.includes("-") && !isNaN(Number(actualUserUuid))) {
    const userRecord = await prisma.user.findUnique({
      where: { id: Number(actualUserUuid) },
      include: { authenticatedUser: true }
    });

    if (userRecord && userRecord.authenticatedUser) {
      actualUserUuid = userRecord.authenticatedUser.id; // Assign the correct UUID
    }
  }

  // 2. Fetch all cart items using the guaranteed UUID
  return await prisma.cartItem.findMany({
    where: { userId: actualUserUuid }, // Now it looks for the correct UUID!
    include: {
      item: true, // Joins the Item table so you get images, title, and price
    },
    orderBy: { createdAt: "desc" },
  });
};

// These two remain exactly the same
const updateCartItemQuantity = async (cartItemId: string, quantity: number) => {
  if (quantity <= 0) {
    return await prisma.cartItem.delete({ where: { id: cartItemId } });
  }
  return await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
    include: { item: true },
  });
};

const removeFromCart = async (cartItemId: string) => {
  return await prisma.cartItem.delete({ where: { id: cartItemId } });
};

export const CartServices = {
  addToCart,
  getMyCart,
  updateCartItemQuantity,
  removeFromCart,
};

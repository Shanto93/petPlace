import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import pick from "../../utils/pick";
import { userFilterableFields, userOptionsFields } from "./user.constant";
import { UserServices } from "./user.services";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, userOptionsFields);

  const result = await UserServices.getAllUsers(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createUser(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});



const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createAdmin(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  createUser,
  createAdmin,
};

import { Request, Response, NextFunction, RequestHandler } from "express";
import { body, param, validationResult } from "express-validator";

export const validationHandling = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
    return;
  }

  next();
};

// const validationHandling: RequestHandler = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void => {
//   try {
//     const errorValidation = validationResult(req);
//     if (!errorValidation.isEmpty()) {
//       res.status(400).json({
//         message: "Validation failed",
//         errors: errorValidation.array(),
//       });
//       return;
//     }
//     next();
//   } catch (err: any) {
//     return next(err)
//   }
// };

export const registValidation = [
  body("username").notEmpty().withMessage("Username is required."),
  body("email")
  .notEmpty().withMessage("Email is required.")
  .isEmail().withMessage("Email must be valid.")
,
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minUppercase: 1,
      minSymbols: 0
    })
    .withMessage("Password must have at least 8 characters, including 1 lowercase, 1 uppercase, and 1 number."),
  validationHandling,
];

export const loginValidation = [
  body("email")
  .notEmpty().withMessage("Email is required.")
  .isEmail().withMessage("Email must be valid.")
,
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minUppercase: 1,
    })
    .withMessage("Password must have at least 8 characters, including 1 lowercase, 1 uppercase, and 1 number."),
  validationHandling,
];

export const passwordValidator = [
  body("old_password")
    .notEmpty()
    .withMessage("Please fill in your current password."),
  body("new_password")
    .notEmpty()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minUppercase: 1,
    })
    .withMessage(
      "Please create a new password of minimum 6 characters, 1 lowercase, 1 uppercase, and 1 number."
    ),
  validationHandling,
];

export const eventValidator = [
  body("name").notEmpty().withMessage("Please fill in the event title."),
  body("price")
    .notEmpty()
    .withMessage("Ticket price is required")
    .isNumeric()
    .withMessage("Ticket price must be a number")
    .custom((value) => value >= 0)
    .withMessage("Ticket price must be 0 or more."),
  body("start_date")
    .notEmpty()
    .withMessage("Start date is required.")
    .isISO8601()
    .withMessage("Invalid start date format."),
  body("end_date")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("Invalid end date format")
    .custom((value, { req }) => {
      return new Date(value) > new Date(req.body.start_date);
    })
    .withMessage("End date must be after start date."),
  body("event_type").notEmpty().withMessage("Please choose the event type."),
  body("seat_capacity")
    .isInt({ min: 1 })
    .withMessage("Seat capacity must be a number and not negative"),
  validationHandling,
];

export const couponValidator = [
  body("code")
    .notEmpty()
    .withMessage("Coupon code is required.")
    .isString()
    .withMessage("Coupon code must be a string."),

  body("discount_type")
    .notEmpty()
    .withMessage("Discount type is required.")
    .isIn(["fixed", "percentage"])
    .withMessage("Discount type must be either 'fixed' or 'percentage'."),

  body("discount_value")
    .notEmpty()
    .withMessage("Discount amount is required.")
    .isInt({ min: 1 })
    .withMessage("Please enter positive number only."),

  body("usage_limit")
    .notEmpty()
    .withMessage("Usage limit cannot be empty.")
    .isInt({ min: 1 })
    .withMessage("Please enter positive number only."),

  body("expires_at")
    .notEmpty()
    .withMessage("Expiry date is required.")
    .isISO8601()
    .toDate()
    .withMessage("Expiry date must be a valid date in ISO8601 format."),
  validationHandling,
];

export const orgProfileValidator = [
  body("organizer_name")
    .isString()
    .withMessage("Please enter characters only.")
    .isLength({ min: 5 })
    .withMessage("Please enter at least 5 characters"),

  body("organizer_address")
    .isLength({ min: 5 })
    .withMessage("Please enter at least 5 characters for address."),

  body("organizer_phone")
    .isMobilePhone("id-ID")
    .withMessage("Invalid phone number format for Indonesia."),
  validationHandling,
];

export const editEventValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Invalid event ID."),

  body("name")
    .optional()
    .isString()
    .withMessage("Event name must be a string.")
    .isLength({ min: 3 })
    .withMessage("Event name must be at least 3 characters."),

  body("price")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Price must be a non-negative integer."),

  body("start_date")
    .optional()
    .isISO8601()
    .withMessage("Start date must be in ISO8601 format."),

  body("end_date")
    .optional()
    .isISO8601()
    .withMessage("End date must be in ISO8601 format."),

  body("event_type")
    .optional()
    .isString()
    .withMessage("Event type must be a string."),

  body("seat_capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Seat capacity must be a positive number."),

  validationHandling,
];

export const deleteEventValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Invalid event ID."),
  validationHandling,
];
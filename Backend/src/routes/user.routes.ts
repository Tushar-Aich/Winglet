import { Router } from "express";
import {
  sendMail,
  signUp,
  verifyOTP,
  login,
  refreshAccessToken,
  logout,
  forgotPasswordEmail,
  forgotPasswordOtpVerification,
  changePassword,
  updateAvatar,
  updateCoverImage,
  addBio,
  addBirthDate,
  deleteAcc,
  userDetails,
  suggestedUsers,
  searchUser,
  saveFCM
} from "../controllers/User/user.controller.js";
import OTPrateLimit from "../middlewares/OTPrateLimit.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/sendMail").post(OTPrateLimit, sendMail);
router.route("/verifyOTP").post(OTPrateLimit, verifyOTP);
router.route("/signUp").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  signUp
);

router.route("/login").post(login);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/logout").post(verifyJWT, logout);

router.route("/add-bio").post(verifyJWT, addBio);

router.route("/add-birth-date").post(verifyJWT, addBirthDate);

router.route("/update-avatar").post(
  verifyJWT,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  updateAvatar
);

router.route("/update-cover-image").post(
  verifyJWT,
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  updateCoverImage
);

router.route("/delete").delete(verifyJWT, deleteAcc);

router.route("/forgotPassword-Email").post(forgotPasswordEmail);

router
  .route("/forgotPassword-verify-token")
  .post(forgotPasswordOtpVerification);

router.route("/change-password").post(changePassword);

router.route("/").get(verifyJWT, userDetails)

router.route("/suggested-users").get(verifyJWT, suggestedUsers)

router.route("/search").post(verifyJWT, searchUser)

router.route("/save-token").post(verifyJWT, saveFCM)

export default router;

import { Router } from "express";
import { changeCurrentPassword, getChannelProfile, getCurrentUser, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import multer from "multer";
import { getVideo, uploadVideo } from "../controllers/video.controller.js";

const router = Router()

router.route("/register").post(
    upload.fields([ // this is middleware
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        },
    ]),
    registerUser
)


router.route("/login").post(loginUser)

// secured routes

router.route("/logout").post(verifyJWT, logoutUser) // verifyjwt is middleware
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
router.route("/c/:username").get(verifyJWT,getChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)

router.route("/upload-video").post(verifyJWT,
    upload.fields([ // this is middleware
        {
            name: 'video',
            maxCount: 1
        },
        {
            name: 'thumbnail',
            maxCount: 1
        },
    ]),
    uploadVideo
)

router.route("/get-video").get(verifyJWT,getVideo)




export default router
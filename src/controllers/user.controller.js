import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshTockens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessTocken();
        const refreshToken = user.generateRefreshTocken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };  // Fixed typo
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");  // Fixed typo
    }
};


const registerUser = asyncHandler(async (req, res) => {
    // Getting data from the request body
    const { fullName, email, username, password } = req.body;
    // console.log("email:", email);

    // Validation
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if the user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });
    if (existedUser) {
        throw new ApiError(409, "User with username or email already exists!!");
    }

    // Validating images
    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // Upload images to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required");
    }

    // Entry in the database
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    // Check if the user is created
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    // Sending response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    );
});


const loginUser = asyncHandler(async (req, res) => {
    // Getting data from the request body
    const { email, username, password } = req.body;
    if (!(username || email)) {
      throw new ApiError(400, "Username or email is required");
    }
  
    const user = await User.findOne({
      $or: [{ username }, { email }]
    });
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }
  
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Incorrect Password");
    }
  
    const { accessToken, refreshToken } = await generateAccessAndRefreshTockens(user._id);
  
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
  
    // Options for setting cookies
    const cookieOptions = {
      httpOnly: true, // Ensures the cookie cannot be accessed via JavaScript
      secure: process.env.NODE_ENV === 'production', // Set to true if in production
      sameSite: 'Strict' // Adjust based on your use case
    };
  
    // Set cookies
    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);
  
    // Respond with JSON data
    return res.status(200).json({
      user: loggedInUser,
      accessToken,
      refreshToken,
      message: "User Logged in successfully"
    });
  });
  


const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            },
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true, // Security steps for cookies
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});


const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRequestToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRequestToken){
        throw new ApiError(401,"unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRequestToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"invalid refresh token")
        }
    
        if (incomingRequestToken !== user?.refreshToken) {
            throw new ApiError(401,"Refresh token is expired or used")
        }
    
        const options = {
            httpOnly : true,
            secure : true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTockens(user._id)
    
        return res
        .status(200)
        .clearCookie("accessToken",accessToken ,options)
        .clearCookie("refreshToken",newRefreshToken ,options)
        .json(new ApiResponse(200, {accessToken, refreshToken:newRefreshToken}, "Access token refreshed succesfully"));
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid refresh token")
    }
})


const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id) // taken from middleware
    console.log(oldPassword)
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordValid){
        throw new ApiError(400,"Invalid Old Password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave:false}) // this will not change other fields

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password changed successfully"))
})


const getCurrentUser = asyncHandler(async(req,res)=>{   
    const user = await User.findById(req.user?._id);
    return res
    .status(200)
    .json(new ApiResponse(200, user, "current user fetched successfully"))
})


const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;
    
    // Validate input
    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required");
    }

    // Update user details and await the result
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email,
            },
        },
        { new: true }
    ).select("-password");

    // Respond with the updated user details
    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"));
});



const updateUserAvatar = asyncHandler(async(req,res)=>{
    const avatarLocalPath = req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if(!avatar.url){
        throw new ApiError(400, "error while uploading avatar")
    }

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar : avatar.url
            }
        },
        {new : true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Avatar updated successfully"))
})


const updateUserCoverImage = asyncHandler(async(req,res)=>{
    const coverImageLocalPath = req.file?.path
    if(!coverImageLocalPath){
        throw new ApiError(400,"Cover image file is missing")
    }

    const coverImage = uploadOnCloudinary(coverImageLocalPath)
    if(!coverImage.url){
        throw new ApiError(400,"error while uploading cover image")
    }

    User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                coverImage : coverImage.url
            }
        },
        {new : true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Cover image updated successfully"))
})


const getChannelProfile = asyncHandler(async(req,res)=>{
    const {username} = req.params
    if(!username?.trim()){
        throw new ApiError(400,"username is missing")
    }

    // writting aggregate pipelines 

    const channel = await User.aggregate([
        {
            $match : {
                username : username?.toLowerCase()
            }
        },
        {
            $lookup : {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields:{
                subscribersCount : {
                    $size : "$subscribers" // added $ because now subscribers is field and size will return count
                },
                channelsSubscribedToCount : {
                    $size : "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then : true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1, // one is flag
                username : 1,
                subscribersCount: 1,
                channelsSubscribedToCount:1,
                isSubscribed:1,
                avatar:1,
                coverImage: 1,
                email:1
            }
        }
    ])

    if(!channel?.length){
        throw new ApiError(404,"channel does not exists")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, channel[0],"user channel fetched successfully"))
})


const getWatchHistory = asyncHandler(async(req,res)=>{
    const user = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from : "videos",
                localField:"watchHistory",
                foreignField: "_id",
                as : "watchHistory",
                pipeline:[ //nested pipeline
                    {
                        $lookup:{
                            from : "users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        fullName:1,
                                        username:1,
                                        avatar:1,   
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first:"$owner" // this isfor structuring data because the data we get will be in the form of array for making easier for front end we are only sending meaning full data like first element of object for infor read mangodb documentation
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200,user[0].watchHistory,"Watch history fetched successfully"))
}) 


export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getChannelProfile, getWatchHistory };
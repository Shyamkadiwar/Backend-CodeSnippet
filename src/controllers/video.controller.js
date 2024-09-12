import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Upload Video Controller
const uploadVideo = asyncHandler(async (req, res) => {
    // Check if files exist
    if (!req.files || !req.files.video || !req.files.video[0]) {
        throw new ApiError(400, "Video file is required");
    }

    const videoLocalPath = req.files.video[0].path;
    const video = await uploadOnCloudinary(videoLocalPath);
    if (!video) {
        throw new ApiError(400, "Failed to upload video");
    }

    if (!req.files.thumbnail || !req.files.thumbnail[0]) {
        throw new ApiError(400, "Thumbnail file is required");
    }

    const thumbnailLocalPath = req.files.thumbnail[0].path;
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail) {
        throw new ApiError(400, "Failed to upload thumbnail");
    }

    const { title, description } = req.body;
    const owner = req.user._id; // Use the user's ID for the owner
    console.log(owner);

    const final = await Video.create({
        title,
        description,
        owner,
        videoFile: video.url, // Assuming `video` contains Cloudinary URL
        thumbnail: thumbnail.url // Assuming `thumbnail` contains Cloudinary URL
    });

    return res.status(201).json(
        new ApiResponse(200, final, "Video uploaded successfully")
    );
});

// Get Videos by Logged-in User
const getVideo = asyncHandler(async (req, res) => {
    const ownerId = req.user._id; // Logged-in user's ID

    // Find all videos uploaded by the user
    const videos = await Video.find({ owner: ownerId }).populate('owner', 'username'); // Assuming User model has a `username`

    if (!videos || videos.length === 0) {
        throw new ApiError(404, "No videos found for this user");
    }

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos retrieved successfully")
    );
});

export { uploadVideo, getVideo };

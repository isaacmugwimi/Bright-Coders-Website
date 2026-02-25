import { blogValidationSchema } from "../Middleware/Validators/blogValidator.js";
import * as Queries from "../Database/Config/blogQueries.js";

// 1. ADD NEW BLOG
export const handleAddBlog = async (request, response) => {
  try {
    const { error, value } = blogValidationSchema.validate(request.body, {
      abortEarly: false,
    });
    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      return response
        .status(400)
        .json({ message: "Validation failed!", errors: errorMessages });
    }

    const newBlog = await Queries.createBlog(value);
    return response.status(201).json(newBlog);
  } catch (error) {
    return response
      .status(500)
      .json({ message: "An internal error occurred while creating the blog." });
  }
};

// 2. GET ALL BLOGS (Admin View)
export const handleGetAllBlogs = async (request, response) => {
  try {
    const blogs = await Queries.getAllBlogs();
    return response.status(200).json(blogs);
  } catch (error) {
    console.error("GET_ALL_BLOGS_ERROR:", error);
    return response
      .status(500)
      .json({ message: "Unable to retrieve blogs at this time." });
  }
};

// 3. GET LIVE BLOGS (Public View)
export const handleGetLiveBlogs = async (request, response) => {
  try {
    const blogs = await Queries.getLiveBlogs();
    return response.status(200).json(blogs);
  } catch (error) {
    console.error("GET_LIVE_BLOGS_ERROR:", error);
    return response
      .status(500)
      .json({ message: "Unable to load the blog feed." });
  }
};

// 4. UPDATE BLOG CONTENT
export const handleUpdateBlog = async (request, response) => {
  try {
    const { id } = request.params;
    const { error, value } = blogValidationSchema.validate(request.body, {
      abortEarly: false,
    });

    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      return response
        .status(400)
        .json({ message: "Validation failed!", errors: errorMessages });
    }

    const updatedBlog = await Queries.updateBlogById(id, value);
    if (!updatedBlog) {
      return response.status(404).json({ message: "Blog not found." });
    }

    return response.status(200).json(updatedBlog);
  } catch (error) {
    console.error("UPDATE_BLOG_ERROR:", error);
    return response.status(500).json({ message: "Failed to update the blog." });
  }
};

// 5. PUSH TO LIVE (Publish)
export const handlePublishBlog = async (request, response) => {
  try {
    const { id } = request.params;
    const publishedBlog = await Queries.pushBlogToLiveDb(id);

    if (!publishedBlog)
      return response.status(404).json({ message: "Blog not found." });

    return response
      .status(200)
      .json({ message: "Blog is now live!", data: publishedBlog });
  } catch (error) {
    console.error("PUBLISH_BLOG_ERROR:", error);
    return response
      .status(500)
      .json({ message: "Error occurred while publishing the blog." });
  }
};

// 6. WITHDRAW FROM LIVE (Unpublish)
export const handleWithdrawBlog = async (request, response) => {
  try {
    const { id } = request.params;
    const withdrawnBlog = await Queries.withdrawBlogsFromLiveWeb(id);

    if (!withdrawnBlog)
      return response.status(404).json({ message: "Blog not found." });

    return response
      .status(200)
      .json({
        message: "Blog withdrawn from public view.",
        data: withdrawnBlog,
      });
  } catch (error) {
    console.error("WITHDRAW_BLOG_ERROR:", error);
    return response
      .status(500)
      .json({ message: "Error occurred while withdrawing the blog." });
  }
};

// 7. DELETE BLOG
export const handleDeleteBlog = async (request, response) => {
  try {
    const { id } = request.params;
    const deletedBlog = await Queries.deleteBlogById(id);

    if (!deletedBlog) {
      return response
        .status(404)
        .json({ message: "Blog does not exist or already deleted." });
    }

    return response.status(200).json({ message: "Blog successfully deleted." });
  } catch (error) {
    console.error("DELETE_BLOG_ERROR:", error);
    return response.status(500).json({ message: "Could not delete the blog." });
  }
};

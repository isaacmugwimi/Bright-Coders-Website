import * as Queries from "../Database/Config/courseQueries";
// ========================================
// 🔹 Create Course
// ========================================
export const handleAddCourse = async (request, response) => {
  try {
    const course = await Queries.createCourse(request.body);

    // if (req.body.syncWithBrightCoders) {
    //   try {
    //     console.log("🚀 Syncing to BrightCoders Public Page...");

    //     // This is the external API of your public-facing landing page
    //     await axios.post("https://brightcoders.co.ke/api/v1/update-catalog", {
    //       apiKey: process.env.PUBLIC_SITE_SECRET, // Security key
    //       courseData: course, // Send the data we just saved
    //     });

    //     console.log("✅ Public page updated!");
    //   } catch (syncError) {
    //     // If the public site fails, we log it but don't crash the admin panel
    //     console.error("❌ Sync to public page failed:", syncError.message);
    //   }
    // }

    return response.status(201).json(course);
  } catch (err) {
    response.status(500).json({ error: "Failed to add course" });
  }
};

// ========================================
// 🔹 Get Course
// ========================================

export const handleGetCourses = async (request, response) => {
  try {
    const courses = await Queries.getAllCourses();
    return response.status(200).json(courses);
  } catch (err) {
    response.status(500).json({
      error: "Failed to fetch courses",
    });
  }
};
// ========================================
// 🔹 Update Course
// ========================================
export const handleUpdateCourse = async (request, response) => {
  try {
    const updated = await Queries.updateCourseById(
      request.params.id,
      request.body
    );
    return response.status(200).json(updated);
  } catch (err) {
    response.status(500).json({ error: "Update Failed!" });
  }
};
// ========================================
// 🔹 Delete Course
// ========================================
export const handleDeleteCourse = async (request, response) => {
  try {
    const deleted = await Queries.deleteCourseById(request.params.id);
    return response
      .status(200)
      .json({ message: "Course deleted successfully" });
  } catch (err) {
    response.status(500).json({ error: "Delete Failed" });
  }
};

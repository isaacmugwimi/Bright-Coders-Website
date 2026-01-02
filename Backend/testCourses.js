import { getCourseTitles } from "./Database/Config/courseQueries.js";

// Quick test
(async () => {
  const titles = await getCourseTitles();
  console.log("Courses in DB:", titles);
})();

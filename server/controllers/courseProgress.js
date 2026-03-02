const mongoose = require("mongoose")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const CourseProgress = require("../models/CourseProgress")
const Course = require("../models/Course")

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subSectionId } = req.body
  const userId = req.user.id

  try {
    console.log("updateCourseProgress input:", { courseId, subSectionId, userId })
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: userId missing in token" })
    }
    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: "Invalid courseId" })
    }
    if (!mongoose.Types.ObjectId.isValid(subSectionId)) {
      return res.status(400).json({ error: "Invalid subSectionId" })
    }

    // Check if the subsection is valid
    const subSection = await SubSection.findById(subSectionId)
    console.log("subSection found:", !!subSection)
    if (!subSection) {
      return res.status(404).json({ error: "Invalid subsection" })
    }

    // Find the course progress document for the user and course
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })
    console.log("existing courseProgress found:", !!courseProgress)

    if (!courseProgress) {
      // If course progress doesn't exist, create a new one for this user & course
      courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      })
      console.log("created new courseProgress:", courseProgress?._id)
    }

    // Backfill userId for legacy docs without userId to pass validation on save
    if (!courseProgress.userId) {
      courseProgress.userId = userId
    }

    // If course progress exists, check if the subsection is already completed
    if (courseProgress.completedVideos.includes(subSectionId)) {
      return res.status(400).json({ error: "Subsection already completed" })
    }

    // Push the subsection into the completedVideos array
    courseProgress.completedVideos.push(subSectionId)

    // Save the updated course progress
    await courseProgress.save()
    console.log("courseProgress saved with completedVideos count:", courseProgress.completedVideos.length)

    return res.status(200).json({ success: true, message: "Course progress updated" })
  } catch (error) {
    console.error("updateCourseProgress error:", error)
    return res.status(500).json({ error: "Internal server error", details: error?.message })
  }
}

// exports.getProgressPercentage = async (req, res) => {
//   const { courseId } = req.body
//   const userId = req.user.id

//   if (!courseId) {
//     return res.status(400).json({ error: "Course ID not provided." })
//   }

//   try {
//     // Find the course progress document for the user and course
//     let courseProgress = await CourseProgress.findOne({
//       courseID: courseId,
//       userId: userId,
//     })
//       .populate({
//         path: "courseID",
//         populate: {
//           path: "courseContent",
//         },
//       })
//       .exec()

//     if (!courseProgress) {
//       return res
//         .status(400)
//         .json({ error: "Can not find Course Progress with these IDs." })
//     }
//     console.log(courseProgress, userId)
//     let lectures = 0
//     courseProgress.courseID.courseContent?.forEach((sec) => {
//       lectures += sec.subSection.length || 0
//     })

//     let progressPercentage =
//       (courseProgress.completedVideos.length / lectures) * 100

//     // To make it up to 2 decimal point
//     const multiplier = Math.pow(10, 2)
//     progressPercentage =
//       Math.round(progressPercentage * multiplier) / multiplier

//     return res.status(200).json({
//       data: progressPercentage,
//       message: "Succesfully fetched Course progress",
//     })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ error: "Internal server error" })
//   }
// }

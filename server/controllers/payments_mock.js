// Temporary mock payment controller for testing
// Use this only for development/testing when Razorpay keys are invalid

const Course = require("../models/Course")
const crypto = require("crypto");
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail")
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
const { default: mongoose } = require("mongoose");

// Helper to safely extract a course ID from either a string or an object
const extractCourseId = (item) => {
  if (!item) return null;
  if (typeof item === "string") return item;
  if (typeof item === "object") return item.courseId || item._id || item.id || null;
  return null;
}

// Mock capture payment - creates a fake order for testing
exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  if (!Array.isArray(courses) || courses.length === 0) {
    return res.status(400).json({ success: false, message: "Please provide at least one course" });
  }

  // Normalize incoming payload to an array of IDs
  const courseIds = courses.map(extractCourseId).filter(Boolean);
  if (courseIds.length !== courses.length) {
    return res.status(400).json({ success: false, message: "Invalid courses payload. Expected array of IDs or objects with courseId/_id/id" });
  }

  let totalAmount = 0;

  for (const course_id of courseIds) {
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res.status(200).json({ success: false, message: "Could not find the Course" });
      }

      const uid = new mongoose.Types.ObjectId(userId);
      if (Array.isArray(course.studentsEnrolled) && course.studentsEnrolled.some((id) => id.equals(uid))) {
        return res.status(200).json({ success: false, message: "Student is already Enrolled" });
      }

      const priceNum = Number(course.price)
      if (!Number.isFinite(priceNum) || priceNum <= 0) {
        return res.status(400).json({ success: false, message: "Invalid course price" });
      }
      totalAmount += priceNum;
    }
    catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // Validate total amount before creating order
  if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid order amount" });
  }

  // Create a mock order response (simulating Razorpay response)
  const mockOrderResponse = {
    id: `order_mock_${Date.now()}`,
    amount: Math.round(totalAmount * 100),
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
    status: "created",
    created_at: Date.now()
  };

  console.log("MOCK: Created order for amount:", totalAmount);
  
  res.json({
    success: true,
    message: mockOrderResponse
  });
}

// Mock verify payment - always succeeds for testing
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" });
  }

  // Mock verification - always succeed for testing
  console.log("MOCK: Payment verification successful");
  
  try {
    await enrollStudents(courses, userId, res)
    return res.status(200).json({ success: true, message: "Payment Verified (MOCK)" })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ success: false, message: "Enrollment failed after payment verification" })
  }
}

// Send Payment Success Email (same as original)
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res.status(400).json({ success: false, message: "Please Provide all the details" });
  }

  try {
    const enrolledStudent = await User.findById(userId)
    await mailSender(
      enrolledStudent.email,
      `Payment Received (MOCK)`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
    return res.status(200).json({ success: true, message: "Payment success email sent" })
  }
  catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: "Could not send email" })
  }
}

// Enroll students (same as original)
const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({ success: false, message: "Please Provide Course ID and User ID" });
  }

  // Normalize incoming payload to an array of IDs
  const courseIds = Array.isArray(courses) ? courses.map(extractCourseId).filter(Boolean) : [];
  if (courseIds.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid courses payload for enrollment" });
  }

  for (const courseId of courseIds) {
    try {
      const enrolledCourse = await Course.findByIdAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: new mongoose.Types.ObjectId(userId) } },
        { new: true }
      )

      if (!enrolledCourse) {
        return res.status(500).json({ success: false, error: "Course not found" });
      }

      //find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(userId,
        {
          $push: {
            courses: courseId
          }
        },
        { new: true }
      )

      // Send an email notification to the enrolled student
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName, `${enrolledStudent.firstName} ${enrolledStudent.lastName}`)
      )
      console.log("Email sent Successfully: ", emailResponse.response);
    }
    catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  }
}
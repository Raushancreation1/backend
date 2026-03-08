// Importing necessary modules and packages
const path = require("path");
require("dotenv").config({
	override: false,
});
const express = require("express");
const app = express();
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const contactUsRoute = require("./routes/Contact");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

// Setting up port number
const PORT = process.env.PORT || 5000;

// Environment variables are loaded above

// Connecting to database
database.connect();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
const normalizeOrigin = (o) => (o || "").trim().replace(/\/$/, "");
const allowedOrigins = (
	process.env.CORS_ORIGIN
		? process.env.CORS_ORIGIN.split(",").map(normalizeOrigin).filter(Boolean)
		: [
			"https://backend-ol9i.onrender.com",
			"https://study-notion-pro-seven.vercel.app",
			"https://study-notion-pro-beta.vercel.app",
			"http://localhost:3000"
		]
).map(normalizeOrigin);

const corsOptions = {
	origin: function (origin, callback) {
		// Allow requests with no origin (like mobile apps or curl requests)
		if (!origin) return callback(null, true);

		const normalized = normalizeOrigin(origin);

		// Check if origin is in allowed list
		if (allowedOrigins.includes(normalized)) {
			return callback(null, true);
		}

		// Log for debugging
		console.log(`CORS blocked origin: ${origin} (normalized: ${normalized})`);
		console.log(`Allowed origins: ${allowedOrigins.join(", ")}`);

		// Reject unauthorized origins
		return callback(new Error("Not allowed by CORS"));
	},
	credentials: true,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allowedHeaders: [
		"Content-Type",
		"Authorization",
		"X-Requested-With",
		"Accept",
		"Origin",
		"Access-Control-Request-Method",
		"Access-Control-Request-Headers"
	],
	exposedHeaders: ["Content-Range", "X-Content-Range"],
	optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
	preflightContinue: false,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options("*", cors(corsOptions));
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

// Connecting to cloudinary
cloudinaryConnect();

// Setting up routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

// Testing the server
app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

// Global Error Handler - Must be after all routes
app.use((err, req, res, next) => {
	// Ensure CORS headers are set even on errors
	const origin = req.headers.origin;
	if (origin) {
		const normalized = normalizeOrigin(origin);
		if (allowedOrigins.includes(normalized)) {
			res.header("Access-Control-Allow-Origin", origin);
			res.header("Access-Control-Allow-Credentials", "true");
		}
	}

	// Handle CORS errors
	if (err.message === "Not allowed by CORS") {
		return res.status(403).json({
			success: false,
			message: "CORS: Origin not allowed",
			origin: origin,
		});
	}

	// Handle other errors
	console.error("Error:", err);
	res.status(err.status || 500).json({
		success: false,
		message: err.message || "Internal Server Error",
		...(process.env.NODE_ENV === "development" && { stack: err.stack }),
	});
});

// 404 Handler
app.use((req, res) => {
	const origin = req.headers.origin;
	if (origin) {
		const normalized = normalizeOrigin(origin);
		if (allowedOrigins.includes(normalized)) {
			res.header("Access-Control-Allow-Origin", origin);
			res.header("Access-Control-Allow-Credentials", "true");
		}
	}
	res.status(404).json({
		success: false,
		message: "Route not found",
	});
});

// Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
	console.log(`Allowed CORS origins: ${allowedOrigins.join(", ")}`);
});

// End of code.

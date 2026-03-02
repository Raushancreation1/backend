const otpTemplate = (otp) => {
	return `<!DOCTYPE html>
	<html lang="en">
	
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Verify Your Email - StudyNotion</title>
		<style>
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
			}

			body {
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
				line-height: 1.6;
				padding: 20px;
				min-height: 100vh;
			}

			.email-wrapper {
				max-width: 600px;
				margin: 40px auto;
				background: #ffffff;
				border-radius: 16px;
				overflow: hidden;
				box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
			}

			.header {
				background: linear-gradient(135deg, #161D29 0%, #000814 100%);
				padding: 40px 30px;
				text-align: center;
			}

			.logo {
				max-width: 180px;
				height: auto;
				margin-bottom: 20px;
			}

			.header-title {
				color: #FFD60A;
				font-size: 24px;
				font-weight: 700;
				margin: 0;
			}

			.content {
				padding: 40px 30px;
				background: #ffffff;
			}

			.greeting {
				font-size: 20px;
				color: #161D29;
				margin-bottom: 20px;
				font-weight: 600;
			}

			.message {
				color: #585D69;
				font-size: 16px;
				line-height: 1.8;
				margin-bottom: 30px;
			}

			.otp-container {
				background: linear-gradient(135deg, #FFD60A 0%, #FFC107 100%);
				border-radius: 12px;
				padding: 30px;
				text-align: center;
				margin: 30px 0;
				box-shadow: 0 4px 15px rgba(255, 214, 10, 0.3);
			}

			.otp-label {
				color: #161D29;
				font-size: 14px;
				font-weight: 600;
				text-transform: uppercase;
				letter-spacing: 1px;
				margin-bottom: 10px;
			}

			.otp-code {
				font-size: 42px;
				font-weight: 800;
				color: #000814;
				letter-spacing: 8px;
				font-family: 'Courier New', monospace;
				margin: 10px 0;
				text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
			}

			.expiry-note {
				background: #FFF4E5;
				border-left: 4px solid #FFD60A;
				padding: 15px 20px;
				margin: 25px 0;
				border-radius: 6px;
			}

			.expiry-note p {
				color: #161D29;
				font-size: 14px;
				margin: 0;
				display: flex;
				align-items: center;
			}

			.warning-icon {
				color: #FFD60A;
				font-size: 18px;
				margin-right: 10px;
			}

			.security-note {
				background: #F1F2FF;
				padding: 20px;
				border-radius: 8px;
				margin: 25px 0;
			}

			.security-note p {
				color: #585D69;
				font-size: 14px;
				margin: 0;
			}

			.footer {
				background: #F9F9F9;
				padding: 30px;
				text-align: center;
				border-top: 1px solid #E5E5E5;
			}

			.footer-text {
				color: #888888;
				font-size: 14px;
				margin-bottom: 15px;
			}

			.support-link {
				color: #667eea;
				text-decoration: none;
				font-weight: 600;
				transition: color 0.3s ease;
			}

			.support-link:hover {
				color: #764ba2;
			}

			.social-links {
				margin-top: 20px;
				padding-top: 20px;
				border-top: 1px solid #E5E5E5;
			}

			.social-links a {
				color: #888888;
				text-decoration: none;
				margin: 0 10px;
				font-size: 14px;
			}

			.brand-tagline {
				color: #BBB;
				font-size: 12px;
				margin-top: 15px;
				font-style: italic;
			}

			@media only screen and (max-width: 600px) {
				.email-wrapper {
					margin: 20px auto;
					border-radius: 12px;
				}

				.header {
					padding: 30px 20px;
				}

				.content {
					padding: 30px 20px;
				}

				.header-title {
					font-size: 20px;
				}

				.greeting {
					font-size: 18px;
				}

				.message {
					font-size: 15px;
				}

				.otp-code {
					font-size: 36px;
					letter-spacing: 6px;
				}

				.footer {
					padding: 25px 20px;
				}
			}
		</style>
	</head>
	
	<body>
		<div class="email-wrapper">
			<!-- Header -->
			<div class="header">
				<a href="https://rccodingallinone.vercel.app/">
					<img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo">
				</a>
				<h1 class="header-title">Email Verification</h1>
			</div>

			<!-- Content -->
			<div class="content">
				<p class="greeting">Hello! 👋</p>
				
				<p class="message">
					Thank you for choosing <strong>StudyNotion</strong>! We're excited to have you join our learning community. 
					To complete your registration and secure your account, please verify your email address using the OTP below.
				</p>

				<!-- OTP Box -->
				<div class="otp-container">
					<div class="otp-label">Your Verification Code</div>
					<div class="otp-code">${otp}</div>
				</div>

				<!-- Expiry Warning -->
				<div class="expiry-note">
					<p>
						<span class="warning-icon">⏱️</span>
						<strong>Important:</strong> This OTP is valid for only <strong>5 minutes</strong>. 
						Please use it immediately to verify your account.
					</p>
				</div>

				<!-- Security Note -->
				<div class="security-note">
					<p>
						🔒 <strong>Security Tip:</strong> Never share this OTP with anyone. StudyNotion will never ask 
						for your verification code via email, phone, or any other medium.
					</p>
				</div>

				<p class="message">
					If you didn't request this verification code, please ignore this email or contact our support team 
					if you have concerns about your account security.
				</p>
			</div>

			<!-- Footer -->
			<div class="footer">
				<p class="footer-text">
					Need help? Contact our support team at 
					<a href="mailto:info@studynotion.com" class="support-link">info@studynotion.com</a>
				</p>
				
				<p class="footer-text">
					We're here to help you every step of the way on your learning journey!
				</p>

				<div class="social-links">
					<a href="#">About</a> • 
					<a href="#">Blog</a> • 
					<a href="#">Privacy Policy</a> • 
					<a href="#">Terms of Service</a>
				</div>

				<p class="brand-tagline">
					✨ Empowering learners worldwide • StudyNotion © 2025
				</p>
			</div>
		</div>
	</body>
	
	</html>`;
};

module.exports = otpTemplate;
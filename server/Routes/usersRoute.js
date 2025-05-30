import express from 'express';
import { signUp, signIn, userInfor, addUser, updateUser, deleteUser, verifyOtp, resendOtp } from '../controllers/users.js';
import { auth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js'
import Users from '../models/users.js';

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: User
 *     description: User related operations
 */

/**
 * @openapi
 * /user-infor:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user information (need auth)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized - Authentication required
 *       '500':
 *         description: Internal server error
 */
router.get("/user-infor", auth, userInfor)

/**
 * @openapi
 * /signup:
 *   post:
 *     tags:
 *       - User
 *     summary: Sign up a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - personal_id
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               personal_id:
 *                 type: string
 *                 example: "BN12363468"
 *               name:
 *                 type: string
 *                 example: "juwono"
 *               email:
 *                 type: string
 *                 example: "juwono@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Password123"
 *               confirmPassword:
 *                 type: string
 *                 example: "Password123"
 *               address:
 *                 type: string
 *                 example: "Bandung, Indonesia"
 *               phone_number:
 *                 type: string
 *                 example: "089286382736431"
 *     responses:
 *       '200':
 *         description: User registered successfully. Please verify your email.
 *       '400':
 *         description: Bad request - Invalid input or email already exists
 *       '500':
 *         description: Internal server error
 */
router.post("/signup", signUp)

/**
 * @openapi
 * /verify-otp:
 *   post:
 *     tags:
 *       - User
 *     summary: Verify user email with OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: "juwono@gmail.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       '200':
 *         description: Email verified successfully
 *       '400':
 *         description: Invalid or expired OTP
 *       '500':
 *         description: Internal server error
 */
router.post("/verify-otp", verifyOtp)

/**
 * @openapi
 * /resend-otp:
 *   post:
 *     tags:
 *       - User
 *     summary: Resend OTP for email verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "juwono@gmail.com"
 *     responses:
 *       '200':
 *         description: New OTP sent successfully
 *       '400':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.post("/resend-otp", resendOtp)

/**
 * @openapi
 * /signin:
 *   post:
 *     tags:
 *       - User
 *     summary: Sign in user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "juwono@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Password123"
 *     responses:
 *       '200':
 *         description: Sign in successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       '400':
 *         description: Invalid credentials
 *       '500':
 *         description: Internal server error
 */
router.post("/signin", signIn)

/**
 * @openapi
 * /add-user:
 *   post:
 *     tags:
 *       - User
 *     summary: Add a new user (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - personal_id
 *               - name
 *               - email
 *               - password
 *             properties:
 *               personal_id:
 *                 type: string
 *                 example: "BN12345678"
 *               name:
 *                 type: string
 *                 example: "New User"
 *               email:
 *                 type: string
 *                 example: "newuser@example.com"
 *               password:
 *                 type: string
 *                 example: "Password123"
 *               address:
 *                 type: string
 *                 example: "Somewhere Street, City"
 *               phone_number:
 *                 type: string
 *                 example: "082111111111"
 *               role:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       '201':
 *         description: User created successfully
 *       '400':
 *         description: Bad request or email already exists
 *       '401':
 *         description: Unauthorized - Admin access required
 *       '500':
 *         description: Internal server error
 */
router.post("/add-user", auth, isAdmin, addUser)

/**
 * @openapi
 * /update-user/{id}:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update a user by ID (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personal_id:
 *                 type: string
 *                 example: "BN12345678"
 *               name:
 *                 type: string
 *                 example: "Updated Name"
 *               email:
 *                 type: string
 *                 example: "updated@example.com"
 *               password:
 *                 type: string
 *                 example: "NewPassword123"
 *               confirmPassword:
 *                 type: string
 *                 example: "NewPassword123"
 *               address:
 *                 type: string
 *                 example: "New Address"
 *               phone_number:
 *                 type: string
 *                 example: "082222222222"
 *               role:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       '200':
 *         description: User updated successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized - Admin access required
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.patch("/update-user/:id", auth, isAdmin, updateUser)

/**
 * @openapi
 * /delete-user/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete a user by ID (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to delete
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '401':
 *         description: Unauthorized - Admin access required
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.delete("/delete-user/:id", auth, isAdmin, deleteUser)

/**
 * @openapi
 * /all-users:
 *   get:
 *     tags:
 *       - User
 *     summary: Get all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of all users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized - Admin access required
 *       '500':
 *         description: Internal server error
 */
router.get("/all-users", auth, isAdmin, async (req, res) => {
    try {
        const users = await Users.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router
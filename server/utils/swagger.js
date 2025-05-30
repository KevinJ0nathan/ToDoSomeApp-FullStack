import swaggerJsDoc from "swagger-jsdoc";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *      User:
 *         type: object
 *         required:
 *            - personal_id
 *            - name
 *            - email
 *            - password
 *         properties:
 *            _id:
 *               type: object
 *               properties:
 *                  $oid:
 *                     type: string
 *                     description: Unique identifier for the user
 *            user_image:
 *               type: string
 *               description: Image of the user
 *            personal_id:
 *               type: string
 *               description: User's Personal ID (ID Card, Passport, etc)
 *            name:
 *               type: string
 *               description: Full name of the user
 *            email:
 *               type: string
 *               description: Email address of the user
 *            password:
 *               type: string
 *               description: Hashed password of the user
 *            address:
 *               type: string
 *               description: User's address
 *            phone_number:
 *               type: string
 *               description: User's phone number
 *            role:
 *               type: string
 *               description: "User's role (default: 'user')"
 *            otp:
 *               type: string
 *               description: One-time password for email verification
 *            otpExpires:
 *               type: string
 *               format: date-time
 *               description: Expiration time for the OTP
 *            isVerified:
 *               type: boolean
 *               description: Whether the user's email is verified
 *            joinedAt:
 *               type: string
 *               format: date-time
 *               description: Date when the user joined
 *            updatedAt:
 *               type: string
 *               format: date-time
 *               description: Last date when the user's information was updated
 *         example:
 *            _id:
 *               $oid: "uniqueKeyUser"
 *            personal_id: "BN1234567"
 *            user_image: "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=Alexander"
 *            name: "juwono"
 *            email: "juwono@gmail.com"
 *            password: "securePassword123"
 *            address: "Jakarta, Indonesia"
 *            phone_number: "089262317312"
 *            role: "user"
 *            otp: "123456"
 *            otpExpires: "2024-03-20T12:00:00Z"
 *            isVerified: true
 *      Todo:
 *         type: object
 *         required:
 *            - todo_name
 *            - todo_image
 *            - todo_status
 *            - user
 *         properties:
 *            _id:
 *               type: object
 *               properties:
 *                  $oid:
 *                     type: string
 *                     description: Unique identifier for the todo list
 *            todo_name:
 *               type: string
 *               description: Name of the todo list
 *            todo_desc:
 *               type: string
 *               description: Description of the todo list
 *            todo_status:
 *               type: string
 *               description: status of the todo list (active or finished)
 *            user:
 *               type: string
 *               description: ID of the user who created the todo list
 *            createdAt:
 *               type: string
 *               format: date-time
 *               description: Date when the todo was created
 *            updatedAt:
 *               type: string
 *               format: date-time
 *               description: Last date when the todo was updated
 *         example:
 *            _id:
 *               $oid: "uniqueKeyUser"
 *            todo_name: "Review Mid Exam"
 *            todo_image: "https://api.dicebear.com/9.x/icons/svg?seed=Katherine"
 *            todo_desc: "this is the description of the todo list"
 *            todo_status: "active"
 *            user: "64f1a2b3c4d5e6f7g8h9i0j1"
*/

const swaggerSpec = swaggerJsDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Todo List Management API",
            version: "1.0.0",
            description: "API for managing todo list, including user authentication and todo list management.",
        },
        servers: [
            {
                url: 'http://localhost:5000/service/user',
                description: 'Development - user',
            },
            {
                url: "http://localhost:5000/service/todo",
                description: 'Development - todo'
            }
        ],
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: [
        path.join(__dirname, '..', 'routes', '*.js'),
        path.join(__dirname, '..', 'routes', '*.ts'),
        path.join(__dirname, 'swagger.js'),
        path.join(__dirname, 'swagger.ts'),
    ],
});

export default swaggerSpec;
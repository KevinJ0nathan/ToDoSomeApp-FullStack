import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Users from '../models/users.js';
import { userSendMail } from './userSendMail.js';


// check password and confirmPassword
function isMatch(password, confirm_password) {
    if (password === confirm_password) return true
    return false
}

// validate email
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// validate password
function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
    return re.test(password)
}

// create refresh token
function createRefreshToken(payload) {
    console.log('Payload:', payload);
    console.log('Payload type:', typeof payload);
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
}

// user sign-up
export const signUp = async (req, res) => {
    try {
        const { personal_id, name, email, password, confirmPassword, address, phone_number } = req.body;

        if (!personal_id || !name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        if (name.length < 3) return res.status(400).json({ message: "Your name must be at least 3 letters long" });

        if (!isMatch(password, confirmPassword)) return res.status(400).json({ message: "Password did not match" });

        if (!validateEmail(email)) return res.status(400).json({ message: "Invalid emails" });

        if (!validatePassword(password)) {
            return res.status(400).json({
                message: "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters"
            });
        }

        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "This email is already registered" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const newUser = new Users({
            personal_id,
            name,
            email,
            password: hashedPassword,
            address,
            phone_number,
            otp,
            otpExpires
        });

        await newUser.save();

        // Send OTP in email
        userSendMail(email, otp, "Verify your email address")

        res.json({ message: "Register success! Please verify your email using the OTP sent." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await Users.findOne({ email });

        if (!user) return res.status(400).json({ message: "Invalid email" });

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.otp = null;
        user.otpExpires = null;
        user.isVerified = true; // You can add this field in your model
        await user.save();

        res.json({ message: "Email verified successfully!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const resendOtp = async (req, res) => {
    try {
      const { email } = req.body;
  
      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json({ message: "User not found" });
  
      // Generate new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  
      user.otp = otp;
      user.otpExpires = otpExpires;
  
      await user.save();
  
      userSendMail(email, otp, "Your new OTP code");
  
      res.json({ message: "New OTP has been sent to your email." });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

// user sign-in
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email })

        if (!email || !password) return res.status(400).json({ message: "Please fill in all fields" })

        if (!user) return res.status(400).json({ message: "Invalid Credentials" })

        // Check if user is verified
        if (!user.isVerified) {
            // Check if OTP has expired (10 minutes)
            if (user.otpExpires && user.otpExpires < Date.now()) {
                // Delete unverified user
                await Users.findByIdAndDelete(user._id);
                return res.status(400).json({ 
                    message: "Your registration has expired. Please sign up again.",
                    registrationExpired: true
                });
            }
            return res.status(400).json({ 
                message: "Please verify your email first. Check your inbox for the OTP.",
                needsVerification: true,
                email: user.email
            });
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" })

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d',
        });

        const refresh_token = createRefreshToken({ id: user._id, role: user.role })

        const expiry = 24 * 60 * 60 * 1000 // 1 day

        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: '/api/user/refresh_token',
            maxAge: expiry,
            expires: new Date(Date.now() + expiry)
        })

        res.json({
            message: "Sign In successfully!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// user information
export const userInfor = async (req, res) => {
    try {
        const userId = req.user.id
        const userInfor = await Users.findById(userId).select("-password")
        
        if (!userInfor) {
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure we're sending back the role
        const userData = {
            ...userInfor.toObject(),
            role: userInfor.role || 'user' // Default to 'user' if role is not set
        }

        res.json(userData)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// update user
export const updateUser = async (req, res) => {
    try {
        const userID = req.params.id;

        const { personal_id, name, email, password, confirmPassword, address, phone_number, role } = req.body;

        const updateData = { personal_id, name, email, address, phone_number, role };
        // Only update password if provided
        if (password && confirmPassword && password === confirmPassword) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await Users.findByIdAndUpdate(userID, updateData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const addUser = async (req, res) => {
    try {
        const { personal_id, name, email, password, address, phone_number, role } = req.body;

        if (!personal_id || !name || !email || !password) {
            return res.status(400).json({ message: "Required fields: personal_id, name, email, password" });
        }

        // Optionally allow duplicate emails if needed for special cases.
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new Users({
            personal_id,
            name,
            email,
            password: hashedPassword,
            address,
            phone_number,
            role: role
        });

        await newUser.save();

        res.status(201).json({
            message: "User created successfully by admin",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// delete user
export const deleteUser = async (req, res) => {
    try {
        const userID = req.params.id;
        const deletedUser = await Users.findByIdAndDelete(userID);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
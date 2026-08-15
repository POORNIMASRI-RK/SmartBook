const User = require("../Model/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Register New User
const registerUser = async (req, res) => {
    try{
        const {name, email, password, role} = req.body;
        const existingUser = await User.findOne({ email });

        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            }); 
        }
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already existing",
            }); 
        }
        
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }catch(hashErr){
            return res.status(500).json({
                success: false,
                message: "password hashing failed",
            });
        }
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, "secret_key", { expiresIn: "8h" });

        res.status(201).json({
            success: true,
            message: "User register Successfully",
            token,
            newUser,
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "failed to create the registeruser",
            error: error.message,
        });
    }
};

//Login Existing User
const loginUser = async(req, res) => {
    try{
        const { email, password } = req.body;

        //Validate input
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            })
        }

        //Find User
        const user = await User.findOne({ email });
        console.log("User:",user);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        //Compare password
        const ifPasswordValid = await bcrypt.compare(password, user?.password);

        if(!ifPasswordValid){
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }

        //generate token
        const token = jwt.sign({ id: user._id,role: user.role }, "secret_key", { expiresIn: "8h" });

        return res.status(200).json({
            success: true,
            message: "user logged in successfully",
            token,
            user,
        });
    }catch(err){
        console.error("LOGIN ERROR:", err);
        res.status(500).json({
            success: false,
            message:"Internal server error",
        });
    }
};

//Update User
const updateUser = async(req, res) => {
    try{
        const { name, email, role } = req.body;

        const user = await User.findById(req.params.id);
        console.log("User:", user);

        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found",
            });
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        const updatedUser = await user.save();

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            updatedUser,
        });
    }catch(err){
        res.status(500).json({
            success: false,
            message: "failed to update user"
        });
    }
};

//Delete User
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        console.log("User: ", deletedUser);

        if (!deletedUser) {
            return res.status(404).json({
            success: false,
            message: "User not found",
        });
        }

        console.log("Deleting user with ID: ", req.params.id);

        return res.status(200).json({
        success: true,
        message: "User deleted successfully",
        deletedUser,
        });
    } catch (err) {
        return res.status(500).json({
        success: false,
        message: "Failed to delete user",
        });
    }
};


// fetch all the user
// const getUser = async (req, res) => {
//     try {
//         const getuser = await User.find();

//         return res.status(200).json({
//             success: true,
//             message: "Users fetched successfully",
//             getuser
//         });

//     } catch (err) {

//         return res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }
// };

// Get user by id
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = { registerUser,loginUser, updateUser, deleteUser, getUser};
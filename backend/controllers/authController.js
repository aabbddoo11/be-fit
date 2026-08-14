import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const userExtisting = await User.findOne({ email })
        if (userExtisting) {
            return res.status(400).json({
                message: 'Email already exists '
            })
        }
        const hashedPass = await bcrypt.hash(password, 10)
        const user = await User.create({
            name, email, password: hashedPass, phone
        })
        return res.status(201).json({
            message: `Welcome ${name} your account has been created successfully`
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }
        const userIsRegisterd = await User.findOne({ email });
        if (!userIsRegisterd) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }
        const passvali = await bcrypt.compare(password, userIsRegisterd.password);
        if (!passvali) {
            return res.status(401).json({ message: 'Invalid email or password' })

        };
        const token = jwt.sign({email : userIsRegisterd.email , id : userIsRegisterd.id , role : userIsRegisterd.role}, process.env.SECRET_KEY,{expiresIn : '10s'})
        return res.status(200).json({
  message: `Welcome back ${userIsRegisterd.name}`,
  token,
  user: {
    id: userIsRegisterd._id,
    name: userIsRegisterd.name,
    email: userIsRegisterd.email,
    phone: userIsRegisterd.phone,
    role: userIsRegisterd.role
  }
});

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });

    }
}
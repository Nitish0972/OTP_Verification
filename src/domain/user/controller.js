const User = require("./model");
const { hashData,verifyHashedData } = require("./../../utilities/hashData");
const createToken = require("./../../utilities/createToken");


const authenticateUser = async (data) => {
    try {
        const { email, password } = data;
        const fetchUser = await User.findOne({ email });

        if(!fetchUser){
            throw Error("Invalid credentials entered!");
        }

        const hashedPassword = fetchUser.password;
        const passwordMatch = await verifyHashedData(password,hashedPassword);

        if(!passwordMatch){
            throw Error("Inavlid Password");
        }
        
        // create user token
        const tokenData = {userId: fetchUser._id,email};
        const token = await createToken(tokenData);

        // assign user token
        fetchUser.token = token;
        return fetchUser;
    } catch (error) {
        throw error;
    }
};


const createNewUser = async (data) =>{
    try {
        const { name, email, password } = data;

        const existingUser = await User.findOne({ email });
        if(existingUser){
            throw Error("User Already Existed!");
        }

        const hashedPassword = await hashData(password);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        const createdUser = await newUser.save();
        return createdUser;
    } catch (error) {
        throw error;
    }
};

module.exports = { createNewUser, authenticateUser };
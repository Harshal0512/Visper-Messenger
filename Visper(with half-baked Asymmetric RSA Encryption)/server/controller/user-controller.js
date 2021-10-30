import User from "../modal/User.js";

export const addUser = async (request, response) => {
    try {
        let exist = await User.findOne({ googleId: request.body.object.googleId });

        if(exist) {
            if(request.body.flag == true){
                User.updateOne({ googleId: request.body.object.googleId }, { $set: {publicKey: request.body.object.publicKey}});
                response.status(200).json('Public Key Updated in database');
            }else{
                response.status(200).json('user already exists');
                return exist;
            }
        }

        const newUser = new User(request.body.object);
        await newUser.save();
        response.status(200).json(newUser);
        return request.body.object;
    } catch (error) {
        response.status(500).json(error);
    }
}

export const getUser = async (request, response) => {
    try {
        const user = await User.find({});
        response.status(200).json(user);
    } catch (error) {
        response.status(500).json(error);
    }
}
const { User } = require('../../models/students/studentModel');
const bcrypt = require('bcryptjs');
const AppError = require('../../utils/appError')

const Sequelize = require('sequelize');
const router = require('../../routes/students/studentRouter');
const Op = Sequelize.Op;

exports.basicRegister = async (req, res, next)=>{
    try{
        const {
            userEmail,
            userMobile,
            userPassword,
            userFullName,
            countryID,
            stateID,
            cityID,
            languageID,
            userDeviceType,
            userDeviceID
        } = req.body

        // check if email already exists
        const existEmail = await User.findOne({ where: { userEmail : userEmail} })

        if(existEmail){
            return next(new AppError('Email already exists', 400))
        }

        // check if email already exists
        const existMobile = await User.findOne({ where: {userMobile: userMobile} });

        if(existMobile){
            return next(new AppError('Mobile number already exists', 400))
        }

        // hashing the password before saving it to database
        req.body.userPassword = await bcrypt.hash(userPassword, 12);

        // if no user existx create new user
        const user = await User.create(req.body);

        // saving otp in the database
        const otp = 1234;

        user.userOTP = otp.toString()

        await user.save();

        res.status(200).json({
            status: true,
            message: 'OTP sent successfully',
        });

    } catch(error){
        return next(error);
    }
}

exports.register = async (req, res, next)=>{
    try{
        const { userEntityId, userCenterId, userBatchId } = req.body;

        if (!userEntityId || !userCenterId || !userBatchId) {
            return next(new AppError('Fields are required', 400));
        }

        // find the user in database
        const user = await User.findOne({ where: { userID: req.user } })

        if(!user){
            return next(new AppError('User not found', 400));
        }

        // update the details
        user.userEntityId = userEntityId;
        user.userCenterId = userCenterId;
        user.userBatchId = userBatchId;

        await user.save();

        res.status(200).json({
            status: true,
            message: 'Details updated successfully',
        });

    }catch(error){
        return next(error);
    }
}

exports.login = async (req, res, next)=>{
    try{
        const { userName } = req.body

        // find the user in database
        const userExists = await User.findOne({ where: {[Op.or]: [{userEmail: userName}, {userMobile: userName}]} });

        if (!userExists || userExists === null || userExists === undefined) {
            return next(new AppError('No details found', 400));
        }

        // manually saving otp in database
        const otp = 1234;

        userExists.userOTP = otp.toString();

        await userExists.save();

        res.status(200).json({
            status: true,
            message: 'OTP sent successfully',
        });

    }catch (error){
        return next(error);
    }
}



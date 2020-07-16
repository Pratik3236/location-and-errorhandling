const AppError = require('../../utils/appError')
const { User } = require('../../models/students/studentModel');
const jwt = require('jsonwebtoken')

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.verifyOtp = async (req, res, next)=> {
    try{

        const { userName, otp } = req.body;

        // check if user hase given the username and otp
        if(!userName || !otp){
            return next(new AppError('Fields are required', 400));
        }

        // if user exists find the user in database
        const userExists = await User.findOne({ where: {[Op.or]: [{userEmail: userName}, {userMobile: userName}]} });

        if(!userExists){
            return next(new AppError('Invalid email or mobile', 400));
        }

        if(userExists.userOTP != otp){
            return next(new AppError('Invalid OTP', 400));
        }

        // if the otp matches then update columns in User database
        userExists.userOTP = null;
        userExists.userVerified = 'Yes';
        userExists.userSignupOTPVerified = 'Yes';

        await userExists.save();

        const accesstoken = jwt.sign({ id: userExists.userID }, process.env.ACCESS_TOKEN,
            { expiresIn: '5h'}
        );

        const refreshToken = jwt.sign({ id: userExists.userID }, process.env.REFRESH_TOKEN,
            { expiresIn: '7d'}
        );

        res.status(200).json({
            status: true,
            message: 'OTP verified success',
            data: {
                accesstoken,
                refreshToken,
            },
        });

    } catch (error){
        return next(error)
    }
}

exports.resendOtp = async (req, res, next)=>{
    try{

        const userName = req.body.userName

        // check if the user has given the username
        if(!userName){
            return next(new AppError('Fields are required', 400));
        }

        // check if the username exists in database
        const userExists = await User.findOne({ where: {[Op.or]: [{userEmail: userName}, {userMobile: userName}]} });

        if(!userExists){
            return next(new AppError('User not registered', 400));
        }

        const otp = 5678

        userExists.userOTP = otp.toString();

        await userExists.save();

        res.status(200).json({
            status: true,
            message: 'OTP send successfully',
        });

    } catch (error){
        return next(error)
    }
}
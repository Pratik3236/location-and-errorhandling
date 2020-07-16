const jwt = require('jsonwebtoken');
const { User } = require('../models/students/studentModel')
const AppError = require('../utils/appError');

exports.protect = async (req, res, next) => {
    try{
        let token;

        const { authorization, apitype, apiversion } = req.headers;

        if (authorization && authorization.startsWith('Bearer')) {
            token = authorization.split(' ')[1];
        }

        // check if the token is provided
        if (!token) {
            res.status(401).send('Access denied. No token provided');
            return ;
        }

        // check and verify the token
        try{
            const decodedAccessToken = await jwt.verify(token, process.env.ACCESS_TOKEN);

            // check if the user still exists
            const currentUser = await User.findOne({ where: { userID: decodedAccessToken.id} })

            if (!currentUser) {
                return next(new AppError('The user belonging to this token does no longer exists', 401));
            }

            req.user = decodedAccessToken.id;
            next();

        }catch(error){
            return next(error);
        }

    } catch (error){

        const refreshToken = req.header('x-refresh-token');

        // check if refresh token exists
        if(!refreshToken){
            return next(new AppError('Please provide x-refresh-token authorization headers', 401));
        }

        // if refresh token exists, verify it
        try{
            const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN)

            // check if user still exists
            const decodedRefreshUser = await User.findOne({ where: { userID: decodedRefreshToken.id } });

            if(!decodedRefreshUser){
                return next(new AppError('The user belonging to this token does no longer exists', 401));
            }

            const newAccessToken = jwt.sign({ id: decodedRefreshUser.userID}, process.env.ACCESS_TOKEN,
                { expiresIn: '5h'}
            );

            res.set('authorization', `Bearer ${newToken}`);

            req.user = decodedRefreshToken.user

            next()

        }catch(error){
            return next(error);
        }

    }
}
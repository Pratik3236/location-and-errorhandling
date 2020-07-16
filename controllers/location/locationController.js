const { Country } = require('../../models/country/countryModel');
const { State } = require('../../models/state/stateModel');
const { City } = require('../../models/city/cityModel');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const AppError = require('../../utils/appError');

// this router gives us all the countries from database
exports.getCountries = async (req, res) => {
  try {
    const { apitype, apiversion } = req.headers;

    let limit = 3;
    let offset = 0 + (req.params.page - 1) * limit;

    const country = await Country.findAll({
      attributes: ['countryID', 'countryName', 'countryDialCode'],
      where: [{ countryName: { [Op.like]: req.body.searchWord + '%' } }],
      offset: offset,
      limit: limit,
    });
    res.status(200).json({
      status: true,
      message: 'Countries given',
      data: {
        country,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// passing countryID in body to get the state details for that countryID
exports.getStates = async (req, res, next) => {
  try {
    const { apitype, apiversion } = req.headers;

    let limit = 3;
    let offset = 0 + (req.params.page - 1) * limit;

    const state = await State.findAll({
      attributes: ['stateName'],
      where: [{ countryID: req.body.countryID }, { stateName: { [Op.like]: req.body.searchWord + '%' } }],
      offset: offset,
      limit: limit,
    });

    if (req.body.countryID == '') {
      return next(new AppError('Please provide countryID', 400));
    }
    if (!state) {
      return next(new AppError('No states for given countryID', 400));
    } else {
      res.status(200).json({
        status: true,
        message: 'States for the selected countryID',
        data: {
          state,
        },
      });
    }
  } catch (error) {
    return next(error);
  }
};

// passing countryID and stateID in body to get the city details
// for that countryID and stateID
exports.getCities = async (req, res, next) => {
  try {
    const { apitype, apiversion } = req.headers;

    let limit = 3;
    let offset = 0 + (req.params.page - 1) * limit;
    const city = await City.findAll({
      attributes: ['cityName'],
      where: [{ [Op.and]: [{ countryID: req.body.countryID }, { stateID: req.body.stateID }] }, { cityName: { [Op.like]: req.body.searchWord + '%' } }],
      offset: offset,
      limit: limit,
    });

    if (req.body.countryID == '' || req.body.stateID == '') {
      return next(new AppError('Please provide both the ID', 400));
    }
    if (!city) {
      return next(new AppError('No cities for given countryID and stateID', 400));
    } else {
      res.status(200).json({
        status: true,
        message: 'Cities for the selected countryID and stateID',
        data: {
          city,
        },
      });
    }
  } catch (error) {
    return next(error);
  }
};

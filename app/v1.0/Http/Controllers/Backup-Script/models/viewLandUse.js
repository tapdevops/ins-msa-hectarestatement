const mongoose = require( 'mongoose' );

const ViewLandUseSchema = mongoose.Schema( {});

module.exports = mongoose.model( 'ViewLandUse', ViewLandUseSchema, 'VIEW_LAND_USE' );
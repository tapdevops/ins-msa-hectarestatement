const mongoose = require( 'mongoose' );

const LandUseSchema = mongoose.Schema( {
	NATIONAL 				: String,
	REGION_CODE 			: String,
	COMP_CODE 				: String,
	ADDRESS 				: String, // TM_COMP
	EST_CODE 				: String,
	WERKS 					: String, 
	SUB_BA_CODE 			: String,
	KEBUN_CODE 				: String,
	AFD_CODE 				: String,
	AFD_NAME 				: String, // TM_AFD
	WERKS_AFD_CODE 			: String, // TM_AFD
	BLOCK_CODE 				: String,
	BLOCK_NAME				: String, // TM_BLOCK
	WERKS_AFD_BLOCK_CODE	: String,
	LAND_USE_CODE 			: String,
	LAND_USE_NAME 			: String,
	LAND_USE_CODE_GIS 		: String,
	SPMON 					: {
		type 					: Number,
		get 					: v => Math.floor( v ),
		set 					: v => Math.floor( v ),
		alias 					: 'i',
		default 				: function() {
			return null;
		}
	},
	LAND_CAT 				: String,
	LAND_CAT_L1_CODE 		: String,
	LAND_CAT_L1 			: String,
	LAND_CAT_L2_CODE 		: String,
	MATURITY_STATUS 		: String,
	SCOUT_STATUS 			: String,
	AGES 					: {
		type 					: Number,
		get 					: v => Math.floor( v ),
		set 					: v => Math.floor( v ),
		alias 					: 'i',
		default 				: function() {
			return null;
		}
	},
	HA_SAP 					: String,
	PALM_SAP 				: String,
	SPH_SAP 				: String,
	HA_GIS 					: String,
	PALM_GIS 				: {
		type 					: Number,
		get 					: v => Math.floor( v ),
		set 					: v => Math.floor( v ),
		alias 					: 'i',
		default 				: function() {
			return null;
		}
	},
	SPH_GIS 				: {
		type 					: Number,
		get 					: v => Math.floor( v ),
		set 					: v => Math.floor( v ),
		alias 					: 'i',
		default 				: function() {
			return null;
		}
	},
	INSERT_TIME 			: {
		type 					: Number,
		get 					: v => Math.floor( v ),
		set 					: v => Math.floor( v ),
		alias 					: 'i',
		default 				: function() {
			return null;
		}
	},
	UPDATE_TIME: {
		type 					: Number,
		get 					: v => Math.floor( v ),
		set 					: v => Math.floor( v ),
		alias 					: 'i',
		default 				: function() {
			return null;
		}
	},
	DELETE_TIME: {
		type 					: Number,
		get 					: v => Math.floor( v ),
		set 					: v => Math.floor( v ),
		alias 					: 'i',
		default 				: function() {
			return null;
		}
	}
});

module.exports = mongoose.model( 'LandUse', LandUseSchema, 'TR_HS_LAND_USE' );
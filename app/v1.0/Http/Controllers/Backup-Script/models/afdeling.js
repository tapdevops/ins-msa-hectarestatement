const mongoose = require( 'mongoose' );

const AfdelingSchema = mongoose.Schema( {
	NATIONAL: String,
	REGION_CODE: String,
	COMP_CODE: String,
	EST_CODE: String,
	WERKS: String,
	AFD_CODE: String,
	AFD_NAME: String,
	WERKS_AFD_CODE: String,
	START_VALID: {
		type: Number,
		get: v => Math.floor( v ),
		set: v => Math.floor( v ),
		alias: 'i',
		default: function() {
			return null;
		}
	},
	END_VALID: {
		type: Number,
		get: v => Math.floor( v ),
		set: v => Math.floor( v ),
		alias: 'i',
		default: function() {
			return null;
		}
	},
	INSERT_TIME: {
		type: Number,
		get: v => Math.floor( v ),
		set: v => Math.floor( v ),
		alias: 'i',
		default: function() {
			return null;
		}
	},
	UPDATE_TIME: {
		type: Number,
		get: v => Math.floor( v ),
		set: v => Math.floor( v ),
		alias: 'i',
		default: function() {
			return null;
		}
	},
	DELETE_TIME: {
		type: Number,
		get: v => Math.floor( v ),
		set: v => Math.floor( v ),
		alias: 'i',
		default: function() {
			return null;
		}
	}
});

module.exports = mongoose.model( 'Afdeling', AfdelingSchema, 'TM_AFD' );
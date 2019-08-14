const mongoose = require( 'mongoose' );

const BlockSchema = mongoose.Schema( {
	NATIONAL: String,
	REGION_CODE: String,
	COMP_CODE: String,
	EST_CODE: String,
	WERKS: String,
	JUMLAH_TPH: {
		type: Number,
		get: v => Math.floor( v ),
		set: v => Math.floor( v ),
		alias: 'i',
		default: function() {
			return null;
		}
	},
	AFD_CODE: String,
	BLOCK_CODE: String,
	BLOCK_NAME: String,
	WERKS_AFD_CODE: String,
	WERKS_AFD_BLOCK_CODE: String,
	LATITUDE_BLOCK: String,
	LONGITUDE_BLOCK: String,
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

module.exports = mongoose.model( 'Block', BlockSchema, 'TM_BLOCK' );
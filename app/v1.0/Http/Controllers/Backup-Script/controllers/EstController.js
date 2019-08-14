const estModel = require( '../models/est.js' );
const querystring = require('querystring');
const url = require( 'url' );
const jwt = require( 'jsonwebtoken' );
const config = require( '../../config/config.js' );
const uuid = require( 'uuid' );
const nJwt = require( 'njwt' );
const jwtDecode = require( 'jwt-decode' );
const Client = require('node-rest-client').Client; 
const moment_pure = require( 'moment' );
const moment = require( 'moment-timezone' );
const date = require( '../libraries/date.js' );

// Create and Save new Data
exports.create = ( req, res ) => {

	if( !req.body.NATIONAL || !req.body.REGION_CODE || !req.body.COMP_CODE || !req.body.EST_CODE || !req.body.WERKS || !req.body.EST_NAME  ) {
		return res.status( 400 ).send({
			status: false,
			message: 'Invalid input',
			data: {}
		});
	}

	const set = new estModel({
		NATIONAL: req.body.NATIONAL || "",
		REGION_CODE: req.body.REGION_CODE || "",
		COMP_CODE: req.body.COMP_CODE || "",
		EST_CODE: req.body.EST_CODE || "",
		WERKS: req.body.WERKS || "",
		EST_NAME: req.body.EST_NAME || "",
		START_VALID: req.body.START_VALID || "",
		END_VALID: req.body.END_VALID || "",
		CITY: req.body.CITY || "",
		INSERT_TIME_DW: req.body.INSERT_TIME_DW || "",
		UPDATE_TIME_DW: req.body.UPDATE_TIME_DW || "",
		FLAG_UPDATE: dateAndTimes.format( new Date(), 'YYYYMMDD' )
	});

	set.save()
	.then( data => {
		if ( !data ) {
			res.send({
				status: false,
				message: 'Failed',
				data: {}
			});
		}
		res.send({
			status: true,
			message: 'Successs',
			data: data
		});
	} ).catch( err => {
		res.status( 500 ).send( {
			status: false,
			message: 'Some error occurred while creating data',
			data: {}
		} );
	} );
	
};

// Find a single data with a ID
exports.findOne = ( req, res ) => {
	estModel.findOne( { 
		WERKS: req.params.id 
	} )
	.select( {
		_id: 0,
		NATIONAL: 1,
		REGION_CODE: 1,
		COMP_CODE: 1,
		EST_CODE: 1,
		WERKS: 1,
		EST_NAME: 1,
		CITY: 1
	} )
	.then( data => {
		if( !data ) {
			return res.status(404).send({
				status: false,
				message: "Data not found 2 with id " + req.params.id,
				data: {}
			});
		}
		res.send( {
			status: true,
			message: 'Success',
			data: data
		} );
	} ).catch( err => {
		if( err.kind === 'ObjectId' ) {
			return res.status( 404 ).send({
				status: false,
				message: "Data not found 1 with id " + req.params.id,
				data: {}
			});
		}
		return res.status( 500 ).send({
			status: false,
			message: "Error retrieving Data with id " + req.params.id,
			data: {}
		} );
	} );
};

// Update single data with ID
exports.update = ( req, res ) => {

	// Validation
	estModel.findOneAndUpdate( { 
		WERKS : req.params.id 
	}, {
		NATIONAL: req.body.NATIONAL || "",
		REGION_CODE: req.body.REGION_CODE || "",
		COMP_CODE: req.body.COMP_CODE || "",
		EST_CODE: req.body.EST_CODE || "",
		EST_NAME: req.body.EST_NAME || "",
		CITY: req.body.CITY || "",
		UPDATE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' )
	}, { new: true } )
	.select( {
		_id: 0,
		NATIONAL: 1,
		REGION_CODE: 1,
		COMP_CODE: 1,
		EST_CODE: 1,
		WERKS: 1,
		EST_NAME: 1,
		CITY: 1
	} )
	.then( data => {
		if( !data ) {
			return res.status( 404 ).send( {
				status: false,
				message: "Data not found 1 with id " + req.params.id,
				data: {}
			} );
		}
		res.send( {
			status: true,
			message: 'Success',
			data: data
		} );
	}).catch( err => {
		if( err.kind === 'ObjectId' ) {
			return res.status( 404 ).send( {
				status: false,
				message: "Data not found 2 with id " + req.params.id,
				data: {}
			} );
		}
		return res.status( 500 ).send( {
			status: false,
			message: "Data error updating with id " + req.params.id,
			data: {}
		} );
	});
};

// Delete data with the specified ID in the request
exports.delete = ( req, res ) => {
	estModel.findOneAndUpdate( { 
		WERKS: req.params.id
	}, {
		DELETE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' )
	}, { new: true } )
	.then( data => {
		if( !data ) {
			return res.send( {
				status: false,
				message: "Data failed to delete",
				data: {}
			} );
		}
		else {
			return res.send({
				status: true,
				message: 'Data successfully deleted',
				data: {}
			});
		}
	}).catch( err => {
		if( err.kind === 'ObjectId' ) {
			return res.send( {
				status: false,
				message: "ObjectID Error",
				data: {}
			} );
		}
		return res.send( {
			status: false,
			message: "Error",
			data: {}
		} );
	});
};













/*
|--------------------------------------------------------------------------
| Clear Function
|--------------------------------------------------------------------------
*/
	// Create or update data
	exports.createOrUpdate = ( req, res ) => {
		
		nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
			if ( err ) {
				res.sendStatus( 403 );
			}
			else {
				if( !req.body.NATIONAL || !req.body.REGION_CODE || !req.body.COMP_CODE || !req.body.EST_CODE || !req.body.WERKS || !req.body.EST_NAME  ) {
					return res.send({
						status: false,
						message: 'Invalid input',
						data: {}
					});
				}

				estModel.findOne( { 
					WERKS: req.body.WERKS,
					START_VALID: date.convert( req.body.START_VALID, 'YYYYMMDD' )
				} ).then( data => {
					// Kondisi belum ada data, create baru dan insert ke Sync List
					if( !data ) {
						
						const set = new estModel( {
							NATIONAL: req.body.NATIONAL || "",
							REGION_CODE: req.body.REGION_CODE || "",
							COMP_CODE: req.body.COMP_CODE || "",
							EST_CODE: req.body.EST_CODE || "",
							EST_NAME: req.body.EST_NAME || "",
							WERKS: req.body.WERKS || "",
							CITY: req.body.CITY || "",
							START_VALID: date.convert( req.body.START_VALID, 'YYYYMMDD' ),
							END_VALID: date.convert( req.body.END_VALID, 'YYYYMMDD' ),
							INSERT_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
							DELETE_TIME: null,
							UPDATE_TIME: null
						} );

						set.save()
						.then( data => {
							res.send({
								status: true,
								message: 'Success 2',
								data: {}
							});
						} ).catch( err => {
							res.send( {
								status: false,
								message: 'Some error occurred while creating data',
								data: {}
							} );
						} );
						
					}
					// Kondisi data sudah ada, check value, jika sama tidak diupdate, jika beda diupdate dan dimasukkan ke Sync List
					else {
						
						if ( 
							data.NATIONAL != req.body.NATIONAL || 
							data.REGION_CODE != req.body.REGION_CODE || 
							data.COMP_CODE != req.body.COMP_CODE || 
							data.EST_CODE != req.body.EST_CODE || 
							data.EST_NAME != req.body.EST_NAME || 
							data.END_VALID != date.convert( req.body.END_VALID, 'YYYYMMDD' )
						) {
							var data_update;
							if ( date.convert( req.body.END_VALID, 'YYYYMMDD' ) == '99991231' ) {
								data_update = {
									NATIONAL: req.body.NATIONAL || "",
									REGION_CODE: req.body.REGION_CODE || "",
									COMP_CODE: req.body.COMP_CODE || "",
									EST_CODE: req.body.EST_CODE || "",
									EST_NAME: req.body.EST_NAME || "",
									CITY: req.body.CITY || "",
									END_VALID: date.convert( req.body.END_VALID, 'YYYYMMDD' ),
									UPDATE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' )
								}
							}
							else {
								data_update = {
									NATIONAL: req.body.NATIONAL || "",
									REGION_CODE: req.body.REGION_CODE || "",
									COMP_CODE: req.body.COMP_CODE || "",
									EST_CODE: req.body.EST_CODE || "",
									EST_NAME: req.body.EST_NAME || "",
									CITY: req.body.CITY || "",
									END_VALID: date.convert( req.body.END_VALID, 'YYYYMMDD' ),
									DELETE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' )
								}
							}

							estModel.findOneAndUpdate( { 
								REGION_CODE: req.body.REGION_CODE,
								START_VALID: date.convert( req.body.START_VALID, 'YYYYMMDD' )
							}, data_update, { new: true } )
							.then( data => {
								if( !data ) {
									return res.send( {
										status: false,
										message: "Data error updating 2",
										data: {}
									} );
								}
								else {
									res.send({
										status: true,
										message: 'Success',
										data: {}
									});
								}
							}).catch( err => {
								if( err.kind === 'ObjectId' ) {
									return res.send( {
										status: false,
										message: "Data not found 2",
										data: {}
									} );
								}
								return res.send( {
									status: false,
									message: "Data error updating",
									data: {}
								} );
							});
						}
						else {
							res.send( {
								status: true,
								message: 'Skip Update',
								data: {}
							} );
						}
						
					}
				} ).catch( err => {
					if( err.kind === 'ObjectId' ) {
						return res.send({
							status: false,
							message: "Data not found 1",
							data: {}
						});
					}

					return res.send({
						status: false,
						message: "Error retrieving Data",
						data: {}
					} );
				} );
			}
		} );
	};

	// Find All
	exports.findAll = ( req, res ) => {
		var url_query = req.query;
		var url_query_length = Object.keys( url_query ).length;
		
		url_query.END_VALID = 99991231;

		estModel.find( url_query )
		.select( {
			_id: 0,
			NATIONAL: 1,
			REGION_CODE: 1,
			COMP_CODE: 1,
			EST_CODE: 1,
			WERKS: 1,
			EST_NAME: 1,
			CITY: 1
		} )
		.then( data => {
			if( !data ) {
				return res.send( {
					status: false,
					message: 'Data not found 2',
					data: {}
				} );
			}
			res.send( {
				status: true,
				message: 'Success',
				data: data
			} );
		} ).catch( err => {
			if( err.kind === 'ObjectId' ) {
				return res.send( {
					status: false,
					message: 'Data not found 1',
					data: {}
				} );
			}
			return res.send( {
				status: false,
				message: 'Error retrieving data',
				data: {}
			} );
		} );
	}

	// Sync Mobile
	exports.syncMobile = ( req, res ) => {

		// Auth Data
		var auth = req.auth;
		//auth.REFFERENCE_ROLE = 'BA_CODE';
		//auth.LOCATION_CODE = '4121';

		var start_date = date.convert( req.params.start_date, 'YYYYMMDDhhmmss' );
		var end_date = date.convert( req.params.end_date, 'YYYYMMDDhhmmss' );
		var location_code_group = auth.LOCATION_CODE.split( ',' );
		var ref_role = auth.REFFERENCE_ROLE;
		var location_code_final = [];
		var key = [];
		var query = {};
			query["END_VALID"] = 99991231;
		
		if ( ref_role != 'ALL' ) {
			location_code_group.forEach( function( data ) {
				switch ( ref_role ) {
					case 'REGION_CODE':
						location_code_final.push( data.substr( 0, 2 ) );
					break;
					case 'COMP_CODE':
						location_code_final.push( data.substr( 0, 2 ) );
					break;
					case 'AFD_CODE':
						location_code_final.push( data.substr( 0, 4 ) );
					break;
					case 'BA_CODE':
						location_code_final.push( data.substr( 0, 4 ) );
					break;
				}
			} );
		}

		switch ( ref_role ) {
			case 'REGION_CODE':
				key = ref_role;
				query[key] = location_code_final;
			break;
			case 'COMP_CODE':
				key = ref_role;
				query[key] = location_code_final;
			break;
			case 'AFD_CODE':
				key = 'WERKS';
				query[key] = location_code_final;
			break;
			case 'BA_CODE':
				key = 'WERKS';
				query[key] = location_code_final;
			break;
			case 'NATIONAL':
				key = 'NATIONAL';
				query[key] = 'NATIONAL';
			break;
		}

		console.log(auth);
		console.log(query);
		
		// Set Data
		estModel
		.find( 
			query,
			{
				$and: [
					{
						$or: [
							{
								INSERT_TIME: {
									$gte: start_date,
									$lte: end_date
								}
							},
							{
								UPDATE_TIME: {
									$gte: start_date,
									$lte: end_date
								}
							},
							{
								DELETE_TIME: {
									$gte: start_date,
									$lte: end_date
								}
							}
						]
					}
				]
			}
		)
		.select( {
			_id: 0,
			REGION_CODE: 1,
			COMP_CODE: 1,
			EST_CODE: 1,
			EST_NAME: 1,
			WERKS: 1,
			CITY: 1,
			DELETE_TIME: 1,
			INSERT_TIME: 1,
			UPDATE_TIME: 1
		} )
		.then( data_insert => {
			var temp_insert = [];
			var temp_update = [];
			var temp_delete = [];

			data_insert.forEach( function( data ) {

				if ( data.DELETE_TIME >= start_date && data.DELETE_TIME <= end_date ) {
					temp_delete.push( {
						REGION_CODE: data.REGION_CODE,
						COMP_CODE: data.COMP_CODE,
						EST_CODE: data.EST_CODE,
						EST_NAME: data.EST_NAME,
						WERKS: data.WERKS,
						CITY: data.CITY
					} );
				}

				if ( data.INSERT_TIME >= start_date && data.INSERT_TIME <= end_date ) {
					temp_insert.push( {
						REGION_CODE: data.REGION_CODE,
						COMP_CODE: data.COMP_CODE,
						EST_CODE: data.EST_CODE,
						EST_NAME: data.EST_NAME,
						WERKS: data.WERKS,
						CITY: data.CITY
					} );
				}

				if ( data.UPDATE_TIME >= start_date && data.UPDATE_TIME <= end_date ) {
					temp_update.push( {
						REGION_CODE: data.REGION_CODE,
						COMP_CODE: data.COMP_CODE,
						EST_CODE: data.EST_CODE,
						EST_NAME: data.EST_NAME,
						WERKS: data.WERKS,
						CITY: data.CITY
					} );
				}

			} );

			res.json({
				status: true,
				message: 'Data Sync tanggal ' + date.convert( req.params.start_date, 'YYYY-MM-DD' ) + ' s/d ' + date.convert( req.params.end_date, 'YYYY-MM-DD' ),
				data: {
					"hapus": temp_delete,
					"simpan": temp_insert,
					"ubah": temp_update
				}
			});
		} ).catch( err => {
			if( err.kind === 'ObjectId' ) {
				return res.send({
					status: false,
					message: "ObjectId Error",
					data: {}
				});
			}

			return res.send({
				status: false,
				message: "Error",
				data: {}
			} );
		});
	}

	// Retrieve and return all notes from the database.
	exports.find = ( req, res ) => {

		url_query = req.query;
		var url_query_length = Object.keys( url_query ).length;

		// Auth Data
		var auth = req.auth;

		//auth.REFFERENCE_ROLE = 'COMP_CODE';
		//auth.LOCATION_CODE = '21';

		var location_code_group = auth.LOCATION_CODE.split( ',' );
		var ref_role = auth.REFFERENCE_ROLE;
		var location_code_final = [];
		var key = [];
		var query = {};
			query["END_VALID"] = 99991231;
		
		if ( ref_role != 'ALL' ) {
			location_code_group.forEach( function( data ) {
				switch ( ref_role ) {
					case 'REGION_CODE':
						location_code_final.push( data.substr( 0, 2 ) );
					break;
					case 'COMP_CODE':
						location_code_final.push( data.substr( 0, 2 ) );
					break;
					case 'AFD_CODE':
						location_code_final.push( data.substr( 0, 4 ) );
					break;
					case 'BA_CODE':
						location_code_final.push( data.substr( 0, 4 ) );
					break;
				}
			} );
		}

		switch ( ref_role ) {
			case 'REGION_CODE':
				key = ref_role;
				query[key] = location_code_final;
			break;
			case 'COMP_CODE':
				key = ref_role;
				query[key] = location_code_final;
			break;
			case 'AFD_CODE':
				key = 'WERKS';
				query[key] = location_code_final;
			break;
			case 'BA_CODE':
				key = 'WERKS';
				query[key] = location_code_final;
			break;
			case 'NATIONAL':
				key = 'NATIONAL';
				query[key] = 'NATIONAL';
			break;
		}

		estModel.find( query )
		.select( {
			_id: 0,
			NATIONAL: 1,
			REGION_CODE: 1,
			COMP_CODE: 1,
			EST_CODE: 1,
			WERKS: 1,
			EST_NAME: 1,
			CITY: 1
		} )
		.then( data => {
			if( !data ) {
				return res.send( {
					status: false,
					message: 'Data not found 2',
					data: {}
				} );
			}
			res.send( {
				status: true,
				message: 'Success',
				data: data
			} );
		} ).catch( err => {
			if( err.kind === 'ObjectId' ) {
				return res.send( {
					status: false,
					message: 'Data not found 1',
					data: {}
				} );
			}
			return res.send( {
				status: false,
				message: 'Error retrieving data',
				data: {}
			} );
		} );

	};
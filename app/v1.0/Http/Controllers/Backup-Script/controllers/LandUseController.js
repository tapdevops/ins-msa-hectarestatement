/*
 |--------------------------------------------------------------------------
 | App Config
 |--------------------------------------------------------------------------
 */

	// Models
	const landUseModel 		= require( '../models/landUse.js' );
	const viewLandUseModel 	= require( '../models/viewLandUse.js' );

	// Config
	const config 			= require( '../../config/config.js' );

	// Security
	const jwt 				= require( 'jsonwebtoken' );
	const uuid 				= require( 'uuid' );
	const nJwt 				= require( 'njwt' );
	const jwtDecode 		= require( 'jwt-decode' );

	// Libraries
	const date 				= require( '../libraries/date.js' );

	// Plugin
	const Client 			= require('node-rest-client').Client; 
	const querystring 		= require('querystring');
	const url 				= require( 'url' );
	const moment_pure 		= require( 'moment' );
	const moment 			= require( 'moment-timezone' );

	// Sync Mobile
	exports.syncMobile = ( req, res ) => {

		// Auth Data
		var auth = req.auth;
		//auth.REFFERENCE_ROLE = 'AFD_CODE';
		//auth.LOCATION_CODE = '2121D,2121H,2121E,2121C';

		var start_date = date.convert( req.params.start_date, 'YYYYMMDDhhmmss' );
		var end_date = date.convert( req.params.end_date, 'YYYYMMDDhhmmss' );
		var location_code_group = auth.LOCATION_CODE.split( ',' );
		var ref_role = auth.REFFERENCE_ROLE;
		var location_code_final = [];
		var key = [];
		var query = {};
		
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

		console.log(query)

		// Set Data
		landUseModel
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
			NATIONAL : 1,
			REGION_CODE : 1,
			COMP_CODE : 1,
			ADDRESS : 1,
			EST_CODE : 1,
			WERKS : 1,
			SUB_BA_CODE : 1,
			KEBUN_CODE : 1,
			AFD_CODE : 1,
			AFD_NAME : 1,
			WERKS_AFD_CODE : 1,
			BLOCK_CODE : 1,
			BLOCK_NAME : 1,
			WERKS_AFD_BLOCK_CODE : 1,
			LAND_USE_CODE : 1,
			LAND_USE_NAME : 1,
			LAND_USE_CODE_GIS : 1,
			SPMON : 1,
			LAND_CAT : 1,
			LAND_CAT_L1_CODE : 1,
			LAND_CAT_L1 : 1,
			LAND_CAT_L2_CODE : 1,
			MATURITY_STATUS : 1,
			SCOUT_STATUS : 1,
			AGES : 1,
			HA_SAP : 1,
			PALM_SAP : 1,
			SPH_SAP : 1,
			HA_GIS : 1,
			PALM_GIS : 1,
			SPH_GIS: 1,
			DELETE_TIME: 1,
			INSERT_TIME: 1,
			UPDATE_TIME: 1
		} )
		//.limit(3)
		.then( data_insert => {
			var temp_insert = [];
			var temp_update = [];
			var temp_delete = [];

			console.log(data_insert);

			data_insert.forEach( function( data ) {

				if ( data.DELETE_TIME >= start_date && data.DELETE_TIME <= end_date ) {
					temp_delete.push( {
						NATIONAL : data.NATIONAL,
						REGION_CODE : data.REGION_CODE,
						COMP_CODE : data.COMP_CODE,
						ADDRESS : data.ADDRESS,
						EST_CODE : data.EST_CODE,
						WERKS : data.WERKS,
						SUB_BA_CODE : data.SUB_BA_CODE,
						KEBUN_CODE : data.KEBUN_CODE,
						AFD_CODE : data.AFD_CODE,
						AFD_NAME : data.AFD_NAME,
						WERKS_AFD_CODE : data.WERKS_AFD_CODE,
						BLOCK_CODE : data.BLOCK_CODE,
						BLOCK_NAME : data.BLOCK_NAME,
						WERKS_AFD_BLOCK_CODE : data.WERKS_AFD_BLOCK_CODE,
						LAND_USE_CODE : data.LAND_USE_CODE,
						LAND_USE_NAME : data.LAND_USE_NAME,
						LAND_USE_CODE_GIS : data.LAND_USE_CODE_GIS,
						LAND_CAT : data.LAND_CAT,
						LAND_CAT_L1_CODE : data.LAND_CAT_L1_CODE,
						LAND_CAT_L1 : data.LAND_CAT_L1,
						LAND_CAT_L2_CODE : data.LAND_CAT_L2_CODE,
						MATURITY_STATUS : data.MATURITY_STATUS,
						SCOUT_STATUS : data.SCOUT_STATUS,
						AGES : data.AGES,
						HA_SAP : data.HA_SAP,
						PALM_SAP : data.PALM_SAP,
						SPH_SAP : data.SPH_SAP,
						HA_GIS : data.HA_GIS,
						PALM_GIS : data.PALM_GIS,
						SPH_GIS: data.SPH_GIS,
						SPMON: data.SPMON
					} );
				}

				if ( data.INSERT_TIME >= start_date && data.INSERT_TIME <= end_date ) {
					temp_insert.push( {
						NATIONAL : data.NATIONAL,
						REGION_CODE : data.REGION_CODE,
						COMP_CODE : data.COMP_CODE,
						ADDRESS : data.ADDRESS,
						EST_CODE : data.EST_CODE,
						WERKS : data.WERKS,
						SUB_BA_CODE : data.SUB_BA_CODE,
						KEBUN_CODE : data.KEBUN_CODE,
						AFD_CODE : data.AFD_CODE,
						AFD_NAME : data.AFD_NAME,
						WERKS_AFD_CODE : data.WERKS_AFD_CODE,
						BLOCK_CODE : data.BLOCK_CODE,
						BLOCK_NAME : data.BLOCK_NAME,
						WERKS_AFD_BLOCK_CODE : data.WERKS_AFD_BLOCK_CODE,
						LAND_USE_CODE : data.LAND_USE_CODE,
						LAND_USE_NAME : data.LAND_USE_NAME,
						LAND_USE_CODE_GIS : data.LAND_USE_CODE_GIS,
						LAND_CAT : data.LAND_CAT,
						LAND_CAT_L1_CODE : data.LAND_CAT_L1_CODE,
						LAND_CAT_L1 : data.LAND_CAT_L1,
						LAND_CAT_L2_CODE : data.LAND_CAT_L2_CODE,
						MATURITY_STATUS : data.MATURITY_STATUS,
						SCOUT_STATUS : data.SCOUT_STATUS,
						AGES : data.AGES,
						HA_SAP : data.HA_SAP,
						PALM_SAP : data.PALM_SAP,
						SPH_SAP : data.SPH_SAP,
						HA_GIS : data.HA_GIS,
						PALM_GIS : data.PALM_GIS,
						SPH_GIS: data.SPH_GIS,
						SPMON: data.SPMON
					} );
				}

				if ( data.UPDATE_TIME >= start_date && data.UPDATE_TIME <= end_date ) {
					temp_update.push( {
						NATIONAL : data.NATIONAL,
						REGION_CODE : data.REGION_CODE,
						COMP_CODE : data.COMP_CODE,
						ADDRESS : data.ADDRESS,
						EST_CODE : data.EST_CODE,
						WERKS : data.WERKS,
						SUB_BA_CODE : data.SUB_BA_CODE,
						KEBUN_CODE : data.KEBUN_CODE,
						AFD_CODE : data.AFD_CODE,
						AFD_NAME : data.AFD_NAME,
						WERKS_AFD_CODE : data.WERKS_AFD_CODE,
						BLOCK_CODE : data.BLOCK_CODE,
						BLOCK_NAME : data.BLOCK_NAME,
						WERKS_AFD_BLOCK_CODE : data.WERKS_AFD_BLOCK_CODE,
						LAND_USE_CODE : data.LAND_USE_CODE,
						LAND_USE_NAME : data.LAND_USE_NAME,
						LAND_USE_CODE_GIS : data.LAND_USE_CODE_GIS,
						LAND_CAT : data.LAND_CAT,
						LAND_CAT_L1_CODE : data.LAND_CAT_L1_CODE,
						LAND_CAT_L1 : data.LAND_CAT_L1,
						LAND_CAT_L2_CODE : data.LAND_CAT_L2_CODE,
						MATURITY_STATUS : data.MATURITY_STATUS,
						SCOUT_STATUS : data.SCOUT_STATUS,
						AGES : data.AGES,
						HA_SAP : data.HA_SAP,
						PALM_SAP : data.PALM_SAP,
						SPH_SAP : data.SPH_SAP,
						HA_GIS : data.HA_GIS,
						PALM_GIS : data.PALM_GIS,
						SPH_GIS: data.SPH_GIS,
						SPMON: data.SPMON
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

/*
 |--------------------------------------------------------------------------
 | Land Use
 |--------------------------------------------------------------------------
 */
 	// Find All
	exports.findOneForReport = ( req, res ) => {
		var url_query = req.query;
		var url_query_length = Object.keys( url_query ).length;
		//url_query.DELETE_TIME = [null, 0];
		
		viewLandUseModel.findOne( {
			WERKS_AFD_BLOCK_CODE: req.params.id
		} )
		//.select( {
		//	_id : 0,
		//	BLOCK_CODE: 1,
		//	BLOCK_NAME: 1,
		//	AFD_CODE: 1,
		//	AFD_NAME: 1,
		//	SPMON: 1,
		//	MATURITY_STATUS: 1,
		//} )
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

	// Create or update data
	// Untuk proses sync menggunakan cronjob dari database Oracle ke MongoDB (TAP_DW)
	exports.createOrUpdate = ( req, res ) => {

		if( !req.body.REGION_CODE || !req.body.COMP_CODE || !req.body.WERKS || !req.body.AFD_CODE || !req.body.AFD_NAME || !req.body.BLOCK_CODE || !req.body.BLOCK_NAME ) {
			return res.send({
				status: false,
				message: 'Invalid input',
				data: {}
			});
		}

		landUseModel.findOne( { 
			REGION_CODE: req.body.REGION_CODE,
			COMP_CODE: req.body.COMP_CODE,
			WERKS: req.body.WERKS,
			AFD_CODE: req.body.AFD_CODE,
			BLOCK_CODE: req.body.BLOCK_CODE
		} ).then( data => {

			// Kondisi belum ada data, create baru dan insert ke Sync List
			if( !data ) {

				const set = new landUseModel( {
					NATIONAL 				: req.body.NATIONAL || "",
					REGION_CODE 			: req.body.REGION_CODE || "",
					COMP_CODE 				: req.body.COMP_CODE || "",
					WERKS 					: req.body.WERKS || "", 
					SUB_BA_CODE 			: req.body.SUB_BA_CODE || "",
					KEBUN_CODE 				: req.body.KEBUN_CODE || "",
					AFD_CODE 				: req.body.AFD_CODE || "",
					AFD_NAME 				: req.body.AFD_NAME || "",
					WERKS_AFD_CODE 			: req.body.WERKS + req.body.AFD_CODE,
					BLOCK_CODE 				: req.body.BLOCK_CODE || "",
					BLOCK_NAME 				: req.body.BLOCK_NAME || "",
					WERKS_AFD_BLOCK_CODE 	: req.body.WERKS + req.body.AFD_CODE + req.body.BLOCK_CODE,
					LAND_USE_CODE 			: req.body.LAND_USE_CODE || "",
					LAND_USE_NAME 			: req.body.LAND_USE_NAME|| "",
					LAND_USE_CODE_GIS 		: req.body.LAND_USE_CODE_GIS || "",
					SPMON 					: date.convert( req.body.SPMON, 'YYYYMMDDhhmmss' ),
					LAND_CAT 				: req.body.LAND_CAT || "",
					LAND_CAT_L1_CODE 		: req.body.LAND_CAT_L1_CODE || "",
					LAND_CAT_L1 			: req.body.LAND_CAT_L1 || "",

					LAND_CAT_L2_CODE 		: req.body.LAND_CAT_L2_CODE || "",
					MATURITY_STATUS 		: req.body.MATURITY_STATUS || "",
					SCOUT_STATUS 			: req.body.SCOUT_STATUS || "",
					AGES 					: req.body.AGES || "",
					HA_SAP 					: req.body.HA_SAP || "",
					PALM_SAP 				: req.body.PALM_SAP || "",
					SPH_SAP 				: req.body.SPH_SAP || "",
					HA_GIS 					: req.body.HA_GIS || "",
					PALM_GIS 				: req.body.PALM_GIS || "",
					SPH_GIS 				: req.body.SPH_GIS || "",

					INSERT_TIME 			: date.convert( 'now', 'YYYYMMDDhhmmss' ),
					UPDATE_TIME 			: 0,
					DELETE_TIME 			: 0
				} );

				set.save()
				.then( data => {
					
					if ( !data ) {
						res.send({
							status: true,
							message: 'Error',
							data: []
						});
					}

					res.send({
						status: true,
						message: 'Success',
						data: []
					});
				} ).catch( err => {
					if( err.kind === 'ObjectId' ) {
						return res.send( {
							status: false,
							message: "Error ObjectId",
							data: []
						} );
					}
					return res.send( {
						status: false,
						message: "Error retrieving data",
						data: []
					} );
				} );
			}
			// Kondisi data sudah ada, check value, jika sama tidak diupdate, jika beda diupdate dan dimasukkan ke Sync List
			else {
				if ( 
					data.SPMON != date.convert( req.body.SPMON, 'YYYYMMDD' )
				) {
					landUseModel.findOneAndUpdate( { 
						REGION_CODE: req.body.REGION_CODE,
						COMP_CODE: req.body.COMP_CODE,
						WERKS: req.body.WERKS,
						AFD_CODE: req.body.AFD_CODE,
						BLOCK_CODE: req.body.BLOCK_CODE
					}, {
						NATIONAL 				: req.body.NATIONAL || "",
						SUB_BA_CODE 			: req.body.SUB_BA_CODE || "",
						KEBUN_CODE 				: req.body.KEBUN_CODE || "",
						AFD_NAME 				: req.body.AFD_NAME || "",
						WERKS_AFD_CODE 			: req.body.WERKS + req.body.AFD_CODE,
						BLOCK_NAME 				: req.body.BLOCK_NAME || "",
						WERKS_AFD_BLOCK_CODE 	: req.body.WERKS + req.body.AFD_CODE + req.body.BLOCK_CODE,
						LAND_USE_CODE 			: req.body.LAND_USE_CODE || "",
						LAND_USE_NAME 			: req.body.LAND_USE_NAME|| "",
						LAND_USE_CODE_GIS 		: req.body.LAND_USE_CODE_GIS || "",
						SPMON 					: date.convert( req.body.SPMON, 'YYYYMMDDhhmmss' ),
						LAND_CAT 				: req.body.LAND_CAT || "",
						LAND_CAT_L1_CODE 		: req.body.LAND_CAT_L1_CODE || "",
						LAND_CAT_L1 			: req.body.LAND_CAT_L1 || "",

						LAND_CAT_L2_CODE 		: req.body.LAND_CAT_L2_CODE || "",
						MATURITY_STATUS 		: req.body.MATURITY_STATUS || "",
						SCOUT_STATUS 			: req.body.SCOUT_STATUS || "",
						AGES 					: req.body.AGES || "",
						HA_SAP 					: req.body.HA_SAP || "",
						PALM_SAP 				: req.body.PALM_SAP || "",
						SPH_SAP 				: req.body.SPH_SAP || "",
						HA_GIS 					: req.body.HA_GIS || "",
						PALM_GIS 				: req.body.PALM_GIS || "",
						SPH_GIS 				: req.body.SPH_GIS || "",

						UPDATE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' )
					}, { new: true } )
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
				return res.status( 404 ).send({
					status: false,
					message: "Data not found 1",
					data: {}
				});
			}

			return res.status( 500 ).send({
				status: false,
				message: "Error retrieving Data",
				data: {}
			} );
		} );
	};

	// Find All
	exports.findAll = ( req, res ) => {
		var url_query = req.query;
		var url_query_length = Object.keys( url_query ).length;
		url_query.DELETE_TIME = [null, 0];
		
		landUseModel.find( url_query )
		.select( {
			_id : 0,
			NATIONAL : 1,
			REGION_CODE : 1,
			COMP_CODE : 1,
			ADDRESS : 1,
			EST_CODE : 1,
			WERKS : 1,
			SUB_BA_CODE : 1,
			KEBUN_CODE : 1,
			AFD_CODE : 1,
			AFD_NAME : 1,
			WERKS_AFD_CODE : 1,
			BLOCK_CODE : 1,
			BLOCK_NAME : 1,
			WERKS_AFD_BLOCK_CODE : 1,
			LAND_USE_CODE : 1,
			LAND_USE_NAME : 1,
			LAND_USE_CODE_GIS : 1,
			SPMON : 1,
			LAND_CAT : 1,
			LAND_CAT_L1_CODE : 1,
			LAND_CAT_L1 : 1,
			LAND_CAT_L2_CODE : 1,
			MATURITY_STATUS : 1,
			SCOUT_STATUS : 1,
			AGES : 1,
			HA_SAP : 1,
			PALM_SAP : 1,
			SPH_SAP : 1,
			HA_GIS : 1,
			PALM_GIS : 1,
			SPH_GIS: 1
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



	// Retrieve and return all notes from the database.
	exports.find = ( req, res ) => {
		url_query = req.query;
		var url_query_length = Object.keys( url_query ).length;

		// Auth Data
		var auth = req.auth;

		var location_code_group = auth.LOCATION_CODE.split( ',' );
		var ref_role = auth.REFFERENCE_ROLE;
		var location_code_final = [];
		var key = [];
		var query = {};
		
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

		landUseModel
		.find( query )
		.select( {
			_id : 0,
			NATIONAL : 1,
			REGION_CODE : 1,
			COMP_CODE : 1,
			ADDRESS : 1,
			EST_CODE : 1,
			WERKS : 1,
			SUB_BA_CODE : 1,
			KEBUN_CODE : 1,
			AFD_CODE : 1,
			AFD_NAME : 1,
			WERKS_AFD_CODE : 1,
			BLOCK_CODE : 1,
			BLOCK_NAME : 1,
			WERKS_AFD_BLOCK_CODE : 1,
			LAND_USE_CODE : 1,
			LAND_USE_NAME : 1,
			LAND_USE_CODE_GIS : 1,
			SPMON : 1,
			LAND_CAT : 1,
			LAND_CAT_L1_CODE : 1,
			LAND_CAT_L1 : 1,
			LAND_CAT_L2_CODE : 1,
			MATURITY_STATUS : 1,
			SCOUT_STATUS : 1,
			AGES : 1,
			HA_SAP : 1,
			PALM_SAP : 1,
			SPH_SAP : 1,
			HA_GIS : 1,
			PALM_GIS : 1,
			SPH_GIS: 1
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
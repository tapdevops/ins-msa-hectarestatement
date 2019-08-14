/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	// Models
 	const LandUseModel = require( _directory_base + '/app/v1.0/Http/Models/LandUseModel.js' );
 	const ViewLandUseModel = require( _directory_base + '/app/v1.0/Http/Models/ViewLandUseModel.js' );

 	// Modules
	const Validator = require( 'ferds-validator');
 	
	// Libraries
 	const HelperLib = require( _directory_base + '/app/v1.0/Http/Libraries/HelperLib.js' );

 /*
 |--------------------------------------------------------------------------
 | Versi 1.0
 |--------------------------------------------------------------------------
 */
 	/**
	 * Find
	 * ...
	 * --------------------------------------------------------------------------
	 */
		exports.find = ( req, res ) => {

			url_query = req.query;
			var url_query_length = Object.keys( url_query ).length;
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

			LandUseModel.find( query )
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

		exports.find_all = ( req, res ) => {
			var url_query = req.query;
			var url_query_length = Object.keys( url_query ).length;
			url_query.DELETE_TIME = 0;
			console.log(url_query);
			
			ViewLandUseModel.find( url_query )
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
				console.log(data);
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

		// Find All
		exports.findOneForReport = ( req, res ) => {
			var url_query = req.query;
			var url_query_length = Object.keys( url_query ).length;
			//url_query.DELETE_TIME = [null, 0];
			
			ViewLandUseModel.findOne( {
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

	/**
	 * Sync Mobile
	 * ...
	 * --------------------------------------------------------------------------
	 */
		exports.sync_mobile = ( req, res ) => {

			var auth = req.auth;
			var start_date = HelperLib.date_format( req.params.start_date, 'YYYYMMDDhhmmss' );
			var end_date = HelperLib.date_format( req.params.end_date, 'YYYYMMDDhhmmss' );
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

			LandUseModel.find( 
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
					message: 'Data Sync tanggal ' + HelperLib.date_format( req.params.start_date, 'YYYY-MM-DD' ) + ' s/d ' + HelperLib.date_format( req.params.end_date, 'YYYY-MM-DD' ),
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
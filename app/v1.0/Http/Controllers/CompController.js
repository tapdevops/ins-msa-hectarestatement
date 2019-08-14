/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	// Models
 	const CompModel = require( _directory_base + '/app/v1.0/Http/Models/CompModel.js' );

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
			var query_search = [];
			
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
							location_code_final.push( data.substr( 0, 2 ) );
						break;
						case 'BA_CODE':
							location_code_final.push( data.substr( 0, 2 ) );
						break;
					}
				} );
			}

			switch ( ref_role ) {
				case 'REGION_CODE':
					location_code_final.forEach( function( q ) {
						query_search.push( new RegExp( '^' + q.substr( 0, 2 ) ) );
					} );
				break;
				case 'COMP_CODE':
					location_code_final.forEach( function( q ) {
						query_search.push( new RegExp( '^' + q.substr( 0, 2 ) ) );
					} );
				break;
				case 'AFD_CODE':
					location_code_final.forEach( function( q ) {
						query_search.push( new RegExp( '^' + q.substr( 0, 2 ) ) )
					} );
				break;
				case 'BA_CODE':
					location_code_final.forEach( function( q ) {
						query_search.push( new RegExp( '^' + q.substr( 0, 2 ) ) )
					} );
				break;
			}

			switch ( ref_role ) {
				case 'REGION_CODE':
					key = ref_role;
					query[key] = query_search;
				break;
				case 'COMP_CODE':
					key = ref_role;
					query[key] = query_search;
				break;
				case 'AFD_CODE':
					key = 'COMP_CODE';
					query[key] = query_search;
				break;
				case 'BA_CODE':
					key = 'COMP_CODE';
					query[key] = query_search;
				break;
				case 'NATIONAL':
					key = 'NATIONAL';
					query[key] = 'NATIONAL';
				break;
			}

			CompModel.find( query )
			.select( {
				_id: 0,
				NATIONAL: 1,
				REGION_CODE: 1,
				COMP_CODE: 1,
				COMP_NAME: 1,
				ADDRESS: 1
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

		exports.find_one = ( req, res ) => {
			CompModel.findOne( { 
				COMP_CODE: req.params.id 
			} ).then( data => {
				if( !data ) {
					return res.status(404).send({
						status: false,
						message: "Data not found 2 with id " + req.params.id,
						data: {}
					});
				}
				return res.send( {
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

		exports.find_all = ( req, res ) => {
			var url_query = req.query;
			var url_query_length = Object.keys( url_query ).length;

			CompModel.find( url_query )
			.select( {
				_id: 0,
				NATIONAL: 1,
				REGION_CODE: 1,
				COMP_CODE: 1,
				COMP_NAME: 1,
				ADDRESS: 1
			} )
			.then( data => {
				if( !data ) {
					return res.send( {
						status: false,
						message: 'Data not found 2',
						data: {}
					} );
				}
				return res.send( {
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

			// Auth Data
			var auth = req.auth;
			//auth.REFFERENCE_ROLE = 'AFD_CODE';
			//auth.LOCATION_CODE = '4121A,2121A';
			
			var start_date = HelperLib.date_format( req.params.start_date, 'YYYYMMDDhhmmss' );
			var end_date = HelperLib.date_format( req.params.end_date, 'YYYYMMDDhhmmss' );
			var location_code_group = auth.LOCATION_CODE.split( ',' );
			var ref_role = auth.REFFERENCE_ROLE;
			var location_code_final = [];
			var key = [];
			var query = {};
			var query_search = [];
			
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
							location_code_final.push( data.substr( 0, 2 ) );
						break;
						case 'BA_CODE':
							location_code_final.push( data.substr( 0, 2 ) );
						break;
					}
				} );
			}


			switch ( ref_role ) {
				case 'REGION_CODE':
					location_code_final.forEach( function( q ) {
						query_search.push( new RegExp( '^' + q.substr( 0, 2 ) ) );
					} );
				break;
				case 'COMP_CODE':
					location_code_final.forEach( function( q ) {
						query_search.push( new RegExp( '^' + q.substr( 0, 2 ) ) );
					} );
				break;
				case 'AFD_CODE':
					location_code_final.forEach( function( q ) {
						query_search.push( new RegExp( '^' + q.substr( 0, 2 ) ) )
					} );
				break;
				case 'BA_CODE':
					location_code_final.forEach( function( q ) {
						query_search.push( new RegExp( '^' + q.substr( 0, 2 ) ) )
					} );
				break;
			}

			switch ( ref_role ) {
				case 'REGION_CODE':
					key = 'REGION_CODE';
					query[key] = query_search;
				break;
				case 'COMP_CODE':
					key = ref_role;
					query[key] = query_search;
				break;
				case 'AFD_CODE':
					key = 'COMP_CODE';
					query[key] = query_search;
				break;
				case 'BA_CODE':
					key = 'COMP_CODE';
					query[key] = query_search;
				break;
				case 'NATIONAL':
					key = 'NATIONAL';
					query[key] = 'NATIONAL';
				break;
			}

			console.log(query);

			// Set Data
			CompModel.find( 
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
				NATIONAL: 1,
				REGION_CODE: 1,
				COMP_CODE: 1,
				COMP_NAME: 1,
				ADDRESS: 1,
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
							NATIONAL: data.NATIONAL,
							REGION_CODE: data.REGION_CODE,
							COMP_CODE: data.COMP_CODE,
							COMP_NAME: data.COMP_NAME,
							ADDRESS: data.ADDRESS
						} );
					}

					if ( data.INSERT_TIME >= start_date && data.INSERT_TIME <= end_date ) {
						temp_insert.push( {
							NATIONAL: data.NATIONAL,
							REGION_CODE: data.REGION_CODE,
							COMP_CODE: data.COMP_CODE,
							COMP_NAME: data.COMP_NAME,
							ADDRESS: data.ADDRESS
						} );
					}

					if ( data.UPDATE_TIME >= start_date && data.UPDATE_TIME <= end_date ) {
						temp_update.push( {
							NATIONAL: data.NATIONAL,
							REGION_CODE: data.REGION_CODE,
							COMP_CODE: data.COMP_CODE,
							COMP_NAME: data.COMP_NAME,
							ADDRESS: data.ADDRESS
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
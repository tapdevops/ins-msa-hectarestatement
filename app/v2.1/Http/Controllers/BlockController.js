/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	// Models
 	const BlockModel = require( _directory_base + '/app/v2.1/Http/Models/BlockModel.js' );

 	// Modules
 	const Terminal = require( 'child_process' ).execSync;
 	const FS = require( 'file-system' );
 	const GeoJSONPrecision = require( 'geojson-precision' );
 	const GeoJSONReducer = require('geojson-reducer');
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

			BlockModel.find( query )
			.select( {
				_id: 0,
				REGION_CODE: 1,
				COMP_CODE: 1,
				EST_CODE: 1,
				WERKS: 1,
				AFD_CODE: 1,
				JUMLAH_TPH: 1,
				BLOCK_CODE: 1,
				BLOCK_NAME: 1,
				WERKS_AFD_CODE: 1,
				WERKS_AFD_BLOCK_CODE: 1,
				LATITUDE_BLOCK: 1,
				LONGITUDE_BLOCK: 1,
				TOPOGRAPHY: 1
			} )
			.then( data => {
				if( !data ) {
					return res.send( {
						status: false,
						message: 'Data not found 2',
						data: {}
					} );
				}
				var results = [];
				if ( data.length > 0 ) {
					data.forEach( function ( dt ) {
						results.push( {
							"JUMLAH_TPH": ( dt.JUMLAH_TPH == null ? 0 : dt.JUMLAH_TPH ),
							"REGION_CODE": dt.REGION_CODE,
							"COMP_CODE": dt.COMP_CODE,
							"EST_CODE": dt.EST_CODE,
							"WERKS": dt.WERKS,
							"AFD_CODE": dt.AFD_CODE,
							"BLOCK_CODE": dt.BLOCK_CODE,
							"BLOCK_NAME": dt.BLOCK_NAME,
							"WERKS_AFD_CODE": dt.WERKS_AFD_CODE,
							"WERKS_AFD_BLOCK_CODE": dt.WERKS_AFD_BLOCK_CODE,
							"LATITUDE_BLOCK": dt.LATITUDE_BLOCK,
							"LONGITUDE_BLOCK": dt.LONGITUDE_BLOCK,
							"TOPOGRAPHY": dt.TOPOGRAPHY
						} );
					} );
				}
				res.send( {
					status: true,
					message: 'Success!',
					data: results
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

		// Create or update data
		exports.createOrUpdate = ( req, res ) => {

			if ( 
				!req.body.REGION_CODE || 
				!req.body.COMP_CODE || 
				!req.body.EST_CODE || 
				!req.body.WERKS || 
				!req.body.JUMLAH_TPH || 
				!req.body.AFD_CODE || 
				!req.body.WERKS_AFD_BLOCK_CODE ||
				!req.body.START_VALID ||
				!req.body.END_VALID ||
				!req.body.TOPOGRAPHY
			) {
				return res.send({
					status: false,
					message: 'Invalid input',
					data: {}
				});
			}

			BlockModel.findOne( { 
				WERKS_AFD_BLOCK_CODE: req.body.WERKS_AFD_BLOCK_CODE,
				START_VALID: HelperLib.date_format( req.body.START_VALID, 'YYYYMMDD' )
			} ).then( data => {

				// Kondisi belum ada data, create baru dan insert ke Sync List
				if( !data ) {
					
					const set = new BlockModel( {
						NATIONAL: req.body.NATIONAL || "",
						REGION_CODE: req.body.REGION_CODE || "",
						COMP_CODE: req.body.COMP_CODE || "",
						EST_CODE: req.body.EST_CODE || "",
						WERKS: req.body.WERKS || "",
						JUMLAH_TPH: req.body.JUMLAH_TPH || "",
						AFD_CODE: req.body.AFD_CODE || "",
						BLOCK_CODE: req.body.BLOCK_CODE || "",
						BLOCK_NAME: req.body.BLOCK_NAME || "",
						WERKS_AFD_CODE: req.body.WERKS_AFD_CODE || "",
						WERKS_AFD_BLOCK_CODE: req.body.WERKS_AFD_BLOCK_CODE || "",
						LATITUDE_BLOCK: req.body.LATITUDE_BLOCK || "",
						LONGITUDE_BLOCK: req.body.LONGITUDE_BLOCK || "",
						START_VALID: HelperLib.date_format( req.body.START_VALID, 'YYYYMMDD' ),
						END_VALID: HelperLib.date_format( req.body.END_VALID, 'YYYYMMDD' ),
						INSERT_TIME: HelperLib.date_format( 'now', 'YYYYMMDDhhmmss' ),
						DELETE_TIME: null,
						UPDATE_TIME: null,
						TOPOGRAPHY: req.body.TOPOGRAPHY
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
						data.REGION_CODE != req.body.REGION_CODE || 
						data.COMP_CODE != req.body.COMP_CODE || 
						data.EST_CODE != req.body.EST_CODE || 
						data.WERKS != req.body.WERKS || 
						data.JUMLAH_TPH != req.body.JUMLAH_TPH || 
						data.AFD_CODE != req.body.AFD_CODE || 
						data.BLOCK_NAME != req.body.BLOCK_NAME || 
						data.LATITUDE_BLOCK != req.body.LATITUDE_BLOCK || 
						data.LONGITUDE_BLOCK != req.body.LONGITUDE_BLOCK || 
						data.END_VALID != HelperLib.date_format( req.body.END_VALID, 'YYYYMMDD' ) ||
						data.TOPOGRAPHY != req.body.TOPOGRAPHY
					) {

						var data_update;
						if ( HelperLib.date_format( req.body.END_VALID, 'YYYYMMDD' ) == '99991231' ) {
							data_update = {
								NATIONAL: req.body.NATIONAL || "",
								REGION_CODE: req.body.REGION_CODE || "",
								COMP_CODE: req.body.COMP_CODE || "",
								EST_CODE: req.body.EST_CODE || "",
								WERKS: req.body.WERKS || "",
								JUMLAH_TPH: req.body.JUMLAH_TPH || "",
								AFD_CODE: req.body.AFD_CODE || "",
								BLOCK_CODE: req.body.BLOCK_CODE || "",
								BLOCK_NAME: req.body.BLOCK_NAME || "",
								LATITUDE_BLOCK: req.body.LATITUDE_BLOCK || "",
								LONGITUDE_BLOCK: req.body.LONGITUDE_BLOCK || "",
								END_VALID: HelperLib.date_format( req.body.END_VALID, 'YYYYMMDD' ),
								UPDATE_TIME: HelperLib.date_format( 'now', 'YYYYMMDDhhmmss' ),
								TOPOGRAPHY: req.body.TOPOGRAPHY
							}
						}
						else {
							data_update = {
								NATIONAL: req.body.NATIONAL || "",
								REGION_CODE: req.body.REGION_CODE || "",
								COMP_CODE: req.body.COMP_CODE || "",
								EST_CODE: req.body.EST_CODE || "",
								WERKS: req.body.WERKS || "",
								JUMLAH_TPH: req.body.JUMLAH_TPH || "",
								AFD_CODE: req.body.AFD_CODE || "",
								BLOCK_CODE: req.body.BLOCK_CODE || "",
								BLOCK_NAME: req.body.BLOCK_NAME || "",
								LATITUDE_BLOCK: req.body.LATITUDE_BLOCK || "",
								LONGITUDE_BLOCK: req.body.LONGITUDE_BLOCK || "",
								END_VALID: HelperLib.date_format( req.body.END_VALID, 'YYYYMMDD' ),
								DELETE_TIME: HelperLib.date_format( 'now', 'YYYYMMDDhhmmss' ),
								TOPOGRAPHY: req.body.TOPOGRAPHY
							}
						}

						BlockModel.findOneAndUpdate( { 
							WERKS_AFD_BLOCK_CODE: req.body.WERKS_AFD_BLOCK_CODE,
							START_VALID: HelperLib.date_format( req.body.START_VALID, 'YYYYMMDD' )
						}, data_update, { new: true } )
						.then( data => {
							if( !data ) {
								return res.send( {
									status: false,
									message: "Data error updating 2 ",
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
		};

		exports.find_one = ( req, res ) => {
			BlockModel.findOne( { 
				WERKS_AFD_BLOCK_CODE: req.params.id 
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
			
			url_query.END_VALID = 99991231;

			BlockModel.find( url_query )
			.select( {
				_id: 0,
				REGION_CODE: 1,
				COMP_CODE: 1,
				EST_CODE: 1,
				WERKS: 1,
				JUMLAH_TPH: 1,
				AFD_CODE: 1,
				BLOCK_CODE: 1,
				BLOCK_NAME: 1,
				WERKS_AFD_BLOCK_CODE: 1,
				LATITUDE_BLOCK: 1,
				LONGITUDE_BLOCK: 1
			} )
			.sort( {
				WERKS: 1,
				AFD_CODE: 1,
				BLOCK_NAME: 1
			} )
			.then( data => {
				if( !data ) {
					return res.send( {
						status: false,
						message: 'Data not found 2',
						data: {}
					} );
				}
				var results = [];
				if ( data.length > 0 ) {
					data.forEach( function ( dt ) {
						results.push( {
							"JUMLAH_TPH": ( dt.JUMLAH_TPH == null ? 0 : dt.JUMLAH_TPH ),
							"REGION_CODE": dt.REGION_CODE,
							"COMP_CODE": dt.COMP_CODE,
							"EST_CODE": dt.EST_CODE,
							"WERKS": dt.WERKS,
							"AFD_CODE": dt.AFD_CODE,
							"BLOCK_CODE": dt.BLOCK_CODE,
							"BLOCK_NAME": dt.BLOCK_NAME,
							"WERKS_AFD_CODE": dt.WERKS_AFD_CODE,
							"WERKS_AFD_BLOCK_CODE": dt.WERKS_AFD_BLOCK_CODE,
							"LATITUDE_BLOCK": dt.LATITUDE_BLOCK,
							"LONGITUDE_BLOCK": dt.LONGITUDE_BLOCK
						} );
					} );
				}
				return res.send( {
					status: true,
					message: 'Success',
					data: results
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
	 * Find
	 * ...
	 * --------------------------------------------------------------------------
	 */
		exports.find_one_geom = ( req, res ) => {
			
			if ( !req.body.WERKS ) {
				return res.status( 200 ).send( {
					status: false,
					message: 'Input tidak valid',
					data: {}
				} );
			}

			var geometry_file_location = 'assets/geo-json/design-block/' + req.body.WERKS + '.enc';
			var results = [];

			console.log(geometry_file_location);

			if ( FS.existsSync( geometry_file_location ) ) {
				// Generate Recuder GeoJSON
				var cmd = "geojson-reducer " + geometry_file_location;
				var options = {
					encoding: 'utf8'
				};

				console.log( Terminal( cmd, options ) );
				
				var data_geometry = GeoJSONPrecision.parse( JSON.parse( FS.readFileSync( geometry_file_location ) ), 4 );
				
				if ( data_geometry.features ) {
					data_geometry.features.forEach( function( data, y ) {
						var coordinates = data.geometry.coordinates;
						var coordinate = coordinates[0];
						// Attributes
						var temporary_geometry = {
							coords: [],
							blokname: String( data.properties.BLOCK_NAME ),
							werks_afd_block_code: String( data.properties.AFD_CODE ) + String( data.properties.BLOCK_CODE ),
							afd_code: String( data.properties.AFD_CODE ).substr( 4, 5 )
						};

						for ( var i = 0; i < coordinate.length; i++ ) {
							for ( var j = i + 1; j < coordinate.length; ) {
								if (coordinate[i][0] == coordinate[j][0] && coordinate[i][1] == coordinate[j][1])
									// Found the same. Remove it.
									coordinate.splice( j, 1 );
								else
									// No match. Go ahead.
									j++;
							}
						}

						// Geometry
						temporary_geometry.coords = [];
						coordinate.forEach( function( locs ) {
							temporary_geometry.coords.push( {
								longitude: locs[0],
								latitude: locs[1]
							} );
						} );
						results.push( temporary_geometry );
					} );

					return res.json( {
						status: true,
						message: "Success!",
						data: {
							polygons: results
						}
					} );
				}
				else {
					return res.json( {
						status: false,
						message: "Error! Invalid geometry data. ",
						data: []
					} );
				}
			}
			else {
				return res.json( {
					status: false,
					message: "Error! Geometry data file not found. ",
					data: []
				} );
			}
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
				query["END_VALID"] = 99991231;
			
			if ( ref_role != 'ALL' ) {
				location_code_group.forEach( function( data ) {
					console.log( "DATA: ", data );
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
			console.log( query );
			BlockModel.find( 
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
				
			).select( {
				_id: 0,
				REGION_CODE: 1,
				COMP_CODE: 1,
				EST_CODE: 1,
				WERKS: 1,
				JUMLAH_TPH: 1,
				AFD_CODE: 1,
				BLOCK_CODE: 1,
				BLOCK_NAME: 1,
				WERKS_AFD_CODE: 1,
				WERKS_AFD_BLOCK_CODE: 1,
				LATITUDE_BLOCK: 1,
				LONGITUDE_BLOCK: 1,
				INSERT_TIME: 1,
				DELETE_TIME: 1,
				UPDATE_TIME: 1,
				TOPOGRAPHY: 1
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
							WERKS: data.WERKS,
							JUMLAH_TPH: ( data.JUMLAH_TPH == null ? 0 : data.JUMLAH_TPH ),
							AFD_CODE: data.AFD_CODE,
							BLOCK_CODE: data.BLOCK_CODE,
							BLOCK_NAME: data.BLOCK_NAME,
							BLOCK_NAME: data.BLOCK_NAME,
							WERKS_AFD_CODE: data.WERKS_AFD_CODE,
							WERKS_AFD_BLOCK_CODE: data.WERKS_AFD_BLOCK_CODE,
							LATITUDE_BLOCK: data.LATITUDE_BLOCK,
							LONGITUDE_BLOCK: data.LONGITUDE_BLOCK,
							TOPOGRAPHY: data.TOPOGRAPHY
						} );
					}

					if ( data.INSERT_TIME >= start_date && data.INSERT_TIME <= end_date ) {
						temp_insert.push( {
							REGION_CODE: data.REGION_CODE,
							COMP_CODE: data.COMP_CODE,
							EST_CODE: data.EST_CODE,
							WERKS: data.WERKS,
							JUMLAH_TPH: ( data.JUMLAH_TPH == null ? 0 : data.JUMLAH_TPH ),
							AFD_CODE: data.AFD_CODE,
							BLOCK_CODE: data.BLOCK_CODE,
							BLOCK_NAME: data.BLOCK_NAME,
							BLOCK_NAME: data.BLOCK_NAME,
							WERKS_AFD_CODE: data.WERKS_AFD_CODE,
							WERKS_AFD_BLOCK_CODE: data.WERKS_AFD_BLOCK_CODE,
							LATITUDE_BLOCK: data.LATITUDE_BLOCK,
							LONGITUDE_BLOCK: data.LONGITUDE_BLOCK,
							TOPOGRAPHY: data.TOPOGRAPHY
						} );
					}
					if ( data.UPDATE_TIME >= start_date && data.UPDATE_TIME <= end_date ) {
						temp_update.push( {
							REGION_CODE: data.REGION_CODE,
							COMP_CODE: data.COMP_CODE,
							EST_CODE: data.EST_CODE,
							WERKS: data.WERKS,
							JUMLAH_TPH: ( data.JUMLAH_TPH == null ? 0 : data.JUMLAH_TPH ),
							AFD_CODE: data.AFD_CODE,
							BLOCK_CODE: data.BLOCK_CODE,
							BLOCK_NAME: data.BLOCK_NAME,
							BLOCK_NAME: data.BLOCK_NAME,
							WERKS_AFD_CODE: data.WERKS_AFD_CODE,
							WERKS_AFD_BLOCK_CODE: data.WERKS_AFD_BLOCK_CODE,
							LATITUDE_BLOCK: data.LATITUDE_BLOCK,
							LONGITUDE_BLOCK: data.LONGITUDE_BLOCK,
							TOPOGRAPHY: data.TOPOGRAPHY
						} );
					}
				} );
				console.log( temp_insert.length );
				console.log( temp_update.length );
				console.log( temp_delete.length );
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
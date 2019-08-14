/**
 * --------------------------------------------------
 * SETUP VARIABLE
 * --------------------------------------------------
 */
	// Libraries
	const request = require( 'supertest' );
	const app = require( '../app.js' );
	const expect = require( 'chai' ).expect;

	// Setup Testing
	const testing_name = "TEST AFDELING";
	const url = {}
	const model = require( '../app/models/afdeling.js' );

	// MENAMPILKAN DATA AFDELING DENGAN PARAMETER
	const data_dummy_test_01 = [ '4121A', '4121B', '4121C' ];

/**
 * --------------------------------------------------
 * BEGIN TESTING
 * --------------------------------------------------
 */
	describe( testing_name, function() {

		// TEST - 01
		// MENAMPILKAN DATA AFDELING DENGAN PARAMETER
		// --------------------------------------------------\
		it ( 'MENAMPILKAN DATA AFDELING DENGAN PARAMETER', function() {
			console.log( 'TESTING -> ' )
			var key = 'AFD_CODE';
			model.find( {
				WERKS_AFD_CODE: {
					$in: data_dummy_test_01
				}
			} )
			.select({
				_id: 0,
				REGION_CODE: 1,
				COMP_CODE: 1,
				EST_CODE: 1,
				WERKS: 1,
				AFD_CODE: 1,
				AFD_NAME: 1,
				WERKS_AFD_CODE: 1
			})
			.then( data => {
				if ( !data ) {
					console.log( 'Error' );
				}
				else {
					data.forEach( function( result ) {
						console.log( 'REGION_CODE : ' + result.WERKS_AFD_CODE + ' - ' + result.AFD_NAME + ' -> SUCCESS' );
					} );
				}
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					console.log( 'ObjectId error' );
				}
				else {
					console.log( 'Error retrieving data' );
				}
			} );

		} );

	} );

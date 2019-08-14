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
	const testing_name = "TEST EST";
	const url = {}
	const model = require( '../app/models/est.js' );

	// MENAMPILKAN DATA EST DENGAN PARAMETER
	const data_dummy_test_01 = [ '4121' ];

/**
 * --------------------------------------------------
 * BEGIN TESTING
 * --------------------------------------------------
 */
	describe( testing_name, function() {

		// TEST - 01
		// MENAMPILKAN DATA EST DENGAN PARAMETER
		// --------------------------------------------------\
		it ( 'MENAMPILKAN DATA EST DENGAN PARAMETER', function() {
			model.find( {
				WERKS: {
					$in: data_dummy_test_01
				}
			} )
			.select({
				_id: 0,
				NATIONAL: 1,
				REGION_CODE: 1,
				COMP_CODE: 1,
				EST_CODE: 1,
				WERKS: 1,
				EST_NAME: 1,
				CITY: 1
			})
			.then( data => {
				if ( !data ) {
					console.log( 'Error' );
				}
				else {
					data.forEach( function( result ) {
						console.log( 'EST_CODE : ' + result.WERKS + ' - ' + result.EST_NAME + ' -> SUCCESS' );
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

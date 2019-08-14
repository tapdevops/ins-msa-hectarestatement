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
	const testing_name = "TEST REGION";
	const url = {}
	const model = require( '../app/models/region.js' );

	// MENAMPILKAN DATA REGION BERDASARKAN PARAMETER
	const data_dummy_test_02 = [ '04' ];

/**
 * --------------------------------------------------
 * BEGIN TESTING
 * --------------------------------------------------
 */
	describe( testing_name, function() {

		// TEST - 01
		// MENAMPILKAN SELURUH DATA REGION
		// --------------------------------------------------\
		it ( 'MENAMPILKAN SELURUH DATA REGION', function() {
			model.find({}).select({
				_id: 0,
				NATIONAL: 1,
				REGION_CODE: 1,
				REGION_NAME: 1
			})
			.then( data => {
				if ( !data ) {
					console.log( 'Error' );
				}
				else {
					data.forEach( function( result ) {
						console.log( 'REGION_CODE : ' + result.REGION_CODE + ' - ' + result.REGION_NAME + ' -> SUCCESS' );
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

		// TEST - 02
		// MENAMPILKAN DATA REGION BERDASARKAN PARAMETER
		// --------------------------------------------------\
		it ( 'MENAMPILKAN DATA REGION BERDASARKAN PARAMETER', function() {
			model.find({
				REGION_CODE: { 
					$in: data_dummy_test_02 
				}
			}).select({
				_id: 0,
				NATIONAL: 1,
				REGION_CODE: 1,
				REGION_NAME: 1
			})
			.then( data => {
				if ( !data ) {
					console.log( 'Error' );
				}
				else {
					data.forEach( function( result ) {
						console.log( 'REGION_CODE : ' + result.REGION_CODE + ' - ' + result.REGION_NAME + ' -> SUCCESS' );
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

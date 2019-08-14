/*
|--------------------------------------------------------------------------
| Variable
|--------------------------------------------------------------------------
*/
	// Config
	const config = require( _directory_base + '/config/config.js' );

	// Node Modules
	const jwt = require( 'jsonwebtoken' );
	const uuid = require( 'uuid' );
	const nJwt = require( 'njwt' );
	const jwtDecode = require( 'jwt-decode' );

	// Declare Controllers
	const AfdelingController = require( _directory_base + '/app/controllers/AfdelingController.js' );
	const BlockController = require( _directory_base + '/app/controllers/BlockController.js' );
	const CompController = require( _directory_base + '/app/controllers/CompController.js' );
	const EstController = require( _directory_base + '/app/controllers/EstController.js' );
	const RegionController = require( _directory_base + '/app/controllers/RegionController.js' );
	const LandUseController = require( _directory_base + '/app/controllers/LandUseController.js' );

/*
|--------------------------------------------------------------------------
| Routing
|--------------------------------------------------------------------------
*/
	module.exports = ( app ) => {

		/*
		 |--------------------------------------------------------------------------
		 | Land Use
		 |--------------------------------------------------------------------------
		 */
			app.get( '/land-use/all', token_verify, LandUseController.findAll );
			app.get( '/land-use/q', token_verify, LandUseController.findAll );
			app.get( '/report/land-use/:id', token_verify, LandUseController.findOneForReport );
			app.get( '/land-use/q', token_verify, LandUseController.findAll );
			app.get( '/land-use', token_verify, LandUseController.find );
			app.post( '/sync-tap/land-use', token_verify, LandUseController.createOrUpdate );
			app.get( '/sync-mobile/land-use/:start_date/:end_date', token_verify, LandUseController.syncMobile );
			
		/*
		 |--------------------------------------------------------------------------
		 | Afdeling
		 |--------------------------------------------------------------------------
		 */
			app.get( '/afdeling/all', token_verify, AfdelingController.findAll );
			app.get( '/afdeling/q', token_verify, AfdelingController.findAll );
			app.post( '/sync-tap/afdeling', AfdelingController.createOrUpdate );
			app.get( '/sync-mobile/afdeling/:start_date/:end_date', token_verify, AfdelingController.syncMobile );
			app.get( '/afdeling', token_verify, AfdelingController.find );
			app.post( '/afdeling', AfdelingController.create );
			app.get( '/afdeling/:id', AfdelingController.findOne );
			app.put( '/afdeling/:id', AfdelingController.update );
			app.delete( '/afdeling/:id', AfdelingController.delete );

		/*
		 |--------------------------------------------------------------------------
		 | Block
		 |--------------------------------------------------------------------------
		 */
			app.get( '/block/all', token_verify, BlockController.findAll );
			app.get( '/block/q', token_verify, BlockController.findAll );
			app.post( '/sync-tap/block', BlockController.createOrUpdate );
			app.get( '/sync-mobile/block/:start_date/:end_date', token_verify, BlockController.syncMobile );
			app.get( '/block', token_verify, BlockController.find );
			app.post( '/block', BlockController.create );
			app.get( '/block/:id', BlockController.findOne );
			app.put( '/block/:id', BlockController.update );
			app.delete( '/block/:id', BlockController.delete );
			app.get( '/geom/design/block/:id', token_verify, BlockController.findDesignGeoJSON );

		/*
		 |--------------------------------------------------------------------------
		 | Comp
		 |--------------------------------------------------------------------------
		 */
			app.get( '/comp/all', token_verify, CompController.findAll );
			app.get( '/comp/q', token_verify, CompController.findAll );
			app.post( '/sync-tap/comp', token_verify, CompController.createOrUpdate );
			app.get( '/sync-mobile/comp/:start_date/:end_date', token_verify, CompController.syncMobile );
			app.delete( '/comp/:id', token_verify, CompController.delete );
			app.get( '/comp', token_verify, CompController.find );
			app.post( '/comp', CompController.create );
			app.get( '/comp/:id', CompController.findOne );
			app.put( '/comp/:id', CompController.update );

		/*
		 |--------------------------------------------------------------------------
		 | Est
		 |--------------------------------------------------------------------------
		 */
			app.get( '/est/all', token_verify, EstController.findAll );
			app.get( '/est/q', token_verify, EstController.findAll );
			app.post( '/sync-tap/est', verifyToken, EstController.createOrUpdate );
			app.get( '/sync-mobile/est/:start_date/:end_date', token_verify, EstController.syncMobile );
			app.get( '/est', token_verify, EstController.find );
			app.post( '/est', EstController.create );
			app.get( '/est/:id', EstController.findOne );
			app.put( '/est/:id', EstController.update );
			app.delete( '/est/:id', EstController.delete );

		/*
		 |--------------------------------------------------------------------------
		 | Region
		 |--------------------------------------------------------------------------
		 */
			app.get( '/region/all', verifyToken, RegionController.findAll );
			app.get( '/region/q', verifyToken, RegionController.findAll );
			app.post( '/sync-tap/region', verifyToken, RegionController.createOrUpdate );
			app.get( '/sync-mobile/region/:start_date/:end_date', token_verify, RegionController.syncMobile );
			app.post( '/region', verifyToken, RegionController.create );
			app.get( '/region', token_verify, RegionController.find );
			app.get( '/region/:id', verifyToken, RegionController.findOne );
			app.put( '/region/:id', verifyToken, RegionController.update );
			app.delete( '/region/:id', verifyToken, RegionController.delete );

	}

/*
|--------------------------------------------------------------------------
| Token Verify
|--------------------------------------------------------------------------
*/
	function token_verify( req, res, next ) {
		// Get auth header value
		const bearerHeader = req.headers['authorization'];

		if ( typeof bearerHeader !== 'undefined' ) {
			const bearer = bearerHeader.split( ' ' );
			const bearer_token = bearer[1];

			req.token = bearer_token;

			nJwt.verify( bearer_token, config.secret_key, config.token_algorithm, ( err, authData ) => {
				if ( err ) {
					res.send({
						status: false,
						message: "Invalid Token",
						data: []
					} );
				}
				else {
					req.auth = jwtDecode( req.token );
					req.auth.LOCATION_CODE_GROUP = req.auth.LOCATION_CODE.split( ',' );
					req.config = config;
					next();
				}
			} );
			
		}
		else {
			// Forbidden
			res.sendStatus( 403 );
		}
	}

	function verifyToken( req, res, next ) {
		// Get auth header value
		const bearerHeader = req.headers['authorization'];

		if ( typeof bearerHeader !== 'undefined' ) {
			const bearer = bearerHeader.split( ' ' );
			const bearerToken = bearer[1];

			req.token = bearerToken;
			next();
		}
		else {
			// Forbidden
			res.sendStatus( 403 );
		}
	}
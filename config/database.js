/*
 |--------------------------------------------------------------------------
 | Database Connections
 |--------------------------------------------------------------------------
 |
 | Here are each of the database connections setup for your application.
 | Of course, examples of configuring each database platform that is
 | supported by NodeJS is shown below to make development simple.
 |
 */
	module.exports = {
		dev: {
			url: 'mongodb://s_hectare_statement:s_hectare_statement@dbappdev.tap-agri.com:4848/s_hectare_statement?authSource=s_hectare_statement',
			ssl: false
		},
		qa: {
			url: 'mongodb://s_hectare_statement:h52019@dbappqa.tap-agri.com:4848/s_hectare_statement?authSource=s_hectare_statement',
			ssl: false
		},
		prod: {
			url: 'mongodb://s_hectare_statement:h52019@dbapp.tap-agri.com:4848/s_hectare_statement?authSource=s_hectare_statement',
			ssl: false
		}
	}
//Bring in the express server and create application
const { application } = require( "express" );
let express = require( 'express' );
const pieRepo = require( "./repos/pieRepo" );
let app = express();
const errorHelper = require( "./helpers/errorHelpers" );
let cors = require( 'cors' );
    
//Use the express Router object
let router = express.Router();

// let pies = [
//     { "id": 1, "name": "Apple" },
//     { "id": 2, "name": "Cherry" },
//     { "id": 3, "name": "Peach" }
// ];
// let pies = pieRepo.get();

//configure middleware to support JSON data parsing in request object
app.use(express.json());

// Configure CORS
app.use(cors());

//Create GET to return a list of all pies
router.get( '/', function ( req, res ,next) { 
    // res.status(200).send( pies );
    // res.status( 200 ).json( {
    //     "status": 200,
    //     "statusText": "OK",
    //     "message": "All pies retrieved.",
    //     "data": pies
    // } );
    pieRepo.get( function ( data ) {
        res.status( 200 ).json( {
            "status": 200,
            "statusText": "OK",
            "message": "All pies retrieved.",
            "data": data
        } );
    }, function ( err ) {
        next( err );
    });
} );

//Search parameter are passed on the query line: http://localhost:5000/api/search?id=1&name=a
//http://localhost:5000/api/search?id=3
//http://localhost:5000/api/search/?name=P

router.get( '/search', function ( req, res ,next) { 
   
    let searchObject = {
        "id": req.query.id,
        "name": req.query.name
    };

    pieRepo.search( searchObject, function ( data ) {
        res.status( 200 ).json( {
            "status": 200,
            "statusText": "OK",
            "message": "All pies retrieved.",
            "data": data
        } );
    }, function ( err ) {
        next( err );
    });
} );



router.get( '/:id', function ( req, res ,next) { 
    
    pieRepo.getById( req.params.id, function ( data ) {
        if ( data ) {
             res.status( 200 ).json( {
            "status": 200,
            "statusText": "OK",
            "message": "Single pies retrieved.",
            "data": data
        } );
        } else {
            res.status( 404 ).json( {
                "status": 404,
                "statusText": "Not Found",
                "message": "The pie '"+req.params.id+"' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "error":"The pie '"+req.params.id+"' could not be found."
                }
            } );
        }
    }, function ( err ) {
        next( err );
    });
} );

router.post( '/', function ( req, res ,next) { 
   
    pieRepo.insert( req.body, function ( data ) {
         res.status( 201 ).json( {
            "status": 201,
            "statusText": "Created",
            "message": "New pie added.",
            "data": data
        } );
    } , function ( err ) {
        next( err );
    });
} );

router.put( '/:id', function ( req, res ,next) { 
   
    pieRepo.getById( req.params.id, function ( data ) {
        if ( data ) {
            // Attempt to update the data
            pieRepo.update( req.body, req.params.id, function ( data ) {
                 res.status( 200 ).json( {
                    "status": 200,
                    "statusText": "OK",
                    "message": "Pie '"+req.params.id+"' updated.",
                    "data": data
                } );
                
            } );
        } else {
            res.status( 404 ).json( {
                "status": 404,
                "statusText": "Not Found",
                "message": "The pie '"+req.params.id+"' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "error":"The pie '"+req.params.id+"' could not be found."
                }
            } );
        }


        
    } , function ( err ) {
        next( err );
    });
} );

router.delete( '/:id', function ( req, res ,next) { 
   
    pieRepo.getById( req.params.id, function ( data ) {
        if ( data ) {
            // Attempt to delete the data
            pieRepo.delete( req.params.id, function ( data ) {
                 res.status( 200 ).json( {
                    "status": 200,
                    "statusText": "OK",
                    "message": "The Pie '"+req.params.id+"' is deleted.",
                    "data": "Pie '"+req.params.id+"' deleted."
                } );
                
            } );
        } else {
            res.status( 404 ).json( {
                "status": 404,
                "statusText": "Not Found",
                "message": "The pie '"+req.params.id+"' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "error":"The pie '"+req.params.id+"' could not be found."
                }
            } );
        }


        
    } , function ( err ) {
        next( err );
    });
} );

router.patch( '/:id', function ( req, res ,next) { 
   
    pieRepo.getById( req.params.id, function ( data ) {
        if ( data ) {
            // Attempt to update the data
            pieRepo.update( req.body, req.params.id, function ( data ) {
                 res.status( 200 ).json( {
                    "status": 200,
                    "statusText": "OK",
                    "message": "Pie '"+req.params.id+"' patched.",
                    "data": data
                } );
                
            } );
        } else {
            res.status( 404 ).json( {
                "status": 404,
                "statusText": "Not Found",
                "message": "The pie '"+req.params.id+"' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "error":"The pie '"+req.params.id+"' could not be found."
                }
            } );
        }


        
    } , function ( err ) {
        next( err );
    });
} );

//Configure router so all routes are prefixed with /api/v1
app.use( '/api/', router );
//All REST APIs in this server are called as follows: http://localhost:5000/api/
/*
function errorBuilder ( err ) {
    return {
        "status": 500,
        "statusText": "Internal Server Error",
        "message": err.message,
        "error": {
            "errno": err.errno,
            "call:":err.syscall,
            "code": "INTERNAL_SERVER_ERROR",
            "message": err.message
        }
    };
}

// Configure exception logger to console
app.use( function ( err, req, res, next ) {
    console.log( errorBuilder( err ) );
    next( err );
} );

// Configure exception middleware last
app.use( function ( err, req, res, next ) {
    // res.status( 500 ).json( {
    //             "status": 500,
    //             "statusText": "Internal Server Error",
    //             "message": err.message,
    //             "error": {
    //                 "code": "INTERNAL_SERVER_ERROR",
    //                  "message": err.message
    //             }
    //         } );
    res.status( 500 ).json( errorBuilder( err ) );
} );
*/

// Configure exception logger to console
app.use( errorHelper.logErrorsToConsole );
// Configure exception logger to file
app.use( errorHelper.logErrorToFile);
// Configure client error handler
app.use( errorHelper.clientErrorHandler);
// Configure exception middleware last
app.use( errorHelper.errorHandler);

//Create server to listen on port 5000
var server = app.listen( 80, beingfluid.github.io, function () {
    console.log('Node server is running on http://localhost:8080..');
} );
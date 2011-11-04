/*!
 * Nodeunit
 * Copyright (c) 2010 Caolan McMahon
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var async = require('../deps/async'),
    types = require('./types'),
    utils = require('./utils'),
    core = require('./core'),
    reporters = require('./reporters'),
    assert = require('./assert'),
    path = require('path'),
    util = require('util'),
    events = require('events');


/**
 * Export sub-modules.
 */

exports.types = types;
exports.utils = utils;
exports.reporters = reporters;
exports.assert = assert;

// backwards compatibility
exports.testrunner = {
    run: function () {
        console.log(
            'WARNING: nodeunit.testrunner is going to be deprecated, please ' +
            'use nodeunit.reporters.default instead!'
        );
        return reporters['default'].run.apply(this, arguments);
    }
};


/**
 * Export all core functions
 */

for (var k in core) {
    exports[k] = core[k];
};

var results = [];

/**
 * Load modules from paths array and run all exported tests in series. If a path
 * is a directory, load all supported file types inside it as modules. This only
 * reads 1 level deep in the directory and does not recurse through
 * sub-directories.
 *
 * @param {Array} paths
 * @param {Object} opt
 * @api public
 */

exports.runFiles = function (paths, opt) {
    var all_assertions = [];
    var options = types.options(opt);
    var start = new Date().getTime();
    
    if (!paths.length) {
        return options.done(types.assertionList(all_assertions));
    }
    // console.log(codeCoverage);
    // if(codeCoverage) {
    //     console.log(codeCoverage.paths);
    //     codeCoverage.paths.forEach(function(path) {
    //         require.paths.unshift(path);            
    //     });
    //     
    // }

    utils.modulePaths(paths, function (err, files) {
        if (err) throw err;
        // console.log(files);
        async.concatSeries(files, function (file, cb) {
            var name = path.basename(file[0]);
            var callback = cb;
            // console.log(name.toString());
            // console.log('Files:' + file);
            
            // console.log(process.cwd() + ' ' + codeCoverage.usual + ' ' + file[1] + '.js');
            
            // console.log(path.join(process.cwd(), codeCoverage.usual, file[1]));
            require(path.join(process.cwd(), codeCoverage.usual, file[1]));
            // console.log(typeof(_$jscoverage));
            // results.push(_$jscoverage);
            var coverage = _$jscoverage;
            exports.runModule(name, require(file[0]), options, function(arguments) {
              // console.log("Module just ran");
              // // console.log(path.join(process.cwd(), codeCoverage.usual, file[1]));
              // // require(path.join(process.cwd(), codeCoverage.usual, file[1]));
              // console.log("Coverage for " + name);
              // console.log("Coverage functions " + typeof printCoverage);
              // console.log("Global coverage function " + typeof reportCoverage);
              // console.log("Coverage details " + (coverage !== undefined));
              // console.log(arguments);
              // console.log(util.inspect(coverage, true, 4));
              printCoverage(coverage, file[1]);
              // console.log(typeof cb);
              // console.log(typeof callback);
              // try {
              //   throw new Error("Cannot pass coverage details");
              // } catch(e) {
              //   console.log(e.stack);
              // }
              cb(arguments);
          });
        },
        function (err, all_assertions) {
            var end = new Date().getTime();
            // console.log("here");
            // console.log(results);
            exports.done()
            // console.log(results.length);
            // Send jscoverage result to the reporter if any results exist
            // if(results.length > 0) {
            //     options.done(types.assertionList(all_assertions, end - start), results);
            //     results = [];
            //     console.log("Clearing results");
            //     console.log(results.length);
            //     
            // } else {
            options.done(types.assertionList(all_assertions, end - start));
            // }
        });
    });

};

/* Export all prototypes from events.EventEmitter */
var label;
for (label in events.EventEmitter.prototype) {
  exports[label] = events.EventEmitter.prototype[label];
}

/* Emit event 'complete' on completion of a test suite. */
exports.complete = function(name, assertions)
{
	exports.emit('complete', name, assertions);
};

/* Emit event 'complete' on completion of all tests. */
exports.done = function()
{
  exports.emit('done');
};

module.exports = exports;

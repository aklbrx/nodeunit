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
    path = require('path')
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
    var coverage = [];
    // var paths = dir[0];
    // var origs = dir[1];
    
    if (!paths.length) {
        return options.done(types.assertionList(all_assertions));
    }

    if(codeCoverage) {
        console.log(codeCoverage.paths);
        codeCoverage.paths.forEach(function(path) {
            require.paths.unshift(path);            
        });
        
    }
    
    utils.modulePaths(paths, function (err, files) {
        if (err) throw err;
        async.concatSeries(files, function (file, cb) {
            var name = path.basename(file[0]);
            console.log(name.toString());
            console.log('Files:' + file);
            
            console.log(process.cwd() + ' ' + codeCoverage.usual + ' ' + file[1].substring(5, file[1].indexOf('-unit')) + '.js');
            require(path.join(process.cwd(), codeCoverage.usual, file[1].substring(5, file[1].indexOf('-unit')) + '.js'));
            results.push(_$jscoverage);
            exports.runModule(name, require(file[0]), options, cb);
        },
        function (err, all_assertions) {
            var end = new Date().getTime();
            exports.done()
            console.log(results.length);
            // Send jscoverage result to the reporter if any results exist
            if(results.length > 0) {
                options.done(types.assertionList(all_assertions, end - start), results);
                results = [];
                console.log("Clearing results");
                console.log(results.length);
                
            } else {
                options.done(types.assertionList(all_assertions, end - start));
            }
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

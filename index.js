/* global module, require, __dirname */
/* jshint globalstrict: true */
'use strict';
var http = require('http');
var https = require('https');
var url = require('url');
var nj = require('nunjucks');
var baseDir = __dirname;
var JSPARSONSPythonCustom = function() {};


JSPARSONSPythonCustom.initialize = function(req, params, handlers, cb) {
  var templateDir = baseDir + '/templates/';
  nj.configure(templateDir, { autoescape: false });  
  var urlParts = url.parse(req.url, true);
  var query = urlParts.query;
  if(query.initial) {
    initializeURLAsync(req, params, cb);
  } else if(query.url) {

    initializeJSONAsync(req, params, cb);
  } else {
    //ERROR
    cb();
  }
  
};


function initializeURLAsync(req, params, cb) {
    var urlParts = url.parse(req.url, true);
    var query = urlParts.query;
    var parsonContent = '<script>\n';
    var initial = query.initial || 'No code given.';

    initial = initial.replace(/\/n/g, '\\n');
    params.headContent += nj.render('head_simple.html', {'initial': initial, 'name': query.name });
    cb();
}

function initializeJSONAsync (req, params, cb) {
    // Helper functions
    var addData = function(data) {
        var JSONData = JSON.parse(data);
        //var initial = JSONData.initial.replace(/\"/g, '\\"');
        var initial = JSONData.initial.replace(/\n/g,'\\n');
        //initial = initial.replace(/\"/g, '\\"');
        //initial = initial.replace(/\n/g, '\\n"');
        
        params.headContent += nj.render('head_simple.html', {'initial': initial });
        //params.bodyContent += '<h1>jee</h1>';
        //params.bodyContent += '<div id="instrcutions"><h3>Instructions</h3>' + JSONData.instructions + '</div>';
    };

    var handleResult = function(result) {
        var body = '';
        if (result.statusCode == 200) {

            result.setEncoding('utf8');
            result.on('data', function(chunk) {
                body += chunk;
            });
            result.on('end', function() {
                addData(body);
                cb();
            });
            
        } else {
            params.error = 'Missing required parameter';
            cb();
        }
    };

    if (req.query) {
      // Get the requested resource
      if (req.query.url) {

        var isHttps = url.parse(req.query.url).protocol === 'https:';
        (isHttps ? https : http).get(req.query.url, function(result) { 

            handleResult(result);
        }).on('error', function(e) {
            params.error = 'Communication error';
            cb();
        });
      }
        
    } else {
        params.error = 'Missing required parameter';
        cb();
    }
    
}

JSPARSONSPythonCustom.register = function(handlers) {
    handlers.contentPackages['jsparsons-python-custom'] = JSPARSONSPythonCustom;
    handlers.contentTypes.jsparsons.installedContentPackages.push(JSPARSONSPythonCustom);
};

JSPARSONSPythonCustom.namespace = 'jsparsons-python-custom';
JSPARSONSPythonCustom.contentTypeNamespace = 'jsparsons';
JSPARSONSPythonCustom.packageContents = [];

JSPARSONSPythonCustom.meta = {
    'name': 'jsparsons-python-custom',
    'shortDescription': 'Exercise package for loading external (URL or JSON) exercise descriptions of Parson\'s problems.',
    'description': '',
    'author': 'Lassi Haaranen',
    'license': 'MIT',
    'version': '0.0.1',
    'url': ''
};

module.exports = JSPARSONSPythonCustom;

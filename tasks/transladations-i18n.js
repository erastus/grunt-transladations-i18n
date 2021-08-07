/*
 * grunt-copyright-notice
 * https://github.com/erastus/grunt-transladations-i18n
 *
 * Copyright © 2021 Erastus
 * Licensed under the BSB license.
 */

'use strict';

//import * as csv from 'fast-csv';
//import {csv} from 'fast-csv';

module.exports = function (grunt) {
    const path = require('path');
    const os = require('os');
    const fgetcsv = require('csv-parse/lib/sync');
    const objectPath = require("object-path");
    const EOL = os.EOL; // end of line for operating system
    const insertPositionMarker = '\uFFFD'; // Unicode REPLACEMENT CHARACTER -- http://www.fileformat.info/info/unicode/char/fffd/index.htm
    const fs = require('fs')

    /**
     * Normalize the files paths for window (\) and unix (/)
     * 
     * @function normalizePaths
     * @return {String} 
     */
     function normalizePaths (path) {
        return path.replace(/\\/g, '/');
     }

    /**
     * @constructor create a new instance of tags task
     */
    function Tags (options) {
        this.options = this.processOptions(options);
    }

    /**
     * process options, overriding defaults
     */
    Tags.prototype.processOptions = function (options) {
        var processedOptions = {};

        processedOptions.delimiter = options.delimiter || ',';

        return processedOptions;
    };

    /**
     * this is the main method that process and modified files, adding tags along the way!
     *
     * @method processFile
     */
    Tags.prototype.processFile = function (output, srcFiles) {
        const that = this;

        srcFiles.forEach(function (destFile) {
            const file = path.basename(destFile);
            const srcFilePath = path.dirname(destFile)
            console.log(`generating ${file}...`);
            //var fh = fopen ( __DIR__ . "/translations/" . $file, 'r' );
            const fh = grunt.file.read(destFile);
            let language_files = [];

            // find out all lang files (columns) we're dealing with...
            const header = fgetcsv(fh, {delimiter: that.options.delimiter});
            header[0].forEach( function(h) {
                if (h != 'label') {
                    language_files.push(h);
                }
            });

            // make a directory in the output folder for each language
            language_files.forEach( function(language) {
                if (!fs.existsSync(path.join(output, language))) {
                  fs.mkdirSync(path.join(output, language), { recursive: true });
                }
            });

            // copy the index.js file to the output folder for each language
            language_files.forEach( function(language) {
                fs.copyFile(path.join(srcFilePath, 'index.js'), path.join(output, language, 'index.js'), (err) => {
                  if (err) throw err;
                });
            });

            language_files.forEach( function(language) {
               const languages = fgetcsv(fh, {columns: true, delimiter: that.options.delimiter});
               let jsonLanguage = {};

                languages.forEach( function(value) {
                    objectPath.set(jsonLanguage, value.label, value[language]);
                });
               
               const fileName = file.split('.').slice(0, -1).join('.');
               const filePath = path.join(output, language, fileName + '.json');
               const jsonContent = JSON.stringify(jsonLanguage, null, 2) + EOL;

               grunt.file.defaultEncoding = 'utf8';
               grunt.file.write(filePath, jsonContent);
            });
        });
    };

    //
    // register tags grunt task
    //
    grunt.registerMultiTask('transladations-i18n', 'Move translations from CSV files to json files', function () {
        const that = this;
        const tags = new Tags(that.options());

        // for each destination file
        this.files.forEach(function (file) {
            tags.processFile(file.dest, file.src);
        });
    });
};

'use strict';

module.exports = function(grunt) {

    // default test task
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        'transladations-i18n': {
            options: {
                //
            },
            test: {
                options: {
                    delimiter: ','
                },
                src: [
                    'tests/*.csv'
                ],
                dest: 'dist/'
            }
        },
        copy: {
            main: {
                expand: true,
                cwd: 'tests/src/',
                src: '**',
                dest: 'dist/'
            }
        },
        clean: {
            src: ['dist/']
        },
        nodeunit: {
            all: ['tests/tags.test.js']
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Test tasks cleans folder, runs tags task, then runs nodeunit
    grunt.registerTask('test', [
        'clean',
        'transladations-i18n:test'
    ]);
};

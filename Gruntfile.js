/*global module:false*/
module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    // Task configuration.

    clean: {
      report: ["test/report"]
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        globals: {
          define: true,
          require: true,
          Backbone: true,
          _: true,
          equal: true,
          module: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      list: {
        src: 'backbone.listview.js'
      }
    },

    qunit: {
      options: {
        '--web-security': 'no',
        coverage: {
          src: ['backbone.listview.js'],
          instrumentedFiles: 'test/temp/',
          htmlReport: 'test/report/coverage',
          coberturaReport: 'test/report/',
          linesThresholdPct: 85
        }
      },
      all: ['test/*.html']
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-qunit-istanbul');

  grunt.registerTask('default', ['jshint', 'qunit']);
};

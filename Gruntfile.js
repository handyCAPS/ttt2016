/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: false,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: false,
        boss: true,
        eqnull: true,
        browser: true,
        jasmine: true,
        globals: {
          jQuery: true,
          require: true,
          console: true,
          alert: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['js/**/*.js', 'test/**/*.js']
      }
    },
    sass: {
      options: {
        style: 'expanded',
        require: 'susy'
      },
      dev: {
        files: [{
          expand: true,
          cwd: 'scss',
          src: '**/*.scss',
          dest: 'css',
          ext: '.css'
        }]
      }
    },
    postcss: {
      options: {
        processors: [require('autoprefixer')]
      },
      dist: {
        src: 'css/**/*.css'
      }
    },
    jasmine: {
      all: {
        src: ['js/**/*.js'],
        options: {
          specs: 'tests/**/*.spec.js',
          keepRunner: true
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    watch: {
      options: {
        livereload: true
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: ['js/**/*.js', 'tests/js/**/*.js'],
        tasks: ['jshint:lib_test', 'jasmine']
      },
      sass: {
        files: 'scss/**/*.scss',
        tasks: ['sass', 'postcss']
      },
      html: {
        files: '**/*.html'
      }
    }
  });

  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt);

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

};

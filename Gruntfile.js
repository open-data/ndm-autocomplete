module.exports = function(grunt) {
    // Load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        clean: {
            src: 'dist'
        },

        jscs: {
            options: {
                config: '.jscsrc'
            },
            src: '<%= jshint.all.src %>'
        },

        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    '*.js',
                    'modules/**/*.js'
                ]
            }
        },

        copy: {
            js: {
                src: 'autocomplete.js',
                dest: 'dist',
                expand: true
            }
        },

        uglify: {
            options: {
                sourceMap: true
            },
            app: {
                cwd: 'dist',
                src: [
                    '*.js',
                    'config/*.js'
                ],
                dest: 'dist',
                ext: '.min.js',
                expand: true
            }
        }
    });

    grunt.registerTask('test', ['jshint', 'jscs']);
    grunt.registerTask('default', ['test', 'copy', 'uglify']);
};

// Gruntfile.js
module.exports = function (grunt) {

    grunt.initConfig({


        // COOL TASKS ==============================================================
        // watch css and js files and process the above tasks
        watch: {
            css: {
                files: ['public/src/css/**/*.css'],
                tasks: ['less', 'cssmin']
            },

            js: {
                files: ['public/src/js/**/*.js'],
                tasks: ['jshint', 'uglify']
            },

            html: {
                files: ['public/views/**/*.html'],
            }
        },

        // watch our node server for changes
        nodemon: {
            dev: {
                script: 'server.js'
            }
        },

        // run watch and nodemon at the same time
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            tasks: ['nodemon', 'watch']
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('default', ['concurrent']);

};
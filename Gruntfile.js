var fs = require('fs');

var srcDir = 'public';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // watch
        watch: {
            less: {
                files: srcDir + '/**/*.less',
                tasks: ['less']
            },
            jade: {
                files: srcDir + '/**/*.jade',
                tasks: ['jade']
            }
        },
        // less
        less: {
            production: {
                options: {
                    patch: ['public/css'],
                    cleancss: false,
                    sourceMap: true,
                    sourceMapFilename: 'public/css/site.css.map',
                    sourceMapURL: 'http://localhost:3000/css/site.css.map'
                },
                files: {
                    'public/css/site.css': srcDir + '/css/less/site.less'
                }
            }
        },
        // jade
        jade: {
            compile: {
                files: [{
                    cwd: srcDir,
                    src: ['**/*.jade', '!partials/**/*.jade'],
                    dest: 'public',
                    expand: true,
                    ext: '.html'
                }],
                options: {
                    pretty: true,
                    debug: false
                }
            }
        },

        bower: {
            install: {
                options: {
                    targetDir: srcDir + '/lib',
                    layout: 'byType',
                    install: true,
                    verbose: true,
                    cleanTargetDir: false,
                    cleanBowerDir: false,
                    bowerOptions: {
                        forceLatest: true,
                        production: true
                    }
                }
            }
        },
        copy: {
            'bower-gumby': {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['public/lib/gumby/**/gumby.css'],
                        dest: 'public/css',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['public/lib/gumby/fonts/**/*.*'],
                        dest: 'public/fonts/icons',
                        filter: 'isFile'
                    }
                ]
            }
        },
        requirejs: {
            mainJS: {
                options: {
                    baseUrl: "public/js/",
//                    paths: {
//                        "app": "app/app"
//                    },
                    findNestedDependencies: true,
                    wrap: true,
                    name: "../lib/almond/almond",
                    preserveLicenseComments: true,
                    optimize: "uglify",
                    mainConfigFile: "public/js/config.js",
                    removeCombined: true,
                    out: "public/js/app.min.js",
                    include: ["start"],
                    insertRequire: ["start"]
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'public/js/**/*.js', '!public/js/**/*min.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: false,
                    module: true,
                    document: true
                }
            }
        }
    });


    var gruntModules = fs.readdirSync('./node_modules');
    gruntModules.forEach(function(path) {
        if (/grunt/.test(path) && path !== 'grunt') {
            grunt.loadNpmTasks(path);
        }
    });


    grunt.registerTask('default', ['watch']);

    grunt.registerTask('build', ['jade', 'less', 'requirejs:mainJS']);

    // Проверить js
    grunt.registerTask('hint', ['jade', 'less', 'jshint']);

    // установить front -зависимости и скопировать css и шрифты
    grunt.registerTask('lib', ['bower', 'copy:bower-gumby']);

    grunt.registerTask('html', ['jade']);

};
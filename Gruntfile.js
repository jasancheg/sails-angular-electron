/* jshint -W069 */ //disable dot notation on Gruntfile

'use strict';

/**
 * @description Important variables and params used:
 *
 * @var {[NODE_ENV]} used by node process for define targets [devtools|development|staging]
 * @var {[GRUNT_ENV | target:@param]} used by grunt for define targets [server|electron|distribution]
 */

// Some Utility functions
var GruntHelper =  require('./gruntHelper.js');

// #Globbing
module.exports = function (grunt) {
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin',
        ngtemplates: 'grunt-angular-templates'
    });

    var packagejson = require('./package.json');

    // Configurable paths and options for the application
    var appConfig = {
        app: packagejson['clientAppPath'] || 'app/client',
        dist: 'dist/' + packagejson['clientAppPath'],
        jsPathExpresion:'', // value will be modified in run time
        jsPathExclude: '', // value will be modified in run time
        compassWatchTarget: '', // value will be modified in run time
        cssPathExpresion:/(\.\.\/){1,2,3}bower_components\//,
        env: process.env.GRUNT_ENV // value will be modified in run time
    };

    // set run configuration for wiredep
    // targets [dev|dist|server]
    function setConfigWiredep(target) {

        if(target === 'dev') {
            // set expresion path for js files
            appConfig.jsPathExpresion = '';
            // set exclude paths
            appConfig.jsPathExclude = /jquery/;
        } else {
            if(target === 'dist'){
                // jquery will be loaded through require on dist/dev targets, to know more about what
                // is this, please refer to the issue https://github.com/atom/electron/issues/254
                appConfig.jsPathExclude = /jquery/;
            } else {
                appConfig.jsPathExclude = '';
            }
            // set expresion path for js files
            appConfig.jsPathExpresion=/\.\.\/\.\.\//;
        }
    }

    // set run configuration for wiredep
    // targets [server|electron]
    function setCompassWatchTarget(target) {
        var compassTarget = (target === 'dev') ? 'electron' : 'server';
        appConfig.compassWatchTarget = compassTarget;
    }

    // define Grunt environment
    // targets [server|electron|distribution]
    function defineGruntEnvironment(target) {
        // define GRUNT_ENV: Grunt environment
        if(target === 'dev'){
            appConfig.env = 'electron';
        } else {
            appConfig.env = target === 'server' ? 'server' : 'distribution';
        }
        process.env.GRUNT_ENV = appConfig.env;
    }

    // Modify config for grunt targets
    function setGruntTasksTargets(target) {
        setConfigWiredep(target);
        setCompassWatchTarget(target);
        defineGruntEnvironment(target);
    }

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: appConfig,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= config.app %>/scripts/{,*/}*.js'],
                tasks: ['newer:jshint:all', 'appreload:<%= config.env %>'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            // jsTest: {
            //     files: ['test/spec/{,*/}*.js'],
            //     tasks: ['newer:jshint:test', 'karma']
            // },
            compass: {
                files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
                options: { livereload: true },
                tasks: ['compass:<%= config.compassWatchTarget %>', 'autoprefixer:<%= config.compassWatchTarget %>']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= config.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            electroncss: {
                files: ['<%= config.app %>/styles/{,*/}*.css'],
                options: { livereload: true },
                tasks: ['appreload:<%= config.env %>']
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function (connect) {
                        return [
                            connect.static('.tmp'),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect().use(
                                '/styles',
                                connect.static('./styles')
                            ),
                            connect.static(appConfig.app)
                        ];
                    }
                }
            },
            // test: {
            //     options: {
            //         port: 9001,
            //         middleware: function (connect) {
            //             return [
            //                 connect.static('.tmp'),
            //                 connect.static('test'),
            //                 connect().use(
            //                 '/bower_components',
            //                 connect.static('./bower_components')
            //                 ),
            //                 connect.static(appConfig.app)
            //             ];
            //         }
            //     }
            // },
            dist: {
                options: {
                    open: true,
                    base: '<%= config.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= config.app %>/scripts/{,*/}*.js'
                ]
            }
            // ,
            // test: {
            //     options: {
            //         jshintrc: 'test/.jshintrc'
            //     },
            //     src: ['test/spec/{,*/}*.js']
            // }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= config.dist %>/{,*/}*',
                        '!<%= config.dist %>/.git{,*/}*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            server: {
                options: {
                    map: true,
                },
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            },
            electron: {
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ['<%= config.app %>/index.html'],
                // exclude files path depends of the target and is define in the origin of the call
                exclude: ['<%= config.jsPathExclude %>'],
                // currentJs Path depends of the target and is define in the origin of the call
                ignorePath: '<%= config.jsPathExpresion %>'
            },
            // test: {
            //     devDependencies: true,
            //     src: '<%= karma.unit.configFile %>',
            //     ignorePath:  /\.\.\//,
            //     fileTypes:{
            //         js: {
            //             block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
            //             detect: {
            //                 js: /'(.*\.js)'/gi
            //             },
            //             replace: {
            //                 js: '\'{{filePath}}\','
            //             }
            //         }
            //     }
            // },
            sass: {
                src: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
                ignorePath: '<%= config.cssPathExpresion %>'
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: '<%= config.app %>/styles',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= config.app %>/images',
                javascriptsDir: '<%= config.app %>/scripts',
                fontsDir: '<%= config.app %>/styles/fonts',
                importPath: './bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            electron: {
                options: {
                    sourcemap: true,
                    cssDir:'<%= config.app %>/styles'
                }
            },
            dist: {
                options: {
                    generatedImagesDir: '<%= config.dist %>/images/generated'
                }
            },
            server: {
                options: {
                    sourcemap: true
                }
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= config.dist %>/scripts/{,*/}*.{js,css}',
                    '<%= config.dist %>/styles/{,*/}*.css',
                    '<%= config.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= config.dist %>/styles/fonts/*'
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= config.app %>/index.html',
            options: {
                dest: '<%= config.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= config.dist %>/{,*/}*.html'],
            css: ['<%= config.dist %>/styles/{,*/}*.css'],
            js: ['<%= config.dist %>/scripts/{,*/}*.js'],
            options: {
                assetsDirs: [
                    '<%= config.dist %>',
                    '<%= config.dist %>/images',
                    '<%= config.dist %>/styles'
                ],
                patterns: {
                    js: [[/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
                }
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= config.dist %>/images'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= config.dist %>/images'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.dist %>',
                    src: ['*.html'],
                    dest: '<%= config.dist %>'
                }]
            }
        },

        ngtemplates: {
            dist: {
                options: {
                    module: 'angularsailsApp',
                    htmlmin: '<%= htmlmin.dist.options %>',
                    usemin: 'scripts/scripts.js'
                },
                cwd: '<%= config.app %>',
                src: 'views/{,*/}*.html',
                dest: '.tmp/templateCache.js'
            }
        },

        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '*.js',
                    dest: '.tmp/concat/scripts'
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        '*.html',
                        'images/{,*/}*.{webp}',
                        'styles/fonts/{,*/}*.*'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= config.dist %>/images',
                    src: ['generated/*']
                }, {
                    expand: true,
                    cwd: '.',
                    src: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
                    dest: '<%= config.dist %>'
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= config.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            electron: [
                'compass:electron'
            ],
            server: [
                'compass:server'
            ],
            // test: [
            //     'compass'
            // ],
            dist: [
                'compass:dist',
                'imagemin',
                'svgmin'
            ]
        },

        // run command shells in the background process or in parallel
        bgShell: {
            _defaults: {
                bg: true
            },
            startelectron: {
                cmd: 'electron ' + packagejson['main']
            }
        }
        //,

        // Test settings
        // karma: {
        //     unit: {
        //         configFile: 'test/karma.conf.js',
        //         singleRun: true
        //     }
        // }
    });

    grunt.registerTask('appreload', 'reload the electron browser window', function (target) {

        if(target === 'electron') {
            // Tell grunt this task is asynchronous
            var done = this.async();
            // get reload the electron app
            GruntHelper.getElectronAppReload(done, process.env.gpid);
        } else{
            grunt.log.warn('No need to reload electron because the application is running in `Server Mode`');
        }

    });

    grunt.registerTask('serve', 'Compile then start a connect in `Server Mode` for the Electron App', function (target) {

        grunt.log.warn("The task is appropiate just if the client side interface don't have dependencie of nodejs, otherwise the application will not work properly");
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        // set config targets
        setGruntTasksTargets('server');

        grunt.task.run([
            'clean:server',
            'wiredep',
            'concurrent:server',
            'autoprefixer:server',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start in a `Server Mode` of the Electron App.');
        grunt.task.run(['serve:' + target]);
    });

    grunt.registerTask('start', 'Compile then start the Electron App', function (target) {

        // Set NODE_ENV
        if(target === 'devtools' || target === 'staging') {
            process.env.NODE_ENV = target;
        } else {
            process.env.NODE_ENV = 'development';
        }

        // this is a limited way to have access to the current level of the process from the electron app
        // a flag is set `gipd` on the current process.env to be used from the electron browser process
        process.env.gpid = process.pid;

        // set  grunt config targets
        setGruntTasksTargets('dev');

        grunt.task.run([
            'clean:server',
            'wiredep',
            'concurrent:electron',
            'bgShell:startelectron',
            'watch'
        ]);
    });

    grunt.registerTask('stop', 'stop the current process, it have sense when is run from nodejs call', function (gpid) {

        if (gpid && process.env.gpid === gpid) {
            grunt.log.ok('Grunt processes have been stopped: ', gpid );
            // additionaly kill process by id when it is run by npm command
            process.kill(gpid);
            grunt.task.run(['bgShell:startelectron:kill']);
            return process.exit(1);
        }

        grunt.log.warn('There is no running processes or is a invalid process id');
    });

    // grunt.registerTask('test', [
    //     'clean:server',
    //     'wiredep',
    //     'concurrent:test',
    //     'autoprefixer',
    //     'connect:test',
    //     'karma'
    // ]);

    grunt.registerTask('build', 'Build the distribution folder', function () {

        // set config targets
        setGruntTasksTargets('dist');

        grunt.task.run([
            'clean:dist',
            'wiredep',
            'useminPrepare',
            'concurrent:dist',
            'autoprefixer',
            'ngtemplates',
            'concat',
            'ngAnnotate',
            'copy:dist',
            'cssmin',
            'uglify',
            'filerev',
            'usemin',
            'htmlmin'
        ]);
    });

    grunt.registerTask('default', [
        'newer:jshint',
        'start'
    ]);

    // kill the electron process
    process.on('SIGINT', function () {
        grunt.task.run(['bgShell:startelectron:kill']);
        process.exit(1);
    });
};

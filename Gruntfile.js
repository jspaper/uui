module.exports = function (grunt) {

	var files = [
		'src/javascripts/**/*.js'
	];

    var dependencies = [
        'vendor/jquery/dist/jquery.min.js',
        'vendor/js-htmlencode/build/htmlencode.min.js'
    ];

	var module_name = 'uui';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		compass: {
			options: {
				config: 'compass.rb',
				force: true
			},
			app: {
				options: {
					environment: 'production'
				}
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			all: {
				options: {
					mangle: false,
					beautify: true
				},
				files: {
					'build/<%= pkg.name %>.js': files,
					'build/<%= pkg.name %>.pkg.js': files.concat(dependencies)
				}
			}
		},
		jshint: {
			all: {
				options: {
					jshintrc: '.jshintrc',
					force: true
				},
				files: {
					src: files
				}
			}
		},
		copy: {
			images: {
				expand: true,
				cwd: 'src/assets/images',
				src: ['**'],
				dest: 'build/images'
			}
		},
		clean: {
			app: ['build']
		},
		watch: {
			options: {
				livereload: 4011
			},
			dev: {
				files: ['src/javascripts/**/*.js'],
				tasks: ['uglify']
			},
			templates: {
				files: ['src/views/**/*.*'],
				tasks: ['uglify']
			},
			css: {
				files: ['src/assets/scss/**/*.scss'],
				tasks: ['compass']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', ['clean', 'copy', 'uglify', 'jshint', 'watch']);

	grunt.event.on('watch', function (action, filepath, target) {
		grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});

};
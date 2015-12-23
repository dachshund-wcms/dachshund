module.exports = function(grunt) {

	grunt.option('force', true);

	const gruntConfig = {
		jsdoc: {
			main: {
				src: ['apps/node_modules/**/*.js'], options: {
					destination: '../dachshund-wcms.github.io.git',
					template: './node_modules/ink-docstrap/template',
					readme: 'README.md',
					config: './config/jsdoc.json',
					tutorials:  './tutorials'
				}
			}
		}, copy: {
			jsdoc: {
				files: [{
					expand: true, src: ['tutorials/*.svg'], dest: '../dachshund-wcms.github.io.git', filter: 'isFile'
				}, {
					src: ['README.md'], dest: '../dachshund-wcms.github.io.git/README.md', filter: 'isFile'
				}

				]
			}
		}, clean: {
			jsdoc: {
				src: ['../dachshund-wcms.github.io.git/*', '!../dachshund-wcms.github.io.git/.git', '!../dachshund-wcms.github.io.git/CNAME']
			}
		}

	};

	grunt.initConfig(gruntConfig);
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('createDocumentation', ['clean:jsdoc', 'copy:jsdoc', 'jsdoc:main']);

};
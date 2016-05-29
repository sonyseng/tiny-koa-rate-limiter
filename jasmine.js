'use strict';

const Jasmine = require('jasmine');
const SpecReporter = require('jasmine-spec-reporter');

let jasmine = new Jasmine();

jasmine.loadConfig({
    spec_dir: './',
    spec_files: ['./*.spec.js']
});

jasmine.addReporter(new SpecReporter());
jasmine.execute();
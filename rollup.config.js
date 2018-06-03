const resolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');

const globals = {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/platform-browser': 'ng.platformBrowser',
    '@angular/router': 'ng.router',
    '@angular/forms': 'ng.forms',
    '@angular/common/http': 'ng.common.http',

    'rxjs/Subject': 'Rx',
    'rxjs/Subscription': 'Rx',
    'rxjs/operators': 'Rx.Observable.prototype'
};

module.exports = {
    rollup: require('rollup'),
    context: 'this',
    output: {
        name: 'ngx-umeditor',
        sourcemap: true,
        format: 'umd',
        globals: globals
    },
    plugins: [
        resolve({
            jsnext: true,
            main: true
        })
    ],
    external: Object.keys(globals)
};

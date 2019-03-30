import babel from 'rollup-plugin-babel';
  
  const rollupConfig = [{
      input: 'src/lib.es6module.js',
      output: {
          file: 'lib/es6_module/zootypeandsearch.js',
          format: 'es'
      },
      plugins: [
          babel({
              exclude: 'node_modules/**'
          })
      ]
  }];

  export default rollupConfig;

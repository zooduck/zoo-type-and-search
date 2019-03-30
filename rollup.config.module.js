import babel from 'rollup-plugin-babel';
  
  const rollupConfig = [{
      input: 'src/lib.module.js',
      output: {
          file: 'lib/module/zootypeandsearch.js',
          format: 'cjs'
      },
      plugins: [
          babel({
              exclude: 'node_modules/**'
          })
      ]
  }];

  export default rollupConfig;

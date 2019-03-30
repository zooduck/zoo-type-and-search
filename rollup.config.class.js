import babel from 'rollup-plugin-babel';
  
  const rollupConfig = [{
      input: 'src/lib.class.js',
      output: {
          file: 'lib/class/zootypeandsearch.js',
          format: 'cjs'
      },
      plugins: [
          babel({
              exclude: 'node_modules/**'
          })
      ]
  }];

  export default rollupConfig;

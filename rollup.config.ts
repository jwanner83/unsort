import { RollupOptions } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import del from 'rollup-plugin-delete'

const config: RollupOptions[] = [
  {
    input: 'src/mod.ts',
    output: {
      format: 'es',
      file: 'dist/index.js'
    },
    plugins: [
      typescript({
        sourceMap: false,
        tsconfig: './tsconfig.json'
      })
    ]
  },
  {
    input: 'dist/dts/mod.d.ts',
    output: {
      file: 'dist/mod.d.ts'
    },
    plugins: [
      dts(),
      del({ targets: ['dist/dts'], hook: 'buildEnd' })
    ]
  }
]

export default config

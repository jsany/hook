import {IBundleOptions} from 'father-build/src/types'

const config: IBundleOptions = {
  esm: 'babel',
  cjs: 'babel',
  runtimeHelpers: true,
}
export default config;

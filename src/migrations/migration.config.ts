import { DataSource } from 'typeorm'
import { dataSourceOptionsExt } from '../../src/datasource'

const datasource = new DataSource(dataSourceOptionsExt) // config is one that is defined in datasource.config.ts file
// datasource.initialize()
export default datasource

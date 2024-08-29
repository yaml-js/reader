import * as path from "path"
import defineConfig from "../shared/configs/jest"

const nodeModulesRoot = path.resolve(__dirname, "../node_modules")
export default defineConfig(nodeModulesRoot, "@yaml-js/core.extensions", [])

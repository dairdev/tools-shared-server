import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
	input: "tools/src/app.js",
	output: {
		file: "tools/app.min.js",
		format: "cjs"
	},
	plugins: [
		replace({
			"process.env.NODE_ENV": JSON.stringify("production"),
			__buildEnv__: "production",
			__buildDate__: () => new Date(),
			__buildVersion: 15,
			preventAssignment: true
		}),
		nodeResolve(),
		babel({
			babelrc: false,
			exclude: "node_modules/**",
			sourceMaps: true,
			presets: [
				[
					"@babel/preset-env",
					{
						modules: false
					}
				]
			],
			plugins: [
				["transform-react-jsx", { pragma: "h" }],
				["@babel/plugin-proposal-class-properties", { loose: true }],
				["@babel/plugin-proposal-private-property-in-object", { "loose": true }],
				["@babel/plugin-proposal-private-methods", { "loose": true }]
			]
		}),
		commonjs()
	]
};

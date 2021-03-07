const path = require("path");
const framework = require("./diginext.json");
const withTM = require("next-transpile-modules")([
  // "drei",
  "three",
  // "postProcessing"
]);

let appBasePath = "";
let isEnabledCDN = false;

if (process.env.NEXT_PUBLIC_ENV == "production") {
  isEnabledCDN = framework.cdn.prod;
} else if (process.env.NEXT_PUBLIC_ENV == "staging") {
  isEnabledCDN = framework.cdn.staging;
  if (framework.domain.staging.length == 0) {
    appBasePath = process.env.NEXT_PUBLIC_BASE_PATH
      ? `/${process.env.NEXT_PUBLIC_BASE_PATH}`
      : `/${framework.projectSlug}`;
  }
} else if (process.env.NEXT_PUBLIC_ENV == "development") {
  isEnabledCDN = framework.cdn.dev;
  if (process.env.NEXT_PUBLIC_BASE_PATH)
    appBasePath = `/${process.env.NEXT_PUBLIC_BASE_PATH}`;
} else {
  isEnabledCDN = false;
}

module.exports = withTM({
  assetPrefix: isEnabledCDN ? process.env.NEXT_PUBLIC_CDN_BASE_PATH : "",
  basePath: appBasePath,
  webpack(config, { dev, isServer }) {
    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();

      if (
        entries["main.js"] &&
        !entries["main.js"].includes("./polyfills.js")
      ) {
        entries["main.js"].unshift("./polyfills.js");
      }

      return entries;
    };

    config.resolve.alias.assets = path.join(__dirname, "assets");

    // for reading & parsing SVG files:
    config.module.rules.push({
      test: /\.svg$/i,
      exclude: [path.resolve("node_modules")],
      use: [
        {
          loader: "raw-loader",
          options: {
            esModule: false,
          },
        },
      ],
    });

    // for reading shader files:
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: [
        'raw-loader',
        'glslify-loader'
      ]
    })

    return config;
  },
});

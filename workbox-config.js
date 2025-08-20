module.exports = {
  globDirectory: "www/",
  globPatterns: ["**/*.{woff,woff2,js,css,png,jpg,svg,html}"],
  globIgnores: [],
  swSrc: "src/service-worker.js", // your custom SW source
  swDest: "www/service-worker.js", // output in build dir
};

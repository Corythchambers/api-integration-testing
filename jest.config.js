export default {
  testEnvironment: "node",
  transform: {},
  extensionsToTreatAsEsm: [".js"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: ["**/__tests__/**/*.test.js"],
  verbose: true,

  // Reporting configuration
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        pageTitle: "API Test Report",
        outputPath: "./reports/test-report.html",
        includeFailureMsg: true,
        includeSuiteFailure: true,
      },
    ],
    [
      "jest-junit",
      {
        outputDirectory: "./reports",
        outputName: "junit.xml",
        classNameTemplate: "{classname}",
        titleTemplate: "{title}",
        ancestorSeparator: " › ",
      },
    ],
  ],

  // Generate JSON report
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "clover", "json-summary"],
  coverageDirectory: "./reports/coverage",

  // Test summary
  testResultsProcessor: "./node_modules/jest-html-reporter",
};

const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",

  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],  // Ensure Jest is aware of all file types
};

module.exports = createJestConfig(customJestConfig);

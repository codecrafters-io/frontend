const VALID_DEPLOY_TARGETS = ['development', 'development-postbuild'];

module.exports = function (deployTarget) {
  if (VALID_DEPLOY_TARGETS.indexOf(deployTarget) === -1) {
    throw new Error(`Invalid deployTarget for deploy-development: ${deployTarget}`);
  }

  const ENV = {
    build: { environment: 'development' },

    redis: {
      allowOverwrite: true,
      distDir: (context) => context.commandOptions.buildDir,
      keyPrefix: `codecrafters-frontend:development`,
      revisionKey: `__development__`,
      url: 'redis://localhost:6311/',
    },
  };

  if (deployTarget === 'development') {
    ENV.pipeline = { disabled: { allExcept: ['build'] } };
  }

  if (deployTarget === 'development-postbuild') {
    ENV.pipeline = { disabled: { allExcept: ['redis'] } };
  }

  return ENV;
};

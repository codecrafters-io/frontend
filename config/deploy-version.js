module.exports = function (deployTarget) {
  const appVersion = process.env.EMBER_DEPLOY_APP_VERSION;
  const commitSha = process.env.EMBER_DEPLOY_COMMIT_SHA;

  if (deployTarget !== 'production') {
    throw new Error(`Invalid deployTarget: ${deployTarget}`);
  }

  const ENV = {
    build: { environment: 'production' },

    redis: {
      allowOverwrite: true,
      keyPrefix: `codecrafters-frontend:version`,
      revisionKey: `${appVersion}+${commitSha.substring(0, 8)}`,
      url: process.env.REDIS_URL,
    },

    s3: {
      prefix: 'codecrafters-frontend',
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
      bucket: process.env.S3_BUCKET,
      region: process.env.S3_BUCKET_REGION,
    },
  };

  return ENV;
};

module.exports = function (deployTarget) {
  const branchName = process.env.EMBER_DEPLOY_APP_BRANCH;
  const commitSha = process.env.EMBER_DEPLOY_COMMIT_SHA;

  if (deployTarget !== 'production') {
    throw new Error(`Invalid deployTarget: ${deployTarget}`);
  }

  const ENV = {
    build: { environment: 'production' },

    redis: {
      allowOverwrite: true,
      keyPrefix: `codecrafters-frontend:branch:${branchName}`,
      maxRecentUploads: 100, // Let's keep this high enough to retain recent builds on a branch
      revisionKey: commitSha.substring(0, 8),
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

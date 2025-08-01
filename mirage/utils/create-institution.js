import { capitalize } from '@ember/string';

export default function createInstitution(server, slug) {
  // TODO: Add stanford too to get one more screenshot
  const knownSlugsToParams = {
    nus: {
      slug: 'nus',
      shortName: 'NUS',
      logoUrl: 'https://codecrafters.io/images/app_institution_logos/nus.svg',
      officialEmailAddressSuffixes: ['@u.nus.edu', '@nus.edu.sg'],
    },
  };

  if (knownSlugsToParams[slug]) {
    return server.create('institution', knownSlugsToParams[slug]);
  } else {
    return server.create('institution', {
      slug,
      shortName: capitalize(slug),
      logoUrl: `https://codecrafters.io/images/app_institution_logos/nus.svg`, // Use a dummy logo since we don't have one
      officialEmailAddressSuffixes: [`@${slug}.edu`],
    });
  }
}

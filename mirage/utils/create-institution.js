export default function createInstitution(server, slug) {
  if (slug !== 'nus') {
    throw new Error('Not implemented');
  }

  return server.create('institution', {
    slug: 'nus',
    shortName: 'NUS',
    logoUrl: 'https://codecrafters.io/images/app_institution_logos/nus.svg',
    officialEmailAddressSuffixes: ['@u.nus.edu', '@nus.edu.sg'],
  });
}

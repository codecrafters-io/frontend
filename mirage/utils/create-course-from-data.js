export default function createCourseFromData(server, courseData) {
  const course = server.create('course', {
    completionPercentage: courseData.completion_percentage,
    descriptionMarkdown: courseData.description_md,
    difficulty: courseData.marketing.difficulty,
    name: courseData.name,
    releaseStatus: courseData.release_status,
    shortName: courseData.name.replace(/Build your own /i, ''),
    shortDescriptionMarkdown: courseData.short_description_md,
    slug: courseData.slug,
    supportedLanguages: [...courseData.supported_languages, ...courseData.early_access_languages].map((languageSlug) =>
      server.schema.languages.findBy({ slug: languageSlug })
    ),
    testimonials: courseData.marketing.testimonials,
  });

  let courseStagePosition = 1;

  for (const courseStageData of courseData.stages) {
    server.create('course-stage', {
      course: course,
      name: courseStageData.name,
      marketingMarkdown: courseStageData.marketing_md,
      position: courseStagePosition,
      slug: courseStageData.slug,
      descriptionMarkdownTemplate: courseStageData.description_md,
      difficulty: courseStageData.difficulty,
      isFree: courseStagePosition <= 2,
    });

    courseStagePosition++;
  }

  return course;
}

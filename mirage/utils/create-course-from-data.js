export default function createCourseFromData(server, courseData) {
  const course = server.create('course', {
    completionPercentage: courseData.completion_percentage,
    difficulty: courseData.marketing.difficulty,
    name: courseData.name,
    slug: courseData.slug,
    descriptionMarkdown: courseData.description_md,
    shortDescriptionMarkdown: courseData.short_description_md,
    supportedLanguages: courseData.supported_languages.map((languageSlug) => server.schema.languages.findBy({ slug: languageSlug })),
  });

  let courseStagePosition = 1;

  for (const courseStageData of courseData.stages) {
    server.create('course-stage', {
      course: course,
      name: courseStageData.name,
      position: courseStagePosition++,
      descriptionMarkdownTemplate: courseStageData.description_md,
    });
  }
}

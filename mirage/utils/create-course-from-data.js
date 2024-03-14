export default function createCourseFromData(server, courseData) {
  const course = server.create('course', courseAttributesFromData(courseData));

  createStages(server, course, courseData);
  createLanguageConfigurations(server, course, courseData);

  for (const courseExtensionData of courseData.extensions || []) {
    server.create('course-extension', {
      course: course,
      name: courseExtensionData.name,
      slug: courseExtensionData.slug,
      descriptionMarkdown: courseExtensionData.description_md,
    });
  }

  return course;
}

function createStages(server, course, courseData) {
  let courseStagePosition = 1;
  let max_position_by_extension_slug = {};

  const stages = [];

  for (const courseStageData of courseData.stages) {
    if (courseStageData.primary_extension_slug) {
      max_position_by_extension_slug[courseStageData.primary_extension_slug] ||= 0;
      max_position_by_extension_slug[courseStageData.primary_extension_slug] += 1;
    }

    const positionWithinExtension = max_position_by_extension_slug[courseStageData.primary_extension_slug] || null;

    const stage = server.create('course-stage', {
      courseId: course.id, // Passing courseId and updating course.stages later makes this 20ms vs 200ms
      ...courseStageAttributesFromData(courseStageData, courseStagePosition, positionWithinExtension),
    });

    stages.push(stage);

    courseStagePosition++;
  }

  course.update({ stages: stages });
}

function createLanguageConfigurations(server, course, courseData) {
  const languageConfigurations = [];

  for (const languageConfigurationData of courseData.languages) {
    const language = server.schema.languages.findBy({ slug: languageConfigurationData.slug });

    if (!language) {
      throw new Error(`Language with slug ${languageConfigurationData.slug} not found`);
    }

    const languageConfiguration = server.create('course-language-configuration', {
      courseId: course.id,
      language: language,
      releaseStatus: languageConfigurationData.release_status || 'live',
      alphaTesterUsernames: languageConfigurationData.alphaTesterUsernames || [],
    });

    languageConfigurations.push(languageConfiguration);
  }

  course.update({ languageConfigurations: languageConfigurations });
}

function courseAttributesFromData(courseData) {
  return {
    completionPercentage: courseData.completion_percentage,
    descriptionMarkdown: courseData.description_md,
    difficulty: courseData.marketing.difficulty,
    name: courseData.name,
    releaseStatus: courseData.release_status,
    sampleExtensionIdeaTitle: courseData.marketing.sample_extension_idea_title,
    sampleExtensionIdeaDescription: courseData.marketing.sample_extension_idea_description,
    shortName: courseData.name.replace(/Build your own /i, ''),
    shortDescription: courseData.short_description_md,
    slug: courseData.slug,
    testimonials: courseData.marketing.testimonials,
  };
}

function courseStageAttributesFromData(courseStageData, positionWithinCourse, positionWithinExtension) {
  return {
    name: courseStageData.name,
    marketingMarkdown: courseStageData.marketing_md,
    position: positionWithinCourse, // TODO: Remove this
    positionWithinCourse: positionWithinCourse,
    positionWithinExtension: positionWithinExtension,
    slug: courseStageData.slug,
    descriptionMarkdownTemplate: courseStageData.description_md,
    difficulty: courseStageData.difficulty,
    testerSourceCodeUrl: courseStageData.tester_source_code_url,
    isPaid: positionWithinCourse > 3,
    primaryExtensionSlug: courseStageData.primary_extension_slug,
    secondaryExtensionSlugs: courseStageData.secondary_extension_slugs || [],
  };
}

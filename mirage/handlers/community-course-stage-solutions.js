export default function (server) {
  // TODO: Add pagination
  server.get('/community-course-stage-solutions', function (schema, request) {
    let result = schema.communityCourseStageSolutions.all();

    if (request.queryParams.language_id) {
      result = result.filter((solution) => solution.language.id.toString() === request.queryParams.language_id);
    }

    if (request.queryParams.course_stage_id) {
      result = result.filter((solution) => solution.courseStage.id.toString() === request.queryParams.course_stage_id);
    }

    return result;
  });

  server.get('/community-course-stage-solutions/:id');
  server.patch('/community-course-stage-solutions/:id');

  server.get('/community-course-stage-solutions/:id/file-comparisons', function (schema, request) {
    const solution = schema.communityCourseStageSolutions.find(request.params.id);

    if (!solution) {
      return new Response(404, {}, { errors: [{ detail: 'Not found' }] });
    }

    return [
      {
        change_type: 'added',
        old_path: null,
        new_path: 'new_file.txt',
        old_content: null,
        new_content: 'Added file content',
        diff: null,
      },
      {
        change_type: 'deleted',
        old_path: 'old_file.txt',
        new_path: null,
        old_content: 'Removed file content',
        new_content: null,
        diff: null,
      },
      {
        change_type: 'modified',
        old_path: 'modified_file.txt',
        new_path: 'modified_file.txt',
        old_content: 'Old file content',
        new_content: 'New file content',
        diff: null, // TODO: Add something here?
      },
      {
        change_type: 'modified',
        old_path: 'old_renamed_file.txt',
        new_path: 'new_renamed_file.txt',
        old_content: 'Renamed file content',
        new_content: 'Renamed file content',
        diff: null,
      },
      {
        change_type: 'modified',
        old_path: 'old_renamed_and_modified_file.txt',
        new_path: 'new_renamed_and_modified_file.txt',
        old_content: 'Renamed and modified file content',
        new_content: 'Renamed and modified file contents',
        diff: null, // TODO: Add something here?
      },
      {
        change_type: 'unchanged',
        old_path: 'unchanged_file.txt',
        new_path: 'unchanged_file.txt',
        old_content: 'Unchanged file content',
        new_content: null,
        diff: null,
      },
      {
        change_type: 'unchanged',
        old_path: 'unchanged_file_2.txt',
        new_path: 'unchanged_file_2.txt',
        old_content: 'Unchanged file content 2',
        new_content: null,
        diff: null,
      },
    ];
  });
}

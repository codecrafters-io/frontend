'use strict';

const nodeFetch = require('node-fetch');

module.exports = async function fetchCourses(backendUrl) {
  const response = await nodeFetch(`${backendUrl}/api/v1/courses?include=language-configurations.language`);

  if (response.status !== 200) {
    throw new Error(`Failed to load Courses and Languages from the API, status: ${response.status}`);
  }

  return response.json();
};

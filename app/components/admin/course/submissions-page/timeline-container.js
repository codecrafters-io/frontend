import Component from '@glimmer/component';

function groupBy(collection, keyFn) {
  const result = {};

  collection.forEach((element) => {
    const groupKey = keyFn(element);

    if (hasOwnProperty.call(result, groupKey)) {
      result[groupKey].push(element);
    } else {
      result[groupKey] = [element];
    }
  });

  return result;
}

export default class AdminCourseSubmissionsPageTimelineContainerComponent extends Component {
  get groupedSubmissions() {
    return groupBy(this.args.submissions.toArray().sort((a, b) => a.createdAt - b.createdAt).reverse(), (submission) => {
      return submission.createdAt.toISOString().slice(0, 10);
    });
  }
}

import Component from '@glimmer/component';
import type CourseModel from 'codecrafters-frontend/models/course';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

export type Faq = {
  query: string;
  answerMarkdown: string;
};

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
    completedStages?: CourseStageModel[];
  };
}

export default class CourseOverviewPageIntroductionAndStages extends Component<Signature> {
  faqs: Faq[] = [
    {
      query: 'How long does this course take?',
      answerMarkdown:
        'This course typically takes 2-4 weeks to complete, depending on your experience level and time commitment. Each stage is designed to be completed in 1-2 hours.',
    },
    {
      query: 'What will I learn in this course?',
      answerMarkdown:
        "You'll learn the fundamental concepts and implementation details behind building your own version of this technology. This includes understanding the core algorithms, data structures, and design patterns used in real-world systems.",
    },
    {
      query: 'Do I need prior experience?',
      answerMarkdown:
        'Some programming experience is recommended, but the course is designed to be accessible to developers with basic knowledge of your chosen programming language. Each stage includes detailed explanations and guidance.',
    },
    {
      query: 'What programming languages are supported?',
      answerMarkdown:
        'This course supports multiple programming languages including Python, JavaScript, Go, Rust, Java, C++, and more. You can switch languages at any time during the course.',
    },
  ];
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseOverviewPage::IntroductionAndStages': typeof CourseOverviewPageIntroductionAndStages;
  }
}

import Component from '@glimmer/component';
import type { CommunitySolutionsAnalysisStatistic } from 'codecrafters-frontend/models/community-solutions-analysis';

interface StatisticCardArgs {
  statistic: CommunitySolutionsAnalysisStatistic;
}

export default class StatisticCardComponent extends Component<StatisticCardArgs> {}
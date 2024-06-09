import { EntityState } from '@datorama/akita';
import { Article } from './article.model';

export interface ArticleState extends EntityState<Article> {
  hasLoaded: boolean;
}
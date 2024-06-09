import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig } from '@datorama/akita';
import { Article } from '../interfaces/article.model';
import { ArticleState } from '../interfaces/ArticleState';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'articles' })
export class ArticleStore extends EntityStore<ArticleState, Article> {
  constructor() {
    super({ hasLoaded: false });
  }
}
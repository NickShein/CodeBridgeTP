import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ArticleStore } from './article.store';
import { ArticleState } from '../interfaces/ArticleState';
import { Article } from '../interfaces/article.model';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ArticleQuery extends QueryEntity<ArticleState, Article> {
  articles$: Observable<Article[]> = this.selectAll();


  constructor(protected override store: ArticleStore) {
    super(store);
  }

  getArticleById(articleId: string): Observable<Article| undefined> {
    return this.selectEntity(articleId);
  }
}
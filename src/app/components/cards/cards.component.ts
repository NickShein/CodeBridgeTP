import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { Article } from 'src/app/interfaces/article.model';
import { Observable } from 'rxjs';
import { ArticleQuery } from 'src/app/state/article.query';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent implements OnInit {
  @Input() inputValue!:string;

  articles$!: Observable<Article[]>;

  constructor(private newsService: NewsService, private articleQuery: ArticleQuery) {}

  ngOnInit(): void {
    this.newsService.fetchArticles();
    this.articles$ = this.articleQuery.articles$;
  }
}
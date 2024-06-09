import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ArticleByID } from 'src/app/interfaces/article-by-id.model';
import { Article } from 'src/app/interfaces/article.model';
import { NewsService } from 'src/app/services/news.service';
import { ArticleQuery } from 'src/app/state/article.query';

@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.scss']
})
export class ArticlePageComponent implements OnInit {


  article$!: Observable<Article | undefined>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleQuery: ArticleQuery,
    private newsService: NewsService,
  ) { }

  redirectToHomePage() {
    this.router.navigate(['/homepage']);
  }

  ngOnInit(): void {
    const ARTICLE_ID = this.route.snapshot.paramMap.get('id');

    this.article$ = this.articleQuery.getArticleById(ARTICLE_ID!);
    
    this.newsService.fetchCurrentArticle(ARTICLE_ID!);
    
  }
}


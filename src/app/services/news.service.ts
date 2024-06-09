import { ElementRef, Injectable, QueryList } from '@angular/core';
import { ArticleStore } from '../state/article.store';
import { Article } from '../interfaces/article.model';
import { ArticleByID } from '../interfaces/article-by-id.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ArticleQuery } from '../state/article.query';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiUrl = 'https://api.spaceflightnewsapi.net/v3/articles';
  private originalArticles: Article[] = []; // Додаємо властивість для зберігання оригінальних статей
  private currentArticle: Article | null = null;
  private ARTICLE_CARD_VIEWS!: QueryList<ElementRef>;

  constructor(
    private articleStore: ArticleStore,
    private articleQuery: ArticleQuery,
    private http: HttpClient
  ) {}

  fetchArticles() {
    if (!this.articleQuery.getValue().hasLoaded) {
      this.http
        .get<Article[]>(this.apiUrl, {
          params: { _limit: '100' },
        })
        .pipe(
          map((articles) => {
            articles.shift(); // Видаляємо перший елемент ("пробник" статті API)

            return articles.map((article) => ({
              id: article.id,
              title: article.title,
              summary: article.summary,
              imageUrl: article.imageUrl,
              publishedAt: article.publishedAt,
              url: article.url,
            }));
          })
        )
        .subscribe((articles) => {
          this.originalArticles = articles; // Зберігаємо оригінальні статті
          this.articleStore.set(articles);
          this.articleStore.update({ hasLoaded: true });
        });
    }
  }

  fetchCurrentArticle(id: string) {
    if (!!this.articleQuery.getEntity(id)) {
      return;
    }

    this.http
      .get<ArticleByID>(`https://api.spaceflightnewsapi.net/v4/articles/${id}`)
      .pipe(
        map(
          (article) =>
            ({
              id: article.id,
              title: article.title,
              summary: article.summary,
              imageUrl: article.image_url,
              publishedAt: article.published_at,
              url: article.url,
            } as Article)
        )
      )
      .subscribe((article) => {
        this.currentArticle = article; // Зберігаємо поточну статтю
        this.articleStore.upsert(id, article);
      });
  }

  setArticleCardViews(articleCardComponent: QueryList<ElementRef>): void {
    this.ARTICLE_CARD_VIEWS = articleCardComponent;
    this.ARTICLE_CARD_VIEWS.forEach((elementRef) => {
      console.log(elementRef.nativeElement.innerHTML);
    });
  }

  filterArticlesByKeywords(keywordString: string): void {
    // Очищуємо ключові слова від зайвих пробілів і видаляємо порожні елементи
    const KEYWORDS = this.cleanKeywords(keywordString);

    // Використовуємо оригінальний масив статей для фільтрації
    let articles = this.originalArticles;

    // Якщо ключові слова відсутні або порожні, повертаємо всі статті
    if (KEYWORDS.length === 0) {
      this.articleStore.set(articles);
      return;
    }

    // Фільтруємо статті за заголовком
    const TITLE_FILTERED_ARTICLES = this.filterByTitle(articles, KEYWORDS);

    // Фільтруємо статті за описом, які не були включені до результатів за заголовком
    const SUMMARY_FILTERED_ARTICLES = this.filterBySummary(
      articles,
      TITLE_FILTERED_ARTICLES,
      KEYWORDS
    );

    // Об'єднуємо результати, спершу заголовки, потім описи
    const FILTERED_ARTICLES = this.combineResults(
      TITLE_FILTERED_ARTICLES,
      SUMMARY_FILTERED_ARTICLES
    );

    // Оновлюємо магазин відфільтрованими статтями
    this.articleStore.set(FILTERED_ARTICLES);
  }

  private cleanKeywords(keywordString: string): string[] {
    return keywordString
      .trim()
      .split(' ')
      .filter((keyword) => keyword.length > 0);
  }

  private filterByTitle(articles: Article[], keywords: string[]): Article[] {
    return articles.filter((article) =>
      keywords.some((keyword) =>
        article.title.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }

  private filterBySummary(
    articles: Article[],
    titleFilteredArticles: Article[],
    keywords: string[]
  ): Article[] {
    return articles.filter(
      (article) =>
        !titleFilteredArticles.includes(article) &&
        keywords.some((keyword) =>
          article.summary.toLowerCase().includes(keyword.toLowerCase())
        )
    );
  }

  private combineResults(
    titleFilteredArticles: Article[],
    summaryFilteredArticles: Article[]
  ): Article[] {
    return [...titleFilteredArticles, ...summaryFilteredArticles];
  }
}

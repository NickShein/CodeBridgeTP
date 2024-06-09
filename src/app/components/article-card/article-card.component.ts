import {  Component, Input, ViewChild} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {
  @Input() imageUrl: string = '';
  @Input() publishedAt: string = '';
  @Input() title: string = '';
  @Input() summary: string = '';
  @Input() id: string = '';
  @Input() url: string = '';
  @Input() inputValue: string = '';


  constructor(private router: Router) {}

  redirectToArticlePage(articleId: string): void {
    this.router.navigate(['/article-page', articleId]);
  }

  // get truncatedArticle(): string { // Метод для обрізання статі до 200 символів для коректного відображення
  //   return this.summary.length > 143 ? this.summary.substring(0, 200) + '...' : this.summary;
  // }
}
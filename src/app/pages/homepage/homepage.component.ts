import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, debounceTime } from 'rxjs';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { NewsService } from 'src/app/services/news.service';
import { ArticleQuery } from 'src/app/state/article.query';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {
  searchSubject$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  searchSubscription: Subscription | null = null;
  inputValue: string = '';
  loading$!: Observable<boolean>;


  constructor(private newsService: NewsService, private articleQuery: ArticleQuery ){

  }

  

  ngOnInit(): void {
    this.loading$ = this.articleQuery.isLoading$;
    this.searchSubscription = this.searchSubject$.pipe(distinctUntilChanged(), debounceTime(300)).subscribe((value: string) =>{
      this.newsService.filterArticlesByKeywords(value);
      this.inputValue = value;
    })
  }

  ngAfterViewInit():void {
    
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }
}

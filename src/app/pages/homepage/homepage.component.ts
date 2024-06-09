import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {
  searchSubject$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  searchSubscription: Subscription | null = null;
  inputValue: string = '';


  constructor(private newsService: NewsService){

  }
  

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject$.pipe(distinctUntilChanged(), debounceTime(300)).subscribe((value: string) =>{
      this.newsService.filterArticlesByKeywords(value);
      this.inputValue = value;
    })
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }
}

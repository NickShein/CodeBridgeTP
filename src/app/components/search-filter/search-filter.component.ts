import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit, OnDestroy {
  @Input() searchSubject$!:BehaviorSubject<string>;

  searchControl: FormControl = new FormControl();
  searchSubscription: Subscription | null = null;

  ngOnInit(): void{
    this.searchSubscription = this.searchControl.valueChanges.subscribe((value: string)=>{
      this.searchSubject$.next(value);
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }
 
}

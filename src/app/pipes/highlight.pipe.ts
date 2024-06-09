import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'highlight'
})

export class HighlightPipe implements PipeTransform {

    transform(value: any, args: any): any {
        if (!args) {
            return value;
        }
    
        const keywords = args.split(' ').filter((word: string) => word.trim().length > 0);
        const uniqueKeywords = [...new Set(keywords)];
    
        // Якщо немає ключових слів, повертаємо початкове значення
        if (uniqueKeywords.length === 0) {
            return value;
        }
    
        // Створення єдиного регулярного виразу, який містить усі ключові слова
        const re = new RegExp(uniqueKeywords.map(keyword => `(${keyword})`).join('|'), 'gi');
    
        // Заміна всіх ключових слів одноразово
        const newValue = value.replace(re, "<mark>$&</mark>");
        
        return newValue;
    }
}
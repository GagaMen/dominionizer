import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type CardDisplayMode = 'compact' | 'midSize' | 'fullSize';

@Injectable({
    providedIn: 'root',
})
export class ViewService {
    static readonly defaultCardDisplayMode: CardDisplayMode = 'compact';

    private cardDisplayModeSubject = new BehaviorSubject<CardDisplayMode>(
        ViewService.defaultCardDisplayMode,
    );

    readonly cardDisplayMode$: Observable<CardDisplayMode> =
        this.cardDisplayModeSubject.asObservable();

    updateCardDisplayMode(cardDisplayMode: CardDisplayMode): void {
        this.cardDisplayModeSubject.next(cardDisplayMode);
    }
}

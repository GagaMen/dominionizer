import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private lightThemeSubject = new BehaviorSubject<boolean>(false);

    readonly isLightThemeActive$: Observable<boolean> = this.lightThemeSubject.asObservable();

    setDarkTheme(isLightThemeActive: boolean): void {
        this.lightThemeSubject.next(isLightThemeActive);
    }
}

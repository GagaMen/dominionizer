import { ComponentFixture } from '@angular/core/testing';
import { getTestScheduler } from 'jasmine-marbles';

export function detectChangesAndFlush(fixture: ComponentFixture<unknown>): void {
    fixture.detectChanges();
    getTestScheduler().flush();
    fixture.detectChanges();
}

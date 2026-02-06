import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Prominence} from './prominence';

describe('Prominence', () => {
    let component: Prominence;
    let fixture: ComponentFixture<Prominence>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Prominence]
        })
            .compileComponents();

        fixture = TestBed.createComponent(Prominence);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

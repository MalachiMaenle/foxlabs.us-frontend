import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gearbound } from './gearbound';

describe('Gearbound', () => {
	let component: Gearbound;
	let fixture: ComponentFixture<Gearbound>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Gearbound]
		})
			.compileComponents();

		fixture = TestBed.createComponent(Gearbound);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

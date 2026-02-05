import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nexus } from './nexus';

describe('Nexus', () => {
	let component: Nexus;
	let fixture: ComponentFixture<Nexus>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Nexus]
		})
			.compileComponents();

		fixture = TestBed.createComponent(Nexus);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

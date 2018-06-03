import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UMeditorModule } from '../index';

const html = ``;

describe('Component: ngx-umeditor', () => {
  let fixture: ComponentFixture<any>;
  let context: TestNGComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestNGComponent],
      imports: [UMeditorModule]
    });
    TestBed.overrideComponent(TestNGComponent, {set: {template: html}});
    fixture = TestBed.createComponent(TestNGComponent);
    context = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('fixture should not be null', () => {
    expect(fixture).not.toBeNull();
  });
});

@Component({
  selector: 'app-umeditor-test',
  template: ''
})
class TestNGComponent {
}

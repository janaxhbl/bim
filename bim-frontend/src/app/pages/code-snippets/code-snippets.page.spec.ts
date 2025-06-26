import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodeSnippetsPage } from './code-snippets.page';

describe('CodeSnippetsPage', () => {
  let component: CodeSnippetsPage;
  let fixture: ComponentFixture<CodeSnippetsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeSnippetsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

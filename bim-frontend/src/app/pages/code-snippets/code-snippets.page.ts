import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CodeSnippet } from '../../models/codeSnippet.model';
import { CodeSnippetService } from '../../services/code-snippet.service';
import { Store } from '@ngxs/store';
import { AuthState } from '../../store/auth.state';

@Component({
  selector: 'app-code-snippets',
  templateUrl: './code-snippets.page.html',
  styleUrls: ['./code-snippets.page.scss'],
})
export class CodeSnippetsPage implements OnInit {

  codeSnippets$!: Observable<CodeSnippet[]>;

  constructor(
    private codeSnippetService: CodeSnippetService,
    private store: Store
  ) { }

  ngOnInit() {
    console.log(this.store.selectSnapshot(AuthState));
    this.codeSnippets$ = this.codeSnippetService.getSnippets();
    this.codeSnippets$.forEach(c => {
      console.log(c);
    });
  }

}

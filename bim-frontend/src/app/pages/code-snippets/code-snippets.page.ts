import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CodeSnippet } from '../../models/codeSnippet.model';
import { Select, Store } from '@ngxs/store';
import { CodeSnippetState, CreateCodeSnippet, DeleteCodeSnippet, GetAllCodeSnippets, UpdateCodeSnippet } from '../../store/code-snippet.state';
import { IonModal, IonSearchbar } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { NotificationService } from '../../services/notification.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthState } from '../../store/auth.state';

@Component({
  selector: 'app-code-snippets',
  templateUrl: './code-snippets.page.html',
  styleUrls: ['./code-snippets.page.scss'],
})
export class CodeSnippetsPage implements OnInit {
  
  @Select(CodeSnippetState.codeSnippets) codeSnippets$!: Observable<CodeSnippet[]>;
  
  @ViewChild(IonModal) addModal!: IonModal;
  @ViewChild(IonModal) updateModal!: IonModal;

  selectedFilter: "all" | "mine" = "all";
  userId!: number;
  filteredSnippets$ = new BehaviorSubject<CodeSnippet[]>([]);
  searchQuery: string = "";

  isUpdateModalOpen = false;
  selectedSnippet!: CodeSnippet;

  addFormGroup = new FormGroup({
    title: new FormControl("", Validators.compose([
      Validators.required
    ]))!,
    language: new FormControl("")!,
    code: new FormControl("", Validators.compose([
      Validators.required
    ]))!
  });

  updateFormGroup = new FormGroup({
    title: new FormControl("", Validators.compose([
      Validators.required
    ]))!,
    language: new FormControl("")!,
    code: new FormControl("", Validators.compose([
      Validators.required
    ]))!
  });

  constructor(
    private store: Store,
    private notification: NotificationService
  ) { }
  
  cancelAdd() {
    this.addModal.dismiss(null, 'cancel');
  }

  confirmAdd() {
    this.addModal.dismiss({
      title: this.addFormGroup.value.title,
      language: this.addFormGroup.value.language,
      code: this.addFormGroup.value.code
    }, "save");
  }

  onWillDismissAdd(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === "save") {
      this.store.dispatch(new CreateCodeSnippet({
        title: this.addFormGroup.value.title!,
        language: this.addFormGroup.value.language!,
        code: this.addFormGroup.value.code!
      })).subscribe({
        next: () => {
          this.notification.show("Code snippet saved successfully!", 3000, "success");
          console.log(this.store.selectSnapshot(CodeSnippetState.codeSnippets));
          this.addFormGroup.value.title = "";
          this.addFormGroup.value.language = "";
          this.addFormGroup.value.code = "";
        },
        error: (err) => {
          this.notification.show("Failed to save code snippet: " + err.error.error, 5000, "danger");
        }
      });
    }
  }

  cancelUpdate() {
    this.isUpdateModalOpen = false;
  }

  confirmUpdate() {
    this.store.dispatch(new UpdateCodeSnippet(this.selectedSnippet.id, {
      title: this.updateFormGroup.value.title!,
      language: this.updateFormGroup.value.language!,
      code: this.updateFormGroup.value.code!
    })).subscribe({
      next: () => {
        this.notification.show("Code snippet updated successfully!", 3000, "success");
        console.log(this.store.selectSnapshot(CodeSnippetState.codeSnippets));
        this.isUpdateModalOpen = false;
        this.updateFormGroup.value.title = "";
        this.updateFormGroup.value.language = "";
        this.updateFormGroup.value.code = "";
        this.selectedSnippet = {} as CodeSnippet;
      },
      error: (err) => {
        this.notification.show("Failed to update code snippet: " + err.error.error, 5000, "danger");
      }
    });
  }

  onFilterChange(event: any) {
    this.selectedFilter = event.detail.value;
    this.filterSnippets(this.store.selectSnapshot(CodeSnippetState.codeSnippets));
    // this.codeSnippets$.subscribe((codeSnippets) => {
    //   this.filterSnippets(codeSnippets, "");
    // }).unsubscribe();
  }

  filterSnippets(codeSnippets: CodeSnippet[]) {
    let filteredSnippetsTemp = codeSnippets;

    if (this.selectedFilter == "mine") {
      filteredSnippetsTemp = filteredSnippetsTemp.filter(s => s.user_id == this.userId);
    }

    if (this.searchQuery.trim()) {
      this.searchQuery = this.searchQuery.toLowerCase();
      filteredSnippetsTemp = filteredSnippetsTemp.filter(s =>
        s.title.toLowerCase().includes(this.searchQuery) ||
        s.language.toLowerCase().includes(this.searchQuery) ||
        s.code.toLowerCase().includes(this.searchQuery)
      );
    }

    this.filteredSnippets$.next(filteredSnippetsTemp);
  }

  editSnippet(codeSnippet: CodeSnippet) {
    console.log(codeSnippet);
    this.selectedSnippet = codeSnippet;

    this.updateFormGroup.patchValue({
      title: codeSnippet.title,
      language: codeSnippet.language,
      code: codeSnippet.code
    });

    this.isUpdateModalOpen = true;
  }

  deleteSnippet(codeSnippet: CodeSnippet) {
    this.store.dispatch(new DeleteCodeSnippet(codeSnippet.id)).subscribe({
      next: () => {
        this.notification.show("Code snippet deleted successfully!", 3000, "success");
      },
      error: (err) => {
        this.notification.show("Failed to delete code snippet: " + err.error.error, 5000, "danger");
      }
    });
  }

  searchInput(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || "";
    this.searchQuery = query;
    this.filterSnippets(this.store.selectSnapshot(CodeSnippetState.codeSnippets));
  }

  ngOnInit() {
    this.userId = this.store.selectSnapshot(AuthState).id;
    this.store.dispatch(new GetAllCodeSnippets()).subscribe({
      next: () => {
        console.log("codesnippets: ", this.store.selectSnapshot(CodeSnippetState.codeSnippets));
      },
      error: (err) => {
        console.log("failed codesnippets: ", err);
      }
    });
    this.codeSnippets$.subscribe((codeSnippets) => {
      this.filterSnippets(codeSnippets);
    })
  }
}

import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from './store/auth.state';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NgxsStoragePluginModule, StorageOption } from '@ngxs/storage-plugin';
import { CodeSnippetState } from './store/code-snippet.state';
import { GlobalErrorHandler } from './core/global-error-handler';
import { UserState } from './store/user.state';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    NgxsModule.forRoot([
      AuthState,
      CodeSnippetState,
      UserState
    ]),
    NgxsStoragePluginModule.forRoot({
      key: ["auth", "user"],
      storage: StorageOption.SessionStorage
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
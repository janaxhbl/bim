import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { NotificationService } from "../services/notification.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private notification: NotificationService) {}

    handleError(error: any): void {
        console.error("Global error caught: ", error);

        this.notification.show("An unexpected error occured. Please try again!" +
            " Error message: " + error.error
        );
    }
}
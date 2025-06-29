import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable({ providedIn: "root" })
export class NotificationService {

    constructor(private toastController: ToastController) {}

    async show(message: string, duration: number = 3000, color: string = "primary") {
        const toast = await this.toastController.create({
            message,
            duration,
            position: "bottom",
            color
        });
        toast.present();
    }

}
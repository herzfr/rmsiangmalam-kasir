import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { PathRegistry } from "../_constant/path";

@NgModule({
    imports: [HttpClientModule],
    exports: [MatIconModule]
})
export class IconMaterialModule {
    customIcons: Array<[string, string]> = [
        // GENERAL
        ["login", `${PathRegistry.ASSETS_SVG}login.svg`],
        ["access-danied", `${PathRegistry.ASSETS_SVG}access_danied.svg`],
        ["logout", `${PathRegistry.ASSETS_SVG}logout.svg`],
        ["back", `${PathRegistry.ASSETS_SVG}icon/arrow-left.svg`],
        ["search", `${PathRegistry.ASSETS_SVG}icon/search.svg`],
        ["plus", `${PathRegistry.ASSETS_SVG}icon/plus.svg`],
        ["minus", `${PathRegistry.ASSETS_SVG}icon/minus.svg`],
        ["remove", `${PathRegistry.ASSETS_SVG}icon/remove.svg`],
        ["chevron", `${PathRegistry.ASSETS_SVG}icon/chevron.svg`],
        ["cancel", `${PathRegistry.ASSETS_SVG}cancel-icon.svg`],
        ["split-image", `${PathRegistry.ASSETS_SVG}split-bill.svg`],
        ["filter", `${PathRegistry.ASSETS_SVG}icon/filter.svg`],
        ["back-screen", `${PathRegistry.ASSETS_SVG}icon/logout.svg`],
        ["note", `${PathRegistry.ASSETS_SVG}icon/note.svg`],
        ["table", `${PathRegistry.ASSETS_SVG}icon/table.svg`],
        ["user", `${PathRegistry.ASSETS_SVG}icon/user.svg`],
        ["clock", `${PathRegistry.ASSETS_SVG}clock.svg`],
        ["refresh", `${PathRegistry.ASSETS_SVG}refresh.svg`],
        ["setting", `${PathRegistry.ASSETS_SVG}setting.svg`],
        ["three-dot", `${PathRegistry.ASSETS_SVG}three-dot.svg`],
        ["chevron-left", `${PathRegistry.ASSETS_SVG}icon/chevron-left.svg`],
        ["chevron-right", `${PathRegistry.ASSETS_SVG}icon/chevron-right.svg`],
        ["line", `${PathRegistry.ASSETS_SVG}line.svg`],
        ["bell", `${PathRegistry.ASSETS_SVG}icon/reserve-bell.svg`],
        ["calendar", `${PathRegistry.ASSETS_SVG}icon/calendar.svg`],
        ["calendar-2", `${PathRegistry.ASSETS_SVG}icon/calendar-2.svg`],
        ["cart", `${PathRegistry.ASSETS_SVG}icon/cart.svg`],
        ["drag", `${PathRegistry.ASSETS_SVG}icon/drag.svg`],
        ["x", `${PathRegistry.ASSETS_SVG}x.svg`],
        ["trash", `${PathRegistry.ASSETS_SVG}trash.svg`],
        ["money-cash", `${PathRegistry.ASSETS_SVG}icon/money-cash.svg`],
        ["note-2", `${PathRegistry.ASSETS_SVG}icon/note-2.svg`],
        ["time", `${PathRegistry.ASSETS_SVG}icon/time.svg`],
        ["date", `${PathRegistry.ASSETS_SVG}icon/date.svg`],

        // MAIN MENU
        ["cashier-menu", `${PathRegistry.ASSETS_SVG}icon/main-menu/cashier-menu.svg`],
        ["order-menu", `${PathRegistry.ASSETS_SVG}icon/main-menu/order-menu.svg`],
        ["other-expanse-menu", `${PathRegistry.ASSETS_SVG}icon/main-menu/other-expanse-menu.svg`],
        ["other-income-menu", `${PathRegistry.ASSETS_SVG}icon/main-menu/other-income-menu.svg`],
        ["reservation-menu", `${PathRegistry.ASSETS_SVG}icon/main-menu/reservation-menu.svg`],
        ["stock-menu", `${PathRegistry.ASSETS_SVG}icon/main-menu/stock-menu.svg`],
        ["table-menu", `${PathRegistry.ASSETS_SVG}icon/main-menu/table-menu.svg`],

        // ILLUSTRATION
        ["empty-data", `${PathRegistry.ASSETS_SVG}empty-data.svg`],
        ["empty-cart", `${PathRegistry.ASSETS_SVG}empty-cart.svg`],
        ["empty", `${PathRegistry.ASSETS_SVG}pattern/empty.svg`],
        ["food", `${PathRegistry.ASSETS_SVG}food.svg`],
        ["hands", `${PathRegistry.ASSETS_SVG}3d-image/hands.svg`],
        ["empty-review", `${PathRegistry.ASSETS_SVG}empty-review.svg`],
        ["merge-bill", `${PathRegistry.ASSETS_SVG}merge-bill.svg`],
        ["area-drop", `${PathRegistry.ASSETS_SVG}area-drop.svg`],
        ["empty-success", `${PathRegistry.ASSETS_SVG}empty-success.svg`],

        // PAYMENT
        ["coin", `${PathRegistry.ASSETS_SVG}icon/payment/coin.svg`],
        ["debit", `${PathRegistry.ASSETS_SVG}icon/payment/debit.svg`],
        ["ewallet", `${PathRegistry.ASSETS_SVG}icon/payment/ewallet.svg`],
        ["receipt", `${PathRegistry.ASSETS_SVG}icon/payment/receipt.svg`],
        ["wallet-cash", `${PathRegistry.ASSETS_SVG}icon/payment/wallet-cash.svg`],
        ["discount", `${PathRegistry.ASSETS_SVG}icon/discount.svg`],
        ["service", `${PathRegistry.ASSETS_SVG}icon/service.svg`],
        ["tax", `${PathRegistry.ASSETS_SVG}icon/tax.svg`],
        ["keypad", `${PathRegistry.ASSETS_SVG}icon/keypad.svg`],
        ["photo-camera", `${PathRegistry.ASSETS_SVG}photo-camera.svg`],

        // SIDENAV
        ["main", `${PathRegistry.ASSETS_SVG}icon/sidenav/icon-main.svg`],
        ["package", `${PathRegistry.ASSETS_SVG}icon/sidenav/icon-package.svg`],
        ["product", `${PathRegistry.ASSETS_SVG}icon/sidenav/icon-product.svg`],
        ["cashier", `${PathRegistry.ASSETS_SVG}icon/sidenav/icon-cashier.svg`],
        ["main-active", `${PathRegistry.ASSETS_SVG}icon/sidenav/icon-main-active.svg`],
        ["package-active", `${PathRegistry.ASSETS_SVG}icon/sidenav/icon-package-active.svg`],
        ["product-active", `${PathRegistry.ASSETS_SVG}icon/sidenav/icon-product-active.svg`],
        ["cashier-active", `${PathRegistry.ASSETS_SVG}icon/sidenav/icon-cashier-active.svg`],
    ];


    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        this.customIcons.forEach(([iconName, iconPath]) => {
            iconRegistry.addSvgIcon(
                iconName,
                sanitizer.bypassSecurityTrustResourceUrl(iconPath)
            );
        });
    }
}
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
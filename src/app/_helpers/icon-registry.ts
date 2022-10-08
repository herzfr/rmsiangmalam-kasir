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
        ["login", `${PathRegistry.ASSETS_SVG}login.svg`],
        ["access-danied", `${PathRegistry.ASSETS_SVG}access_danied.svg`],
        ["logout", `${PathRegistry.ASSETS_SVG}logout.svg`],
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
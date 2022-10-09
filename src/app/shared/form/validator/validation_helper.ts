import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';

@Pipe({
    name: 'validationFormat',
})
export class ValidationHelper {
    transform(source: any, name: any): string[] {
        if (source instanceof FormControl) {
            return this.formatMessages((source as FormControl).errors, name);
        }
        return this.formatMessages(source as ValidationErrors, name);
    }

    formatMessages(errors: ValidationErrors | null, name: string): string[] {
        let message: string[] = [];
        for (let errorsName in errors) {
            switch (errorsName) {
                case 'required':
                    message.push(`${name} harus terisi`);
                    break;
                case 'minlength':
                    message.push(
                        `${name} harus setidaknya ${errors['minlength'].requiredLength} karakter`
                    );
                    break;
                case 'pattern':
                    message.push(`A ${name} mengandung karakter ilegal`);
                    break;
                case 'limit':
                    message.push(`The ${name} harus kurang dari
            ${errors['limit'].limit}`);
                    break;
                case 'hilow':
                    message.push(`${name} tidak boleh kurang dari
            ${errors['hilow'].low} dan tidak boleh lebih dari ${errors['hilow'].high}`);
                    break;
                case 'unique':
                    message.push(`${name} harus unik tidak boleh sama`);
                    break;
                case 'prohibited':
                    message.push(`The ${name} may not contain
            "${errors['prohibited'].prohibited}"`);
                    break;
            }
        }
        return message;
    }
}

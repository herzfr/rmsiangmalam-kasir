export class FormUtil {
    generateObjectForm(
        asName: string,
        asType: string,
        asLabel: string,
        asPlaceholer: string | null,
        asIcon: string | undefined,
        asValue: string | null | number | boolean,
        asVisible: boolean,
        asRequired: boolean,
        asOpt: any
    ) {
        return {
            type: asType,
            name: asName,
            label: asLabel,
            placeholder: asPlaceholer,
            icon: asIcon,
            value: asValue,
            visibility: asVisible,
            required: asRequired,
            option: asOpt,
        };
    }
}
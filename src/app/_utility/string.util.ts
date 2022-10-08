export class StringUtil {
    convertTitleCase(char: string): string {
        return char.charAt(0).toUpperCase() + char.slice(1);
    }

    splitChar(char: string, separator: string): string[] {
        return char.split(separator);
    }

    convertCharBySpliter(charList: string, separator: string): string {
        return this.splitChar(charList, separator).join(' ');
    }

    convertCharTitleCase(char: string, separator: string): any {
        let str = this.splitChar(char, separator).join('');
        return this.convertTitleCase(str);
    }

    convertChartUpperCaseByWord(char: string, separator: string): string {
        let strArr: string[] = [];
        this.splitChar(char, separator).forEach((x) => {
            strArr.push(this.convertTitleCase(x));
        });
        return strArr.join(' ');
    }

    replaceChar(char: string, target: string, replacement: string): string {
        let newStr = '';
        for (var i = 0; i < char.length; i++) {
            if (char[i] == target) {
                newStr += replacement;
            } else {
                newStr += char[i];
            }
        }
        return newStr;
    }
}

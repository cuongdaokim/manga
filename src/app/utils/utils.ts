export class Utils {
    public static IsNullOrEmpty(arr: any[]): boolean {
        if (arr != null && arr.length > 0)
            return false;

        return true;
    }

    static padTo2Digits(num: number): string {
        return num.toString().padStart(2, '0');
    }

    static formatDate(date: Date): string {
        let values = date.toString().slice(0, 10).split('-');
        values.reverse();

        return [...values].join('/');
    }

    static getTimeDiff(time: Date): string {
        let now = new Date();
        let date = new Date(time.valueOf());
        let diff = Math.round((now.getTime() - date.getTime()) / 60000);

        if (diff < 1) {
            return 'Mới đây';
        } else if (diff < 60) {
            return diff + ' phút trước';
        } else if (diff < 1440) {
            return Math.floor(diff / 60) + ' giờ trước';
        }
        else if (diff < 10080) {
            return Math.floor(diff / 1440) + ' ngày trước';
        }
        else {
            return date.toLocaleDateString('en-GB');
        }
    }

    static getUpdatedDateTime(dateTime: Date): string {
        dateTime = new Date(dateTime.valueOf());

        return `${Utils.padTo2Digits(dateTime.getHours())}`
            + `:${Utils.padTo2Digits(dateTime.getMinutes())}`
            + `:${Utils.padTo2Digits(dateTime.getSeconds())} `
            + `${Utils.padTo2Digits(dateTime.getDate())}`
            + `/${Utils.padTo2Digits(dateTime.getMonth() + 1)}`
            + `/${dateTime.getFullYear()}`;
    }

    static moveItemInArray(arr: any[], oldIndex: number, newIndex: number): any[] {
        const element = arr.splice(oldIndex, 1)[0];
        arr.splice(newIndex, 0, element);

        return arr;
    }
}
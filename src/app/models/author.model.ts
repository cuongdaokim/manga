export interface IAuthorModel {
    id: number;
    name: string;
}

export class AuthorModel implements IAuthorModel {
    id: number;
    name: string;

    constructor() {
        this.id = 0;
        this.name = "";
    }
}
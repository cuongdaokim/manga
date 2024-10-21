import { ComicModel } from "./comic.model";

export interface IGenreModel {
    id: number;
    name: string;
}

export class GenreModel implements IGenreModel {
    id: number;
    name: string;

    comics: ComicModel[];

    constructor() {
        this.id = 0;
        this.name = "";

        this.comics = [];
    }
}
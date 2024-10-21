import { ComicModel } from "./comic.model";
import { UserModel } from "./user.model";

export enum ReviewType {
    LIKE,
    DISLIKE
}

export interface IReviewModel {
    type: ReviewType;
    createdTime: Date;

    comic?: ComicModel;
    user?: UserModel;
}

export class ReviewModel implements IReviewModel {
    type: ReviewType;
    createdTime: Date;

    comic?: ComicModel;
    user?: UserModel;

    constructor() {
        this.type = ReviewType.LIKE;
        this.createdTime = new Date();
    }
}
import { Utils } from "../utils/utils";
import { ChapterModel } from "./chapter.model";
import { UserModel } from "./user.model";

export interface ICommentModel {
    id: number;
    comment: string;
    createdTime: Date;
    chapter?: ChapterModel;
    user?: UserModel;
}

export class CommentModel implements ICommentModel {
    id: number;
    comment: string;
    createdTime: Date;

    chapter?: ChapterModel;
    user?: UserModel;

    constructor() {
        this.id = 0;
        this.comment = "";
        this.createdTime = new Date();
    }

    getTimeDiff(): string {
        return Utils.getTimeDiff(this.createdTime);
    }
}
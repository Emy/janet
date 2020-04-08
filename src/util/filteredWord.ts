type FilteredWordOptions = {
    notify: boolean;
    bypass: number;
    word: string;
};

export default class FilteredWord {
    notify: boolean;
    bypass: number;
    word: string;

    constructor(options: FilteredWordOptions) {
        this.notify = options.notify;
        this.bypass = options.bypass;
        this.word = options.word;
    }
}

type FilteredWordOptions = {
    word: string;
    priority: number;
};

export default class FilteredWord {
    word: string;
    priority: number;

    constructor(options: FilteredWordOptions) {
        this.word = options.word;
        this.priority = options.priority;
    }
}

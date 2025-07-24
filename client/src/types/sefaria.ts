export interface TehillimChapterInfo {
  chapterNumber: number;
  hebrewTitle: string;
  englishTitle: string;
  firstVerse: string;
  hebrewFirstVerse: string;
  commonName: string | null;
}

export interface TehillimSuggestions {
  daily_portion: number[];
  popular_chapters: number[];
  completed_today: number[];
  day_of_month: number;
}

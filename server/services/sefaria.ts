import fetch from 'node-fetch';

interface SefariaText {
  text: string[];
  he: string[];
  ref: string;
  heRef: string;
  book: string;
  primary_category: string;
  type: string;
}

interface SefariaResponse {
  text: SefariaText;
}

export class SefariaService {
  private static readonly BASE_URL = 'https://www.sefaria.org/api/v3/texts';
  
  static async getTehillimChapter(chapterNumber: number): Promise<SefariaText | null> {
    try {
      if (chapterNumber < 1 || chapterNumber > 150) {
        throw new Error('Invalid Tehillim chapter number');
      }

      const tref = `Psalms.${chapterNumber}`;
      const url = `${this.BASE_URL}/${encodeURIComponent(tref)}`;
      
      console.log(`Fetching Tehillim chapter ${chapterNumber} from Sefaria:`, url);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Yahrzeit-Tracker/1.0'
        }
      });

      if (!response.ok) {
        console.error(`Sefaria API error: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = await response.json() as SefariaResponse;
      
      if (!data.text) {
        console.error('No text data in Sefaria response');
        return null;
      }

      console.log(`Successfully fetched Tehillim chapter ${chapterNumber}`);
      return data.text;
    } catch (error) {
      console.error('Error fetching from Sefaria API:', error);
      return null;
    }
  }

  static async getTehillimInfo(chapterNumber: number): Promise<{ 
    hebrewTitle: string; 
    englishTitle: string; 
    firstVerse: string;
    hebrewFirstVerse: string;
  } | null> {
    try {
      const chapterData = await this.getTehillimChapter(chapterNumber);
      
      if (!chapterData) {
        return null;
      }

      // Extract basic info
      const hebrewTitle = chapterData.heRef || `תהילים ${chapterNumber}`;
      const englishTitle = `Psalms ${chapterNumber}`;
      
      // Get first verse (if available)
      const firstVerse = chapterData.text && chapterData.text.length > 0 
        ? chapterData.text[0] 
        : '';
      const hebrewFirstVerse = chapterData.he && chapterData.he.length > 0 
        ? chapterData.he[0] 
        : '';

      return {
        hebrewTitle,
        englishTitle,
        firstVerse,
        hebrewFirstVerse
      };
    } catch (error) {
      console.error('Error getting Tehillim info:', error);
      return null;
    }
  }

  static getCommonTehillimNames(): { [key: number]: string } {
    return {
      1: "Ashrei HaIsh",
      23: "Mizmor L'David - The Lord is my shepherd",
      27: "L'David - The Lord is my light",
      51: "L'Menatzeiach - A prayer of repentance",
      67: "L'Menatzeiach - May God be gracious",
      90: "Tefillah L'Moshe - A prayer of Moses",
      91: "Yoshev B'Seter - He who dwells in shelter",
      121: "Shir LaMaalot - I lift my eyes",
      130: "Shir HaMaalot - From the depths",
      142: "Maskil L'David - I cry out",
      145: "Tehillah L'David - Ashrei",
      150: "Halelu-Kah - Praise God"
    };
  }
}

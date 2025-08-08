export class SefariaService {
    static async getTehillimChapter(chapterNumber) {
        try {
            if (chapterNumber < 1 || chapterNumber > 150) {
                throw new Error('Invalid Tehillim chapter number');
            }
            // For now, return a simple response without external API call
            console.log(`Requested Tehillim chapter ${chapterNumber}`);
            return {
                text: [`Chapter ${chapterNumber} text would be here`],
                he: [`פרק ${chapterNumber} טקסט עברי כאן`],
                ref: `Psalms.${chapterNumber}`,
                heRef: `תהילים ${chapterNumber}`,
                book: 'Psalms',
                primary_category: 'Tanakh',
                type: 'text'
            };
        }
        catch (error) {
            console.error('Error in getTehillimChapter:', error);
            return null;
        }
    }
    static async getTehillimInfo(chapterNumber) {
        try {
            const commonNames = this.getCommonTehillimNames();
            return {
                hebrewTitle: `תהילים ${chapterNumber}`,
                englishTitle: `Psalms ${chapterNumber}`,
                firstVerse: commonNames[chapterNumber] || `Psalm ${chapterNumber}`,
                hebrewFirstVerse: `תהילים פרק ${chapterNumber}`
            };
        }
        catch (error) {
            console.error('Error getting Tehillim info:', error);
            return null;
        }
    }
    static getCommonTehillimNames() {
        return {
            1: "Ashrei HaIsh - Blessed is the man",
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

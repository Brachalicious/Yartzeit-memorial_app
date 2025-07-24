import { HDate } from '@hebcal/hdate';

// Debug November 23, 2024
const gregorianDate = new Date('2024-11-23');
const hebrewDate = new HDate(gregorianDate);

console.log('November 23, 2024:');
console.log('Hebrew date:', hebrewDate.toString());
console.log('Day:', hebrewDate.getDate());
console.log('Month:', hebrewDate.getMonth());
console.log('Year:', hebrewDate.getFullYear());
console.log('Month name:', hebrewDate.getMonthName());

// Check what the next yahrzeit should be
const currentYear = new HDate().getFullYear();
console.log('\nCurrent Hebrew year:', currentYear);

// Try to create next yahrzeit
const nextYahrzeit = new HDate(hebrewDate.getDate(), hebrewDate.getMonth(), currentYear + 1);
console.log('Next yahrzeit:', nextYahrzeit.toString());
console.log('Next yahrzeit gregorian:', nextYahrzeit.greg().toDateString());

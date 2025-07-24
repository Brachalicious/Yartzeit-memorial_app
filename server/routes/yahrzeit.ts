import express from 'express';
import { db } from '../database/connection.js';
import { HDate } from '@hebcal/hdate';

const router = express.Router();

// Get all yahrzeit entries
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all yahrzeit entries...');
    const entries = await db
      .selectFrom('yahrzeit_entries')
      .selectAll()
      .orderBy('name', 'asc')
      .execute();
    
    console.log(`Found ${entries.length} yahrzeit entries`);
    res.json(entries);
  } catch (error) {
    console.error('Error fetching yahrzeit entries:', error);
    res.status(500).json({ error: 'Failed to fetch yahrzeit entries' });
  }
});

// Get upcoming yahrzeits
router.get('/upcoming', async (req, res) => {
  try {
    console.log('Fetching upcoming yahrzeits...');
    const entries = await db
      .selectFrom('yahrzeit_entries')
      .selectAll()
      .execute();
    
    const now = new Date();
    const upcomingYahrzeits = [];
    
    for (const entry of entries) {
      try {
        console.log(`Processing entry: ${entry.name}, Hebrew date: ${entry.hebrew_death_date}`);
        
        // Parse the Hebrew death date
        const [hebrewDay, hebrewMonth, hebrewYear] = entry.hebrew_death_date.split('/').map(Number);
        console.log(`Parsed Hebrew date: Day=${hebrewDay}, Month=${hebrewMonth}, Year=${hebrewYear}`);
        
        // Get current Hebrew year
        const currentHebrewYear = new HDate().getFullYear();
        console.log(`Current Hebrew year: ${currentHebrewYear}`);
        
        // Try current Hebrew year first, then next year
        for (let yearOffset = 0; yearOffset <= 1; yearOffset++) {
          const targetYear = currentHebrewYear + yearOffset;
          console.log(`Trying Hebrew year: ${targetYear}`);
          
          try {
            const yahrzeitDate = new HDate(hebrewDay, hebrewMonth, targetYear);
            const gregorianDate = yahrzeitDate.greg();
            
            console.log(`Yahrzeit date: ${yahrzeitDate.toString()}, Gregorian: ${gregorianDate.toDateString()}`);
            
            if (gregorianDate >= now) {
              const daysUntil = Math.ceil((gregorianDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              
              console.log(`Found upcoming yahrzeit in ${daysUntil} days`);
              
              upcomingYahrzeits.push({
                ...entry,
                yahrzeit_date: gregorianDate.toISOString().split('T')[0],
                hebrew_yahrzeit_date: yahrzeitDate.toString(),
                days_until: daysUntil,
                is_soon: daysUntil <= entry.notify_days_before
              });
              break;
            }
          } catch (hebrewDateError) {
            console.error(`Error creating Hebrew date for year ${targetYear}:`, hebrewDateError);
          }
        }
      } catch (error) {
        console.error(`Error calculating yahrzeit for entry ${entry.id}:`, error);
      }
    }
    
    // Sort by days until yahrzeit
    upcomingYahrzeits.sort((a, b) => a.days_until - b.days_until);
    
    console.log(`Found ${upcomingYahrzeits.length} upcoming yahrzeits`);
    res.json(upcomingYahrzeits);
  } catch (error) {
    console.error('Error fetching upcoming yahrzeits:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming yahrzeits' });
  }
});

// Create new yahrzeit entry
router.post('/', async (req, res) => {
  try {
    const { name, hebrew_name, death_date, relationship, notes, notify_days_before } = req.body;
    
    console.log('Creating new yahrzeit entry:', { name, death_date });
    
    // Convert Gregorian date to Hebrew date
    const gregorianDate = new Date(death_date);
    const hebrewDate = new HDate(gregorianDate);
    const hebrew_death_date = `${hebrewDate.getDate()}/${hebrewDate.getMonth()}/${hebrewDate.getFullYear()}`;
    console.log(`Converted ${death_date} to Hebrew: ${hebrew_death_date}`);
    
    const result = await db
      .insertInto('yahrzeit_entries')
      .values({
        name,
        hebrew_name: hebrew_name || null,
        death_date,
        hebrew_death_date,
        relationship: relationship || null,
        notes: notes || null,
        notify_days_before: notify_days_before || 7,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .returning('id')
      .executeTakeFirstOrThrow();
    
    console.log('Created yahrzeit entry with ID:', result.id);
    res.status(201).json({ id: result.id, message: 'Yahrzeit entry created successfully' });
  } catch (error) {
    console.error('Error creating yahrzeit entry:', error);
    res.status(500).json({ error: 'Failed to create yahrzeit entry' });
  }
});

// Update yahrzeit entry
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, hebrew_name, death_date, relationship, notes, notify_days_before } = req.body;
    
    console.log('Updating yahrzeit entry:', id);
    
    // Convert Gregorian date to Hebrew date if death_date is provided
    let hebrew_death_date;
    if (death_date) {
      const gregorianDate = new Date(death_date);
      const hebrewDate = new HDate(gregorianDate);
      hebrew_death_date = `${hebrewDate.getDate()}/${hebrewDate.getMonth()}/${hebrewDate.getFullYear()}`;
      console.log(`Converted ${death_date} to Hebrew: ${hebrew_death_date}`);
    }
    
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    if (name !== undefined) updateData.name = name;
    if (hebrew_name !== undefined) updateData.hebrew_name = hebrew_name || null;
    if (death_date !== undefined) {
      updateData.death_date = death_date;
      updateData.hebrew_death_date = hebrew_death_date;
    }
    if (relationship !== undefined) updateData.relationship = relationship || null;
    if (notes !== undefined) updateData.notes = notes || null;
    if (notify_days_before !== undefined) updateData.notify_days_before = notify_days_before;
    
    await db
      .updateTable('yahrzeit_entries')
      .set(updateData)
      .where('id', '=', parseInt(id))
      .execute();
    
    console.log('Updated yahrzeit entry:', id);
    res.json({ message: 'Yahrzeit entry updated successfully' });
  } catch (error) {
    console.error('Error updating yahrzeit entry:', error);
    res.status(500).json({ error: 'Failed to update yahrzeit entry' });
  }
});

// Delete yahrzeit entry
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Deleting yahrzeit entry:', id);
    
    await db
      .deleteFrom('yahrzeit_entries')
      .where('id', '=', parseInt(id))
      .execute();
    
    console.log('Deleted yahrzeit entry:', id);
    res.json({ message: 'Yahrzeit entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting yahrzeit entry:', error);
    res.status(500).json({ error: 'Failed to delete yahrzeit entry' });
  }
});

export default router;

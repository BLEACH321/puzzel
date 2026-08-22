// Google Spreadsheet & SheetDB API Service with Live Leaderboard Sync

export const DEFAULT_SHEETDB_API_URL = 'https://sheetdb.io/api/v1/162rq1skhm8h3';

const STORAGE_KEY = '8puzzle_spreadsheet_records';
const WEBHOOK_KEY = '8puzzle_sheet_webhook_url';

export const SpreadsheetService = {
  // Always get active API URL (defaulting to SheetDB)
  getWebhookUrl() {
    const custom = localStorage.getItem(WEBHOOK_KEY);
    if (custom && custom.trim().length > 5) {
      return custom.trim();
    }
    return DEFAULT_SHEETDB_API_URL;
  },

  setWebhookUrl(url) {
    if (url && url.trim().length > 5) {
      localStorage.setItem(WEBHOOK_KEY, url.trim());
    } else {
      localStorage.removeItem(WEBHOOK_KEY);
    }
  },

  // Get local records
  getRecords() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  // Fetch live names & scores directly from the Google Sheet via SheetDB
  async getLiveLeaderboard() {
    const localRecords = this.getRecords();
    const apiUrl = this.getWebhookUrl();

    let combined = [...localRecords];

    if (apiUrl) {
      try {
        const response = await fetch(apiUrl, {
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          const cloudData = await response.json();
          if (Array.isArray(cloudData) && cloudData.length > 0) {
            const cloudPlayers = cloudData
              .filter(row => (row['FIRST NAME'] || row['First Name'] || row.Name || row.name))
              .map((row, idx) => {
                const rawName = row['FIRST NAME'] || row['First Name'] || row.FirstName || row.Name || row.name || 'Player';
                const firstName = rawName.trim().split(' ')[0] || 'Player';
                const score = parseInt(row.SCORE || row.Score || row.score, 10) || (1450 - idx * 15);
                const moves = parseInt(row.MOVES || row.Moves || row.moves, 10) || 6;
                const time = row.TIME || row.Time || row.time || '00:08';
                return {
                  id: row.ID || row.id || ('SHEET-' + idx),
                  name: firstName,
                  score: score,
                  moves: moves,
                  timeFormatted: time
                };
              });

            // Merge unique records by name
            const map = new Map();
            for (const p of [...cloudPlayers, ...localRecords]) {
              const key = p.name.toLowerCase();
              if (!map.has(key) || (map.get(key).score < p.score)) {
                map.set(key, p);
              }
            }
            combined = Array.from(map.values());
          }
        }
      } catch (err) {
        console.warn('Could not fetch cloud leaderboard:', err);
      }
    }

    // Default mock competitors if list is short
    if (combined.length < 2) {
      combined.push(
        { id: 'DEFAULT-1', name: 'Mia', score: 1250, moves: 8, timeFormatted: '00:15', avatar: '👧', avatarBg: '#EC4899' },
        { id: 'DEFAULT-2', name: 'Noah', score: 875, moves: 12, timeFormatted: '00:28', avatar: '👦', avatarBg: '#3B82F6' }
      );
    }

    // Sort descending by score
    combined.sort((a, b) => b.score - a.score);

    const avatars = ['👧', '🧩', '👦', '🌟', '🚀', '🐱', '🦊', '🐼'];
    const colors = ['#EC4899', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#06B6D4'];

    return combined.slice(0, 10).map((player, idx) => ({
      ...player,
      rank: idx + 1,
      name: player.name.trim().split(' ')[0] || 'Player',
      avatar: player.avatar || avatars[idx % avatars.length],
      avatarBg: player.avatarBg || colors[idx % colors.length]
    }));
  },

  // Save and automatically push First Name & game stats to Google Spreadsheet
  async recordResult(recordData) {
    const timestampStr = new Date().toLocaleString();
    const recordId = 'REC-' + Date.now();
    const firstName = (recordData.name || 'Player').trim().split(' ')[0] || 'Player';

    const record = {
      id: recordId,
      name: firstName,
      moves: recordData.moves || 0,
      timeFormatted: recordData.timeFormatted || '00:00',
      timeSeconds: recordData.timeSeconds || 0,
      score: recordData.score || 0,
      puzzleImage: recordData.puzzleImage || 'Community Image',
      timestamp: timestampStr,
      syncedToCloud: false
    };

    // Save locally
    const existing = this.getRecords();
    existing.unshift(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

    // Post to SheetDB matching exact "FIRST NAME" column in Google Sheet
    const apiUrl = this.getWebhookUrl();
    if (apiUrl) {
      try {
        const payload = {
          data: [
            {
              'FIRST NAME': firstName,
              'First Name': firstName,
              'FirstName': firstName,
              'NAME': firstName,
              'Name': firstName,
              'MOVES': record.moves,
              'Moves': record.moves,
              'TIME': record.timeFormatted,
              'Time': record.timeFormatted,
              'SCORE': record.score,
              'Score': record.score,
              'PUZZLE': record.puzzleImage,
              'Puzzle': record.puzzleImage,
              'DATE': record.timestamp,
              'Date': record.timestamp,
              'ID': record.id
            }
          ]
        };

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          record.syncedToCloud = true;
          console.log('✅ SheetDB record success for FIRST NAME:', firstName);
        }
      } catch (err) {
        console.warn('SheetDB sync attempt:', err);
      }
    }

    return record;
  }
};

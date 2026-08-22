// Google Spreadsheet & SheetDB API Service with Live Leaderboard Sync

export const DEFAULT_SHEETDB_API_URL = 'https://sheetdb.io/api/v1/162rq1skhm8h3';

const STORAGE_KEY = '8puzzle_spreadsheet_records';
const WEBHOOK_KEY = '8puzzle_sheet_webhook_url';

export const SpreadsheetService = {
  // Get active API URL
  getWebhookUrl() {
    return localStorage.getItem(WEBHOOK_KEY) || DEFAULT_SHEETDB_API_URL;
  },

  setWebhookUrl(url) {
    if (url && url.trim()) {
      localStorage.setItem(WEBHOOK_KEY, url.trim());
    } else {
      localStorage.setItem(WEBHOOK_KEY, DEFAULT_SHEETDB_API_URL);
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

  // Fetch live leaderboard rankings from SheetDB or local storage
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
            // Map sheet columns to standard player objects
            const cloudPlayers = cloudData.map(row => {
              const name = row['FIRST NAME'] || row['First Name'] || row.FirstName || row.Name || row.name || 'Player';
              const firstName = name.trim().split(' ')[0] || 'Player';
              const score = parseInt(row.SCORE || row.Score || row.score, 10) || 0;
              const moves = parseInt(row.MOVES || row.Moves || row.moves, 10) || 0;
              const time = row.TIME || row.Time || row.time || '00:00';
              return {
                id: row.ID || row.id || ('CLOUD-' + Math.random()),
                name: firstName,
                score: score,
                moves: moves,
                timeFormatted: time
              };
            });

            // Merge unique records
            const map = new Map();
            for (const p of [...cloudPlayers, ...localRecords]) {
              const key = p.name + '-' + p.score + '-' + p.moves;
              if (!map.has(key)) {
                map.set(key, p);
              }
            }
            combined = Array.from(map.values());
          }
        }
      } catch (err) {
        console.warn('Could not fetch cloud leaderboard, using local records:', err);
      }
    }

    // Default mock competitors if list is short
    if (combined.length < 3) {
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

  // Save a new completion record and push directly to SheetDB / Google Sheets
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

    // Post to SheetDB matching EXACT Google Sheet column names
    const apiUrl = this.getWebhookUrl();
    if (apiUrl) {
      try {
        const payload = {
          data: [
            {
              // Exact Column Name in Google Sheet
              'FIRST NAME': firstName,
              'First Name': firstName,
              'FirstName': firstName,
              'NAME': firstName,
              'Name': firstName,
              'name': firstName,
              // Other standard columns
              'MOVES': record.moves,
              'Moves': record.moves,
              'moves': record.moves,
              'TIME': record.timeFormatted,
              'Time': record.timeFormatted,
              'time': record.timeFormatted,
              'SCORE': record.score,
              'Score': record.score,
              'score': record.score,
              'PUZZLE': record.puzzleImage,
              'Puzzle': record.puzzleImage,
              'puzzle': record.puzzleImage,
              'DATE': record.timestamp,
              'Date': record.timestamp,
              'Timestamp': record.timestamp,
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
          console.log('✅ Recorded FIRST NAME to SheetDB Google Sheet:', firstName);
        }
      } catch (err) {
        console.warn('SheetDB sync attempt:', err);
      }
    }

    return record;
  },

  // Export all saved submissions to CSV
  downloadCSV() {
    const records = this.getRecords();
    if (records.length === 0) {
      alert('No game records to download yet.');
      return;
    }

    const headers = ['FIRST NAME', 'MOVES', 'TIME', 'SCORE', 'PUZZLE', 'DATE', 'RECORD ID'];
    const rows = records.map(r => [
      `"${r.name.replace(/"/g, '""')}"`,
      r.moves,
      `"${r.timeFormatted}"`,
      r.score,
      `"${r.puzzleImage}"`,
      `"${r.timestamp}"`,
      `"${r.id}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `8puzzle_results_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

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

  // Fetch live names, moves & leaderborder directly from Google Sheet via SheetDB
  async getLiveLeaderboard() {
    const localRecords = this.getRecords();
    const apiUrl = this.getWebhookUrl();

    let combined = [];

    if (apiUrl) {
      try {
        const response = await fetch(apiUrl, {
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          const cloudData = await response.json();
          if (Array.isArray(cloudData) && cloudData.length > 0) {
            const cloudPlayers = cloudData
              .filter(row => {
                const name = row['FIRST NAME'] || row['First Name'] || row.Name || row.name;
                return Boolean(name && name.trim());
              })
              .map((row, idx) => {
                const rawName = row['FIRST NAME'] || row['First Name'] || row.FirstName || row.Name || row.name || 'Player';
                const firstName = rawName.trim().split(' ')[0] || 'Player';

                const rawMoves = row['Moves '] || row['Moves'] || row['MOVES'] || row['moves'] || '';
                const movesNum = parseInt(rawMoves, 10);
                const movesStr = isNaN(movesNum) ? (rawMoves || '0') : `${movesNum} moves`;

                const rawLeaderborder = row['leaderborder'] || row['leaderboard'] || row['SCORE'] || row['Score'] || row['score'] || '';
                const numericScore = parseInt(String(rawLeaderborder).replace(/[^0-9]/g, ''), 10) || 0;

                const timeStr = row['TIME'] || row['Time'] || row['time'] || '';

                return {
                  id: row.ID || row.id || `SHEET-${idx}-${firstName}`,
                  name: firstName,
                  moves: isNaN(movesNum) ? rawMoves : movesNum,
                  movesFormatted: movesStr,
                  score: numericScore,
                  leaderborder: rawLeaderborder || `${numericScore} pts`,
                  timeFormatted: timeStr
                };
              });

            // Group / keep best score per player
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

    if (combined.length === 0 && localRecords.length > 0) {
      combined = [...localRecords];
    }

    // Sort descending by score / leaderborder
    combined.sort((a, b) => b.score - a.score);

    const avatars = ['🌟', '🧩', '👦', '👧', '🚀', '🐱', '🦊', '🐼'];
    const colors = ['#EC4899', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#06B6D4'];

    return combined.slice(0, 15).map((player, idx) => ({
      ...player,
      rank: idx + 1,
      name: player.name.trim().split(' ')[0] || 'Player',
      avatar: player.avatar || avatars[idx % avatars.length],
      avatarBg: player.avatarBg || colors[idx % colors.length]
    }));
  },

  // Save on Welcome Screen (Initial First Name entry)
  async recordInitialPlayer(playerName) {
    const firstName = (playerName || 'Player').trim().split(' ')[0] || 'Player';
    const apiUrl = this.getWebhookUrl();

    if (!apiUrl) return;

    try {
      // First try to check if user already exists
      const searchRes = await fetch(`${apiUrl}/search?FIRST%20NAME=${encodeURIComponent(firstName)}`, {
        headers: { 'Accept': 'application/json' }
      });
      const existing = await searchRes.json();

      if (Array.isArray(existing) && existing.length > 0) {
        // Already exists in sheet, no need to duplicate row
        return;
      }

      // If not exists, insert initial row
      const payload = {
        data: [
          {
            'FIRST NAME': firstName,
            'Moves ': '',
            'leaderborder': ''
          }
        ]
      };

      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Initial player record warning:', err);
    }
  },

  // Update Moves & Leaderboard on Game Complete / Victory
  async recordResult(recordData) {
    const timestampStr = new Date().toLocaleString();
    const recordId = 'REC-' + Date.now();
    const firstName = (recordData.name || 'Player').trim().split(' ')[0] || 'Player';
    const movesVal = recordData.moves !== undefined ? recordData.moves : 0;
    const scoreVal = recordData.score !== undefined ? recordData.score : 0;
    const leaderborderVal = `${scoreVal.toLocaleString()} pts`;

    const record = {
      id: recordId,
      name: firstName,
      moves: movesVal,
      movesFormatted: `${movesVal} moves`,
      timeFormatted: recordData.timeFormatted || '00:00',
      timeSeconds: recordData.timeSeconds || 0,
      score: scoreVal,
      leaderborder: leaderborderVal,
      puzzleImage: recordData.puzzleImage || 'Community Image',
      timestamp: timestampStr,
      syncedToCloud: false
    };

    // Save locally
    const existing = this.getRecords();
    const filtered = existing.filter(r => r.name.toLowerCase() !== firstName.toLowerCase());
    filtered.unshift(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    const apiUrl = this.getWebhookUrl();
    if (apiUrl) {
      try {
        // 1. First attempt to PATCH (update) existing row for FIRST NAME
        const patchUrl = `${apiUrl}/FIRST%20NAME/${encodeURIComponent(firstName)}`;
        const patchPayload = {
          data: {
            'FIRST NAME': firstName,
            'Moves ': String(movesVal),
            'Moves': String(movesVal),
            'leaderborder': leaderborderVal,
            'leaderboard': leaderborderVal
          }
        };

        const patchRes = await fetch(patchUrl, {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(patchPayload)
        });

        const patchData = await patchRes.json();

        // If no rows were updated, POST a new row
        if (!patchRes.ok || !patchData || patchData.updated === 0) {
          const postPayload = {
            data: [
              {
                'FIRST NAME': firstName,
                'Moves ': String(movesVal),
                'Moves': String(movesVal),
                'leaderborder': leaderborderVal,
                'leaderboard': leaderborderVal
              }
            ]
          };

          await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(postPayload)
          });
        }

        record.syncedToCloud = true;
        console.log('✅ SheetDB updated Moves & leaderborder successfully for:', firstName);
      } catch (err) {
        console.warn('SheetDB sync attempt error:', err);
      }
    }

    return record;
  }
};


// Google Spreadsheet & SheetDB API Service for 8-Puzzle

export const DEFAULT_SHEETDB_API_URL = 'https://sheetdb.io/api/v1/162rq1skhm8h3';

const STORAGE_KEY = '8puzzle_spreadsheet_records';
const WEBHOOK_KEY = '8puzzle_sheet_webhook_url';

export const SpreadsheetService = {
  // Get active API URL (defaulting to the user's SheetDB endpoint)
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

  // Get all locally recorded game results
  getRecords() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  // Save a new completion record and push directly to SheetDB / Google Sheets
  async recordResult(recordData) {
    const timestampStr = new Date().toLocaleString();
    const recordId = 'REC-' + Date.now();

    const record = {
      id: recordId,
      name: recordData.name || 'Player',
      moves: recordData.moves || 0,
      timeFormatted: recordData.timeFormatted || '00:00',
      timeSeconds: recordData.timeSeconds || 0,
      score: recordData.score || 0,
      puzzleImage: recordData.puzzleImage || 'Community Image',
      timestamp: timestampStr,
      syncedToCloud: false
    };

    // 1. Save locally for instant offline reliability & CSV export
    const existing = this.getRecords();
    existing.unshift(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

    // 2. Post directly to SheetDB endpoint
    const apiUrl = this.getWebhookUrl();
    if (apiUrl) {
      try {
        // SheetDB expects { "data": [ { "Name": "...", "Moves": "...", ... } ] }
        const payload = {
          data: [
            {
              ID: record.id,
              Name: record.name,
              name: record.name,
              Moves: record.moves,
              moves: record.moves,
              Time: record.timeFormatted,
              time: record.timeFormatted,
              Score: record.score,
              score: record.score,
              Puzzle: record.puzzleImage,
              puzzle: record.puzzleImage,
              Date: record.timestamp,
              Timestamp: record.timestamp
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
          console.log('✅ Successfully posted result to SheetDB Google Sheet:', record);
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

    const headers = ['Record ID', 'Player Name', 'Moves', 'Time (MM:SS)', 'Time (Seconds)', 'Score', 'Puzzle Image', 'Date & Time'];
    const rows = records.map(r => [
      `"${r.id}"`,
      `"${r.name.replace(/"/g, '""')}"`,
      r.moves,
      `"${r.timeFormatted}"`,
      r.timeSeconds,
      r.score,
      `"${r.puzzleImage}"`,
      `"${r.timestamp}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `8puzzle_sheetdb_results_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

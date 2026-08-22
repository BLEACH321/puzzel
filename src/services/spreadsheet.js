// Google Spreadsheet & CSV Data Sync Service for 8-Puzzle

const STORAGE_KEY = '8puzzle_spreadsheet_records';
const WEBHOOK_KEY = '8puzzle_sheet_webhook_url';

export const SpreadsheetService = {
  // Get stored webhook URL (Google Apps Script / SheetDB / custom endpoint)
  getWebhookUrl() {
    return localStorage.getItem(WEBHOOK_KEY) || '';
  },

  setWebhookUrl(url) {
    if (url) {
      localStorage.setItem(WEBHOOK_KEY, url.trim());
    } else {
      localStorage.removeItem(WEBHOOK_KEY);
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

  // Save a new completion record
  async recordResult(recordData) {
    const record = {
      id: 'REC-' + Date.now(),
      name: recordData.name || 'Anonymous',
      moves: recordData.moves || 0,
      timeFormatted: recordData.timeFormatted || '00:00',
      timeSeconds: recordData.timeSeconds || 0,
      score: recordData.score || 0,
      puzzleImage: recordData.puzzleImage || 'Unknown',
      timestamp: new Date().toLocaleString(),
      syncedToCloud: false
    };

    // 1. Save locally
    const existing = this.getRecords();
    existing.unshift(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

    // 2. If Google Sheet Webhook URL is configured, POST to it
    const webhookUrl = this.getWebhookUrl();
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors', // standard for Google Apps Script Web Apps
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        });
        record.syncedToCloud = true;
      } catch (err) {
        console.warn('Google Sheet webhook sync failed:', err);
      }
    }

    return record;
  },

  // Export all saved submissions to Google Sheets / Excel compatible CSV file
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
    link.setAttribute('download', `8puzzle_results_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

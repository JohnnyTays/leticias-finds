// Google Apps Script for Leticia's Inventory
// ===========================================
// INSTRUCTIONS:
// 1. Go to https://script.google.com
// 2. Click "+ New Project"
// 3. Paste this entire code
// 4. Click Deploy > New Deployment
// 5. Select "Web app"
// 6. Execute as: "Me"
// 7. Who has access: "Anyone"
// 8. Click Deploy
// 9. Copy the Web App URL
//
// THEN: Message Braxley the URL and I'll wire it up

const SHEET_NAME = 'Inventory';

const doGet = () => {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    const headers = data[0].map(h => h.toString().toLowerCase());
    const items = data.slice(1).map(row => {
      const item = {};
      headers.forEach((h, i) => item[h] = row[i]);
      return item;
    }).filter(item => item.id); // Filter empty rows
    return ContentService.createTextOutput(JSON.stringify(items))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({error: e.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
};

const doPost = (e) => {
  try {
    const sheet = getOrCreateSheet();
    const inventory = JSON.parse(e.postData.contents);
    
    // Clear and rewrite
    sheet.clear();
    
    // Headers
    const headers = ['id', 'name', 'category', 'price', 'condition', 'emoji', 'image', 'description'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Data rows
    const rows = inventory.map(item => [
      item.id || Date.now(),
      item.name || '',
      item.category || 'Electronics',
      item.price || 0,
      item.condition || '',
      item.emoji || '📦',
      item.image || '',
      item.description || ''
    ]);
    
    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: true, count: rows.length}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({error: e.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
};

const getOrCreateSheet = () => {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
};

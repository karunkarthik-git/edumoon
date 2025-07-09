// Utility to fetch Google Sheets data as JSON
// Sheet must be published to the web or shared publicly for this to work without authentication

const SHEET_ID = '1tky7mE0sBMhXOtlu2Ger7AHUZy1SR39VGKo_oUyNojQ';
const SHEET_GID = '0'; // Default first sheet

// Returns a Promise resolving to an array of row objects
export async function fetchSheetData() {
  // Use the Google Visualization API to get JSON
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${SHEET_GID}`;
  const res = await fetch(url);
  const text = await res.text();
  // Remove Google API JS function wrapper
  const json = JSON.parse(text.substring(47, text.length - 2));
  const cols = json.table.cols.map(col => col.label);
  return json.table.rows.map(row => {
    const obj = {};
    row.c.forEach((cell, i) => {
      obj[cols[i]] = cell ? cell.v : '';
    });
    return obj;
  });
}

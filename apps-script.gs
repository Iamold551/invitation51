// Google Apps Script backend: saves RSVPs to the Google Sheet this script is attached to.
// One row per email. Submitting the same email again updates that row.

const HEADERS = ["Email", "Name", "Attending", "Guests", "Message", "Submitted", "Last Updated"];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("RSVPs") || ss.insertSheet("RSVPs");
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function findRow_(sheet, email) {
  const last = sheet.getLastRow();
  if (last < 2) return -1;
  const emails = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (let i = 0; i < emails.length; i++) {
    if (String(emails[i][0]).toLowerCase() === email.toLowerCase()) return i + 2;
  }
  return -1;
}

// Guest looks up an earlier response: ?email=...
function doGet(e) {
  const email = ((e.parameter && e.parameter.email) || "").trim();
  if (!email) return json_({ found: false });
  const sheet = getSheet_();
  const row = findRow_(sheet, email);
  if (row < 0) return json_({ found: false });
  const v = sheet.getRange(row, 1, 1, HEADERS.length).getValues()[0];
  return json_({ found: true, name: v[1], attending: v[2], guests: v[3], message: v[4] });
}

// Guest submits or updates a response
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const email = String(d.email || "").trim();
    if (!email || !d.name) return json_({ ok: false, error: "Email and name are required" });

    const sheet = getSheet_();
    const now = new Date();
    const values = [
      email,
      String(d.name).slice(0, 200),
      ["Yes", "No", "Maybe"].indexOf(d.attending) >= 0 ? d.attending : "Maybe",
      Math.max(1, Math.min(20, parseInt(d.guests, 10) || 1)),
      String(d.message || "").slice(0, 1000),
    ];

    const row = findRow_(sheet, email);
    if (row > 0) {
      const submitted = sheet.getRange(row, 6).getValue();
      sheet.getRange(row, 1, 1, HEADERS.length).setValues([values.concat([submitted, now])]);
      return json_({ ok: true, updated: true });
    }
    sheet.appendRow(values.concat([now, now]));
    return json_({ ok: true, updated: false });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

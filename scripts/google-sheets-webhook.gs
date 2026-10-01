function jsonResponse(body, status) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function authorized(event) {
  const expected = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");
  if (!expected) return true;
  const header = event.headers || {};
  const auth =
    header.Authorization ||
    header.authorization ||
    (event.parameter && event.parameter.secret) ||
    "";
  return auth === "Bearer " + expected || auth === expected;
}

function sheetByName(name) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
}

function ensureHeader(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Submitted at",
      "Name",
      "Email",
      "Phone",
      "Subject",
      "Message",
    ]);
  }
}

function doPost(event) {
  if (!authorized(event)) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
  }

  const payload = JSON.parse(event.postData.contents);
  const tab = payload.tab;
  if (!tab) {
    return jsonResponse({ ok: false, error: "Missing tab" });
  }

  const sheet = sheetByName(tab);
  ensureHeader(sheet);
  sheet.appendRow([
    payload.submittedAt || new Date().toISOString(),
    payload.name || "",
    payload.email || "",
    payload.phone || "",
    payload.subject || "",
    payload.message || "",
  ]);

  return jsonResponse({ ok: true });
}

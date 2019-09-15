function myFunction() {
  const SS_COLS = ss_cols();
  var calendar = CalendarApp.getDefaultCalendar();
  var sheet = SpreadsheetApp.getActiveSheet();
  var values = sheet.getDataRange().getValues();

  for (var i = 1; i < values.length; i++) {

    var date = values[i][SS_COLS.DATE.no];
    var startTime = values[i][SS_COLS.START_TIME.no];
    var startDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startTime.getHours(), startTime.getMinutes(), 0);
    var endTime = values[i][SS_COLS.END_TIME.no];
    var endDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endTime.getHours(), endTime.getMinutes(), 0);
    var title = values[i][SS_COLS.TITLE.no];

    // カレンダーIDがある場合は更新
    if (values[i][SS_COLS.CALENDAR_ID.no]) {
      var event = calendar.getEventById(values[i][SS_COLS.CALENDAR_ID.no]);
      event.setTime(startDateTime, endDateTime);
      event.setTitle(title);
      continue;
    }

    var event = calendar.createEvent(title, startDateTime, endDateTime);
    sheet.getRange(i + 1, SS_COLS.CALENDAR_ID.colNo).setValue(event.getId());
  }
}

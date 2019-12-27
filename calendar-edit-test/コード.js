// デフォルトカレンダー取得
var calendar = CalendarApp.getDefaultCalendar();
var calendarId = calendar.getId();
  
var sheet = SpreadsheetApp.getActiveSpreadsheet();
var values = sheet.getDataRange().getValues();

/**
 * スプレッドシートの予定をカレンダーへ登録する関数
 */
function myFunction() {

  for (var row in values) {
    // 1行目はヘッダーなのでスキップ
    if (Number(row) === 0) {
      continue;
    }
    
    // 予定日
    var date = values[row][0];
    
    // 開始時間
    var startTime = values[row][1];
    var startDateTime = new Date(date.getFullYear(),
                                 date.getMonth(),
                                 date.getDate(), 
                                 startTime.getHours(),
                                 startTime.getMinutes(), 0);
    // 終了時間
    var endTime = values[row][2];
    var endDateTime = new Date(date.getFullYear(),
                               date.getMonth(),
                               date.getDate(),
                               endTime.getHours(),
                               endTime.getMinutes(), 0);
    // タイトル
    var title = values[row][3];
    
    // イベントID
    var eventIdRange = sheet.getRange('E' + (Number(row) + 1));
    var eventId = eventIdRange.getValue();
    
    if (!eventId) {
      var event = calendar.createEvent(title, startDateTime, endDateTime);
      eventIdRange.setValue(event.getId());
      initialSync(calendar.getId());
    }
  }
}
  
/**
 * カレンダーへイベント登録時、
 * カレンダーとスクリプトプロパティを同期化する関数
 */
function initialSync() {
  var items = Calendar.Events.list(calendarId);
  var nextSyncToken = items.nextSyncToken;
  Logger.log(nextSyncToken);
  var properties = PropertiesService.getScriptProperties();
  properties.setProperty("syncToken", nextSyncToken);
}

/**
 * トリガーに設定する関数
 * カレンダー編集時に実行される
 */
function onCalendarEdit() {
  var properties = PropertiesService.getScriptProperties();
  var nextSyncToken = properties.getProperty("syncToken");
  var optionalArgs = {
    syncToken: nextSyncToken
  };
  var events = Calendar.Events.list(calendarId, optionalArgs);
  Logger.log(events);
  
  var items = events.items;
  
  for (var i = 0; i < items.length; i++) {
    var iCalUID = items[i].iCalUID;
    for(var row in values) {
      var eventId = values[row][4];
      if (eventId !== iCalUID) {
        continue;
      }

      var sdate = Utilities.formatDate(new Date(items[i].start.dateTime), "Asia/Tokyo", "yyyy/MM/dd");
      var stime = Utilities.formatDate(new Date(items[i].start.dateTime), "Asia/Tokyo", "HH:mm");
      var etime = Utilities.formatDate(new Date(items[i].end.dateTime), "Asia/Tokyo", "HH:mm");
      // スプレッドシートの内容を更新
      sheet.getRange('A' + (Number(row) + 1)).setValue(sdate);
      sheet.getRange('B' + (Number(row) + 1)).setValue(stime);
      sheet.getRange('C' + (Number(row) + 1)).setValue(etime);
      sheet.getRange('D' + (Number(row) + 1)).setValue(items[i].summary);  
    } 
  }
  var nextSyncToken = events["nextSyncToken"];
  properties.setProperty("syncToken", nextSyncToken);
}




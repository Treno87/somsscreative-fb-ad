// ===== 설정값 =====
const SHEET_ID = '1dfqG5ImZfir8Qe8YkxQqB-q6ZIHJ6FpRzkE7VrxR9E0';
const SHEET_NAME = '리드DB';
const FOLLOW_UP_DAYS = 3;

// 1. 메인 실행 함수
function checkGmailAndNotifySlack() {
  var query = 'from:somsscreative1@gmail.com "소옴크리에이티브" "새 응답이 접수되었습니다." newer_than:1h';
  var threads = GmailApp.search(query, 0, 10);

  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    for (var j = 0; j < messages.length; j++) {
      var message = messages[j];

      // 데이터 파싱 및 Slack 전송
      var data = parseImwebEmail(message);
      sendToSlack(data);
      saveToSheet(data); // ← 추가: 구글시트 저장

      // 읽음 처리
      GmailApp.markMessageRead(message);
    }
  }
}

// 2. 이메일 데이터 파싱 함수
function parseImwebEmail(message) {
  var plainBody = message.getPlainBody().replace(/\r/g, '');
  var subject = message.getSubject();

  var regTimeMatch = plainBody.match(/등록시각[\s]*(\d{4}-\d{2}-\d{2}\s*\d{2}:\d{2})/);
  var regTime = regTimeMatch ? regTimeMatch[1].split(/\s/)[0] : '알 수 없음';

  var rawPhone = plainBody.match(/핸드폰\s*번호\s*\n+([^\n]+)/)?.[1]?.trim() || '';

  return {
    subject: subject,
    regTime: regTime,
    formPosition: subject.match(/\]\s*(.+?)에\s*새 응답/)?.[1]?.trim() || 'Home',
    name:   plainBody.match(/이\s*름\s*\n+([^\n]+)/)?.[1]?.trim() || '이름없음',
    phone:  formatPhone(rawPhone),
    email:  plainBody.match(/E-mail\s*\n+([^\n]+)/)?.[1]?.trim() || '이메일없음',
    career: plainBody.match(/미용경력\s*\n+([^\n]+)/)?.[1]?.trim() || '없음',
    course: plainBody.match(/과정명\s*\n+([^\n]+)/)?.[1]?.trim() || '없음'
  };
}

function formatPhone(raw) {
  var digits = raw.replace(/\D/g, '');
  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  if (digits.length === 10) {
    return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  return raw || '번호없음';
}

// 3. Slack 전송 함수
function sendToSlack(data) {
  var webhookUrl = PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK_URL');

  var payload = {
    "blocks": [
      {"type": "header", "text": {"type": "plain_text", "text": '🔔 ' + data.subject}},
      {"type": "section", "text": {"type": "mrkdwn", "text":
        '<@U09SFM79D0Q>\n' +
        '*📅 등록시각:* ' + data.regTime + '\n' +
        '*📍 폼위치:* ' + data.formPosition + '\n' +
        '*👤 이름:* ' + data.name + '\n' +
        '*📞 전화번호:* ' + data.phone + '\n' +
        '*✉️ 이메일:* ' + data.email + '\n' +
        '*💼 미용경력:* ' + data.career + '\n' +
        '*📚 관심과정:* ' + data.course
      }},
      {"type": "actions", "elements": [{
        "type": "button", "text": {"type": "plain_text", "text": "Gmail 열기"},
        "url": 'https://mail.google.com/mail/u/0/#search/' + encodeURIComponent(data.subject)
      }]}
    ]
  };

  UrlFetchApp.fetch(webhookUrl, {
    'method': 'POST',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  });
}

// ===== 추가 1: 구글시트 저장 =====
// 시트 헤더 (A1부터): 등록시각 | 이름 | 전화번호 | 이메일 | 미용경력 | 관심과정 | 폼위치 | 상태
function saveToSheet(data) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log('시트를 찾을 수 없음: ' + SHEET_NAME);
    return;
  }

  var existingData = sheet.getDataRange().getValues();
  var today = new Date().toLocaleDateString('ko-KR');
  var isDuplicate = existingData.some(function(row) {
    return row[2] === data.phone && String(row[0]).startsWith(today);
  });
  if (isDuplicate) {
    Logger.log('중복 스킵: ' + data.name + ' (' + data.phone + ')');
    return;
  }

  sheet.appendRow([
    data.regTime,
    data.name,
    data.phone,
    data.email,
    data.career,
    data.course,
    data.formPosition,
    '리드'
  ]);

  Logger.log('시트 저장 완료: ' + data.name);
}

// ===== 추가 2: 사후관리 알림 (트리거: 매주 월요일 오전 9시) =====
function sendFollowUpAlert() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return;

  var rows = sheet.getDataRange().getValues();
  var now = new Date();

  var leads = rows.slice(1).filter(function(row) {
    var daysPassed = (now - new Date(row[0])) / (1000 * 60 * 60 * 24);
    return row[7] === '리드' && daysPassed >= FOLLOW_UP_DAYS;
  });

  if (leads.length === 0) {
    Logger.log('사후관리 대상 없음');
    return;
  }

  var lines = leads.map(function(row) {
    var daysPassed = Math.floor((now - new Date(row[0])) / (1000 * 60 * 60 * 24));
    return '• ' + row[1] + ' | ' + row[2] + ' | ' + row[5] + ' | ' + daysPassed + '일 경과';
  }).join('\n');

  var webhookUrl = PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK_URL');
  UrlFetchApp.fetch(webhookUrl, {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify({
      text: '*사후관리 알림 - 미등록 리드 ' + leads.length + '명*\n' +
            '_(등록 후 ' + FOLLOW_UP_DAYS + '일 경과, 상태: 리드)_\n\n' +
            lines + '\n\n' +
            'https://docs.google.com/spreadsheets/d/' + SHEET_ID
    })
  });

  Logger.log('사후관리 알림 전송: ' + leads.length + '명');
}

// ===== 테스트 함수 =====
function testSaveToSheet() {
  saveToSheet({
    regTime: '2026-03-20',
    name: '테스트',
    phone: '010-0000-0000',
    email: 'test@test.com',
    career: '3년',
    course: '클래식',
    formPosition: '히어로'
  });
}

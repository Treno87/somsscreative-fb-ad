# 디자인 방향(Design Direction) 플레이그라운드 빌더 — imweb.html을 인라인으로 감싸고,
# 브라우저에서 "디자인 자체"(타이포·모서리·여백·장식·보더·그림자)를 통째로 바꿔보는 하네스를 생성한다(비정본).
#
# ⚠️ 기존 버전은 CSS 변수(색)만 갈아끼워서 "색만 바뀌고 디자인은 그대로"였다.
#    이 버전은 .pd.dir-X .sec / .btn / .shot / 카드 표면까지 실제 CSS 규칙을 오버라이드하는
#    "디자인 방향 프리셋"을 주입한다. → 레이아웃 느낌·타이포·밀도·장식이 실제로 달라진다.
#    Accent(색) 팔레트는 방향과 독립된 축으로 그대로 둔다(방향 × 색 조합 가능).
#
# 정본(imweb.html)은 절대 건드리지 않는다.
# 재생성: python3 courses/persona-design/build-tokens-playground.py
from pathlib import Path
base = Path("courses/persona-design")
imweb = (base / "imweb.html").read_text(encoding="utf-8")
out = base / "landing" / "imweb-tokens-playground.html"

# ── 디자인 방향 프리셋 ────────────────────────────────────────────────
# 각 방향은 .pd.dir-{key} 스코프 안에서 변수 + 실제 규칙을 오버라이드한다.
# 셀렉터를 .pd.dir-X 복합으로 써서 정본 .pd 베이스 규칙보다 특이도를 높인다(미디어쿼리 포함).
DIRECTIONS = [
    ("signature", "Signature",  "현재 정본 — 라운드 카드 · 알약 CTA · violet orb · Pretendard+Cormorant", ""),

    ("editorial", "Editorial", "샤프(라디우스 0) · 대형 세리프 헤드라인 · 넓은 여백 · orb 제거 · hairline only", """
    .pd.dir-editorial { --r-input:0; --r-chip:0; --r-card:0; --r-sheet:0; --r-pill:3px; --container:1080px; --w-head:600; }
    .pd.dir-editorial .display, .pd.dir-editorial .h2-display, .pd.dir-editorial .h3-block {
      font-family:"Cormorant Garamond","Pretendard Variable",serif; font-weight:600; letter-spacing:-0.02em; }
    .pd.dir-editorial .display { font-size:clamp(40px,7.4vw,82px); line-height:1.04; }
    .pd.dir-editorial .h2-display { font-size:clamp(30px,5vw,52px); line-height:1.1; }
    .pd.dir-editorial .eyebrow { letter-spacing:0.36em; font-size:11px; font-weight:600; margin-bottom:24px; }
    .pd.dir-editorial .lead { font-size:clamp(17px,1.7vw,20px); line-height:1.85; }
    .pd.dir-editorial .sec { padding:120px 0; }
    @media (min-width:768px){ .pd.dir-editorial .sec { padding:172px 0; } }
    .pd.dir-editorial .sec--orb-tr::before, .pd.dir-editorial .sec--orb-bl::before,
    .pd.dir-editorial .sec--orb-tl::before, .pd.dir-editorial .sec--orb-br::before { display:none; }
    .pd.dir-editorial .shot, .pd.dir-editorial .matrix, .pd.dir-editorial .countdown,
    .pd.dir-editorial .framework-card, .pd.dir-editorial .callout {
      box-shadow:none; border:1px solid var(--c-line); }
    .pd.dir-editorial .btn { border-radius:3px; box-shadow:none; }
    .pd.dir-editorial .btn--primary:hover { box-shadow:none; }
    .pd.dir-editorial .hero__pill { border-radius:0; }
    """),

    ("soft", "Soft", "큰 라운드(22px) · 소프트 드롭섀도우 · 부드러운 표면 · 알약 CTA 강조", """
    .pd.dir-soft { --r-input:12px; --r-chip:14px; --r-card:22px; --r-sheet:28px; --r-pill:30px; }
    .pd.dir-soft .shot, .pd.dir-soft .matrix, .pd.dir-soft .countdown,
    .pd.dir-soft .framework-card, .pd.dir-soft .callout {
      border-radius:var(--r-card); box-shadow:0 26px 60px -34px rgba(0,0,0,0.72); border:1px solid var(--c-line-soft); }
    .pd.dir-soft .sec--light .shot, .pd.dir-soft .sec--tint .shot {
      box-shadow:0 22px 50px -32px rgba(10,10,14,0.30); }
    .pd.dir-soft .btn { box-shadow:0 10px 26px -10px rgba(0,0,0,0.5); }
    .pd.dir-soft .btn--primary { box-shadow:0 14px 30px rgba(123,62,237,0.40); }
    .pd.dir-soft .display { font-weight:700; letter-spacing:-0.02em; }
    .pd.dir-soft .sec--orb-tr::before, .pd.dir-soft .sec--orb-bl::before { opacity:0.85; filter:blur(8px); }
    """),

    ("brutal", "Brutal", "각진 0 라디우스 · 2px 헤비 보더 · 그로테스크/모노 라벨 · 그림자 제거 · 타이트 그리드", """
    .pd.dir-brutal { --r-input:0; --r-chip:0; --r-card:0; --r-sheet:0; --r-pill:0; --w-head:800; --w-label:700; --container:1140px; }
    .pd.dir-brutal .display, .pd.dir-brutal .h2-display, .pd.dir-brutal .h3-block {
      font-family:"Space Grotesk","Archivo","Pretendard Variable",sans-serif; font-weight:800; letter-spacing:-0.03em; }
    .pd.dir-brutal .display { font-size:clamp(34px,6.4vw,66px); line-height:1.02; }
    .pd.dir-brutal .eyebrow, .pd.dir-brutal .matrix__lbl, .pd.dir-brutal .shot__ph {
      font-family:ui-monospace,"SF Mono","Roboto Mono",monospace; letter-spacing:0.14em; text-transform:uppercase; }
    .pd.dir-brutal .shot, .pd.dir-brutal .matrix, .pd.dir-brutal .countdown,
    .pd.dir-brutal .framework-card, .pd.dir-brutal .callout {
      box-shadow:none; border:2px solid var(--c-ink); background:var(--c-paper-2); }
    .pd.dir-brutal .sec--light .shot, .pd.dir-brutal .sec--tint .shot { border-color:var(--c-ink-dark); }
    .pd.dir-brutal .btn { border-radius:0; box-shadow:none; border:2px solid var(--c-ink); }
    .pd.dir-brutal .btn--primary { background:var(--c-accent); border-color:var(--c-accent); }
    .pd.dir-brutal .btn--primary:hover { box-shadow:none; transform:none; background:var(--c-accent-deep); }
    .pd.dir-brutal .btn--ghost-dark:hover { transform:none; }
    .pd.dir-brutal .pain, .pd.dir-brutal .testi, .pd.dir-brutal .curri-row, .pd.dir-brutal .faq-item { border-top-width:2px; }
    .pd.dir-brutal .pain:last-of-type, .pd.dir-brutal .testi:last-of-type { border-bottom-width:2px; }
    .pd.dir-brutal .hero__pill { border-radius:0; border:2px solid var(--c-line); }
    .pd.dir-brutal .sec--orb-tr::before, .pd.dir-brutal .sec--orb-bl::before,
    .pd.dir-brutal .sec--orb-tl::before, .pd.dir-brutal .sec--orb-br::before { display:none; }
    .pd.dir-brutal .sec { padding:72px 0; }
    @media (min-width:768px){ .pd.dir-brutal .sec { padding:96px 0; } }
    """),

    ("couture", "Couture", "럭스 세리프 전면 · 초대형 타이포 · 극대 여백 · 뮤트 톤 · 아웃라인 CTA", """
    .pd.dir-couture { --r-input:0; --r-chip:0; --r-card:2px; --r-sheet:2px; --r-pill:0; --container:1020px; --w-head:500; }
    .pd.dir-couture .display, .pd.dir-couture .h2-display, .pd.dir-couture .h3-block {
      font-family:"Playfair Display","Cormorant Garamond",serif; font-weight:500; letter-spacing:-0.01em; }
    .pd.dir-couture .display { font-size:clamp(44px,8vw,90px); line-height:1.06; }
    .pd.dir-couture .h2-display { font-size:clamp(32px,5.4vw,58px); line-height:1.12; }
    .pd.dir-couture .eyebrow { letter-spacing:0.42em; font-size:10px; color:var(--c-ink-3); margin-bottom:28px; }
    .pd.dir-couture .lead { font-size:clamp(17px,1.7vw,21px); line-height:1.9; color:var(--c-ink-2); }
    .pd.dir-couture .sec { padding:128px 0; }
    @media (min-width:768px){ .pd.dir-couture .sec { padding:200px 0; } }
    .pd.dir-couture .sec--orb-tr::before, .pd.dir-couture .sec--orb-bl::before,
    .pd.dir-couture .sec--orb-tl::before, .pd.dir-couture .sec--orb-br::before { display:none; }
    .pd.dir-couture .shot, .pd.dir-couture .matrix, .pd.dir-couture .countdown,
    .pd.dir-couture .framework-card, .pd.dir-couture .callout {
      box-shadow:none; border:1px solid var(--c-line); background:transparent; }
    .pd.dir-couture .btn { border-radius:0; box-shadow:none; letter-spacing:0.04em; }
    .pd.dir-couture .btn--primary { background:transparent; color:var(--c-accent-2); border:1px solid var(--c-accent); }
    .pd.dir-couture .btn--primary:hover { background:var(--c-accent); color:#fff; box-shadow:none; }
    .pd.dir-couture .hero__pill { border-radius:0; }
    """),
]

DIR_KEYS = [d[0] for d in DIRECTIONS]
DIR_CSS = "\n".join(d[3] for d in DIRECTIONS if d[3].strip())
DIR_BTNS = "\n      ".join(
    '<button data-dir="{k}"{on}>{label}</button>'.format(
        k=k, label=label, on=' class="on"' if k == "signature" else "")
    for (k, label, desc, _css) in DIRECTIONS
)
# 방향 설명(선택 시 패널 하단에 표시)
DIR_DESC_JS = ",".join('"{}":"{}"'.format(k, desc.replace('"', '\\"')) for (k, label, desc, _c) in DIRECTIONS)

doc = """<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>페르소나 디자인 — 디자인 방향 플레이그라운드 (비정본)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Space+Grotesk:wght@500;700&family=Archivo:wght@600;800&family=Cormorant+Garamond:wght@500;600;700&display=swap" rel="stylesheet" />
  <style>
    html, body { margin: 0; padding: 0; background: #050608; }
    .imweb-wrap { max-width: 1240px; margin: 0 auto; background: #0a0a0e; }

    /* ── 디자인 방향 프리셋 (정본 .pd 베이스보다 특이도 높음) ── */
__DIR_CSS__

    /* accent(색) 프리셋: 방향과 독립된 축. .pd에 클래스가 붙으면 accent 토큰군을 덮어쓴다 */
    .pd.tk-violet { --c-accent:#7b3eed; --c-accent-2:#a575ff; --c-accent-deep:#5a23c0; --c-accent-soft:rgba(123,62,237,.14); --c-accent-line:rgba(123,62,237,.30); --c-accent-glow:rgba(123,62,237,.55); --c-magenta:#d946ef; }
    .pd.tk-lime   { --c-accent:#c6f24e; --c-accent-2:#e3ff8a; --c-accent-deep:#9bcc2e; --c-accent-soft:rgba(198,242,78,.14); --c-accent-line:rgba(198,242,78,.32); --c-accent-glow:rgba(198,242,78,.50); --c-magenta:#00B8FF; }
    .pd.tk-amber  { --c-accent:#f5b840; --c-accent-2:#ffd27a; --c-accent-deep:#d2901c; --c-accent-soft:rgba(245,184,64,.14); --c-accent-line:rgba(245,184,64,.32); --c-accent-glow:rgba(245,184,64,.50); --c-magenta:#ff7a59; }
    .pd.tk-blue   { --c-accent:#3b82f6; --c-accent-2:#85acff; --c-accent-deep:#1d5fd6; --c-accent-soft:rgba(59,130,246,.16); --c-accent-line:rgba(59,130,246,.34); --c-accent-glow:rgba(59,130,246,.55); --c-magenta:#22d3ee; }
    .pd.tk-rose   { --c-accent:#f43f7a; --c-accent-2:#ff85ab; --c-accent-deep:#c41d57; --c-accent-soft:rgba(244,63,122,.15); --c-accent-line:rgba(244,63,122,.32); --c-accent-glow:rgba(244,63,122,.52); --c-magenta:#fb7185; }

    /* 배경(paper) 프리셋 */
    .pd.bg-ink     { --c-paper:#0a0a0e; --c-paper-2:#15181e; --c-paper-3:#1f232b; }
    .pd.bg-navy    { --c-paper:#0a0e1a; --c-paper-2:#141a2b; --c-paper-3:#1f2638; }
    .pd.bg-char    { --c-paper:#141414; --c-paper-2:#1e1e1e; --c-paper-3:#2a2a2a; }
    .pd.bg-bone    { --c-paper:#f4f1ea; --c-paper-2:#fffdf8; --c-paper-3:#ece7dc; --c-ink:#1a1714; --c-ink-2:rgba(26,23,20,.78); --c-ink-3:rgba(26,23,20,.55); --c-ink-muted:rgba(26,23,20,.4); --c-line:rgba(26,23,20,.12); --c-line-soft:rgba(26,23,20,.06); }

    /* 토글 패널 (정본 스타일과 무관, 고정) */
    .tk-panel { position: fixed; top: 12px; right: 12px; z-index: 99999;
      background: rgba(10,10,14,.94); backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,.15); border-radius: 10px; padding: 14px;
      font-family: -apple-system, system-ui, "Noto Sans KR", sans-serif; color: #fff;
      box-shadow: 0 12px 34px rgba(0,0,0,.55); width: min(280px, 92vw);
      max-height: calc(100vh - 24px); overflow: auto; }
    .tk-panel h4 { margin: 0 0 8px; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: rgba(255,255,255,.55); font-weight: 700; }
    .tk-panel h4:not(:first-child) { margin-top: 16px; }
    .tk-row { display: flex; flex-wrap: wrap; gap: 6px; }
    .tk-row button { font-size: 12px; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,.22); background: transparent; color: #fff; cursor: pointer; font-family: inherit; transition: all .12s; }
    .tk-row button:hover { border-color: rgba(255,255,255,.5); }
    .tk-row button.on { background: #fff; color: #111; border-color: #fff; font-weight: 700; }
    .tk-row--dir button { flex: 1 1 calc(50% - 3px); }
    .tk-dirdesc { margin-top: 8px; font-size: 11px; line-height: 1.5; color: rgba(255,255,255,.6); min-height: 32px; }
    .tk-pick { display: flex; align-items: center; gap: 8px; font-size: 12px; color: rgba(255,255,255,.8); margin-top: 12px; }
    .tk-pick input { width: 40px; height: 26px; border: none; background: none; cursor: pointer; padding: 0; }
    .tk-panel textarea { width: 100%; box-sizing: border-box; margin-top: 4px;
      background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.2); border-radius: 6px;
      color: #fff; font-family: ui-monospace, Menlo, monospace; font-size: 11px; line-height: 1.5; padding: 8px; resize: vertical; }
    .tk-apply { margin-top: 8px; width: 100%; font-size: 12px; padding: 8px; border-radius: 6px; border: none; background: #fff; color: #111; font-weight: 700; cursor: pointer; font-family: inherit; }
    .tk-reset { margin-top: 8px; width: 100%; font-size: 11px; padding: 7px; border-radius: 6px; border: 1px solid rgba(255,255,255,.2); background: transparent; color: rgba(255,255,255,.75); cursor: pointer; font-family: inherit; }
    .tk-note { margin-top: 12px; font-size: 10px; color: rgba(255,255,255,.42); line-height: 1.55; }
    .tk-note code { color: rgba(255,255,255,.7); }
  </style>
</head>
<body>
  <div class="tk-panel">
    <h4>① 디자인 방향 <span style="color:rgba(255,255,255,.35);font-weight:400;text-transform:none;letter-spacing:0">(타이포·여백·장식 통째로)</span></h4>
    <div class="tk-row tk-row--dir" id="tkDir">
      __DIR_BTNS__
    </div>
    <p class="tk-dirdesc" id="tkDirDesc"></p>

    <h4>② Accent 팔레트 (색 — 방향과 독립)</h4>
    <div class="tk-row" id="tkAccent">
      <button data-tk="violet" class="on">Violet</button>
      <button data-tk="lime">Lime·Cyan</button>
      <button data-tk="amber">Amber</button>
      <button data-tk="blue">Blue</button>
      <button data-tk="rose">Rose</button>
    </div>
    <label class="tk-pick">커스텀 액센트 색 <input type="color" id="tkPicker" value="#7b3eed" /></label>

    <h4>③ 배경(Paper)</h4>
    <div class="tk-row" id="tkBg">
      <button data-bg="ink" class="on">Ink</button>
      <button data-bg="navy">Navy</button>
      <button data-bg="char">Charcoal</button>
      <button data-bg="bone">Bone(라이트)</button>
    </div>

    <h4>④ 토큰 직접 입력</h4>
    <textarea id="tkCustom" rows="5" spellcheck="false" placeholder="--c-accent: #ff3366;
--r-card: 18px;
--container: 1040px;"></textarea>
    <button class="tk-apply" id="tkApply">적용</button>

    <button class="tk-reset" id="tkReset">전체 초기화 (Signature 정본)</button>
    <p class="tk-note">비정본 테스트용. <b>방향</b>은 타이포·모서리·여백·장식·보더를 통째로 바꾸고, <b>Accent/배경</b>은 색만 바꾼다(조합 가능). 마음에 드는 조합을 정본에 반영하려면 알려주세요.</p>
  </div>

  <div class="imweb-wrap">__IMWEB__</div>

  <script>
    (function(){
      var pd = document.querySelector('.pd');
      var DIRS = __DIR_KEYS__;
      var DESC = {__DIR_DESC__};
      var ACC = ['tk-violet','tk-lime','tk-amber','tk-blue','tk-rose'];
      var BG  = ['bg-ink','bg-navy','bg-char','bg-bone'];
      pd.classList.add('tk-violet', 'bg-ink');  // signature = 방향 클래스 없음
      var accVars = ['--c-accent','--c-accent-2','--c-accent-deep','--c-accent-soft','--c-accent-line','--c-accent-glow'];
      function clearInlineAcc(){ accVars.forEach(function(p){ pd.style.removeProperty(p); }); }
      function rgb(h){ h=h.replace('#',''); return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; }
      function mix(h,t,a){ var c=rgb(h); return 'rgb('+Math.round(c[0]+(t-c[0])*a)+','+Math.round(c[1]+(t-c[1])*a)+','+Math.round(c[2]+(t-c[2])*a)+')'; }
      function rgba(h,a){ var c=rgb(h); return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')'; }

      // ① 디자인 방향
      function setDirDesc(k){ document.getElementById('tkDirDesc').textContent = DESC[k] || ''; }
      document.querySelectorAll('#tkDir button').forEach(function(b){
        b.addEventListener('click', function(){
          DIRS.forEach(function(k){ pd.classList.remove('dir-'+k); });
          if (b.dataset.dir !== 'signature') pd.classList.add('dir-'+b.dataset.dir);
          document.querySelectorAll('#tkDir button').forEach(function(x){ x.classList.toggle('on', x===b); });
          setDirDesc(b.dataset.dir);
          window.scrollTo({top:0});
        });
      });
      setDirDesc('signature');

      // ② accent 프리셋
      document.querySelectorAll('#tkAccent button').forEach(function(b){
        b.addEventListener('click', function(){
          clearInlineAcc();
          ACC.forEach(function(c){ pd.classList.remove(c); });
          pd.classList.add('tk-'+b.dataset.tk);
          document.querySelectorAll('#tkAccent button').forEach(function(x){ x.classList.toggle('on', x===b); });
        });
      });
      // 커스텀 액센트 색 (명암 변형 자동 생성)
      document.getElementById('tkPicker').addEventListener('input', function(){
        ACC.forEach(function(c){ pd.classList.remove(c); });
        document.querySelectorAll('#tkAccent button').forEach(function(x){ x.classList.remove('on'); });
        var h = this.value;
        pd.style.setProperty('--c-accent', h);
        pd.style.setProperty('--c-accent-2', mix(h,255,0.35));
        pd.style.setProperty('--c-accent-deep', mix(h,0,0.25));
        pd.style.setProperty('--c-accent-soft', rgba(h,0.14));
        pd.style.setProperty('--c-accent-line', rgba(h,0.32));
        pd.style.setProperty('--c-accent-glow', rgba(h,0.55));
      });
      // ③ 배경 프리셋
      document.querySelectorAll('#tkBg button').forEach(function(b){
        b.addEventListener('click', function(){
          BG.forEach(function(c){ pd.classList.remove(c); });
          pd.classList.add('bg-'+b.dataset.bg);
          document.querySelectorAll('#tkBg button').forEach(function(x){ x.classList.toggle('on', x===b); });
        });
      });
      // ④ 토큰 직접 입력 — "--prop: value;" 들을 파싱해 .pd에 적용
      document.getElementById('tkApply').addEventListener('click', function(){
        var txt = document.getElementById('tkCustom').value;
        var n = 0;
        txt.split(';').forEach(function(decl){
          var i = decl.indexOf(':'); if (i < 0) return;
          var prop = decl.slice(0, i).trim();
          var val = decl.slice(i + 1).trim();
          if (prop.indexOf('--') === 0 && val) { pd.style.setProperty(prop, val); n++; }
        });
        this.textContent = n ? ('적용됨 (' + n + '개)') : '유효한 --토큰 없음';
        var self = this; setTimeout(function(){ self.textContent = '적용'; }, 1400);
      });
      // 전체 초기화 → Signature 정본
      document.getElementById('tkReset').addEventListener('click', function(){
        pd.style.cssText = '';
        DIRS.forEach(function(k){ pd.classList.remove('dir-'+k); });
        ACC.concat(BG).forEach(function(c){ pd.classList.remove(c); });
        pd.classList.add('tk-violet','bg-ink');
        document.querySelectorAll('#tkDir button').forEach(function(x){ x.classList.toggle('on', x.dataset.dir==='signature'); });
        document.querySelectorAll('#tkAccent button').forEach(function(x){ x.classList.toggle('on', x.dataset.tk==='violet'); });
        document.querySelectorAll('#tkBg button').forEach(function(x){ x.classList.toggle('on', x.dataset.bg==='ink'); });
        document.getElementById('tkPicker').value = '#7b3eed';
        setDirDesc('signature');
        document.getElementById('tkCustom').value = '';
      });
    })();
  </script>
</body>
</html>
"""
doc = (doc
       .replace("__DIR_CSS__", DIR_CSS)
       .replace("__DIR_BTNS__", DIR_BTNS)
       .replace("__DIR_KEYS__", str(DIR_KEYS).replace("'", '"'))
       .replace("__DIR_DESC__", DIR_DESC_JS)
       .replace("__IMWEB__", imweb))
out.write_text(doc, encoding="utf-8")
print(f"wrote {out} ({len(doc)} bytes) — {len(DIRECTIONS)} directions, {len(DIR_CSS)} bytes of override CSS")

from pathlib import Path
base = Path("courses/persona-design")
imweb = (base / "imweb.html").read_text(encoding="utf-8")
preview = base / "imweb-preview.html"
doc = """<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>페르소나 디자인 — 얼굴파츠분석 과정 1기 · 미리보기 (비정본)</title>
  <style>
    html, body { margin: 0; padding: 0; }
    body { background: #f1eee5; min-height: 100vh; }
    .imweb-wrap { max-width: 1240px; margin: 0 auto; background: #fff; box-shadow: 0 8px 40px rgba(0,0,0,0.06); }
    .preview-banner {
      max-width: 1240px; margin: 0 auto; padding: 10px 16px;
      background: #2f3e8c; color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, system-ui, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
      font-size: 12px; letter-spacing: 0.06em; text-align: center;
    }
    .preview-banner strong { letter-spacing: 0.16em; text-transform: uppercase; }
    .preview-banner code { background: rgba(255,255,255,0.18); padding: 2px 6px; border-radius: 3px; font-size: 11px; }
  </style>
</head>
<body>
  <div class="preview-banner">
    <strong>PREVIEW · 비정본 · 인라인 빌드</strong> &nbsp;|&nbsp; 정본: <code>courses/persona-design/imweb.html</code> · NOBASE DNA hybrid 적용 (12px card · 30px pill · period accent · framework SVG art · consult dark inversion)
  </div>
  <div class="imweb-wrap">__IMWEB__</div>
</body>
</html>
"""
doc = doc.replace("__IMWEB__", imweb)
preview.write_text(doc, encoding="utf-8")
print(f"wrote {preview} ({len(doc)} bytes)")

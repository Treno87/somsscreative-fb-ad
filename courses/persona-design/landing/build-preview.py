from pathlib import Path
base = Path("courses/persona-design")
imweb = (base / "imweb.html").read_text(encoding="utf-8")
preview = base / "landing" / "imweb-preview.html"
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
  </style>
</head>
<body>
  <div class="imweb-wrap">__IMWEB__</div>
</body>
</html>
"""
doc = doc.replace("__IMWEB__", imweb)
preview.write_text(doc, encoding="utf-8")
print(f"wrote {preview} ({len(doc)} bytes)")

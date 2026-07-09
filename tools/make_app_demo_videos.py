from __future__ import annotations

from functools import lru_cache
from pathlib import Path
import math

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
OUT_DIR = ROOT / "deliverables"
OUT_DIR.mkdir(exist_ok=True)

W, H = 1920, 1080
FPS = 24
USER_DURATION = 24.0
ADMIN_DURATION = 25.0

BRAND = (103, 83, 248)
BRAND_DEEP = (79, 59, 217)
BRAND_SOFT = (247, 245, 255)
BRAND_PALE = (234, 239, 255)
INK = (17, 18, 28)
MUTED = (93, 94, 112)
FAINT = (148, 150, 166)
WHITE = (255, 255, 255)
GREEN = (23, 178, 106)
RED = (239, 78, 93)

PHONE_W, PHONE_H = 1179, 2556

FONT_DIR = ASSETS / "fonts"
FONT_FILES = {
    "regular": FONT_DIR / "Pretendard-Regular.otf",
    "medium": FONT_DIR / "Pretendard-Medium.otf",
    "semibold": FONT_DIR / "Pretendard-SemiBold.otf",
    "bold": FONT_DIR / "Pretendard-Bold.otf",
    "extrabold": FONT_DIR / "Pretendard-ExtraBold.otf",
}
FALLBACK_FONT = Path("/System/Library/Fonts/AppleSDGothicNeo.ttc")


@lru_cache(maxsize=None)
def font(size: int, weight: str = "regular") -> ImageFont.FreeTypeFont:
    path = FONT_FILES.get(weight, FONT_FILES["regular"])
    if not path.exists():
        path = FALLBACK_FONT
    return ImageFont.truetype(str(path), size=size)


def ease(x: float) -> float:
    x = max(0.0, min(1.0, x))
    return 1 - (1 - x) ** 3


def ease_in_out(x: float) -> float:
    x = max(0.0, min(1.0, x))
    return x * x * (3 - 2 * x)


def lerp(a: float, b: float, x: float) -> float:
    return a + (b - a) * x


def rgba(c: tuple[int, int, int], a: int) -> tuple[int, int, int, int]:
    return (*c, a)


def linear_gradient(width: int, height: int, top: tuple[int, int, int], bottom: tuple[int, int, int]) -> Image.Image:
    top_arr = np.array(top, dtype=np.float32)
    bottom_arr = np.array(bottom, dtype=np.float32)
    ys = np.linspace(0, 1, height, dtype=np.float32)[:, None, None]
    row = (top_arr * (1 - ys) + bottom_arr * ys).astype(np.uint8)
    arr = np.repeat(row, width, axis=1)
    return Image.fromarray(arr, "RGB").convert("RGBA")


def text(
    img: Image.Image,
    xy: tuple[int, int],
    value: str,
    size: int,
    fill=INK,
    weight: str = "semibold",
    anchor: str | None = None,
    spacing: int = 6,
) -> None:
    ImageDraw.Draw(img).multiline_text(xy, value, font=font(size, weight), fill=fill, anchor=anchor, spacing=spacing)


def text_bbox(value: str, size: int, weight: str = "semibold") -> tuple[int, int, int, int]:
    return ImageDraw.Draw(Image.new("RGBA", (8, 8))).textbbox((0, 0), value, font=font(size, weight))


def wrapped(
    img: Image.Image,
    xy: tuple[int, int],
    value: str,
    size: int,
    max_width: int,
    fill=MUTED,
    weight: str = "regular",
    line_gap: int = 12,
) -> int:
    d = ImageDraw.Draw(img)
    words = value.split()
    lines: list[str] = []
    line = ""
    f = font(size, weight)
    for word in words:
        candidate = word if not line else f"{line} {word}"
        if d.textbbox((0, 0), candidate, font=f)[2] <= max_width:
            line = candidate
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    y = xy[1]
    for line in lines:
        d.text((xy[0], y), line, font=f, fill=fill)
        y += size + line_gap
    return y


def card(img: Image.Image, box, radius: int = 28, fill=WHITE, outline=(229, 231, 238), shadow=True) -> None:
    if shadow:
        shadow_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
        sd = ImageDraw.Draw(shadow_layer)
        sd.rounded_rectangle((box[0], box[1] + 14, box[2], box[3] + 14), radius=radius, fill=(84, 73, 166, 26))
        shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(22))
        img.alpha_composite(shadow_layer)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=2)


def base_bg() -> Image.Image:
    img = linear_gradient(W, H, WHITE, BRAND_SOFT)
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(glow)
    d.ellipse((980, -300, 2200, 780), fill=rgba(BRAND, 34))
    d.ellipse((-280, 640, 760, 1420), fill=rgba((219, 229, 255), 100))
    glow = glow.filter(ImageFilter.GaussianBlur(90))
    return Image.alpha_composite(img, glow)


def ring(img: Image.Image, center: tuple[int, int], outer: int, inner: int, color=BRAND) -> None:
    d = ImageDraw.Draw(img)
    x, y = center
    d.ellipse((x - outer, y - outer, x + outer, y + outer), fill=color)
    d.ellipse((x - inner, y - inner, x + inner, y + inner), fill=WHITE)


def logo_lockup(img: Image.Image, x: int, y: int, app: str) -> None:
    ring(img, (x + 30, y + 34), 23, 10)
    text(img, (x + 72, y - 1), app, 52, INK, "semibold")
    text(img, (x + 74, y + 62), "by Iruvy", 18, MUTED, "semibold")


def phone_mockup(img: Image.Image, screen: Image.Image, x: int, y: int, w: int, opacity: int = 255) -> None:
    ratio = screen.height / screen.width
    h = int(w * ratio)
    bezel = max(13, int(w * 0.04))
    rail = max(6, int(w * 0.018))
    pad = max(34, int(w * 0.1))
    device_w = w + (bezel + rail) * 2
    device_h = h + (bezel + rail) * 2
    radius = int(device_w * 0.14)
    screen_radius = int(w * 0.105)

    phone = Image.new("RGBA", (device_w + pad * 2, device_h + pad * 2), (0, 0, 0, 0))
    shadow = Image.new("RGBA", phone.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    shell = (pad, pad, pad + device_w, pad + device_h)
    sd.rounded_rectangle((shell[0] + 18, shell[1] + 26, shell[2] + 18, shell[3] + 26), radius=radius, fill=(21, 19, 43, 58))
    shadow = shadow.filter(ImageFilter.GaussianBlur(30))
    phone.alpha_composite(shadow)

    d = ImageDraw.Draw(phone)
    left, right, top = shell[0], shell[2], shell[1]
    for by, bh in [(128, 77), (250, 98), (380, 98)]:
        d.rounded_rectangle((left - 7, top + by, left + 3, top + by + bh), radius=5, fill=(184, 182, 197, 245))
    d.rounded_rectangle((right - 3, top + 290, right + 8, top + 425), radius=5, fill=(184, 182, 197, 245))
    d.rounded_rectangle(shell, radius=radius, fill=(204, 202, 214, 255))
    d.rounded_rectangle((shell[0] + 2, shell[1] + 2, shell[2] - 2, shell[3] - 2), radius=radius - 2, outline=(255, 255, 255, 210), width=3)
    d.rounded_rectangle((shell[0] + rail, shell[1] + rail, shell[2] - rail, shell[3] - rail), radius=radius - rail, fill=(9, 10, 17, 255))

    screen_box = (pad + rail + bezel, pad + rail + bezel, pad + rail + bezel + w, pad + rail + bezel + h)
    crop = screen.resize((w, h), Image.Resampling.LANCZOS).convert("RGBA")
    mask = Image.new("L", (w, h), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle((0, 0, w, h), radius=screen_radius, fill=255)
    crop.putalpha(mask)
    phone.alpha_composite(crop, (screen_box[0], screen_box[1]))

    sheen = Image.new("RGBA", phone.size, (0, 0, 0, 0))
    sh = ImageDraw.Draw(sheen)
    sh.rounded_rectangle(screen_box, radius=screen_radius, outline=(255, 255, 255, 74), width=2)
    island_w = int(w * 0.28)
    island_h = max(22, int(w * 0.066))
    island_x = screen_box[0] + (w - island_w) // 2
    island_y = screen_box[1] + max(16, int(w * 0.045))
    sh.rounded_rectangle((island_x, island_y, island_x + island_w, island_y + island_h), radius=island_h // 2, fill=(5, 6, 10, 235))
    phone.alpha_composite(sheen)

    if opacity < 255:
        alpha = phone.getchannel("A").point(lambda p: int(p * opacity / 255))
        phone.putalpha(alpha)
    img.alpha_composite(phone, (x - pad, y - pad))


def status_bar(img: Image.Image, minute: str = "2:11") -> None:
    text(img, (118, 66), minute, 42, INK, "bold")
    d = ImageDraw.Draw(img)
    for i, h in enumerate([15, 23, 31, 39]):
        d.rounded_rectangle((PHONE_W - 270 + i * 18, 84 - h, PHONE_W - 258 + i * 18, 84), radius=4, fill=INK)
    d.arc((PHONE_W - 186, 50, PHONE_W - 116, 108), 218, 322, fill=INK, width=7)
    d.arc((PHONE_W - 172, 64, PHONE_W - 130, 100), 218, 322, fill=INK, width=7)
    d.ellipse((PHONE_W - 153, 83, PHONE_W - 141, 95), fill=INK)
    d.rounded_rectangle((PHONE_W - 96, 52, PHONE_W - 34, 90), radius=10, fill=INK)
    text(img, (PHONE_W - 66, 71), "99", 24, WHITE, "bold", anchor="mm")


def app_gradient() -> Image.Image:
    img = linear_gradient(PHONE_W, PHONE_H, (250, 250, 255), (230, 235, 255))
    glow = Image.new("RGBA", (PHONE_W, PHONE_H), (0, 0, 0, 0))
    d = ImageDraw.Draw(glow)
    d.ellipse((-230, 210, 460, 1050), fill=rgba(BRAND, 42))
    d.ellipse((480, 980, 1370, 2040), fill=rgba((205, 218, 255), 90))
    glow = glow.filter(ImageFilter.GaussianBlur(95))
    return Image.alpha_composite(img, glow)


def pill(img: Image.Image, box, fill=WHITE, outline=(237, 238, 244), radius=32) -> None:
    ImageDraw.Draw(img).rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=2)


def user_list_screen(progress: float) -> Image.Image:
    img = app_gradient()
    status_bar(img)
    d = ImageDraw.Draw(img)
    d.ellipse((PHONE_W - 220, 170, PHONE_W - 65, 325), fill=rgba(WHITE, 230))
    text(img, (PHONE_W - 142, 247), "▮▮▮", 34, INK, "bold", anchor="mm")
    text(img, (PHONE_W // 2, 900), "어디로 갈까요?", 132, INK, "extrabold", anchor="mm")
    text(img, (PHONE_W // 2, 1066), "화면 아무 곳이나 터치하면 시작합니다", 54, MUTED, "bold", anchor="mm")

    if progress > 0.12:
        alpha = int(255 * ease((progress - 0.12) / 0.24))
        bubble = Image.new("RGBA", (PHONE_W, PHONE_H), (0, 0, 0, 0))
        bd = ImageDraw.Draw(bubble)
        bd.rounded_rectangle((100, 1150, PHONE_W - 100, 1315), radius=44, fill=(255, 255, 255, min(238, alpha)), outline=(232, 234, 243, alpha), width=2)
        text(bubble, (158, 1196), "듣고 있습니다", 38, INK + (alpha,), "bold")
        for i in range(8):
            amp = 18 + 18 * math.sin(progress * 16 + i * 0.8)
            x = 790 + i * 24
            bd.rounded_rectangle((x, 1235 - amp, x + 10, 1235 + amp), radius=5, fill=rgba(BRAND, alpha))
        img.alpha_composite(bubble)

    if progress > 0.38:
        p = ease((progress - 0.38) / 0.28)
        y0 = int(1390 - 50 * (1 - p))
        text(img, (PHONE_W // 2, y0), "현재 위치 주변 목적지", 46, INK, "bold", anchor="mm")
        cards = [("상담실 201", "Iruvy Go 기본 체험 공간"), ("안내 데스크", "Iruvy Go 기본 체험 공간")]
        for i, (title, body) in enumerate(cards):
            x = 65 + i * 515
            y = y0 + 70
            pill(img, (x, y, x + 480, y + 210), fill=rgba(WHITE, 244), radius=42)
            text(img, (x + 48, y + 62), title, 44, INK, "extrabold")
            text(img, (x + 48, y + 126), body, 30, MUTED, "bold")
        text(img, (PHONE_W // 2, y0 + 360), "가까운 건물의 게시된 목적지를 먼저 보여줍니다.", 34, MUTED, "bold", anchor="mm")
    return img


def user_route_screen(progress: float) -> Image.Image:
    img = app_gradient()
    status_bar(img)
    d = ImageDraw.Draw(img)
    text(img, (72, 178), "상담실 201", 70, INK, "extrabold")
    text(img, (76, 264), "목적지까지 42m", 36, MUTED, "bold")
    card(img, (64, 345, PHONE_W - 64, 1325), radius=46, fill=rgba(WHITE, 235), outline=(232, 234, 244), shadow=False)
    for gx in range(132, PHONE_W - 70, 135):
        d.line((gx, 370, gx, 1300), fill=rgba(BRAND, 28), width=3)
    for gy in range(430, 1290, 130):
        d.line((88, gy, PHONE_W - 88, gy), fill=rgba(BRAND, 28), width=3)

    pts = [(180, 1115), (470, 1115), (635, 900), (850, 900), (970, 720)]
    total = (len(pts) - 1) * progress
    for i in range(len(pts) - 1):
        sp = max(0, min(1, total - i))
        if sp <= 0:
            continue
        a, b = pts[i], pts[i + 1]
        ex = int(lerp(a[0], b[0], sp))
        ey = int(lerp(a[1], b[1], sp))
        d.line((a[0], a[1], ex, ey), fill=BRAND, width=24)
        d.ellipse((a[0] - 34, a[1] - 34, a[0] + 34, a[1] + 34), fill=BRAND)
        d.ellipse((a[0] - 12, a[1] - 12, a[0] + 12, a[1] + 12), fill=WHITE)
        if sp >= 1:
            d.ellipse((b[0] - 34, b[1] - 34, b[0] + 34, b[1] + 34), fill=BRAND)
            d.ellipse((b[0] - 12, b[1] - 12, b[0] + 12, b[1] + 12), fill=WHITE)
    user_x, user_y = pts[min(int(progress * (len(pts) - 1)), len(pts) - 1)]
    d.ellipse((user_x - 28, user_y - 28, user_x + 28, user_y + 28), fill=GREEN)
    d.ellipse((user_x - 10, user_y - 10, user_x + 10, user_y + 10), fill=WHITE)

    pill(img, (730, 645, 1042, 735), fill=rgba(WHITE, 245), radius=26)
    text(img, (786, 674), "상담실", 42, INK, "extrabold")
    panel_y = 1435
    card(img, (68, panel_y, PHONE_W - 68, panel_y + 455), radius=46, fill=rgba(WHITE, 246), outline=(233, 234, 244), shadow=True)
    direction = "오른쪽으로 이동하세요" if progress > 0.52 else "직진하세요"
    distance = max(0, int(42 * (1 - progress)))
    text(img, (PHONE_W // 2, panel_y + 95), direction, 62, INK, "extrabold", anchor="mm")
    text(img, (PHONE_W // 2, panel_y + 178), f"{distance}m 남음", 42, BRAND_DEEP, "bold", anchor="mm")
    for i, name in enumerate(["음성", "진동", "화면"]):
        x = 148 + i * 300
        pill(img, (x, panel_y + 265, x + 225, panel_y + 350), fill=rgba(BRAND_PALE, 255), outline=(221, 217, 255), radius=38)
        text(img, (x + 112, panel_y + 308), name, 34, BRAND_DEEP, "bold", anchor="mm")
    return img


def user_arrival_screen() -> Image.Image:
    img = app_gradient()
    status_bar(img)
    ring(img, (PHONE_W // 2, 710), 112, 44, GREEN)
    text(img, (PHONE_W // 2, 930), "도착했습니다", 100, INK, "extrabold", anchor="mm")
    text(img, (PHONE_W // 2, 1048), "상담실 201", 58, MUTED, "bold", anchor="mm")
    card(img, (100, 1305, PHONE_W - 100, 1670), radius=48, fill=rgba(WHITE, 246), outline=(234, 235, 243), shadow=True)
    items = [("도착 경로", "42m"), ("안내 방식", "음성·진동·화면"), ("이탈 감지", "없음")]
    for i, (k, v) in enumerate(items):
        x = 158 + i * 300
        text(img, (x, 1406), k, 30, BRAND_DEEP, "bold")
        text(img, (x, 1465), v, 39, INK, "extrabold")
    pill(img, (116, 1888, PHONE_W - 116, 2028), fill=BRAND, outline=BRAND, radius=58)
    text(img, (PHONE_W // 2, 1958), "다른 목적지 찾기", 46, WHITE, "extrabold", anchor="mm")
    return img


def admin_info_screen(progress: float) -> Image.Image:
    img = app_gradient()
    status_bar(img)
    text(img, (PHONE_W // 2, 840), "무엇을 할까요?", 110, INK, "extrabold", anchor="mm")
    text(img, (PHONE_W // 2, 990), "공간을 한 번 스캔하면 서버가 자동으로\n지도를 만들고, 관리자는 검수만 합니다", 42, MUTED, "bold", anchor="mm", spacing=8)
    pill(img, (80, 1715, PHONE_W - 80, 1870), fill=BRAND, outline=BRAND, radius=60)
    text(img, (PHONE_W // 2, 1792), "스캔 시작", 48, WHITE, "extrabold", anchor="mm")

    p = ease(progress)
    sheet_y = int(2556 - 980 * p)
    card(img, (0, sheet_y, PHONE_W, 2556 + 80), radius=64, fill=rgba(WHITE, 250), outline=(235, 236, 244), shadow=True)
    text(img, (92, sheet_y + 100), "공간 정보", 60, INK, "extrabold")
    fields = [("건물명", "서울 AI스마트시티재단"), ("층", "1층"), ("목적", "실내 안내 지도 생성")]
    for i, (k, v) in enumerate(fields):
        y = sheet_y + 220 + i * 165
        text(img, (105, y), k, 30, BRAND_DEEP, "bold")
        pill(img, (95, y + 42, PHONE_W - 95, y + 132), fill=(248, 248, 252, 255), outline=(230, 231, 240), radius=28)
        text(img, (130, y + 70), v, 38, INK, "bold")
    pill(img, (96, sheet_y + 770, PHONE_W - 96, sheet_y + 910), fill=BRAND, outline=BRAND, radius=56)
    text(img, (PHONE_W // 2, sheet_y + 840), "스캔 시작", 44, WHITE, "extrabold", anchor="mm")
    return img


def admin_scan_screen(progress: float) -> Image.Image:
    img = linear_gradient(PHONE_W, PHONE_H, (241, 242, 248), (224, 230, 248))
    status_bar(img)
    d = ImageDraw.Draw(img)
    for y in range(310, 1730, 135):
        shade = int(235 - (y - 310) * 0.04)
        d.polygon([(0, y + 70), (PHONE_W, y + 35), (PHONE_W, y + 95), (0, y + 130)], fill=(shade, shade, min(255, shade + 8)))
    for x in range(-220, PHONE_W + 240, 160):
        d.line((x, 330, x + 470, 1640), fill=rgba(WHITE, 80), width=3)
    for y in range(420, 1680, 160):
        d.line((80, y, PHONE_W - 80, y - 40), fill=rgba(BRAND, 36), width=3)

    path = [(205, 1500), (330, 1360), (520, 1250), (715, 1120), (875, 930), (955, 735)]
    limit = progress * (len(path) - 1)
    for i in range(len(path) - 1):
        p = max(0, min(1, limit - i))
        if p <= 0:
            continue
        a, b = path[i], path[i + 1]
        ex = int(lerp(a[0], b[0], p))
        ey = int(lerp(a[1], b[1], p))
        d.line((a[0], a[1], ex, ey), fill=rgba(BRAND, 230), width=18)
        d.ellipse((a[0] - 18, a[1] - 18, a[0] + 18, a[1] + 18), fill=BRAND)
    for i in range(int(3 + progress * 10)):
        px = 170 + (i * 93) % 830
        py = 540 + (i * 151) % 880
        d.rounded_rectangle((px - 18, py - 18, px + 18, py + 18), radius=8, outline=rgba(BRAND, 180), width=5)

    pill(img, (64, 165, 330, 260), fill=rgba(BRAND, 240), outline=BRAND, radius=42)
    text(img, (197, 213), "스캔 중", 38, WHITE, "extrabold", anchor="mm")
    card(img, (70, 1785, PHONE_W - 70, 2210), radius=48, fill=rgba(WHITE, 245), outline=(233, 234, 244), shadow=True)
    text(img, (118, 1870), "공간을 천천히 비추세요", 52, INK, "extrabold")
    text(img, (118, 1952), f"키프레임 {int(4 + progress * 26)}개 · 이동거리 {progress * 28:0.1f}m", 34, MUTED, "bold")
    d.rounded_rectangle((118, 2048, PHONE_W - 118, 2085), radius=18, fill=(228, 230, 240))
    d.rounded_rectangle((118, 2048, int(118 + (PHONE_W - 236) * progress), 2085), radius=18, fill=BRAND)
    return img


def admin_processing_screen(progress: float) -> Image.Image:
    img = app_gradient()
    status_bar(img)
    text(img, (90, 280), "업로드와 AI 처리", 72, INK, "extrabold")
    text(img, (92, 375), "원본 스캔을 서버로 올리고\n장면 그래프와 경로 지도를 생성합니다", 40, MUTED, "bold", spacing=8)
    steps = [("업로드", 0.22), ("키프레임 분석", 0.48), ("장면 그래프 생성", 0.72), ("검수 초안 준비", 0.95)]
    for i, (label, threshold) in enumerate(steps):
        y = 650 + i * 235
        done = progress >= threshold
        active = abs(progress - threshold) < 0.22 or done
        d = ImageDraw.Draw(img)
        color = GREEN if done else (BRAND if active else FAINT)
        d.ellipse((95, y, 175, y + 80), fill=color)
        text(img, (135, y + 41), "✓" if done else f"{i+1}", 34, WHITE, "extrabold", anchor="mm")
        text(img, (220, y + 5), label, 48, INK if active else MUTED, "extrabold")
        d.rounded_rectangle((220, y + 82, PHONE_W - 120, y + 116), radius=17, fill=(227, 229, 240))
        fill_w = max(0.08, min(1, progress / threshold)) if not done else 1
        d.rounded_rectangle((220, y + 82, int(220 + (PHONE_W - 340) * fill_w), y + 116), radius=17, fill=color)
    return img


def admin_review_screen(progress: float) -> Image.Image:
    img = app_gradient()
    status_bar(img)
    text(img, (86, 220), "검수", 76, INK, "extrabold")
    text(img, (90, 310), "자동 생성된 목적지와 경로를 확인합니다", 38, MUTED, "bold")
    card(img, (70, 455, PHONE_W - 70, 1500), radius=46, fill=rgba(WHITE, 238), outline=(232, 234, 244), shadow=True)
    d = ImageDraw.Draw(img)
    for gx in range(140, PHONE_W - 80, 140):
        d.line((gx, 490, gx, 1460), fill=rgba(BRAND, 28), width=3)
    for gy in range(540, 1460, 120):
        d.line((105, gy, PHONE_W - 105, gy), fill=rgba(BRAND, 28), width=3)
    pts = [(190, 1265), (480, 1265), (600, 1040), (830, 1040), (955, 805)]
    for i in range(len(pts) - 1):
        p = ease(max(0, min(1, progress * 4 - i)))
        if p <= 0:
            continue
        a, b = pts[i], pts[i + 1]
        d.line((a[0], a[1], int(lerp(a[0], b[0], p)), int(lerp(a[1], b[1], p))), fill=BRAND, width=20)
    labels = [("접수", 190, 1185), ("상담실", 760, 950), ("출구", 875, 1330)]
    for label, x, y in labels:
        pill(img, (x, y, x + 190, y + 82), fill=rgba(WHITE, 248), radius=24)
        text(img, (x + 95, y + 42), label, 34, INK, "extrabold", anchor="mm")
    d.ellipse((920, 760, 990, 830), fill=GREEN)
    d.ellipse((946, 786, 964, 804), fill=WHITE)
    card(img, (80, 1630, PHONE_W - 80, 1990), radius=46, fill=rgba(WHITE, 248), outline=(234, 235, 243), shadow=True)
    text(img, (130, 1712), "검수 완료", 52, INK, "extrabold")
    text(img, (130, 1792), "목적지 12개 · 접근 가능 경로 18개", 36, MUTED, "bold")
    pill(img, (130, 1875, PHONE_W - 130, 1970), fill=BRAND, outline=BRAND, radius=40)
    text(img, (PHONE_W // 2, 1923), "사용자 앱에 게시", 38, WHITE, "extrabold", anchor="mm")
    return img


def title_panel(img: Image.Image, app: str, eyebrow: str, headline: str, body: str, current: str) -> None:
    logo_lockup(img, 138, 122, app)
    text(img, (140, 300), eyebrow, 28, BRAND, "extrabold")
    text(img, (140, 365), headline, 82, INK, "extrabold", spacing=14)
    wrapped(img, (142, 610), body, 32, 720, MUTED, "regular", 14)
    card(img, (140, 800, 780, 920), radius=24, fill=rgba(WHITE, 232), outline=(225, 226, 237), shadow=True)
    text(img, (178, 835), current, 34, INK, "extrabold")


def cursor_layer(x: int, y: int, scale: float, alpha: int = 255) -> Image.Image:
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    r = int(34 * scale)
    d.ellipse((x - r, y - r, x + r, y + r), fill=rgba(BRAND, int(alpha * 0.13)), outline=rgba(BRAND, alpha), width=max(3, int(4 * scale)))
    d.ellipse((x - 8, y - 8, x + 8, y + 8), fill=rgba(BRAND, alpha))
    return layer


def user_screen_at(t: float) -> Image.Image:
    if t < 5.2:
        return user_list_screen(ease(t / 5.2))
    if t < 15.5:
        return user_route_screen(ease((t - 5.2) / 10.3))
    return user_arrival_screen()


def admin_screen_at(t: float) -> Image.Image:
    if t < 5.0:
        return admin_info_screen(ease(t / 5.0))
    if t < 12.0:
        return admin_scan_screen(ease((t - 5.0) / 7.0))
    if t < 18.0:
        return admin_processing_screen(ease((t - 12.0) / 6.0))
    return admin_review_screen(ease((t - 18.0) / 7.0))


def user_frame(t: float) -> Image.Image:
    img = base_bg()
    stage = "목적지를 말하거나 선택하면, 앱이 곧바로 경로를 안내합니다"
    if t >= 5.2:
        stage = "현재 위치에서 목적지까지 음성, 진동, 화면으로 안내"
    if t >= 15.5:
        stage = "도착 확인과 이동 결과를 한 화면에서 확인"
    title_panel(
        img,
        "Iruvy Go",
        "USER APP DEMO",
        "실내 목적지까지\n혼자 이동하는 경험",
        "화면을 누르거나 목적지를 선택하면 Iruvy Go가 현재 위치에서 실제 목적지까지 단계별로 안내합니다.",
        stage,
    )
    screen = user_screen_at(t)
    phone_mockup(img, screen, 1150, 84, 360)
    if 3.1 <= t <= 4.2:
        p = ease_in_out((t - 3.1) / 1.1)
        img.alpha_composite(cursor_layer(int(1380 + 40 * p), int(750 + 22 * p), 1 + 0.35 * math.sin(p * math.pi), 230))
    if 5.5 <= t <= 6.6:
        p = ease_in_out((t - 5.5) / 1.1)
        img.alpha_composite(cursor_layer(int(1390 + 15 * p), int(755 + 155 * p), 1 + 0.30 * math.sin(p * math.pi), 220))
    return img.convert("RGB")


def admin_frame(t: float) -> Image.Image:
    img = base_bg()
    stage = "공간 정보 입력 후 스캔을 시작"
    if t >= 5.0:
        stage = "카메라와 자세 데이터를 기반으로 공간을 수집"
    if t >= 12.0:
        stage = "서버가 스캔을 분석하고 경로 그래프를 생성"
    if t >= 18.0:
        stage = "관리자는 검수 후 사용자 앱에 게시"
    title_panel(
        img,
        "Iruvy Go Admin",
        "ADMIN APP DEMO",
        "공간 스캔부터\n지도 게시까지",
        "관리자는 복잡한 지도 편집 대신 공간을 스캔하고, 서버가 만든 경로와 목적지를 검수한 뒤 게시합니다.",
        stage,
    )
    screen = admin_screen_at(t)
    phone_mockup(img, screen, 1150, 84, 360)
    if 3.2 <= t <= 4.2:
        p = ease_in_out((t - 3.2) / 1.0)
        img.alpha_composite(cursor_layer(int(1380), int(832 + 45 * p), 1 + 0.35 * math.sin(p * math.pi), 230))
    if 21.8 <= t <= 22.8:
        p = ease_in_out((t - 21.8) / 1.0)
        img.alpha_composite(cursor_layer(int(1384), int(780 + 300 * p), 1 + 0.3 * math.sin(p * math.pi), 230))
    return img.convert("RGB")


def write_video(path: Path, poster: Path, duration: float, frame_fn) -> None:
    if path.exists():
        path.unlink()
    if poster.exists():
        poster.unlink()
    writer = imageio.get_writer(
        path,
        fps=FPS,
        codec="libx264",
        quality=10,
        macro_block_size=1,
        ffmpeg_params=["-pix_fmt", "yuv420p", "-crf", "18", "-preset", "medium"],
    )
    try:
        frames = int(duration * FPS)
        for i in range(frames):
            t = i / FPS
            frame = frame_fn(t)
            if i == int(1.8 * FPS):
                frame.save(poster, quality=92)
            writer.append_data(np.asarray(frame))
    finally:
        writer.close()


def main() -> None:
    write_video(
        OUT_DIR / "iruvy_go_user_app_demo_24s.mp4",
        OUT_DIR / "iruvy_go_user_app_demo_poster.jpg",
        USER_DURATION,
        user_frame,
    )
    write_video(
        OUT_DIR / "iruvy_go_admin_app_demo_25s.mp4",
        OUT_DIR / "iruvy_go_admin_app_demo_poster.jpg",
        ADMIN_DURATION,
        admin_frame,
    )
    print(OUT_DIR / "iruvy_go_user_app_demo_24s.mp4")
    print(OUT_DIR / "iruvy_go_admin_app_demo_25s.mp4")


if __name__ == "__main__":
    main()

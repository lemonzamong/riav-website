from __future__ import annotations

import math
from pathlib import Path
from functools import lru_cache

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
OUT_DIR = ROOT / "deliverables"
OUT_DIR.mkdir(exist_ok=True)

W, H = 1920, 1080
FPS = 24
DURATION = 33.0
FRAME_COUNT = int(DURATION * FPS)

BRAND = (103, 83, 248)
BRAND_DEEP = (79, 59, 217)
BRAND_SOFT = (247, 245, 255)
BRAND_LINE = (216, 210, 255)
INK = (17, 18, 28)
MUTED = (92, 93, 110)
FAINT = (140, 143, 161)
WHITE = (255, 255, 255)
GREEN = (23, 178, 106)

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


def lerp(a: float, b: float, x: float) -> float:
    return a + (b - a) * x


def mix(c1: tuple[int, int, int], c2: tuple[int, int, int], x: float) -> tuple[int, int, int]:
    return tuple(int(lerp(a, b, x)) for a, b in zip(c1, c2))


def rgba(color: tuple[int, int, int], alpha: int) -> tuple[int, int, int, int]:
    return (*color, alpha)


def rounded(draw: ImageDraw.ImageDraw, box, radius: int, fill, outline=None, width: int = 1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def linear_gradient(width: int, height: int, top: tuple[int, int, int], bottom: tuple[int, int, int]) -> Image.Image:
    top_arr = np.array(top, dtype=np.float32)
    bottom_arr = np.array(bottom, dtype=np.float32)
    ys = np.linspace(0, 1, height, dtype=np.float32)[:, None, None]
    row = (top_arr * (1 - ys) + bottom_arr * ys).astype(np.uint8)
    arr = np.repeat(row, width, axis=1)
    return Image.fromarray(arr, "RGB").convert("RGBA")


_BASE_BG: Image.Image | None = None


def base_bg() -> Image.Image:
    global _BASE_BG
    if _BASE_BG is not None:
        return _BASE_BG.copy()
    img = linear_gradient(W, H, WHITE, BRAND_SOFT)
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((960, -240, 2180, 760), fill=rgba(BRAND, 38))
    gd.ellipse((-260, 620, 700, 1400), fill=rgba((219, 229, 255), 105))
    glow = glow.filter(ImageFilter.GaussianBlur(95))
    _BASE_BG = Image.alpha_composite(img, glow)
    return _BASE_BG.copy()


def draw_text(
    img: Image.Image,
    xy: tuple[int, int],
    text: str,
    size: int,
    fill=INK,
    anchor: str | None = None,
    spacing: int = 4,
    weight: str = "semibold",
) -> None:
    d = ImageDraw.Draw(img)
    d.multiline_text(xy, text, font=font(size, weight), fill=fill, anchor=anchor, spacing=spacing)


def draw_wrapped(
    img: Image.Image,
    xy: tuple[int, int],
    text: str,
    size: int,
    max_width: int,
    fill=MUTED,
    line_gap: int = 16,
    weight: str = "regular",
):
    f = font(size, weight)
    d = ImageDraw.Draw(img)
    words = text.split()
    lines: list[str] = []
    line = ""
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


def draw_ring(img: Image.Image, center: tuple[int, int], outer: int, inner: int, alpha: int = 255):
    d = ImageDraw.Draw(img)
    x, y = center
    d.ellipse((x - outer, y - outer, x + outer, y + outer), fill=rgba(BRAND, alpha))
    d.ellipse((x - inner, y - inner, x + inner, y + inner), fill=rgba(WHITE, alpha))


def draw_logo_lockup(img: Image.Image, x: int, y: int, scale: float = 1.0):
    draw_ring(img, (x + int(32 * scale), y + int(34 * scale)), int(23 * scale), int(10 * scale))
    draw_text(img, (x + int(72 * scale), y), "Iruvy Go", int(56 * scale), INK)
    draw_text(img, (x + int(75 * scale), y + int(65 * scale)), "by Iruvy", int(18 * scale), MUTED)


def card(img: Image.Image, box, alpha: int = 222, outline=BRAND_LINE, radius: int = 18):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle(box, radius=radius, fill=rgba(WHITE, alpha), outline=rgba(outline, 210), width=2)
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((box[0], box[1] + 12, box[2], box[3] + 12), radius=radius, fill=(103, 83, 248, 24))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    img.alpha_composite(shadow)
    img.alpha_composite(layer)


def phone_mockup(img: Image.Image, screen: Image.Image, x: int, y: int, w: int, tilt: float = 0.0, opacity: int = 255):
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
    sd.rounded_rectangle(
        (shell[0] + 16, shell[1] + 24, shell[2] + 16, shell[3] + 24),
        radius=radius,
        fill=(21, 19, 43, 62),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(28))
    phone.alpha_composite(shadow)

    d = ImageDraw.Draw(phone)
    # Side buttons, drawn behind the rail so they read like physical controls.
    left = shell[0]
    right = shell[2]
    top = shell[1]
    d.rounded_rectangle((left - 7, top + 128, left + 3, top + 205), radius=5, fill=(184, 182, 197, 245))
    d.rounded_rectangle((left - 8, top + 250, left + 3, top + 348), radius=5, fill=(184, 182, 197, 245))
    d.rounded_rectangle((left - 8, top + 380, left + 3, top + 478), radius=5, fill=(184, 182, 197, 245))
    d.rounded_rectangle((right - 3, top + 290, right + 8, top + 425), radius=5, fill=(184, 182, 197, 245))

    # Titanium-like outer rail and black inner bezel.
    d.rounded_rectangle(shell, radius=radius, fill=(204, 202, 214, 255))
    d.rounded_rectangle(
        (shell[0] + 2, shell[1] + 2, shell[2] - 2, shell[3] - 2),
        radius=radius - 2,
        outline=(255, 255, 255, 210),
        width=3,
    )
    d.rounded_rectangle(
        (shell[0] + rail, shell[1] + rail, shell[2] - rail, shell[3] - rail),
        radius=radius - rail,
        fill=(9, 10, 17, 255),
    )

    screen_box = (pad + rail + bezel, pad + rail + bezel, pad + rail + bezel + w, pad + rail + bezel + h)
    crop = screen.resize((w, h), Image.Resampling.LANCZOS).convert("RGBA")
    mask = Image.new("L", (w, h), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle((0, 0, w, h), radius=screen_radius, fill=255)
    crop.putalpha(mask)
    phone.alpha_composite(crop, (screen_box[0], screen_box[1]))

    # Subtle glass sheen keeps the screen from feeling pasted onto the frame.
    sheen = Image.new("RGBA", phone.size, (0, 0, 0, 0))
    sh = ImageDraw.Draw(sheen)
    sh.rounded_rectangle(screen_box, radius=screen_radius, outline=(255, 255, 255, 70), width=2)
    sh.polygon(
        [
            (screen_box[0] + int(w * 0.06), screen_box[1] + 4),
            (screen_box[0] + int(w * 0.48), screen_box[1] + 4),
            (screen_box[0] + int(w * 0.25), screen_box[1] + int(h * 0.55)),
            (screen_box[0] - 20, screen_box[1] + int(h * 0.38)),
        ],
        fill=(255, 255, 255, 18),
    )
    island_w = int(w * 0.28)
    island_h = max(22, int(w * 0.066))
    island_x = screen_box[0] + (w - island_w) // 2
    island_y = screen_box[1] + max(16, int(w * 0.045))
    sh.rounded_rectangle(
        (island_x, island_y, island_x + island_w, island_y + island_h),
        radius=island_h // 2,
        fill=(5, 6, 10, 235),
    )
    sh.ellipse(
        (island_x + island_w - island_h + 7, island_y + 7, island_x + island_w - 8, island_y + island_h - 8),
        fill=(23, 25, 35, 255),
    )
    phone.alpha_composite(sheen)

    if opacity < 255:
        a = phone.getchannel("A").point(lambda p: int(p * opacity / 255))
        phone.putalpha(a)
    if abs(tilt) > 0.01:
        phone = phone.rotate(tilt, expand=True, resample=Image.Resampling.BICUBIC)
    img.alpha_composite(phone, (x - pad, y - pad))


USER_SCREEN = Image.open(ASSETS / "app-user-clean.jpg").convert("RGB")
ADMIN_SCREEN = Image.open(ASSETS / "app-admin-clean.jpg").convert("RGB")


def draw_path_map(img: Image.Image, x: int, y: int, w: int, h: int, progress: float = 1.0):
    card(img, (x, y, x + w, y + h), alpha=205, radius=18)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for gx in range(x + 70, x + w, 112):
        d.line((gx, y, gx, y + h), fill=(103, 83, 248, 25), width=2)
    for gy in range(y + 70, y + h, 92):
        d.line((x, gy, x + w, gy), fill=(103, 83, 248, 25), width=2)

    pts = [
        (x + 135, y + 250),
        (x + 440, y + 250),
        (x + 610, y + 112),
        (x + 815, y + 112),
    ]
    total_segments = len(pts) - 1
    p = progress * total_segments
    for i in range(total_segments):
        start, end = pts[i], pts[i + 1]
        seg_p = max(0, min(1, p - i))
        if seg_p <= 0:
            continue
        ex = int(lerp(start[0], end[0], seg_p))
        ey = int(lerp(start[1], end[1], seg_p))
        d.line((start[0], start[1], ex, ey), fill=rgba(BRAND, 255), width=14)
        d.ellipse((start[0] - 22, start[1] - 22, start[0] + 22, start[1] + 22), fill=rgba(BRAND, 255))
        d.ellipse((start[0] - 8, start[1] - 8, start[0] + 8, start[1] + 8), fill=rgba(WHITE, 255))
        if seg_p >= 1:
            d.ellipse((end[0] - 22, end[1] - 22, end[0] + 22, end[1] + 22), fill=rgba(BRAND, 255))
            d.ellipse((end[0] - 8, end[1] - 8, end[0] + 8, end[1] + 8), fill=rgba(WHITE, 255))
    d.ellipse((x + 680, y + 320, x + 728, y + 368), fill=rgba(GREEN, 255))
    d.ellipse((x + 697, y + 337, x + 711, y + 351), fill=rgba(WHITE, 255))
    rounded(d, (x + 105, y + 150, x + 190, y + 205), 14, rgba(WHITE, 245), outline=rgba((227, 228, 234), 255), width=2)
    rounded(d, (x + 620, y + 44, x + 740, y + 102), 14, rgba(WHITE, 245), outline=rgba((227, 228, 234), 255), width=2)
    rounded(d, (x + 710, y + 360, x + 800, y + 418), 14, rgba(WHITE, 245), outline=rgba((227, 228, 234), 255), width=2)
    img.alpha_composite(overlay)
    draw_text(img, (x + 128, y + 162), "접수", 28, INK)
    draw_text(img, (x + 642, y + 56), "상담실", 28, INK)
    draw_text(img, (x + 733, y + 372), "출구", 28, INK)


def scene_hero(t: float) -> Image.Image:
    img = base_bg()
    p = ease(min(1, t / 1.6))
    x = int(lerp(110, 140, p))
    draw_logo_lockup(img, x, 190)
    draw_text(img, (140, 360), "AI INDOOR NAVIGATION INFRASTRUCTURE", 28, BRAND)
    draw_text(img, (140, 420), "누구나 어디든\n갈 수 있는 세상", 104, INK, spacing=20)
    draw_wrapped(
        img,
        (140, 690),
        "Iruvy Go는 GPS가 닿지 않는 복합 실내공간에서 사용자의 위치를 AI로 추정하고 목적지까지 음성, 진동, 화면으로 안내합니다.",
        32,
        760,
        MUTED,
        14,
    )
    phone_p = ease(max(0, (t - 0.4) / 1.4))
    phone_mockup(img, USER_SCREEN, int(lerp(1240, 1030, phone_p)), 155, 360, opacity=255)
    phone_mockup(img, ADMIN_SCREEN, int(lerp(1680, 1450, phone_p)), 275, 330, opacity=210)
    return img


def scene_problem(t: float) -> Image.Image:
    img = base_bg()
    draw_text(img, (140, 150), "LAST 100M INDOOR MOBILITY GAP", 28, BRAND)
    draw_text(img, (140, 225), "지도는 건물 입구까지,\nIruvy Go는 실제 목적지까지", 84, INK, spacing=18)
    draw_wrapped(
        img,
        (140, 480),
        "병원 진료실, 공공기관 민원실, 복지관 상담실, 전시장 부스처럼 사용자가 실제로 가야 하는 곳은 건물 안에 있습니다.",
        34,
        860,
        MUTED,
        14,
    )
    labels = [("병원", "진료실 201"), ("공공기관", "민원창구"), ("전시장", "부스 A-12")]
    for i, (k, v) in enumerate(labels):
        p = ease(max(0, min(1, (t - 0.5 - i * 0.25) / 0.7)))
        bx = int(lerp(220, 140 + i * 510, p))
        by = 700
        card(img, (bx, by, bx + 420, by + 170), alpha=235, radius=24)
        draw_text(img, (bx + 34, by + 30), k, 28, BRAND)
        draw_text(img, (bx + 34, by + 82), v, 48, INK)
    return img


def scene_platform(t: float) -> Image.Image:
    img = base_bg()
    draw_text(img, (140, 130), "PLATFORM", 28, BRAND)
    draw_text(img, (140, 200), "앱 하나가 아니라,\n실내공간 운영 인프라", 84, INK, spacing=18)
    steps = [
        ("01", "공간 스캔", "운영자가 주요 동선과 목적지를 등록"),
        ("02", "AI 경로 구성", "위치추정과 경로 그래프를 안내 데이터로 변환"),
        ("03", "Iruvy Go 안내", "사용자는 음성, 진동, 화면으로 목적지까지 이동"),
        ("04", "기관 리포트", "도착률, 이동 시간, 이탈 지점을 개선 자료로 확인"),
    ]
    for i, (num, title, body) in enumerate(steps):
        p = ease(max(0, min(1, (t - i * 0.35) / 0.7)))
        bx = int(lerp(1320, 1110, p))
        by = 130 + i * 205
        card(img, (bx, by, bx + 650, by + 160), alpha=235, radius=18)
        d = ImageDraw.Draw(img)
        d.ellipse((bx + 34, by + 46, bx + 96, by + 108), fill=BRAND)
        draw_text(img, (bx + 51, by + 60), num, 24, WHITE)
        draw_text(img, (bx + 130, by + 34), title, 38, INK)
        draw_text(img, (bx + 130, by + 92), body, 25, MUTED)
    draw_path_map(img, 120, 565, 840, 420, progress=ease(t / 4.0))
    return img


def scene_technology(t: float) -> Image.Image:
    img = base_bg()
    draw_text(img, (140, 145), "TECHNOLOGY", 28, BRAND)
    draw_text(img, (140, 215), "사람을 안내하면서,\n공간을 데이터로 만듭니다", 82, INK, spacing=18)
    draw_wrapped(
        img,
        (140, 480),
        "비식별 동선과 공간 그래프는 실내공간을 운영하고, 복원하고, 로봇과 공유할 수 있는 데이터 기반이 됩니다.",
        34,
        800,
        MUTED,
        14,
    )
    draw_path_map(img, 980, 120, 820, 470, progress=ease(t / 3.6))
    techs = [
        ("실시간 길찾기", "인프라 부담을 낮춘 실내 위치추정"),
        ("비식별 이동 데이터", "도착 성공률과 경로 이탈 지점 축적"),
        ("공용 공간 인프라", "사람, 로봇, AR이 함께 쓰는 공간 데이터"),
    ]
    for i, (title, body) in enumerate(techs):
        bx = 980 + i * 275
        by = 690
        card(img, (bx, by, bx + 250, by + 180), alpha=235, radius=18)
        draw_text(img, (bx + 26, by + 32), title, 30, INK)
        draw_wrapped(img, (bx + 26, by + 86), body, 22, 190, MUTED, 8)
    return img


def scene_validation(t: float) -> Image.Image:
    img = base_bg()
    draw_text(img, (140, 140), "FIELD NETWORK", 28, BRAND)
    draw_text(img, (140, 210), "도입·실증·협의 현장", 86, INK)
    names = [
        ("도입", "서울 AI스마트시티재단"),
        ("PoC", "한양대학교 학생회관"),
        ("지원", "서울대학교 캠퍼스타운"),
        ("협의", "서울 지하철 9호선"),
        ("육성", "KIST 홍릉강소특구"),
        ("검증", "시각장애인 사용자 PoC"),
    ]
    for i, (tag, name) in enumerate(names):
        col = i % 2
        row = i // 2
        bx = 140 + col * 650
        by = 390 + row * 145
        card(img, (bx, by, bx + 570, by + 108), alpha=235, radius=18)
        draw_text(img, (bx + 30, by + 36), tag, 26, BRAND)
        draw_text(img, (bx + 120, by + 30), name, 34, INK)
    metric_x = 1460
    card(img, (metric_x, 250, metric_x + 330, 410), alpha=235, radius=20)
    draw_text(img, (metric_x + 34, 286), "자력 도착률", 28, BRAND)
    draw_text(img, (metric_x + 34, 330), "26.6% → 93.3%", 42, INK)
    card(img, (metric_x, 450, metric_x + 330, 610), alpha=235, radius=20)
    draw_text(img, (metric_x + 34, 486), "참여자", 28, BRAND)
    draw_text(img, (metric_x + 34, 530), "23명", 52, INK)
    card(img, (metric_x, 650, metric_x + 330, 810), alpha=235, radius=20)
    draw_text(img, (metric_x + 34, 686), "도입 전환", 28, BRAND)
    draw_text(img, (metric_x + 34, 730), "Light → Standard", 38, INK)
    return img


def scene_contact(t: float) -> Image.Image:
    img = base_bg()
    draw_ring(img, (W // 2, 240), 62, 28)
    draw_text(img, (W // 2, 335), "Iruvy", 88, INK, anchor="mm")
    draw_text(img, (W // 2, 440), "AI 실내 내비게이션 인프라", 54, INK, anchor="mm")
    draw_text(img, (W // 2, 525), "누구나 어디든 갈 수 있는 세상", 42, MUTED, anchor="mm")
    card(img, (540, 650, 1380, 770), alpha=250, radius=22)
    draw_text(img, (W // 2, 710), "iruvy.official@gmail.com", 46, BRAND_DEEP, anchor="mm")
    draw_text(img, (W // 2, 850), "iruvy.com", 34, MUTED, anchor="mm")
    return img


SCENES = [
    (0.0, 5.5, scene_hero),
    (5.5, 10.5, scene_problem),
    (10.5, 16.0, scene_platform),
    (16.0, 21.5, scene_technology),
    (21.5, 27.0, scene_validation),
    (27.0, 33.0, scene_contact),
]


def frame_at(t: float) -> Image.Image:
    for start, end, fn in SCENES:
        if start <= t < end:
            local = t - start
            img = fn(local)
            fade = min(1.0, local / 0.55, (end - t) / 0.55)
            if fade < 1:
                overlay = Image.new("RGBA", (W, H), WHITE + (int(255 * (1 - fade)),))
                img = Image.alpha_composite(img, overlay)
            return img.convert("RGB")
    return scene_contact(0).convert("RGB")


def main():
    out = OUT_DIR / "iruvy_go_promo_33s.mp4"
    poster = OUT_DIR / "iruvy_go_promo_poster.jpg"
    if out.exists():
        out.unlink()
    if poster.exists():
        poster.unlink()
    writer = imageio.get_writer(
        out,
        fps=FPS,
        codec="libx264",
        quality=8,
        macro_block_size=1,
        ffmpeg_params=["-pix_fmt", "yuv420p", "-movflags", "+faststart"],
    )
    try:
        for i in range(FRAME_COUNT):
            img = frame_at(i / FPS)
            if i == int(1.6 * FPS):
                img.save(poster, quality=92)
            writer.append_data(np.asarray(img))
    finally:
        writer.close()
    print(out)
    print(poster)


if __name__ == "__main__":
    main()

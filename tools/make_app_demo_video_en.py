from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

from make_app_demo_videos import (
    ADMIN_DURATION,
    BRAND,
    BRAND_DEEP,
    BRAND_PALE,
    FAINT,
    FPS,
    GREEN,
    H,
    INK,
    MUTED,
    OUT_DIR,
    PHONE_H,
    PHONE_W,
    RED,
    USER_DURATION,
    W,
    WHITE,
    app_gradient,
    base_bg,
    card,
    cursor_layer,
    ease,
    ease_in_out,
    lerp,
    linear_gradient,
    logo_lockup,
    phone_mockup,
    pill,
    ring,
    rgba,
    status_bar,
    text,
    wrapped,
    write_video,
)


TOTAL_DURATION = USER_DURATION + ADMIN_DURATION


def user_list_screen_en(progress: float) -> Image.Image:
    img = app_gradient()
    status_bar(img)
    d = ImageDraw.Draw(img)
    d.ellipse((PHONE_W - 220, 170, PHONE_W - 65, 325), fill=rgba(WHITE, 230))
    text(img, (PHONE_W - 142, 247), "▮▮▮", 34, INK, "bold", anchor="mm")
    text(img, (PHONE_W // 2, 900), "Where to?", 142, INK, "extrabold", anchor="mm")
    text(img, (PHONE_W // 2, 1066), "Tap anywhere to start", 58, MUTED, "bold", anchor="mm")

    if progress > 0.12:
        alpha = int(255 * ease((progress - 0.12) / 0.24))
        bubble = Image.new("RGBA", (PHONE_W, PHONE_H), (0, 0, 0, 0))
        bd = ImageDraw.Draw(bubble)
        bd.rounded_rectangle((100, 1150, PHONE_W - 100, 1315), radius=44, fill=(255, 255, 255, min(238, alpha)), outline=(232, 234, 243, alpha), width=2)
        text(bubble, (158, 1196), "Listening", 42, INK + (alpha,), "bold")
        for i in range(8):
            amp = 18 + 18 * math.sin(progress * 16 + i * 0.8)
            x = 790 + i * 24
            bd.rounded_rectangle((x, 1235 - amp, x + 10, 1235 + amp), radius=5, fill=rgba(BRAND, alpha))
        img.alpha_composite(bubble)

    if progress > 0.38:
        p = ease((progress - 0.38) / 0.28)
        y0 = int(1390 - 50 * (1 - p))
        text(img, (PHONE_W // 2, y0), "Nearby destinations", 48, INK, "bold", anchor="mm")
        cards = [("Room 201", "Iruvy Go demo space"), ("Info Desk", "Iruvy Go demo space")]
        for i, (title, body) in enumerate(cards):
            x = 65 + i * 515
            y = y0 + 70
            pill(img, (x, y, x + 480, y + 210), fill=rgba(WHITE, 244), radius=42)
            text(img, (x + 48, y + 62), title, 48, INK, "extrabold")
            text(img, (x + 48, y + 126), body, 32, MUTED, "bold")
        text(img, (PHONE_W // 2, y0 + 360), "Published destinations are sorted by your current location.", 30, MUTED, "bold", anchor="mm")
    return img


def user_route_screen_en(progress: float) -> Image.Image:
    img = app_gradient()
    status_bar(img)
    d = ImageDraw.Draw(img)
    text(img, (72, 178), "Room 201", 72, INK, "extrabold")
    text(img, (76, 264), "42 m to destination", 36, MUTED, "bold")
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
    text(img, (786, 674), "Room", 42, INK, "extrabold")
    panel_y = 1435
    card(img, (68, panel_y, PHONE_W - 68, panel_y + 455), radius=46, fill=rgba(WHITE, 246), outline=(233, 234, 244), shadow=True)
    direction = "Move right" if progress > 0.52 else "Go straight"
    distance = max(0, int(42 * (1 - progress)))
    text(img, (PHONE_W // 2, panel_y + 95), direction, 68, INK, "extrabold", anchor="mm")
    text(img, (PHONE_W // 2, panel_y + 178), f"{distance} m left", 44, BRAND_DEEP, "bold", anchor="mm")
    for i, name in enumerate(["Voice", "Haptic", "Screen"]):
        x = 148 + i * 300
        pill(img, (x, panel_y + 265, x + 225, panel_y + 350), fill=rgba(BRAND_PALE, 255), outline=(221, 217, 255), radius=38)
        text(img, (x + 112, panel_y + 308), name, 30, BRAND_DEEP, "bold", anchor="mm")
    return img


def user_arrival_screen_en() -> Image.Image:
    img = app_gradient()
    status_bar(img)
    ring(img, (PHONE_W // 2, 710), 112, 44, GREEN)
    text(img, (PHONE_W // 2, 930), "Arrived", 112, INK, "extrabold", anchor="mm")
    text(img, (PHONE_W // 2, 1048), "Room 201", 62, MUTED, "bold", anchor="mm")
    card(img, (100, 1305, PHONE_W - 100, 1670), radius=48, fill=rgba(WHITE, 246), outline=(234, 235, 243), shadow=True)
    items = [("Route", "42 m"), ("Guidance", "Voice · Haptic"), ("Deviation", "None")]
    for i, (k, v) in enumerate(items):
        x = 158 + i * 300
        text(img, (x, 1406), k, 30, BRAND_DEEP, "bold")
        text(img, (x, 1465), v, 36, INK, "extrabold")
    pill(img, (116, 1888, PHONE_W - 116, 2028), fill=BRAND, outline=BRAND, radius=58)
    text(img, (PHONE_W // 2, 1958), "Find another destination", 44, WHITE, "extrabold", anchor="mm")
    return img


def admin_info_screen_en(progress: float) -> Image.Image:
    img = app_gradient()
    status_bar(img)
    text(img, (PHONE_W // 2, 840), "What to do?", 106, INK, "extrabold", anchor="mm")
    text(img, (PHONE_W // 2, 990), "Scan once, let the server build the map,\nand review before publishing", 39, MUTED, "bold", anchor="mm", spacing=8)
    pill(img, (80, 1715, PHONE_W - 80, 1870), fill=BRAND, outline=BRAND, radius=60)
    text(img, (PHONE_W // 2, 1792), "Start scan", 48, WHITE, "extrabold", anchor="mm")

    p = ease(progress)
    sheet_y = int(2556 - 980 * p)
    card(img, (0, sheet_y, PHONE_W, 2556 + 80), radius=64, fill=rgba(WHITE, 250), outline=(235, 236, 244), shadow=True)
    text(img, (92, sheet_y + 100), "Space info", 60, INK, "extrabold")
    fields = [("Building", "Seoul AI Smart City Foundation"), ("Floor", "1F"), ("Purpose", "Indoor guidance map")]
    for i, (k, v) in enumerate(fields):
        y = sheet_y + 220 + i * 165
        text(img, (105, y), k, 30, BRAND_DEEP, "bold")
        pill(img, (95, y + 42, PHONE_W - 95, y + 132), fill=(248, 248, 252, 255), outline=(230, 231, 240), radius=28)
        text(img, (130, y + 70), v, 34, INK, "bold")
    pill(img, (96, sheet_y + 770, PHONE_W - 96, sheet_y + 910), fill=BRAND, outline=BRAND, radius=56)
    text(img, (PHONE_W // 2, sheet_y + 840), "Start scan", 44, WHITE, "extrabold", anchor="mm")
    return img


def admin_scan_screen_en(progress: float) -> Image.Image:
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
        d.line((a[0], a[1], int(lerp(a[0], b[0], p)), int(lerp(a[1], b[1], p))), fill=rgba(BRAND, 230), width=18)
        d.ellipse((a[0] - 18, a[1] - 18, a[0] + 18, a[1] + 18), fill=BRAND)
    for i in range(int(3 + progress * 10)):
        px = 170 + (i * 93) % 830
        py = 540 + (i * 151) % 880
        d.rounded_rectangle((px - 18, py - 18, px + 18, py + 18), radius=8, outline=rgba(BRAND, 180), width=5)

    pill(img, (64, 165, 340, 260), fill=rgba(BRAND, 240), outline=BRAND, radius=42)
    text(img, (202, 213), "Scanning", 36, WHITE, "extrabold", anchor="mm")
    card(img, (70, 1785, PHONE_W - 70, 2210), radius=48, fill=rgba(WHITE, 245), outline=(233, 234, 244), shadow=True)
    text(img, (118, 1870), "Move slowly through the space", 46, INK, "extrabold")
    text(img, (118, 1952), f"{int(4 + progress * 26)} keyframes · {progress * 28:0.1f} m captured", 34, MUTED, "bold")
    d.rounded_rectangle((118, 2048, PHONE_W - 118, 2085), radius=18, fill=(228, 230, 240))
    d.rounded_rectangle((118, 2048, int(118 + (PHONE_W - 236) * progress), 2085), radius=18, fill=BRAND)
    return img


def admin_processing_screen_en(progress: float) -> Image.Image:
    img = app_gradient()
    status_bar(img)
    text(img, (90, 280), "Upload and AI processing", 58, INK, "extrabold")
    text(img, (92, 375), "The server turns raw scans into\nroute graphs and review drafts", 40, MUTED, "bold", spacing=8)
    steps = [("Upload", 0.22), ("Keyframe analysis", 0.48), ("Scene graph generation", 0.72), ("Review draft ready", 0.95)]
    for i, (label, threshold) in enumerate(steps):
        y = 650 + i * 235
        done = progress >= threshold
        active = abs(progress - threshold) < 0.22 or done
        d = ImageDraw.Draw(img)
        color = GREEN if done else (BRAND if active else FAINT)
        d.ellipse((95, y, 175, y + 80), fill=color)
        text(img, (135, y + 41), "✓" if done else f"{i + 1}", 34, WHITE, "extrabold", anchor="mm")
        text(img, (220, y + 5), label, 43, INK if active else MUTED, "extrabold")
        d.rounded_rectangle((220, y + 82, PHONE_W - 120, y + 116), radius=17, fill=(227, 229, 240))
        fill_w = max(0.08, min(1, progress / threshold)) if not done else 1
        d.rounded_rectangle((220, y + 82, int(220 + (PHONE_W - 340) * fill_w), y + 116), radius=17, fill=color)
    return img


def admin_review_screen_en(progress: float) -> Image.Image:
    img = app_gradient()
    status_bar(img)
    text(img, (86, 220), "Review", 76, INK, "extrabold")
    text(img, (90, 310), "Confirm auto-generated destinations and routes", 34, MUTED, "bold")
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
    labels = [("Desk", 190, 1185), ("Room", 760, 950), ("Exit", 875, 1330)]
    for label, x, y in labels:
        pill(img, (x, y, x + 190, y + 82), fill=rgba(WHITE, 248), radius=24)
        text(img, (x + 95, y + 42), label, 32, INK, "extrabold", anchor="mm")
    d.ellipse((920, 760, 990, 830), fill=GREEN)
    d.ellipse((946, 786, 964, 804), fill=WHITE)
    card(img, (80, 1630, PHONE_W - 80, 1990), radius=46, fill=rgba(WHITE, 248), outline=(234, 235, 243), shadow=True)
    text(img, (130, 1712), "Review complete", 50, INK, "extrabold")
    text(img, (130, 1792), "12 destinations · 18 accessible routes", 34, MUTED, "bold")
    pill(img, (130, 1875, PHONE_W - 130, 1970), fill=BRAND, outline=BRAND, radius=40)
    text(img, (PHONE_W // 2, 1923), "Publish to user app", 36, WHITE, "extrabold", anchor="mm")
    return img


def title_panel_en(img: Image.Image, app: str, eyebrow: str, headline: str, body: str, current: str) -> None:
    logo_lockup(img, 138, 122, app)
    text(img, (140, 300), eyebrow, 28, BRAND, "extrabold")
    text(img, (140, 365), headline, 72, INK, "extrabold", spacing=14)
    wrapped(img, (142, 610), body, 32, 720, MUTED, "regular", 14)
    card(img, (140, 800, 810, 920), radius=24, fill=rgba(WHITE, 232), outline=(225, 226, 237), shadow=True)
    text(img, (178, 835), current, 31, INK, "extrabold")


def user_screen_en_at(t: float) -> Image.Image:
    if t < 5.2:
        return user_list_screen_en(ease(t / 5.2))
    if t < 15.5:
        return user_route_screen_en(ease((t - 5.2) / 10.3))
    return user_arrival_screen_en()


def admin_screen_en_at(t: float) -> Image.Image:
    if t < 5.0:
        return admin_info_screen_en(ease(t / 5.0))
    if t < 12.0:
        return admin_scan_screen_en(ease((t - 5.0) / 7.0))
    if t < 18.0:
        return admin_processing_screen_en(ease((t - 12.0) / 6.0))
    return admin_review_screen_en(ease((t - 18.0) / 7.0))


def user_frame_en(t: float) -> Image.Image:
    img = base_bg()
    stage = "Tap or choose a destination to begin guidance"
    if t >= 5.2:
        stage = "Voice, haptic and visual guidance to the destination"
    if t >= 15.5:
        stage = "Arrival confirmation and route result summary"
    title_panel_en(
        img,
        "Iruvy Go",
        "USER APP DEMO",
        "Independent indoor\nnavigation",
        "Iruvy Go estimates a user's indoor position and guides them to the real destination beyond the building entrance.",
        stage,
    )
    phone_mockup(img, user_screen_en_at(t), 1150, 84, 360)
    if 3.1 <= t <= 4.2:
        p = ease_in_out((t - 3.1) / 1.1)
        img.alpha_composite(cursor_layer(int(1380 + 40 * p), int(750 + 22 * p), 1 + 0.35 * math.sin(p * math.pi), 230))
    if 5.5 <= t <= 6.6:
        p = ease_in_out((t - 5.5) / 1.1)
        img.alpha_composite(cursor_layer(int(1390 + 15 * p), int(755 + 155 * p), 1 + 0.30 * math.sin(p * math.pi), 220))
    return img.convert("RGB")


def admin_frame_en(t: float) -> Image.Image:
    img = base_bg()
    stage = "Enter space information and start scanning"
    if t >= 5.0:
        stage = "Capture visual keyframes and motion path"
    if t >= 12.0:
        stage = "Server generates route graph and review draft"
    if t >= 18.0:
        stage = "Admin reviews and publishes to the user app"
    title_panel_en(
        img,
        "Iruvy Go Admin",
        "ADMIN APP DEMO",
        "From space scan\nto map publishing",
        "Administrators scan the space, review server-generated routes and destinations, then publish a verified indoor map.",
        stage,
    )
    phone_mockup(img, admin_screen_en_at(t), 1150, 84, 360)
    if 3.2 <= t <= 4.2:
        p = ease_in_out((t - 3.2) / 1.0)
        img.alpha_composite(cursor_layer(1380, int(832 + 45 * p), 1 + 0.35 * math.sin(p * math.pi), 230))
    if 21.8 <= t <= 22.8:
        p = ease_in_out((t - 21.8) / 1.0)
        img.alpha_composite(cursor_layer(1384, int(780 + 300 * p), 1 + 0.3 * math.sin(p * math.pi), 230))
    return img.convert("RGB")


def combined_frame_en(t: float) -> Image.Image:
    if t < USER_DURATION:
        return user_frame_en(t)
    return admin_frame_en(t - USER_DURATION)


def main() -> None:
    write_video(
        OUT_DIR / "iruvy_go_app_demo_combined_en_49s.mp4",
        OUT_DIR / "iruvy_go_app_demo_combined_en_poster.jpg",
        TOTAL_DURATION,
        combined_frame_en,
    )
    print(OUT_DIR / "iruvy_go_app_demo_combined_en_49s.mp4")


if __name__ == "__main__":
    main()

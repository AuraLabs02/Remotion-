"""
Pull the channel's real branding from YouTube and wire it into the reel.

    python3 scripts/fetch_brand.py              # fetch @Cloud-Codes (default)
    python3 scripts/fetch_brand.py @SomeHandle   # any other channel
    python3 scripts/fetch_brand.py --colors-only # just re-theme from public/brand/avatar.*

Downloads (needs network access to youtube.com, yt3.googleusercontent.com,
yt3.ggpht.com and i.ytimg.com):
  public/brand/avatar.jpg        channel logo (900 px)
  public/brand/banner.jpg        channel banner
  public/brand/thumb-1..8.jpg    latest video thumbnails
and writes src/config/live.json with the channel name, handle, subscriber and
video counts, description, latest titles / views / upload age / durations and
a colour palette extracted from the logo (requires Pillow for the palette).
Everything degrades gracefully: whatever cannot be fetched keeps its stand-in.
"""

import datetime as dt
import html
import json
import os
import re
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
BRAND_DIR = os.path.join(ROOT, 'public', 'brand')
LIVE_JSON = os.path.join(ROOT, 'src', 'config', 'live.json')

# Overridable for offline tests.
YT = os.environ.get('YT_BASE', 'https://www.youtube.com')
THUMB = os.environ.get('YT_THUMB_BASE', 'https://i.ytimg.com')

UA = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36')
HEADERS = {
    'User-Agent': UA,
    'Accept-Language': 'en-US,en;q=0.9',
    # skips the EU cookie-consent interstitial
    'Cookie': 'CONSENT=YES+cb; SOCS=CAI',
}


def get(url, binary=False):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    return data if binary else data.decode('utf-8', 'replace')


def save(url, path):
    try:
        data = get(url, binary=True)
    except (urllib.error.URLError, TimeoutError, ValueError) as e:
        print(f'  ! {os.path.basename(path)}: {e}')
        return False
    if len(data) < 2000:  # YouTube serves a tiny grey placeholder for missing sizes
        return False
    with open(path, 'wb') as f:
        f.write(data)
    print(f'  ✓ {os.path.relpath(path, ROOT)} ({len(data) // 1024} KB)')
    return True


def meta(page, prop):
    m = re.search(r'<meta (?:property|name|itemprop)="%s" content="([^"]*)"' % re.escape(prop), page)
    return html.unescape(m.group(1)) if m else None


def initial_data(page):
    m = re.search(r'(?:var ytInitialData|window\["ytInitialData"\])\s*=\s*(\{.*?\});\s*</script>', page, re.S)
    if not m:
        return None
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError:
        return None


def walk(node):
    """Yield every dict inside a JSON tree, breadth-first in document order."""
    from collections import deque

    queue = deque([node])
    while queue:
        n = queue.popleft()
        if isinstance(n, dict):
            yield n
            queue.extend(n.values())
        elif isinstance(n, list):
            queue.extend(n)


def strings(node):
    for d in walk(node):
        for v in d.values():
            if isinstance(v, str):
                yield v


def text_of(v):
    if isinstance(v, str):
        return v
    if isinstance(v, dict):
        if 'simpleText' in v:
            return v['simpleText']
        if 'content' in v and isinstance(v['content'], str):
            return v['content']
        if 'runs' in v:
            return ''.join(r.get('text', '') for r in v['runs'])
    return None


def compact(n):
    n = int(n)
    for div, suf in ((1_000_000_000, 'B'), (1_000_000, 'M'), (1_000, 'K')):
        if n >= div:
            v = n / div
            s = f'{v:.1f}' if v < 10 else f'{v:.0f}'
            return s.rstrip('0').rstrip('.') + suf
    return str(n)


def ago(iso):
    try:
        t = dt.datetime.fromisoformat(iso.replace('Z', '+00:00'))
    except ValueError:
        return ''
    s = (dt.datetime.now(dt.timezone.utc) - t).total_seconds()
    for unit, secs in (('year', 31536000), ('month', 2592000), ('week', 604800), ('day', 86400), ('hour', 3600), ('minute', 60)):
        if s >= secs:
            n = int(s // secs)
            return f'{n} {unit}{"s" if n > 1 else ""} ago'
    return 'just now'


def biggest_image(node):
    """Largest image URL (by width) found inside a JSON subtree."""
    best, best_w = None, -1
    for d in walk(node):
        u = d.get('url')
        if isinstance(u, str) and (u.startswith('http') or u.startswith('//')):
            w = d.get('width') or 0
            if w > best_w:
                best, best_w = u, w
    if best and best.startswith('//'):
        best = 'https:' + best
    return best


# ─────────────────────────── channel page ───────────────────────────

def fetch_channel(handle):
    url = f'{YT}/{handle}'
    print(f'→ {url}')
    page = get(url)
    data = initial_data(page) or {}
    info = {'handle': handle, 'url': f'youtube.com/{handle}'}

    name = meta(page, 'og:title')
    if name:
        info['name'] = name.replace(' - YouTube', '').strip()
    desc = meta(page, 'og:description') or meta(page, 'description')
    if desc:
        info['description'] = re.sub(r'\s+', ' ', desc).strip()

    cid = (re.search(r'"(?:externalId|channelId|browseId)":\s*"(UC[\w-]{22})"', page) or
           re.search(r'channel/(UC[\w-]{22})', page))
    info['_channelId'] = cid.group(1) if cid else None

    all_text = ' '.join(strings(data)) + ' ' + page
    subs = re.search(r'([\d.,]+\s?[KMB]?)\s+subscribers', all_text)
    if subs:
        info['subscribers'] = f'{subs.group(1).replace(" ", "")} subscribers'
    vids = re.search(r'([\d.,]+\s?[KMB]?)\s+videos', all_text)
    if vids:
        info['videoCount'] = f'{vids.group(1).replace(" ", "")} videos'

    avatar = meta(page, 'og:image')
    banner = None
    for d in walk(data):
        if 'banner' in d and banner is None:
            banner = biggest_image(d['banner'])
        if 'imageBannerViewModel' in d and banner is None:
            banner = biggest_image(d['imageBannerViewModel'])
    return info, avatar, banner


def fetch_videos(handle, channel_id, limit=8):
    videos = []
    # 1) RSS feed: stable titles, ids, views and dates
    if channel_id:
        try:
            feed = get(f'{YT}/feeds/videos.xml?channel_id={channel_id}')
            ns = {'a': 'http://www.w3.org/2005/Atom', 'yt': 'http://www.youtube.com/xml/schemas/2015',
                  'media': 'http://search.yahoo.com/mrss/'}
            root = ET.fromstring(feed)
            for e in root.findall('a:entry', ns):
                vid = e.findtext('yt:videoId', default='', namespaces=ns)
                if not vid:
                    continue
                if '/shorts/' in (e.find('a:link', ns).get('href') if e.find('a:link', ns) is not None else ''):
                    continue
                stats = e.find('media:group/media:community/media:statistics', ns)
                views = stats.get('views') if stats is not None else None
                videos.append({
                    'id': vid,
                    'title': e.findtext('a:title', default='', namespaces=ns),
                    'views': f'{compact(views)} views' if views else '',
                    'age': ago(e.findtext('a:published', default='', namespaces=ns)),
                })
        except (urllib.error.URLError, ET.ParseError, TimeoutError) as err:
            print(f'  ! RSS feed: {err}')

    # 2) /videos tab: durations (and a fallback list if RSS failed)
    durations = {}
    try:
        page = get(f'{YT}/{handle}/videos')
        data = initial_data(page) or {}
        for d in walk(data):
            vid = d.get('videoId') or d.get('contentId')
            if not isinstance(vid, str) or len(vid) != 11:
                continue
            texts = list(strings(d))
            dur = next((t for t in texts if re.fullmatch(r'\d{1,2}:\d{2}(:\d{2})?', t)), None)
            if dur and vid not in durations:
                durations[vid] = dur
            if not any(v['id'] == vid for v in videos) and len(videos) < limit * 2:
                title = text_of(d.get('title')) or next(
                    (text_of(x.get('title')) for x in walk(d) if isinstance(x, dict) and text_of(x.get('title'))), None)
                views = next((t for t in texts if re.search(r'views?$', t)), '')
                age_t = next((t for t in texts if t.endswith('ago')), '')
                if title:
                    videos.append({'id': vid, 'title': title, 'views': views, 'age': age_t})
    except (urllib.error.URLError, TimeoutError) as err:
        print(f'  ! /videos tab: {err}')

    for v in videos:
        if v['id'] in durations:
            v['duration'] = durations[v['id']]
    return videos[:limit]


# ─────────────────────────── palette ───────────────────────────

def extract_palette(path, n=3):
    """Accent colours from the logo, most prominent vivid hues first → gradient order."""
    try:
        from PIL import Image
    except ImportError:
        print('  ! Pillow not installed (pip install pillow) — keeping the stand-in colours')
        return None
    import colorsys

    im = Image.open(path).convert('RGB').resize((160, 160))
    q = im.quantize(colors=16, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()
    counts = sorted(q.getcolors(), reverse=True)
    total = sum(c for c, _ in counts)
    cands = []
    for count, idx in counts:
        r, g, b = pal[idx * 3: idx * 3 + 3]
        h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        # skip near-black, whites, greys, and tiny anti-aliasing blends
        if v < 0.4 or s < 0.3 or count < total * 0.01:
            continue
        cands.append((count * s * v, h, s, v, (r, g, b)))
    cands.sort(reverse=True)
    picked = []
    for _, h, s, v, rgb in cands:
        if all(min(abs(h - p[0]), 1 - abs(h - p[0])) > 0.06 for p in picked):
            picked.append((h, s, v, rgb))
        if len(picked) == n:
            break
    if not picked:
        return None
    # not enough distinct hues → derive neighbours from the main colour
    while len(picked) < n:
        h, s, v, _ = picked[0]
        nh = (h + (0.09 if len(picked) == 1 else -0.08)) % 1
        r, g, b = colorsys.hsv_to_rgb(nh, max(0.55, s), max(0.75, v))
        picked.append((nh, s, v, (int(r * 255), int(g * 255), int(b * 255))))

    def boost(rgb):
        h, s, v = colorsys.rgb_to_hsv(*(c / 255 for c in rgb))
        r, g, b = colorsys.hsv_to_rgb(h, max(s, 0.55), max(v, 0.82))
        return '#%02x%02x%02x' % (int(r * 255), int(g * 255), int(b * 255))

    out = [boost(p[3]) for p in picked]
    # most prominent colour drives the main glow ('blue' role), the next two the accents
    return [out[1], out[0], out[2]] if len(out) >= 3 else out


def find_avatar():
    for ext in ('png', 'jpg', 'jpeg', 'webp'):
        p = os.path.join(BRAND_DIR, f'avatar.{ext}')
        if os.path.exists(p):
            return p
    return None


def write_live(update):
    live = {}
    if os.path.exists(LIVE_JSON):
        try:
            live = json.load(open(LIVE_JSON))
        except json.JSONDecodeError:
            live = {}
    live.update(update)
    with open(LIVE_JSON, 'w') as f:
        json.dump(live, f, indent=2, ensure_ascii=False)
        f.write('\n')
    print(f'  ✓ {os.path.relpath(LIVE_JSON, ROOT)}')


def main():
    os.makedirs(BRAND_DIR, exist_ok=True)
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if '--colors-only' in sys.argv:
        av = find_avatar()
        if not av:
            sys.exit('No public/brand/avatar.(png|jpg|webp) found.')
        pal = extract_palette(av)
        if pal:
            write_live({'palette': pal})
            print('palette', pal)
        return

    handle = args[0] if args else '@Cloud-Codes'
    if not handle.startswith('@'):
        handle = '@' + handle
    try:
        info, avatar, banner = fetch_channel(handle)
    except (urllib.error.URLError, TimeoutError) as e:
        sys.exit(f'Could not reach YouTube ({e}). Allow youtube.com, yt3.googleusercontent.com, '
                 'yt3.ggpht.com and i.ytimg.com, or run this on your own computer.')

    print(f"channel: {info.get('name')} · {info.get('subscribers')} · {info.get('videoCount')}")
    if avatar:
        avatar = re.sub(r'=s\d+-', '=s900-', avatar)
        save(avatar, os.path.join(BRAND_DIR, 'avatar.jpg'))
    if banner:
        big = re.sub(r'=w\d+[^"]*$', '=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj', banner)
        if not save(big, os.path.join(BRAND_DIR, 'banner.jpg')):
            save(banner, os.path.join(BRAND_DIR, 'banner.jpg'))

    videos = fetch_videos(handle, info.pop('_channelId', None))
    for i, v in enumerate(videos):
        target = os.path.join(BRAND_DIR, f'thumb-{i + 1}.jpg')
        if not save(f"{THUMB}/vi/{v['id']}/maxresdefault.jpg", target):
            save(f"{THUMB}/vi/{v['id']}/hqdefault.jpg", target)

    update = {
        'channel': {k: v for k, v in info.items() if v},
        'videos': [{k: v[k] for k in ('title', 'views', 'age', 'duration') if v.get(k)} for v in videos],
        'fetchedAt': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'),
    }
    av = find_avatar()
    pal = extract_palette(av) if av else None
    if pal:
        update['palette'] = pal
        print('palette', pal)
    write_live(update)
    print('Done. Render again (npm run render) to use the real branding.')


if __name__ == '__main__':
    main()

import io
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

SRC = "/Users/novid/claude/platform-gitops/apps/www/schibsted-grotesk.woff2"
TEXT = "nuved."
TRACKING_EM = -0.03          # .mark letter-spacing on the homepage header
WEIGHT = 700                 # .mark font-weight

f = TTFont(SRC)                                  # fontTools reads woff2 via brotli
f = instancer.instantiateVariableFont(f, {"wght": WEIGHT})
upm = f["head"].unitsPerEm
gs = f.getGlyphSet()
cmap = f.getBestCmap()
hmtx = f["hmtx"]
track = TRACKING_EM * upm

paths, x = [], 0.0
minx = miny = 1e9; maxx = maxy = -1e9
for ch in TEXT:
    gname = cmap[ord(ch)]
    pen = SVGPathPen(gs, ntos=lambda v: f"{v:.1f}")
    gs[gname].draw(pen)
    d = pen.getCommands()
    if d:
        paths.append((d, x))
        bp = BoundsPen(gs); gs[gname].draw(bp)
        if bp.bounds:
            x0,y0,x1,y1 = bp.bounds
            minx=min(minx,x0+x); miny=min(miny,y0); maxx=max(maxx,x1+x); maxy=max(maxy,y1)
    x += hmtx[gname][0] + track

W, H, PAD = 600, 160, 12
gw, gh = maxx-minx, maxy-miny
scale = min((W-2*PAD)/gw, (H-2*PAD)/gh)
tx = (W - gw*scale)/2 - minx*scale
ty = (H - gh*scale)/2 + maxy*scale   # +maxy because the y axis is flipped below

def svg(colour):
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="nuved.">',
           '<title>nuved.</title>',
           f'<g fill="{colour}" transform="translate({tx:.2f} {ty:.2f}) scale({scale:.5f} -{scale:.5f})">']
    for d, dx in paths:
        out.append(f'<path transform="translate({dx:.1f} 0)" d="{d}"/>')
    out += ['</g>', '</svg>', '']
    return "\n".join(out)

open("nuved-wordmark.svg","w").write(svg("#0B5563"))
open("nuved-wordmark-dark.svg","w").write(svg("#E3ECEB"))
print(f"upm={upm} glyph box={gw:.0f}x{gh:.0f} scale={scale:.4f} paths={len(paths)}")

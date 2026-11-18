import base64, sys, os, re
ROOT = os.path.dirname(os.path.abspath(__file__))
ORDER = ['00_core','01_audio','02_art','03_kit3d','04_models','05_world','06_data','06b_data2','06c_data3','07_hero','08_story','08b_story1x','08c_story2','08d_story3','08c2_story2x','08e_story4','09_chapters','10_r3d','11_battle','12_bview','13_skills','13c_champs','14_hud','15_book','16_main']
FONTS = [('IM Fell English','fell.woff2','normal','normal'),('IM Fell English','fell-italic.woff2','normal','italic'),('IM Fell English SC','fell-sc.woff2','normal','normal'),('Cinzel','cinzel.woff2','700','normal'),('Grenze Gotisch','grenze.woff2','800','normal')]
CDN = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/'
EX = ['shaders/CopyShader.js','shaders/LuminosityHighPassShader.js','postprocessing/EffectComposer.js','postprocessing/RenderPass.js','postprocessing/ShaderPass.js','postprocessing/UnrealBloomPass.js']
def build(dev):
    html = open(os.path.join(ROOT,'src/index.html')).read()
    css = open(os.path.join(ROOT,'src/css/style.css')).read()
    fonts = ''
    for fam, f, w, s in FONTS:
        if dev: src = f"url('../fonts/{f}') format('woff2')"
        else: src = "url(data:font/woff2;base64,%s) format('woff2')" % base64.b64encode(open(os.path.join(ROOT,'fonts',f),'rb').read()).decode()
        fonts += "@font-face{font-family:'%s';src:%s;font-weight:%s;font-style:%s;font-display:swap}\n" % (fam, src, w, s)
    js = '\n'.join(open(os.path.join(ROOT,'src/js',n+'.js')).read() for n in ORDER)
    if dev:
        three = '<script src="../node_modules/three/build/three.min.js"></script>\n' + '\n'.join(f'<script src="../node_modules/three/examples/js/{e}"></script>' for e in EX)
    else:
        three = '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n' + '\n'.join(f'<script src="{CDN}{e}"></script>' for e in EX)
    html = html.replace('/*FONTS*/', fonts).replace('/*CSS*/', css).replace('<!--THREE-->', three).replace('/*JS*/', js.replace('</script', '<\\/script'))
    out = os.path.join(ROOT, 'dist', 'dev.html' if dev else 'index.html')
    open(out,'w').write(html)
    print(out, len(html)//1024, 'KB')
os.makedirs(os.path.join(ROOT,'dist'), exist_ok=True)
build(True); build(False)

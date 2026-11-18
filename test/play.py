import sys, asyncio, json
from playwright.async_api import async_playwright
import os
URL = os.environ.get('URL', 'file:///home/claude/ink-and-valor/dist/dev.html')
async def main(steps, W, H):
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        pg = await b.new_page(viewport={'width':W,'height':H})
        errs=[]
        pg.on('console', lambda m: errs.append(f'{m.type}: {m.text}') if m.type in ('error','warning') and 'ReadPixels' not in m.text else None)
        pg.on('pageerror', lambda e: errs.append(f'pageerror: {e}'))
        await pg.goto(URL)
        await pg.wait_for_timeout(1500)
        for st in steps:
            kind = st[0]
            if kind == 'shot': await pg.screenshot(path=st[1])
            elif kind == 'wait': await pg.wait_for_timeout(st[1])
            elif kind == 'click': await pg.evaluate('(s)=>document.querySelector(s).click()', st[1])
            elif kind == 'js': r = await pg.evaluate(st[1]); print('js->', r)
            elif kind == 'mouse': await pg.mouse.click(st[1], st[2])
            elif kind == 'reload': await pg.reload(); await pg.wait_for_timeout(1500)
        for e in errs[:25]: print(e)
        await b.close()
steps = json.loads(sys.argv[1]); W = int(sys.argv[2]) if len(sys.argv)>2 else 1600; H = int(sys.argv[3]) if len(sys.argv)>3 else 900
asyncio.run(main(steps, W, H))

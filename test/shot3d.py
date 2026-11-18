import sys, asyncio
from playwright.async_api import async_playwright
async def main(url, out, w, h, wait):
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        pg = await b.new_page(viewport={'width':w,'height':h})
        errs=[]
        pg.on('console', lambda m: errs.append(f'{m.type}: {m.text}') if m.type in ('error','warning') else None)
        pg.on('pageerror', lambda e: errs.append(f'pageerror: {e}'))
        await pg.goto(url)
        await pg.wait_for_timeout(wait)
        await pg.screenshot(path=out)
        for e in errs[:20]: print(e)
        await b.close()
a=sys.argv
asyncio.run(main(a[1], a[2], int(a[3]) if len(a)>3 else 1600, int(a[4]) if len(a)>4 else 900, int(a[5]) if len(a)>5 else 1500))

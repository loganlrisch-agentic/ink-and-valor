import sys, asyncio
from playwright.async_api import async_playwright
async def main(url, out, w=1600, h=900, wait=400):
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width':w,'height':h})
        errs=[]
        pg.on('console', lambda m: errs.append(f'{m.type}: {m.text}') if m.type in ('error','warning') else None)
        pg.on('pageerror', lambda e: errs.append(f'pageerror: {e}'))
        await pg.goto(url)
        await pg.wait_for_timeout(wait)
        await pg.screenshot(path=out)
        for e in errs: print(e)
        await b.close()
w = int(sys.argv[3]) if len(sys.argv)>3 else 1600
h = int(sys.argv[4]) if len(sys.argv)>4 else 900
asyncio.run(main(sys.argv[1], sys.argv[2], w, h))

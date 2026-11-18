import asyncio, sys
from playwright.async_api import async_playwright
SECS = [int(x) for x in sys.argv[1].split(',')]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        pg = await b.new_page(viewport={'width':1600,'height':900})
        errs=[]
        pg.on('console', lambda m: errs.append(f'{m.type}: {m.text}') if m.type in ('error','warning') and 'ReadPixels' not in m.text else None)
        pg.on('pageerror', lambda e: errs.append(f'pageerror: {e}'))
        await pg.goto('file:///home/claude/inkvalor/dist/dev.html'); await pg.wait_for_timeout(1200)
        await pg.evaluate("document.querySelector('[data-t=new]').click()"); await pg.wait_for_timeout(800)
        await pg.evaluate("document.querySelector('#cGo').click()"); await pg.wait_for_timeout(800)
        for s in SECS:
            await pg.evaluate(f"Book.go({s})"); await pg.wait_for_timeout(2600)
            await pg.screenshot(path=f'test/sec{s}.png', clip={'x':160,'y':60,'width':680,'height':520})
        for e in errs[:15]: print(e)
        await b.close()
asyncio.run(main())

from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Collect console messages
    messages = []
    page.on("console", lambda msg: messages.append(f"[{page.url}] {msg.type}: {msg.text}"))

    # Check pages
    urls = ["http://localhost:3000/", "http://localhost:3000/editor", "http://localhost:3000/portfolio"]
    for url in urls:
        page.goto(url)
        page.wait_for_load_state("domcontentloaded")

    # Print console messages
    for msg in messages:
        print(msg)

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
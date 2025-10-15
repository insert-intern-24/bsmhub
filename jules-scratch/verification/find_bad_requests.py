from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    def handle_response(response):
        if response.status == 400:
            print(f"Bad Request URL: {response.url}")
            print(f"Request Method: {response.request.method}")
            # print(f"Request Post Data: {response.request.post_data}")

    page.on("response", handle_response)

    # Go to a portfolio page
    page.goto("http://localhost:3000/portfolio/Minjae-Kwon", wait_until="networkidle")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
import { NextRequest, NextResponse } from "next/server"
import { JSDOM } from "jsdom"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch URL" },
        { status: response.status }
      )
    }

    const html = await response.text()
    const dom = new JSDOM(html)
    const doc = dom.window.document

    const getMetaContent = (property: string) => {
      const element = doc.querySelector(`meta[property="${property}"]`) || doc.querySelector(`meta[name="${property}"]`)
      return element ? element.getAttribute("content") : null
    }

    const title =
      getMetaContent("og:title") ||
      doc.querySelector("title")?.textContent ||
      ""
    const description =
      getMetaContent("og:description") ||
      getMetaContent("description") ||
      ""
    const image = getMetaContent("og:image") || ""

    return NextResponse.json({
      title,
      description,
      image,
      url,
    })
  } catch (error) {
    console.error("Error fetching OG data:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

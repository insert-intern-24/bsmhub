import { NodeViewWrapper, NodeViewProps } from "@tiptap/react"
import { useEffect, useState } from "react"
import { IconLink } from "@tabler/icons-react"

export const LinkCardComponent = ({
  node,
  updateAttributes,
}: NodeViewProps) => {
  const { href, title, description, image } = node.attrs
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // If we already have metadata, don't fetch again
    if (title || description || image) return

    const fetchMetadata = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `/api/og-fetch?url=${encodeURIComponent(href)}`
        )
        if (response.ok) {
          const data = await response.json()
          updateAttributes({
            title: data.title,
            description: data.description,
            image: data.image,
          })
        }
      } catch (error) {
        console.error("Failed to fetch link metadata:", error)
      } finally {
        setLoading(false)
      }
    }

    if (href) {
      fetchMetadata()
    }
  }, [href, title, description, image, updateAttributes])

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    window.open(href, "_blank", "noopener,noreferrer")
  }

  return (
    <NodeViewWrapper className="link-card-wrapper" data-drag-handle>
      <a href={href} onClick={handleCardClick} className="link-card">
        <div className="link-card__content">
          <div className="link-card__title">
            {title || (loading ? "Loading..." : href)}
          </div>
          <div className="link-card__description">
            {description || (loading ? "Fetching metadata..." : "")}
          </div>
          <div className="link-card__url">
            <IconLink size={14} />
            {new URL(href).hostname}
          </div>
        </div>
        {image && (
          <div className="link-card__image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={title || "Link preview"} />
          </div>
        )}
        {!image && loading && (
            <div className="link-card__image link-card__image--placeholder">
                Loading...
            </div>
        )}
      </a>
    </NodeViewWrapper>
  )
}

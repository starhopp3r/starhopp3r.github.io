# frozen_string_literal: true

# Points each post image at the WebP copies that _tools/images.py makes and lists in _data/images.yml, so a
# browser fetches only the size it shows. The tag also gets the original's width and height, so the text
# doesn't jump as images arrive. Images without copies are left as they are.
module ResponsiveImages
  COLUMN = 736 # The widest the reading column gets, in CSS pixels.
  FALLBACK = 1472 # The copy for browsers that ignore srcset: sharp at the column's width on any screen.

  def self.rewrite(tag, images)
    src = tag[/\ssrc="([^"]+)"/, 1]
    image = images[src] if src
    return tag if image.nil? || tag.include?(" srcset=")

    width, height, copies = image.values_at("width", "height", "copies")
    base = src.sub(%r{\A/assets/img/}, "/assets/img/sized/").sub(/\.[^.]+\z/, "")
    shown = [width, COLUMN].min
    attributes = [
      %(src="#{base}-#{copies.select { |copy| copy <= FALLBACK }.max || copies.min}.webp"),
      %(srcset="#{copies.map { |copy| "#{base}-#{copy}.webp #{copy}w" }.join(", ")}"),
      %(sizes="(max-width: #{shown + 48}px) calc(100vw - 48px), #{shown}px"),
    ]
    attributes << %(width="#{width}" height="#{height}") unless tag.include?(" width=")
    tag.sub(/\ssrc="[^"]+"/, " #{attributes.join(" ")}")
  end
end

Jekyll::Hooks.register [:posts, :pages], :post_render do |document|
  images = document.site.data["images"]
  next unless images && document.output_ext == ".html"

  document.output = document.output.gsub(/<img\b[^>]*>/) { |tag| ResponsiveImages.rewrite(tag, images) }
end

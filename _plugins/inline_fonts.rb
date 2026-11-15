# frozen_string_literal: true

# Lets the stylesheet carry a font inside the page instead of pointing at its file, so the first paint already
# has the font and no text flashes in a system font. _tools/fonts.py makes the small copies worth carrying.
#   {{ '/assets/fonts/crimson-text/normal-basic.woff2' | font_src: true }}   the font itself, as a data URI
#   {{ '/assets/fonts/crimson-text/italic-basic.woff2' | font_src: false }}  the path, for the browser to fetch
module InlineFonts
  DATA = {}

  def font_src(path, inline)
    return path unless inline

    file = @context.registers[:site].in_source_dir(path)
    DATA[[file, File.mtime(file)]] ||= "data:font/woff2;base64,#{[File.binread(file)].pack("m0")}"
  end
end

Liquid::Template.register_filter(InlineFonts)

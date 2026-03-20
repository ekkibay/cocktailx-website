#!/bin/bash
# Generate SVG placeholder images for Cocktail X Festival
# Uses brand colors from the design system

set -e

DIR="$(cd "$(dirname "$0")/.." && pwd)/public/images/placeholder"
mkdir -p "$DIR"

generate_svg() {
  local file="$1" w="$2" h="$3" bg="$4" label="$5"
  cat > "$DIR/$file" <<SVGEOF
<svg xmlns="http://www.w3.org/2000/svg" width="$w" height="$h" viewBox="0 0 $w $h">
  <rect width="$w" height="$h" fill="$bg"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-family="sans-serif" font-size="20" fill="#F5F0E8" opacity="0.6">$label</text>
</svg>
SVGEOF
  echo "  Created $file ($w x $h)"
}

echo "Generating placeholder images..."

# Hero background
generate_svg "hero-bg.svg" 1920 1080 "#191513" "Hero Background"

# Bars (6)
for i in 1 2 3 4 5 6; do
  generate_svg "bar-$i.svg" 600 400 "#523113" "Bar $i"
done

# Events (3) - different brand colors
generate_svg "event-1.svg" 800 500 "#D4A843" "Grand Opening"
generate_svg "event-2.svg" 800 500 "#523113" "Festival Days"
generate_svg "event-3.svg" 800 500 "#223a7b" "Closing &amp; Awards"

# Cocktails (3)
for i in 1 2 3; do
  generate_svg "cocktail-$i.svg" 500 600 "#523113" "Cocktail $i"
done

# Sponsors (5)
for i in 1 2 3 4 5; do
  generate_svg "sponsor-$i.svg" 200 80 "#191513" "Sponsor $i"
done

# Blog posts (3)
for i in 1 2 3; do
  generate_svg "blog-$i.svg" 800 450 "#223a7b" "Blog $i"
done

# Misc
generate_svg "about.svg" 800 600 "#191513" "About"
generate_svg "newsletter-bg.svg" 1920 600 "#191513" "Newsletter"
generate_svg "founder.svg" 600 600 "#191513" "Founder"

echo "Done! Generated $(ls "$DIR"/*.svg | wc -l | tr -d ' ') placeholder images in $DIR"

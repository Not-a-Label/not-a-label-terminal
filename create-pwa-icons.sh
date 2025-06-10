#!/bin/bash

# 🎨 Create PWA Icons for Not a Label

echo "🎨 Creating PWA icons..."

# Upload SVG icons and convert to PNG on server
ssh root@159.89.247.208 << 'ENDSSH'
cd /var/www/not-a-label

# Create 192x192 PNG icon
cat > icon-192.svg << 'EOF'
<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" fill="#000000"/>
  <rect x="20" y="20" width="152" height="152" fill="none" stroke="#00ff00" stroke-width="4" rx="20"/>
  <text x="96" y="85" text-anchor="middle" fill="#00ff00" font-size="32" font-family="monospace" font-weight="bold">N.A.L</text>
  <text x="96" y="110" text-anchor="middle" fill="#00ff00" font-size="48">🎵</text>
  <text x="96" y="140" text-anchor="middle" fill="#00ff00" font-size="14" font-family="monospace">AI Music</text>
  <text x="96" y="160" text-anchor="middle" fill="#00ff00" font-size="12" font-family="monospace">Terminal</text>
</svg>
EOF

# Create 512x512 PNG icon  
cat > icon-512.svg << 'EOF'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#000000"/>
  <rect x="50" y="50" width="412" height="412" fill="none" stroke="#00ff00" stroke-width="8" rx="50"/>
  <text x="256" y="200" text-anchor="middle" fill="#00ff00" font-size="64" font-family="monospace" font-weight="bold">NOT A LABEL</text>
  <text x="256" y="290" text-anchor="middle" fill="#00ff00" font-size="120">🎵</text>
  <text x="256" y="350" text-anchor="middle" fill="#00ff00" font-size="32" font-family="monospace">AI Music Terminal</text>
  <text x="256" y="390" text-anchor="middle" fill="#00ff00" font-size="24" font-family="monospace">Enhanced Features</text>
</svg>
EOF

# If ImageMagick is available, convert SVG to PNG
if command -v convert >/dev/null 2>&1; then
    echo "✅ Converting SVG to PNG with ImageMagick..."
    convert icon-192.svg icon-192.png
    convert icon-512.svg icon-512.png
    echo "✅ PNG icons created"
else
    echo "⚠️ ImageMagick not available, using SVG icons as fallback"
    # Copy SVG as PNG fallback (browsers can handle SVG)
    cp icon-192.svg icon-192.png
    cp icon-512.svg icon-512.png
fi

# Create favicon
cat > favicon.ico << 'EOF'
<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#000000"/>
  <rect x="4" y="4" width="24" height="24" fill="none" stroke="#00ff00" stroke-width="2" rx="4"/>
  <text x="16" y="22" text-anchor="middle" fill="#00ff00" font-size="16">🎵</text>
</svg>
EOF

# Set permissions
chmod 644 *.svg *.png *.ico

echo "✅ PWA icons created and configured"

ENDSSH

echo "✅ PWA icons deployment complete!"
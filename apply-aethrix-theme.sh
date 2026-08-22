#!/bin/bash

set -e

FRONTEND="frontend"

echo "🚀 Updating AETHRIX premium theme..."

# --------------------------------------------------
# 1. Backup important files
# --------------------------------------------------

cp "$FRONTEND/src/components/Hero/Hero.jsx" \
   "$FRONTEND/src/components/Hero/Hero.jsx.backup"

cp "$FRONTEND/src/components/Navbar/Navbar.jsx" \
   "$FRONTEND/src/components/Navbar/Navbar.jsx.backup"

cp "$FRONTEND/src/main.jsx" \
   "$FRONTEND/src/main.jsx.backup"

cp "$FRONTEND/src/index.css" \
   "$FRONTEND/src/index.css.backup"

cp "$FRONTEND/src/styles/theme.css" \
   "$FRONTEND/src/styles/theme.css.backup"

echo "✅ Backups created"

# --------------------------------------------------
# 2. Create ThemeContext
# --------------------------------------------------

mkdir -p "$FRONTEND/src/context"

cat > "$FRONTEND/src/context/ThemeContext.jsx" <<'EOF'
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('aethrix_theme') || 'dark'
  );

  useEffect(() => {
    const root = document.documentElement;

    localStorage.setItem('aethrix_theme', theme);

    const applyTheme = (value) => {
      root.dataset.theme = value;
    };

    if (theme === 'system') {
      const media = window.matchMedia(
        '(prefers-color-scheme: dark)'
      );

      applyTheme(media.matches ? 'dark' : 'light');

      const handleChange = (event) => {
        applyTheme(event.matches ? 'dark' : 'light');
      };

      media.addEventListener('change', handleChange);

      return () => {
        media.removeEventListener('change', handleChange);
      };
    }

    applyTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme must be used inside ThemeProvider'
    );
  }

  return context;
};
EOF

echo "✅ ThemeContext created"

# --------------------------------------------------
# 3. Update main.jsx
# --------------------------------------------------

python3 <<'PY'
from pathlib import Path

path = Path("frontend/src/main.jsx")
text = path.read_text()

if "ThemeContext" not in text:
    text = text.replace(
        "import { WishlistProvider } from \"./context/WishlistContext\";",
        "import { WishlistProvider } from \"./context/WishlistContext\";\nimport { ThemeProvider } from './context/ThemeContext.jsx';"
    )

old = """      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>"""

new = """      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <App />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>"""

if old in text:
    text = text.replace(old, new)

path.write_text(text)
PY

echo "✅ main.jsx updated"

# --------------------------------------------------
# 4. Replace Hero background
# --------------------------------------------------

python3 <<'PY'
from pathlib import Path

path = Path("frontend/src/components/Hero/Hero.jsx")
text = path.read_text()

old = """      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#05070d] via-[#0a0e1a] to-[#05070d]" />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,#fff,#fff 1px,transparent 1px,transparent 64px),repeating-linear-gradient(90deg,#fff,#fff 1px,transparent 1px,transparent 64px)',
        }}
      />

      <div className="absolute w-[600px] h-[600px] rounded-full bg-brand-gold/10 blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
"""

new = """      {/* Premium AETHRIX background */}
      <div className="absolute inset-0 bg-[#060606]" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              circle at 72% 32%,
              rgba(212,175,55,0.14),
              transparent 26%
            ),
            radial-gradient(
              circle at 25% 70%,
              rgba(255,255,255,0.035),
              transparent 24%
            ),
            linear-gradient(
              135deg,
              #050505 0%,
              #0a0a0b 45%,
              #070707 100%
            )
          `,
        }}
      />

      {/* Subtle luxury glow */}
      <div
        className="
          absolute
          top-[18%]
          right-[8%]
          w-[420px]
          h-[420px]
          rounded-full
          border
          border-brand-gold/20
          opacity-70
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          top-[22%]
          right-[12%]
          w-[330px]
          h-[330px]
          rounded-full
          bg-brand-gold/[0.035]
          blur-[90px]
          pointer-events-none
        "
      />
"""

if old not in text:
    print("⚠️ Hero background block not found")
else:
    text = text.replace(old, new)
    path.write_text(text)
PY

echo "✅ Hero background updated"

# --------------------------------------------------
# 5. Add theme support to Navbar
# --------------------------------------------------

python3 <<'PY'
from pathlib import Path

path = Path("frontend/src/components/Navbar/Navbar.jsx")
text = path.read_text()

# Import theme hook
if 'ThemeContext' not in text:
    text = text.replace(
        'import { useWishlist } from "../../context/WishlistContext";',
        'import { useWishlist } from "../../context/WishlistContext";\nimport { useTheme } from "../../context/ThemeContext";'
    )

# Import theme icons
if 'TbSun' not in text:
    text = text.replace(
        '  TbMapPin,',
        '  TbMapPin,\n  TbSun,\n  TbMoon,\n  TbDeviceDesktop,'
    )

# Theme state
old_state = """  const [searchOpen, setSearchOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);"""

new_state = """  const [searchOpen, setSearchOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const { theme, setTheme } = useTheme();"""

if old_state in text and 'const { theme, setTheme } = useTheme();' not in text:
    text = text.replace(old_state, new_state)

# Theme selector
marker = """          <div className="flex items-center gap-1 sm:gap-1 shrink-0">

            {/* Search - desktop only */}"""

theme_selector = """          <div className="flex items-center gap-1 sm:gap-1 shrink-0">

            {/* Theme Toggle */}
<button
  type="button"
  aria-label="Toggle theme"
  onClick={() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }}
  className="
    hidden
    sm:flex
    items-center
    justify-center
    w-9
    h-9
    rounded-lg
    border
    border-white/10
    text-white/70
    hover:text-brand-gold
    hover:border-brand-gold/50
    transition-all
    duration-300
    shrink-0
  "
>
  {theme === 'dark' ? (
    <TbSun size={19} />
  ) : (
    <TbMoon size={19} />
  )}
</button>

            {/* Search - desktop only */}"""

if marker in text and 'Theme selector' not in text:
    text = text.replace(marker, theme_selector)

path.write_text(text)
PY

echo "✅ Navbar theme selector added"

# --------------------------------------------------
# 6. Replace old theme.css
# --------------------------------------------------

cat > "$FRONTEND/src/styles/theme.css" <<'EOF'
:root {
  --aethrix-bg: #060606;
  --aethrix-surface: #111111;
  --aethrix-surface-soft: #171717;

  --aethrix-text: #ffffff;
  --aethrix-muted: rgba(255, 255, 255, 0.55);
  --aethrix-border: rgba(255, 255, 255, 0.1);

  --aethrix-gold: #d4af37;
}

html[data-theme="light"] {
  --aethrix-bg: #f7f7f5;
  --aethrix-surface: #ffffff;
  --aethrix-surface-soft: #f0f0ed;

  --aethrix-text: #111111;
  --aethrix-muted: rgba(0, 0, 0, 0.55);
  --aethrix-border: rgba(0, 0, 0, 0.1);

  --aethrix-gold: #b38b16;
}

html,
body {
  background: var(--aethrix-bg);
  color: var(--aethrix-text);
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

a {
  text-decoration: none;
  color: inherit;
}

img {
  border-radius: 20px;
}
EOF

echo "✅ Theme styles updated"

# --------------------------------------------------
# 7. Add global theme variables
# --------------------------------------------------

cat >> "$FRONTEND/src/index.css" <<'EOF'

/* =========================================================
   AETHRIX THEME SYSTEM
   ========================================================= */

:root {
  --aethrix-bg: #060606;
  --aethrix-surface: #111111;
  --aethrix-text: #ffffff;
  --aethrix-muted: rgba(255,255,255,.55);
  --aethrix-border: rgba(255,255,255,.1);
  --aethrix-gold: #d4af37;
}

html[data-theme="light"] {
  --aethrix-bg: #f7f7f5;
  --aethrix-surface: #ffffff;
  --aethrix-text: #111111;
  --aethrix-muted: rgba(0,0,0,.55);
  --aethrix-border: rgba(0,0,0,.1);
  --aethrix-gold: #b38b16;
}

body {
  background-color: var(--aethrix-bg);
  color: var(--aethrix-text);
  transition:
    background-color .3s ease,
    color .3s ease;
}
EOF

echo "✅ Global theme variables added"

# --------------------------------------------------
# 8. Remove old floating shapes if still present
# --------------------------------------------------

python3 <<'PY'
from pathlib import Path
import re

path = Path("frontend/src/components/Hero/Hero.jsx")
text = path.read_text()

text = re.sub(
    r'\n\s*\{/\* Floating shapes \*/\}.*?(?=\n\s*<motion\.div)',
    '',
    text,
    flags=re.S
)

path.write_text(text)
PY

echo "✅ Floating Hero boxes removed"

# --------------------------------------------------
# 9. Check files
# --------------------------------------------------

echo ""
echo "======================================"
echo "AETHRIX THEME UPDATE COMPLETE"
echo "======================================"
echo ""
echo "Logo: UNCHANGED"
echo "Hero: New premium background"
echo "Floating boxes: Removed"
echo "Theme: Light / Dark / System"
echo "Theme preference: Saved in localStorage"
echo ""
echo "Now run:"
echo ""
echo "cd frontend"
echo "npm run dev"
echo ""

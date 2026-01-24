#!/bin/bash
# Anthropic Skills Installation Script
# Installs curated skills from https://github.com/anthropics/skills

set -e

echo "🚀 Installing Anthropic Skills to ~/.claude/skills/"
echo ""

# Create temporary directory
TEMP_DIR=$(mktemp -d)
echo "📁 Using temporary directory: $TEMP_DIR"

# Clone repository
echo "📦 Cloning Anthropic skills repository..."
git clone --depth 1 https://github.com/anthropics/skills.git "$TEMP_DIR" 2>/dev/null || {
    echo "❌ Failed to clone repository. Check internet connection."
    exit 1
}

# Create skills directory if not exists
mkdir -p ~/.claude/skills

# Tier 1: Essential Skills (Must Install)
echo ""
echo "=== Tier 1: Essential Skills ==="
echo ""

# 1. webapp-testing
if [ -d ~/.claude/skills/webapp-testing ]; then
    echo "⏭️  webapp-testing already exists, skipping..."
else
    echo "📦 Installing webapp-testing..."
    cp -r "$TEMP_DIR/skills/webapp-testing" ~/.claude/skills/
    echo "✅ webapp-testing installed"
fi

# 2. doc-coauthoring
if [ -d ~/.claude/skills/doc-coauthoring ]; then
    echo "⏭️  doc-coauthoring already exists, skipping..."
else
    echo "📦 Installing doc-coauthoring..."
    cp -r "$TEMP_DIR/skills/doc-coauthoring" ~/.claude/skills/
    echo "✅ doc-coauthoring installed"
fi

# 3. web-artifacts-builder
if [ -d ~/.claude/skills/web-artifacts-builder ]; then
    echo "⏭️  web-artifacts-builder already exists, skipping..."
else
    echo "📦 Installing web-artifacts-builder..."
    cp -r "$TEMP_DIR/skills/web-artifacts-builder" ~/.claude/skills/
    echo "✅ web-artifacts-builder installed"
fi

# Tier 2: Recommended Skills (Optional but Useful)
echo ""
echo "=== Tier 2: Recommended Skills ==="
echo ""

# 4. theme-factory
if [ -d ~/.claude/skills/theme-factory ]; then
    echo "⏭️  theme-factory already exists, skipping..."
else
    echo "📦 Installing theme-factory..."
    cp -r "$TEMP_DIR/skills/theme-factory" ~/.claude/skills/
    echo "✅ theme-factory installed"
fi

# 5. brand-guidelines
if [ -d ~/.claude/skills/brand-guidelines ]; then
    echo "⏭️  brand-guidelines already exists, skipping..."
else
    echo "📦 Installing brand-guidelines..."
    cp -r "$TEMP_DIR/skills/brand-guidelines" ~/.claude/skills/
    echo "✅ brand-guidelines installed"
fi

# Set script permissions
echo ""
echo "🔧 Setting script permissions..."
find ~/.claude/skills -type f -name "*.sh" -exec chmod +x {} \; 2>/dev/null || true
find ~/.claude/skills -type f -name "*.py" -exec chmod +x {} \; 2>/dev/null || true
echo "✅ Permissions set"

# Cleanup
echo ""
echo "🧹 Cleaning up..."
rm -rf "$TEMP_DIR"
echo "✅ Cleanup complete"

# Summary
echo ""
echo "=========================================="
echo "✅ Installation Complete!"
echo "=========================================="
echo ""
echo "📁 Installed Skills in ~/.claude/skills/:"
ls -1 ~/.claude/skills/ 2>/dev/null || echo "(No skills directory found)"
echo ""
echo "🧪 Test Your New Skills:"
echo ""
echo "Tier 1 (Essential):"
echo "  webapp-testing:         'test this webapp' or 'check if the UI works'"
echo "  doc-coauthoring:        'write a PRD' or 'create a spec document'"
echo "  web-artifacts-builder:  'create a React artifact' or 'build a landing page'"
echo ""
echo "Tier 2 (Recommended):"
echo "  theme-factory:          'apply a theme to this presentation'"
echo "  brand-guidelines:       'apply Anthropic brand colors'"
echo ""
echo "📚 Full documentation: _artifacts/anthropic-skills-analysis-and-installation-plan.md"
echo ""

# Check for dependencies
echo "⚠️  Dependency Check:"
echo ""

if command -v playwright &> /dev/null; then
    echo "  ✅ Playwright: installed"
else
    echo "  ❌ Playwright: NOT installed (required for webapp-testing)"
    echo "     Install: pip install playwright && playwright install chromium"
fi

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "  ✅ Node.js: $NODE_VERSION"
    if [[ "${NODE_VERSION:1:2}" -ge 18 ]]; then
        echo "     (version 18+ ✅)"
    else
        echo "     (⚠️  version 18+ recommended for web-artifacts-builder)"
    fi
else
    echo "  ❌ Node.js: NOT installed (required for web-artifacts-builder)"
    echo "     Install: brew install node"
fi

echo ""
echo "🎉 Setup complete! Your global skills are ready to use."

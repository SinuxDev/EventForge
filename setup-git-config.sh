#!/bin/bash

# Setup Git Configuration for Conventional Commits
# Run this once to configure your local git

echo "🔧 Setting up Git configuration for Conventional Commits..."
echo ""

# Set commit message template
git config commit.template .gitmessage
echo "✅ Commit message template configured"

# Set default editor (optional - uncomment if needed)
# git config core.editor "code --wait"  # VS Code
# git config core.editor "vim"          # Vim
# git config core.editor "nano"         # Nano

echo ""
echo "📝 Git configuration complete!"
echo ""
echo "Now when you run 'git commit' (without -m), you'll see a helpful template."
echo ""
echo "Or use the commit helper: npm run commit"

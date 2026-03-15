#!/bin/bash

# Commit Helper Script
# Makes it easier to create conventional commits

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎯 Conventional Commit Helper${NC}"
echo ""

# Show commit types
echo -e "${YELLOW}Available commit types:${NC}"
echo "1) feat     - New feature"
echo "2) fix      - Bug fix"
echo "3) docs     - Documentation"
echo "4) style    - Code formatting"
echo "5) refactor - Code restructure"
echo "6) perf     - Performance improvement"
echo "7) test     - Tests"
echo "8) build    - Build/dependencies"
echo "9) ci       - CI/CD"
echo "10) chore   - Maintenance"
echo ""

# Get type
read -p "Select type (1-10): " type_choice

case $type_choice in
  1) type="feat" ;;
  2) type="fix" ;;
  3) type="docs" ;;
  4) type="style" ;;
  5) type="refactor" ;;
  6) type="perf" ;;
  7) type="test" ;;
  8) type="build" ;;
  9) type="ci" ;;
  10) type="chore" ;;
  *) echo -e "${RED}Invalid choice${NC}"; exit 1 ;;
esac

# Get scope (optional)
read -p "Scope (optional, e.g., auth, user, api): " scope

# Get subject
read -p "Subject (required): " subject

if [ -z "$subject" ]; then
  echo -e "${RED}Subject is required!${NC}"
  exit 1
fi

# Get body (optional)
read -p "Body (optional, press Enter to skip): " body

# Build commit message
if [ -z "$scope" ]; then
  commit_msg="$type: $subject"
else
  commit_msg="$type($scope): $subject"
fi

if [ ! -z "$body" ]; then
  commit_msg="$commit_msg

$body"
fi

# Show preview
echo ""
echo -e "${BLUE}📝 Commit message preview:${NC}"
echo -e "${GREEN}$commit_msg${NC}"
echo ""

# Confirm
read -p "Proceed with commit? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Commit cancelled${NC}"
  exit 1
fi

# Stage all changes
git add .

# Commit
git commit -m "$commit_msg"

if [ $? -eq 0 ]; then
  echo ""
  echo -e "${GREEN}✅ Commit successful!${NC}"
else
  echo ""
  echo -e "${RED}❌ Commit failed${NC}"
  exit 1
fi

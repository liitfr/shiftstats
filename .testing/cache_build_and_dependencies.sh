#!/bin/sh
export MONGO_URL="mongodb://localhost/cache"
echo "Running meteor to cache it …"
node ./.testing/cache_build_and_dependencies.js

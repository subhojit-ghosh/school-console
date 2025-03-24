sed -i '' 's/const serverless = false;/const serverless = true;/' apps/api/webpack.config.js

pnpm reset

pnpm build api

cd dist/apps/api

npm install --legacy-peer-deps

cd ../../

pnpm serverless deploy

sed -i '' 's/const serverless = true;/const serverless = false;/' apps/api/webpack.config.js
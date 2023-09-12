FROM oven/bun
COPY . .
ENTRYPOINT ["bun",  "./index.ts"]

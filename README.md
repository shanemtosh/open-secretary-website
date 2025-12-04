# OpenSecretary Website

Marketing site for [OpenSecretary](https://github.com/shanemtosh/open-secretary), an autonomous AI agent for Obsidian.

**Live**: [opensecretary.com](https://opensecretary.com)

## Structure

```
html/           # HTML pages
markdown/       # Markdown versions (for LLM agents)
styles.css      # Main styles
demo.css        # Demo page styles
script.js       # Copy button
demo.js         # Interactive demo
nginx.example.conf
```

## Deployment

Static site. Run `./build.sh` after pull to add cache-busting version params to CSS/JS references.

See `nginx.example.conf` for server configuration with Accept-header routing (serves markdown to LLM agents, HTML to browsers).

## License

MIT


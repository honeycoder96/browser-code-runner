# Browser Code Runner Demo

This is an interactive demo of the Browser Code Runner package, showcasing how to execute JavaScript, Python, and Lua code directly in the browser using web workers.

**🎉 Now using the published npm package from CDN!**

## 🚀 Features

- **Monaco Editor**: Professional code editor with syntax highlighting
- **Multi-language Support**: JavaScript, Python, and Lua execution
- **Mobile Responsive**: Works perfectly on all device sizes
- **Real-time Output**: See execution results immediately
- **Example Code**: Pre-built examples for each language
- **GitHub Pages Ready**: Automatically deploys to GitHub Pages
- **Published Package**: Uses the real `browser-code-runner` npm package from CDN

## 📦 Published Package Integration

This demo now uses the **published npm package** instead of local builds:

- **Package**: [browser-code-runner@1.0.0](https://www.npmjs.com/package/browser-code-runner)
- **CDN**: `https://cdn.jsdelivr.net/npm/browser-code-runner@1.0.0/dist/index.js`
- **Fallback**: Local package if CDN fails
- **Benefits**: Always uses the latest published version, no local build required

### How It Works
1. **Primary**: Loads from CDN (jsDelivr)
2. **Fallback**: If CDN fails, falls back to local package
3. **Real-time**: Uses actual published package functionality
4. **Versioned**: Pinned to specific version (1.0.0)

## 🖥️ Running Locally

### Prerequisites
- Node.js 16+ and npm
- Modern web browser with ES2020 support

### Quick Start
```bash
# Install dependencies
npm install

# Serve the demo locally (no build required!)
npm run demo
```

The demo will open automatically in your browser at `http://localhost:8080`.

### Alternative Commands
```bash
# Serve the demo directly (if you have http-server installed)
npx http-server demo -p 8080 -o

# Or use any static file server
python3 -m http.server 8080
# or
php -S localhost:8080
```

## 🌐 GitHub Pages Deployment

This demo is automatically configured for GitHub Pages deployment.

### Automatic Deployment
1. Push your code to the `main` or `master` branch
2. GitHub Actions will automatically build and deploy
3. The demo will be available at `https://honeycoder96.github.io/browser-c`

### Manual Deployment
If you prefer manual deployment:

1. **Build the package:**
   ```bash
   npm run build
   ```

2. **Enable GitHub Pages:**
   - Go to your repository Settings
   - Navigate to Pages section
   - Set source to "Deploy from a branch"
   - Select `gh-pages` branch and `/ (root)` folder
   - Click Save

3. **Deploy:**
   ```bash
   npx gh-pages -d demo
   ```

## 📱 Mobile Responsiveness

The demo is fully responsive and optimized for:
- **Desktop**: Full two-column layout with side-by-side editor and controls
- **Tablet**: Responsive grid that adapts to medium screens
- **Mobile**: Single-column layout with optimized touch controls

### Responsive Breakpoints
- **Desktop**: 1200px+ (two-column layout)
- **Tablet**: 768px - 1199px (adaptive grid)
- **Mobile**: < 768px (single-column layout)

## 🎨 Monaco Editor Features

- **Syntax Highlighting**: Full support for JavaScript, Python, and Lua
- **Dark Theme**: Professional dark theme for better code readability
- **Auto-completion**: Intelligent code suggestions
- **Error Detection**: Real-time syntax error highlighting
- **Keyboard Shortcuts**: Ctrl+Enter to run code
- **Responsive Layout**: Automatically adjusts to container size

## 🔧 Customization

### Adding New Languages
1. Add the language to the `examples` object in `index.html`
2. Update the language selector
3. Add Monaco Editor language support if needed

### Styling
- All styles are in the `<style>` section of `index.html`
- Uses CSS Grid and Flexbox for responsive layouts
- CSS custom properties for consistent theming
- Smooth transitions and hover effects

### Example Code
- Examples are stored in the `examples` object
- Each language has 'simple' and 'advanced' examples
- Easy to add new examples or modify existing ones

## 🧪 Testing

### Local Testing
```bash
# Run all tests
npm test

# Test build output
npm run test:build

# Watch mode for development
npm run test:watch
```

### Browser Testing
- Test on different browsers (Chrome, Firefox, Safari, Edge)
- Test on different devices (desktop, tablet, mobile)
- Test with different screen sizes
- Test keyboard shortcuts and touch interactions

## 📁 File Structure

```
demo/
├── index.html          # Main demo page
├── 404.html           # GitHub Pages 404 redirect
├── README.md          # This file
└── assets/            # Any additional assets
```

## 🌟 Browser Support

- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+
- **Mobile**: iOS Safari 13+, Chrome Mobile 80+

## 🚨 Known Issues

- **Monaco Editor**: Requires internet connection for CDN resources
- **Web Workers**: Not supported in older browsers
- **WebAssembly**: Required for Python support (Pyodide)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on different devices
5. Submit a pull request

## 📄 License

This demo is part of the Browser Code Runner package and is licensed under the MIT License.

## 🔗 Links

- **Package**: [npmjs.com/package/browser-code-runner](https://npmjs.com/package/browser-code-runner)
- **Repository**: [github.com/honeycoder96/browser-code-runner](https://github.com/honeycoder96/browser-code-runner)
- **Monaco Editor**: [microsoft.github.io/monaco-editor](https://microsoft.github.io/monaco-editor)
- **GitHub Pages**: [pages.github.com](https://pages.github.com) 
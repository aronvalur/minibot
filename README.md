# Minimalískt — spjallmenni

## Hvað er hér
- `server.js` — bakendinn. Kallar á Claude API með þekkingu Minimalískt innbyggða.
- `package.json` — segir Render hvað á að setja upp.
- `public/widget.js` — spjallgluggi sem fer á minimaliskt.is (og hvaða vefsíðu sem er).

## Svona kemur þetta í loftið (engin skipanalína þarf)

1. Farðu á github.com og skráðu þig inn.
2. Búðu til nýtt "repository" — t.d. `minimaliskt-bot`.
3. Hladdu upp `server.js`, `package.json` og README.md beint á rót geymslunnar.
4. Búðu til möppu sem heitir nákvæmlega `public` og hladdu `widget.js` upp þangað inn — ekki á rótina.
5. Farðu á render.com, tengdu GitHub reikninginn þinn, veldu "New Web Service" og bentu á þessa geymslu.
6. Í Environment breytum (Environment Variables), bættu við:
   - Key: `ANTHROPIC_API_KEY`
   - Value: alvöru API lykillinn þinn frá console.anthropic.com
7. Bíddu eftir að byggingin klárist. Þú færð þá slóð eins og `https://minimaliskt-bot.onrender.com`.

## Setja á vefsíðuna

Bættu þessari línu við rétt fyrir `</body>` í Framer (Site Settings → Custom Code → End of `<body>` tag):

```html
<script src="https://ÞITT-SLÓÐ-HÉR.onrender.com/widget.js" defer></script>
```

Skiptu út `ÞITT-SLÓÐ-HÉR` fyrir alvöru slóðina sem Render gaf þér.

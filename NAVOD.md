# 🥋 Judo Warrior – Návod na nasadenie

## Čo potrebuješ

1. **Počítač** (Windows, Mac, alebo Linux)
2. **Node.js** – stiahni z https://nodejs.org (klikni na "LTS" verziu)
3. **GitHub účet** – zadarmo na https://github.com (ak ešte nemáš)
4. **Vercel účet** – zadarmo na https://vercel.com (prihlásiš sa cez GitHub)

---

## Krok 1: Nainštaluj Node.js

1. Choď na https://nodejs.org
2. Stiahni **LTS verziu** (zelené tlačidlo)
3. Nainštaluj (klikaj Next, Next, Next...)
4. Otvor **terminál** (Windows: cmd alebo PowerShell, Mac: Terminal)
5. Over, že funguje:
   ```
   node --version
   ```
   Mal by vypísať číslo verzie, napr. `v20.11.0`

---

## Krok 2: Rozbaľ projekt

1. Rozbaľ stiahnutý súbor `judo-warrior.zip`
2. V terminále sa presuň do priečinka:
   ```
   cd cesta/kam/si/rozbalil/judo-warrior
   ```
   Napríklad:
   ```
   cd Downloads/judo-warrior
   ```

---

## Krok 3: Nainštaluj závislosti a otestuj

```
npm install
npm run dev
```

Otvorí sa v prehliadači na adrese `http://localhost:5173` – skontroluj, či appka funguje.

**Ctrl+C** zastaví lokálny server.

---

## Krok 4: Nahraj na GitHub

### A) Cez webovú stránku (najjednoduchšie)

1. Choď na https://github.com
2. Klikni **"+" → "New repository"**
3. Názov: `judo-warrior`
4. Klikni **"Create repository"**
5. Na stránke nového repa klikni **"uploading an existing file"**
6. Pretiahnni **VŠETKY súbory** z priečinka `judo-warrior` (nie samotný priečinok!)
7. Klikni **"Commit changes"**

### B) Cez terminál (ak máš git)

```
git init
git add .
git commit -m "Judo Warrior app"
git branch -M main
git remote add origin https://github.com/TVOJ-USERNAME/judo-warrior.git
git push -u origin main
```

---

## Krok 5: Nasaď na Vercel

1. Choď na https://vercel.com
2. Klikni **"Sign Up"** → **"Continue with GitHub"**
3. Po prihlásení klikni **"Add New..." → "Project"**
4. Nájdi `judo-warrior` v zozname repozitárov a klikni **"Import"**
5. Všetko nechaj prednastavené (Vercel automaticky zistí, že je to Vite projekt)
6. Klikni **"Deploy"**
7. Počkaj 1-2 minúty...

**HOTOVO!** 🎉

Vercel ti dá adresu, napr: `https://judo-warrior.vercel.app`

---

## Krok 6: "Nainštaluj" na telefón

### Android:
1. Otvor adresu v **Chrome**
2. Klikni na **tri bodky** (⋮) vpravo hore
3. Klikni **"Pridať na plochu"** alebo **"Inštalovať aplikáciu"**
4. Na ploche sa objaví ikona – appka sa otvára na celú obrazovku!

### iPhone:
1. Otvor adresu v **Safari**
2. Klikni na **ikonu zdieľania** (štvorček so šípkou)
3. Klikni **"Pridať na plochu"**
4. Hotovo!

---

## Budúce zmeny

Keď chceš niečo zmeniť:
1. Uprav súbory na GitHube (alebo lokálne a pushni)
2. Vercel automaticky znovu nasadí novú verziu
3. Na telefóne sa appka aktualizuje sama

---

## Štruktúra projektu

```
judo-warrior/
├── index.html          ← hlavná HTML stránka
├── package.json        ← závislosti
├── vite.config.js      ← nastavenie buildu + PWA
├── public/
│   ├── icon-192.png    ← ikona appky (malá)
│   └── icon-512.png    ← ikona appky (veľká)
└── src/
    ├── main.jsx        ← vstupný bod
    ├── App.jsx         ← hlavná appka (logika + obrazovky)
    ├── ExerciseDemo.jsx← animované SVG cviky
    └── styles.css      ← štýly
```

---

## Riešenie problémov

**"npm install" nefunguje:**
- Skontroluj, že máš nainštalovaný Node.js (`node --version`)

**Appka sa nezobrazuje správne:**
- Vymaž `node_modules` priečinok a spusti `npm install` znova

**Vercel deploy padá:**
- Skontroluj, že si nahral VŠETKY súbory vrátane `package.json`

**Ikona sa nezobrazuje na telefóne:**
- Môže trvať chvíľu, kým ju prehliadač načíta

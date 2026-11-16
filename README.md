# Onlayn Shaxmat

Brauzerda onlayn shaxmat: tasodifiy rakib yoki xona ID orqali. Har bir o‘yinchiga 10 daqiqa, g‘olib +50 reyting va +1000 ball oladi. Yurishlar va g‘alaba serverda tekshiriladi.

## Ishga tushirish

```bash
node server.js        # http://localhost:3000
```

Node.js 18+ kerak, hech qanday paket o‘rnatish shart emas.

## GitHub’ga yuklash

```bash
git init && git add . && git commit -m "Onlayn shaxmat"
git branch -M main
git remote add origin https://github.com/<login>/<repo>.git
git push -u origin main
```

## Internetda ishlatish

GitHub Pages faqat statik sahifa beradi, shuning uchun o‘yin serveri alohida joyda ishlashi kerak. Render, Railway yoki Fly.io’da GitHub repozitoriyani ulab, start buyrug‘i `node server.js` qilib qo‘ying. Server `PORT` o‘zgaruvchisini o‘zi o‘qiydi.

## Fayllar

- `server.js` — o‘yin serveri (juftlash, xonalar, vaqt, yurishlarni tekshirish)
- `engine.js` — shaxmat qoidalari
- `public/index.html` — o‘yin sahifasi

## Cheklovlar

Rokirovka va en passant yo‘q, piyoda faqat farzinga aylanadi. Ballar va reyting `data.json` faylida saqlanadi. Ko‘p serverli hosting uchun bazaga o‘tkazish kerak. O‘yinchi brauzerdagi tasodifiy ID bilan aniqlanadi, ro‘yxatdan o‘tish yo‘q.


<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>$VIBEZ | Memes, Fun &amp; Utility on Solana</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;800;900&display=swap" rel="stylesheet">
<style>
:root{
  --ink:#0b0b12; --ink2:#4a4358; --white:#fff;
  --orange:#ff6a00; --orange-l:#ffa45c;
  --purple:#7b2cff; --purple-d:#5b21ff;
  --pink:#ff2fa6; --pink-d:#c4007f;
  --cyan:#00c2ff; --cyan-d:#0a7fd6;
  --card:rgba(255,255,255,.94); --line:rgba(11,11,18,.1);
  --grad-btn:linear-gradient(120deg,#5b21ff 0%,#c026d3 50%,#e0208f 100%);
  --grad-visor:linear-gradient(120deg,#5b21ff 0%,#c026d3 40%,#ff2fa6 70%,#00b4ff 100%);
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:90px}
body{font-family:'Inter',sans-serif;background:#fff;color:var(--ink);overflow-x:hidden;min-height:100vh;-webkit-font-smoothing:antialiased}
h1,h2,h3,h4,.display{font-family:'Outfit',sans-serif;letter-spacing:-.03em}
a{color:inherit;text-decoration:none}
:focus-visible{outline:3px solid var(--purple);outline-offset:3px}

/* ===== BANDS (full-width colour sections) ===== */
.band{position:relative;overflow:hidden}
.band-hero{background:repeating-linear-gradient(115deg,rgba(255,255,255,0) 0 46px,rgba(255,255,255,.12) 46px 92px),linear-gradient(160deg,#ff6a00 0%,#ff7d12 38%,#ffb878 72%,#fff 100%)}
.band-white{background:#fff}
.band-orange{background:repeating-linear-gradient(115deg,rgba(255,255,255,0) 0 46px,rgba(255,255,255,.1) 46px 92px),linear-gradient(180deg,#fff 0%,#ffa45c 12%,#ff6a00 35%,#ff6a00 65%,#ffa45c 88%,#fff 100%)}
.band-lav{background:linear-gradient(180deg,#fff 0%,#f1eaff 55%,#e3f6ff 100%)}
.orb{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0}

/* gradient text */
.g1{background:linear-gradient(135deg,#3b0fd8,#7a00c8);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.g2{background:linear-gradient(135deg,#0050d0,#0080b8);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.g3{background:linear-gradient(135deg,#8a00b0,#c4007f);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}

/* buttons */
.btn-neon{background:var(--grad-btn);color:#fff;padding:.7rem 1.3rem;border-radius:12px;font-family:'Outfit',sans-serif;font-weight:600;display:inline-flex;align-items:center;justify-content:center;gap:.5rem;box-shadow:0 6px 20px rgba(192,38,211,.4);transition:box-shadow .3s,transform .3s;border:0;cursor:pointer}
.btn-neon:hover{box-shadow:0 8px 28px rgba(0,194,255,.55);transform:translateY(-2px)}
.btn-outline{background:#fff;color:var(--ink);border:2px solid var(--ink);padding:.75rem 1.5rem;font-weight:600;border-radius:14px;display:inline-flex;align-items:center;justify-content:center;gap:.6rem;transition:transform .2s,box-shadow .2s;cursor:pointer;font-size:1rem;box-shadow:3px 3px 0 var(--cyan)}
.btn-outline:hover{transform:translate(-2px,-2px);box-shadow:5px 5px 0 var(--pink)}
.btn-outline .fa-telegram{color:#1e88e5}
.btn-outline .fa-chart-pie{color:var(--pink-d)}

/* header */
header{position:fixed;top:0;left:0;right:0;z-index:40;background:rgba(255,255,255,.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid var(--line)}
header::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:3px;background:linear-gradient(90deg,var(--orange),var(--pink),var(--purple),var(--cyan))}
.nav{max-width:1200px;margin:0 auto;padding:.9rem 1.25rem;display:flex;align-items:center;justify-content:space-between;gap:.75rem}
.logo{display:flex;align-items:center;gap:.75rem}
.logo-box{width:42px;height:42px;border-radius:12px;background:var(--grad-visor);display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.1rem;box-shadow:0 4px 14px rgba(192,38,211,.4);flex-shrink:0}
.logo-name{font-family:'Outfit',sans-serif;font-weight:900;font-size:1.2rem;letter-spacing:.05em;color:var(--ink);line-height:1.1}
.logo-sub{font-size:.62rem;color:var(--purple-d);font-weight:700;letter-spacing:.14em;text-transform:uppercase}
.nav-links{display:none;gap:1.5rem;font-weight:600;font-size:.9rem;color:var(--ink2)}
.nav-links a:hover{color:var(--pink-d)}
.nav-right{display:flex;align-items:center;gap:1rem}
.menu-btn{background:none;border:0;color:var(--ink);font-size:1.3rem;cursor:pointer;padding:.25rem .4rem}
.mobile-menu{display:none;flex-direction:column;border-top:1px solid var(--line);padding:.5rem 1.25rem 1rem;max-width:1200px;margin:0 auto}
.mobile-menu.open{display:flex}
.mobile-menu a{padding:.8rem 0;color:var(--ink2);font-weight:600;border-bottom:1px solid var(--line)}
.mobile-menu a:last-child{border-bottom:0}
.mobile-menu a:hover{color:var(--pink-d)}
@media(min-width:900px){.nav-links{display:flex}.menu-btn{display:none}.mobile-menu,.mobile-menu.open{display:none}}

/* sections */
section{position:relative;z-index:1;padding:4rem 1.25rem;max-width:1200px;margin:0 auto}
@media(min-width:640px){section{padding:6rem 1.5rem}}
.hero{padding-top:8.5rem;max-width:1000px;text-align:center}
.badge{display:inline-flex;align-items:center;gap:.6rem;padding:.55rem 1.1rem;border-radius:999px;background:#fff;border:2px solid var(--purple-d);font-size:.75rem;font-weight:700;color:var(--purple-d);margin-bottom:1.75rem;text-transform:uppercase;letter-spacing:.12em;box-shadow:3px 3px 0 var(--cyan)}
.dot{width:10px;height:10px;border-radius:50%;background:var(--cyan);box-shadow:0 0 0 0 rgba(0,194,255,.7);animation:pulse 2s infinite}
@keyframes pulse{70%{box-shadow:0 0 0 8px rgba(0,194,255,0)}100%{box-shadow:0 0 0 0 rgba(0,194,255,0)}}
@media(prefers-reduced-motion:reduce){.dot{animation:none}html{scroll-behavior:auto}}
h1{font-size:2.35rem;line-height:1.2;font-weight:900;margin-bottom:1.5rem;color:var(--ink);text-shadow:2px 2px 0 rgba(0,194,255,.75),-2px -2px 0 rgba(255,47,166,.55)}
h1 span{text-shadow:none}
@media(min-width:640px){h1{font-size:3.9rem}}
.hero>p{color:#2a1a12;font-size:1.05rem;max-width:650px;margin:0 auto 2.25rem;line-height:1.7;font-weight:500}

.ca{max-width:560px;margin:0 auto 1.5rem;background:var(--card);border:2px solid var(--ink);padding:1.1rem;border-radius:22px;box-shadow:6px 6px 0 var(--pink);text-align:left}
.ca-top{display:flex;align-items:center;gap:.9rem;padding:.2rem .4rem .9rem}
.ca-top i{color:var(--purple-d);font-size:1.4rem}
.ca-label{font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:var(--ink2);font-weight:700}
.ca-text{font-family:ui-monospace,Menlo,Consolas,monospace;color:var(--ink);font-size:.9rem;word-break:break-all}
.btn-copy{width:100%;background:var(--grad-btn);color:#fff;border:0;padding:.9rem 1rem;font-weight:700;font-size:.95rem;letter-spacing:.08em;text-transform:uppercase;border-radius:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.6rem;transition:filter .2s,transform .2s}
.btn-copy:hover{filter:brightness(1.1);transform:translateY(-1px)}
.ca-note{font-size:.8rem;color:#2a1a12;margin-bottom:2rem;font-weight:500}
.hero-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:1rem;max-width:520px;margin:0 auto}
.hero-actions .btn-outline{min-width:150px}
.hero-actions .wide{flex-basis:100%;max-width:300px;margin:0 auto}

.section-head{text-align:center;max-width:720px;margin:0 auto 3rem}
.eyebrow{font-size:.8rem;font-weight:800;letter-spacing:.18em;text-transform:uppercase;margin-bottom:.8rem}
.section-head h2{font-size:2.3rem;font-weight:900;margin-bottom:.9rem;color:var(--ink)}
@media(min-width:640px){.section-head h2{font-size:2.9rem}}
.section-head p{color:var(--ink2);font-size:1.05rem;line-height:1.6}
.band-orange .section-head p{color:#2a1608;font-weight:500}
.band-orange .eyebrow{color:var(--ink)}

/* about */
.panel{background:var(--card);border:2px solid var(--ink);border-radius:28px;padding:2rem 1.5rem;box-shadow:8px 8px 0 var(--orange)}
@media(min-width:640px){.panel{padding:3rem}}
.about-grid{display:grid;gap:2.5rem;grid-template-columns:1fr;align-items:center}
@media(min-width:900px){.about-grid{grid-template-columns:1.15fr .85fr}}
.tag{display:inline-block;padding:.45rem 1.1rem;background:#efe7ff;color:var(--purple-d);font-size:.8rem;font-weight:800;border-radius:8px;text-transform:uppercase;letter-spacing:.08em;margin-bottom:1.5rem}
.panel h2{font-size:2rem;font-weight:900;line-height:1.2;margin-bottom:1.5rem}
@media(min-width:640px){.panel h2{font-size:2.4rem}}
.panel .lead{color:var(--ink2);font-size:1.05rem;line-height:1.8;margin-bottom:2rem}
.feature{display:flex;gap:1.1rem;align-items:flex-start;background:#faf7ff;border:1px solid var(--line);border-radius:18px;padding:1.3rem;margin-bottom:1.1rem}
.ficon{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1.1rem}
.ficon.p{background:#efe7ff;color:var(--purple-d)}
.ficon.g{background:#ffe3f3;color:var(--pink-d)}
.ficon.b{background:#dff4ff;color:var(--cyan-d)}
.ficon.o{background:#ffe9d6;color:#d95500}
.feature h4{font-family:'Inter',sans-serif;letter-spacing:0;font-size:1.05rem;font-weight:700;margin-bottom:.25rem}
.feature p{color:var(--ink2);font-size:.92rem;line-height:1.5}
.token-card{background:var(--grad-visor);border:2px solid var(--ink);border-radius:22px;padding:1.6rem;box-shadow:6px 6px 0 var(--ink);color:#fff}
.tc-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.4rem}
.tc-name{font-family:'Outfit',sans-serif;font-weight:900;font-size:1.5rem;letter-spacing:.08em}
.secure{background:#fff;color:var(--purple-d);font-size:.78rem;font-weight:800;letter-spacing:.06em;padding:.4rem .9rem;border-radius:999px}
.tc-row{display:flex;justify-content:space-between;padding:.75rem 0;border-top:1px solid rgba(255,255,255,.3);font-size:.92rem}
.tc-row span:first-child{opacity:.85}
.tc-row span:last-child{font-weight:700}

/* tokenomics */
.grid4{display:grid;gap:1.25rem;grid-template-columns:1fr}
@media(min-width:640px){.grid4{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1024px){.grid4{grid-template-columns:repeat(4,1fr)}}
.tcard{background:var(--card);border:2px solid var(--ink);border-radius:26px;padding:1.75rem 1.75rem 2rem;box-shadow:5px 5px 0 var(--ink);transition:transform .2s,box-shadow .2s}
.tcard:hover{transform:translate(-3px,-3px);box-shadow:8px 8px 0 var(--pink)}
.tcard .ficon{width:58px;height:58px;font-size:1.3rem;border-radius:14px;margin-bottom:1.6rem}
.tlabel{font-size:.9rem;text-transform:uppercase;letter-spacing:.1em;color:var(--ink2);font-weight:700;margin-bottom:.5rem}
.tval{font-family:'Outfit',sans-serif;font-size:2rem;font-weight:800;letter-spacing:-.02em;margin-bottom:.7rem}
.tcard p{color:var(--ink2);font-size:.95rem;line-height:1.5}

/* roadmap */
.road{display:grid;gap:1.5rem;grid-template-columns:1fr;max-width:1100px;margin:0 auto}
@media(min-width:900px){.road{grid-template-columns:repeat(2,1fr)}}
.phase{background:#fff;border:2px solid var(--line);border-radius:26px;padding:1.9rem 1.75rem;display:flex;flex-direction:column;box-shadow:0 10px 30px rgba(91,33,255,.08)}
.phase.active{border-color:var(--purple-d);box-shadow:6px 6px 0 var(--purple-d)}
.ph-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem}
.pill{padding:.5rem 1.1rem;border-radius:999px;font-size:.85rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase}
.pill.p{background:#efe7ff;color:var(--purple-d)}
.pill.b{background:#dff4ff;color:var(--cyan-d)}
.pill.g{background:#ffe3f3;color:var(--pink-d)}
.pill.o{background:#ffe9d6;color:#b84700}
.ph-icon{font-size:1.3rem}
.phase h3{font-size:1.7rem;font-weight:800;margin-bottom:1.3rem}
.phase ul{list-style:none;flex:1}
.phase li{display:flex;align-items:center;gap:.9rem;color:#2a2535;font-size:1.02rem;margin-bottom:.9rem}
.phase li i.fa-check{color:var(--cyan-d)}
.phase li .bul{width:10px;height:10px;border-radius:50%;flex-shrink:0;margin:0 .15rem}
.status{margin-top:1.3rem;padding-top:1.4rem;border-top:1px solid var(--line);font-size:.95rem;font-weight:700}
.c-p{color:var(--purple-d)}.c-b{color:var(--cyan-d)}.c-g{color:var(--pink-d)}.c-o{color:#d95500}
.bg-p{background:var(--purple)}.bg-b{background:var(--cyan)}.bg-g{background:var(--pink)}.bg-o{background:var(--orange)}

/* ===== AIRDROP TASKS ===== */
.tk-wrap{max-width:820px;margin:0 auto}
.tk-panel{background:var(--card);border:2px solid var(--ink);border-radius:30px;padding:1.4rem;box-shadow:8px 8px 0 var(--ink)}
@media(min-width:640px){.tk-panel{padding:2.25rem}}
.tk-progress{margin-bottom:1.6rem}
.tk-prog-top{display:flex;justify-content:space-between;font-size:.85rem;font-weight:700;color:var(--ink2);margin-bottom:.6rem}
.tk-prog-top b{color:var(--ink)}
.tk-bar{height:12px;border-radius:999px;background:#ece7f5;overflow:hidden;border:1px solid var(--line)}
.tk-bar span{display:block;height:100%;width:0;border-radius:999px;background:linear-gradient(90deg,#ff6a00,#ff2fa6,#7b2cff,#00c2ff);transition:width .5s ease}
.tk-list{display:flex;flex-direction:column;gap:1rem}
.tk-task{background:#faf7ff;border:2px solid var(--line);border-radius:20px;padding:1.2rem;transition:border-color .25s}
.tk-task.done{border-color:var(--cyan-d);background:#f2fbff}
.tk-head{display:flex;align-items:flex-start;gap:.9rem}
.tk-icon{width:46px;height:46px;border-radius:12px;background:#efe7ff;color:var(--purple-d);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}
.tk-task.done .tk-icon{background:#dff4ff;color:var(--cyan-d)}
.tk-info{flex:1;min-width:0}
.tk-title{font-weight:700;font-size:1.02rem;display:flex;align-items:center;gap:.55rem;flex-wrap:wrap}
.tk-num{width:22px;height:22px;border-radius:50%;background:var(--ink);font-size:.72rem;display:inline-flex;align-items:center;justify-content:center;color:#fff}
.tk-desc{color:var(--ink2);font-size:.9rem;line-height:1.5;margin-top:.25rem;word-break:break-word}
.tk-pill{font-size:.72rem;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:.35rem .75rem;border-radius:999px;background:#ffe9d6;color:#b84700;white-space:nowrap;flex-shrink:0}
.tk-pill.ok{background:#dff4ff;color:var(--cyan-d)}
.tk-actions,.tk-form{display:flex;flex-wrap:wrap;gap:.7rem;margin-top:1rem}
.tk-btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;padding:.75rem 1.2rem;border-radius:12px;border:2px solid var(--ink);background:#fff;color:var(--ink);font:700 .92rem 'Inter',sans-serif;cursor:pointer;transition:transform .2s,box-shadow .2s,opacity .2s}
.tk-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:3px 3px 0 var(--cyan)}
.tk-btn.primary{background:var(--grad-btn);border-color:transparent;color:#fff;box-shadow:0 6px 18px rgba(192,38,211,.35)}
.tk-btn.success{background:#dff4ff;border-color:var(--cyan-d);color:var(--cyan-d)}
.tk-btn:disabled{opacity:.45;cursor:not-allowed}
.tk-btn.success:disabled{opacity:1}
.tk-input{flex:1 1 220px;min-width:0;padding:.8rem 1rem;border-radius:12px;border:2px solid var(--line);background:#fff;color:var(--ink);font:.92rem 'Inter',sans-serif}
.tk-input::placeholder{color:#8b849a}
.tk-input:focus{outline:none;border-color:var(--purple-d);box-shadow:0 0 0 3px rgba(123,44,255,.2)}
.tk-input[readonly]{color:var(--ink2);border-style:dashed;background:#f6f3fb}
.tk-msg{font-size:.82rem;margin-top:.6rem;min-height:1em;color:#c2410c;font-weight:600}
.tk-msg.ok{color:var(--cyan-d)}
.tk-final{margin-top:1.4rem;padding:1.2rem;border-radius:18px;text-align:center;background:linear-gradient(135deg,#ffe9d6,#ffe3f3 50%,#dff4ff);border:2px solid var(--ink)}
.tk-final[hidden]{display:none}
.tk-final h3{font-size:1.3rem;margin-bottom:.3rem}
.tk-final p{color:var(--ink2);font-size:.92rem}
.tk-foot{margin-top:1.3rem;font-size:.8rem;color:var(--ink2);text-align:center;line-height:1.6}
.tk-foot i{color:var(--cyan-d);margin-right:.35rem}

/* join */
.join{background:var(--ink);border:2px solid var(--ink);border-radius:32px;text-align:center;padding:3rem 1.5rem;max-width:900px;margin:0 auto;color:#fff;box-shadow:8px 8px 0 var(--pink);position:relative;overflow:hidden}
.join::before{content:"";position:absolute;inset:-40% -20% auto auto;width:360px;height:360px;background:radial-gradient(circle,rgba(0,194,255,.35),transparent 65%);pointer-events:none}
.join::after{content:"";position:absolute;inset:auto auto -40% -20%;width:360px;height:360px;background:radial-gradient(circle,rgba(255,47,166,.35),transparent 65%);pointer-events:none}
.join>*{position:relative;z-index:1}
.join h2{font-size:2.3rem;font-weight:900;margin-bottom:1.4rem;line-height:1.15}
@media(min-width:640px){.join h2{font-size:3rem}}
.join p{color:#e4dff0;font-size:1.05rem;line-height:1.7;max-width:560px;margin:0 auto 2.2rem}
.join-actions{display:flex;flex-direction:column;gap:1rem;max-width:440px;margin:0 auto}
.btn-blue{background:linear-gradient(120deg,#3a1fe0,#0a6fd6);color:#fff;padding:1.05rem 1.5rem;border-radius:16px;font-family:'Outfit',sans-serif;font-weight:600;font-size:1.05rem;display:flex;align-items:center;justify-content:center;gap:.75rem;box-shadow:0 8px 28px rgba(0,194,255,.45);transition:transform .2s,filter .2s}
.btn-blue:hover{transform:translateY(-2px);filter:brightness(1.1)}
.btn-dark{background:#fff;color:var(--ink);padding:1.05rem 1.5rem;border-radius:16px;font-family:'Outfit',sans-serif;font-weight:700;font-size:1.05rem;display:flex;align-items:center;justify-content:center;gap:.75rem;box-shadow:4px 4px 0 var(--pink);transition:transform .2s,box-shadow .2s}
.btn-dark:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 var(--cyan)}

/* footer */
footer{background:var(--ink);color:#c9c4d6;padding:3rem 1.25rem;text-align:center;font-size:.85rem;position:relative}
footer::before{content:"";position:absolute;left:0;right:0;top:0;height:4px;background:linear-gradient(90deg,var(--orange),var(--pink),var(--purple),var(--cyan))}
.foot{max-width:900px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:1.25rem}
.foot .logo-box{width:48px;height:48px}
.foot .logo-name{font-size:1.5rem;color:#fff}
.foot .disc{line-height:1.7;max-width:760px}
.foot .disc b{color:#fff}
.foot-links{display:flex;gap:1.5rem}
.foot-links a:hover{color:var(--cyan)}

/* toast */
#toast{position:fixed;bottom:1.25rem;left:1.25rem;right:1.25rem;margin:0 auto;max-width:420px;z-index:50;padding:.85rem 1.25rem;border-radius:12px;background:#fff;border:2px solid var(--ink);box-shadow:4px 4px 0 var(--cyan);color:var(--ink);font-weight:600;font-size:.9rem;text-align:center;transform:translateY(120px);opacity:0;transition:transform .3s,opacity .3s;pointer-events:none}
#toast.show{transform:translateY(0);opacity:1}
#toast.error{box-shadow:4px 4px 0 var(--orange)}
@media(min-width:640px){#toast{left:auto;right:1.25rem;margin:0}}
</style>
</head>
<body>

<div id="toast" role="status" aria-live="polite"><span id="toast-icon">✓</span> <span id="toast-message"></span></div>

<header>
  <div class="nav">
    <a href="#top" class="logo" aria-label="$VIBEZ home">
      <div class="logo-box"><i class="fa-solid fa-bolt"></i></div>
      <div><div class="logo-name">$VIBEZ</div><div class="logo-sub">Solana Network</div></div>
    </a>
    <nav class="nav-links" aria-label="Primary">
      <a href="#about">About</a>
      <a href="#tokenomics">Tokenomics</a>
      <a href="#roadmap">Roadmap</a>
      <a href="#tasks">Airdrop</a>
      <a href="https://t.me/vibecoinonsoll" target="_blank" rel="noopener noreferrer">Telegram ↗</a>
      <a href="https://x.com/Vibez_coin" target="_blank" rel="noopener noreferrer">X (Twitter) ↗</a>
    </nav>
    <div class="nav-right">
      <a href="#join" class="btn-neon">Launching Soon <i class="fa-solid fa-rocket"></i></a>
      <button class="menu-btn" id="menu-btn" aria-label="Toggle menu" aria-expanded="false" aria-controls="mobile-menu"><i class="fa-solid fa-bars"></i></button>
    </div>
  </div>
  <div class="mobile-menu" id="mobile-menu">
    <a href="#about">About</a>
    <a href="#tokenomics">Tokenomics</a>
    <a href="#roadmap">Roadmap</a>
    <a href="#tasks">Airdrop</a>
    <a href="https://t.me/vibecoinonsoll" target="_blank" rel="noopener noreferrer">Telegram ↗</a>
    <a href="https://x.com/Vibez_coin" target="_blank" rel="noopener noreferrer">X (Twitter) ↗</a>
  </div>
</header>

<main id="top">

  <!-- Hero -->
  <div class="band band-hero">
    <div class="orb" style="top:6%;right:-80px;width:320px;height:320px;background:rgba(255,47,166,.4)"></div>
    <div class="orb" style="bottom:4%;left:-90px;width:340px;height:340px;background:rgba(0,194,255,.4)"></div>
    <section class="hero">
      <div class="badge"><span class="dot"></span> Solana Meme Token &bull; Launching Soon</div>
      <h1>Operating on the borders of <span class="g1">memes,</span> <span class="g2">fun,</span> and a strong belief in <span class="g3">utility</span></h1>
      <p>$VIBEZ bridges the gap between viral internet culture and robust ecosystem utility on Solana. Pure community energy powered by immaculate vibes.</p>

      <div class="ca">
        <div class="ca-top">
          <i class="fa-solid fa-file-signature"></i>
          <div>
            <div class="ca-label">Contract Address (CA)</div>
            <div class="ca-text" id="ca-text">Coming Soon (Will be updated at launch)</div>
          </div>
        </div>
        <button class="btn-copy" id="copy-btn" type="button"><i class="fa-solid fa-copy"></i> Copy CA</button>
      </div>
      <p class="ca-note">Always verify the official CA on our verified channels before trading.</p>

      <div class="hero-actions">
        <a class="btn-outline" href="https://t.me/vibecoinonsoll" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-telegram"></i> Join Telegram</a>
        <a class="btn-outline" href="https://x.com/Vibez_coin" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-x-twitter"></i> Follow on X</a>
        <a class="btn-outline wide" href="#tokenomics"><i class="fa-solid fa-chart-pie"></i> View Tokenomics</a>
      </div>
    </section>
  </div>

  <!-- About -->
  <div class="band band-white">
    <section id="about">
      <div class="panel">
        <div class="about-grid">
          <div>
            <span class="tag">The $VIBEZ Philosophy</span>
            <h2>Where Community Culture Meets Sustainable Utility</h2>
            <p class="lead">Most meme coins live and die by hype alone. $VIBEZ is built differently. Operating on the vibrant Solana network, we combine unstoppable meme energy with real, forward-thinking utility designed to reward holders and empower community builders.</p>
            <div class="feature">
              <div class="ficon p"><i class="fa-solid fa-bolt"></i></div>
              <div><h4>Lightning Fast</h4><p>Built on Solana for instant transactions and ultra-low fees.</p></div>
            </div>
            <div class="feature">
              <div class="ficon g"><i class="fa-solid fa-shield-halved"></i></div>
              <div><h4>Community First</h4><p>Fair distribution, renounced mint authority, and burned liquidity.</p></div>
            </div>
          </div>
          <div class="token-card">
            <div class="tc-top"><span class="tc-name">$VIBEZ</span><span class="secure">SECURE</span></div>
            <div class="tc-row"><span>Network</span><span>Solana</span></div>
            <div class="tc-row"><span>Total Supply</span><span>1,000,000,000</span></div>
            <div class="tc-row"><span>Buy / Sell Tax</span><span>0% / 0%</span></div>
            <div class="tc-row"><span>Liquidity</span><span>Burned</span></div>
            <div class="tc-row"><span>Mint Authority</span><span>Revoked</span></div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Tokenomics -->
  <div class="band band-orange">
    <section id="tokenomics">
      <div class="section-head">
        <div class="eyebrow">Transparent &amp; Secure</div>
        <h2>Tokenomics</h2>
        <p>Designed for long-term sustainability, reward holders, and maintain healthy liquidity pools.</p>
      </div>
      <div class="grid4">
        <div class="tcard">
          <div class="ficon p"><i class="fa-solid fa-coins"></i></div>
          <div class="tlabel">Total Supply</div>
          <div class="tval">1,000,000,000</div>
          <p>Fixed supply with zero hidden mint functions.</p>
        </div>
        <div class="tcard">
          <div class="ficon b"><i class="fa-solid fa-percent"></i></div>
          <div class="tlabel">Buy / Sell Tax</div>
          <div class="tval">0% / 0%</div>
          <p>Zero tax policy for frictionless trading and maximum volume.</p>
        </div>
        <div class="tcard">
          <div class="ficon g"><i class="fa-solid fa-fire"></i></div>
          <div class="tlabel">Liquidity Pool</div>
          <div class="tval">Burned at Launch</div>
          <p>LP tokens permanently burned, so the liquidity can never be pulled.</p>
        </div>
        <div class="tcard">
          <div class="ficon o"><i class="fa-solid fa-shield-cat"></i></div>
          <div class="tlabel">Mint Authority</div>
          <div class="tval">Revoked</div>
          <p>Mint authority renounced, so no new tokens can ever be created.</p>
        </div>
      </div>
    </section>
  </div>

  <!-- Roadmap -->
  <div class="band band-white">
    <section id="roadmap">
      <div class="section-head">
        <div class="eyebrow c-g">The Journey Ahead</div>
        <h2>Roadmap</h2>
        <p>Our strategic execution plan to scale $VIBEZ into a dominant Web3 meme and utility ecosystem.</p>
      </div>
      <div class="road">
        <div class="phase active">
          <div class="ph-top"><span class="pill p">Phase 1</span><i class="fa-solid fa-flag-checkered ph-icon c-p"></i></div>
          <h3>Inception &amp; Community</h3>
          <ul>
            <li><i class="fa-solid fa-check"></i> Website &amp; Brand Launch</li>
            <li><i class="fa-solid fa-check"></i> Telegram &amp; X Setup</li>
            <li><i class="fa-solid fa-check"></i> Initial Organic Marketing</li>
          </ul>
          <div class="status c-p">Status: In Progress</div>
        </div>
        <div class="phase">
          <div class="ph-top"><span class="pill b">Phase 2</span><i class="fa-solid fa-rocket ph-icon c-b"></i></div>
          <h3>Launch &amp; DEX</h3>
          <ul>
            <li><span class="bul bg-b"></span> Token Launch on Solana</li>
            <li><span class="bul bg-b"></span> DEX Listings (Raydium/Jupiter)</li>
            <li><span class="bul bg-b"></span> DexScreener &amp; DEXTools Fast-Track</li>
          </ul>
          <div class="status c-b">Status: Upcoming</div>
        </div>
        <div class="phase">
          <div class="ph-top"><span class="pill g">Phase 3</span><i class="fa-solid fa-gears ph-icon c-g"></i></div>
          <h3>Utility &amp; Expansion</h3>
          <ul>
            <li><span class="bul bg-g"></span> Community Utility Dashboard</li>
            <li><span class="bul bg-g"></span> Strategic KOL Partnerships</li>
            <li><span class="bul bg-g"></span> Viral Meme Competitions</li>
          </ul>
          <div class="status c-g">Status: Planned</div>
        </div>
        <div class="phase">
          <div class="ph-top"><span class="pill o">Phase 4</span><i class="fa-solid fa-earth-americas ph-icon c-o"></i></div>
          <h3>Global Takeover</h3>
          <ul>
            <li><span class="bul bg-o"></span> Tier-2 Exchange Listings</li>
            <li><span class="bul bg-o"></span> Ecosystem Feature Expansion</li>
            <li><span class="bul bg-o"></span> Massive IRL &amp; Digital Marketing</li>
          </ul>
          <div class="status c-o">Status: Vision</div>
        </div>
      </div>
    </section>
  </div>

  <!-- Airdrop Tasks -->
  <div class="band band-orange">
    <section id="tasks">
      <div class="section-head">
        <div class="eyebrow">Airdrop</div>
        <h2>Tasks</h2>
        <p>Complete all tasks to get a share of the $VIBEZ airdrop.</p>
      </div>
      <div class="tk-wrap">
        <div class="tk-panel">
          <div class="tk-progress">
            <div class="tk-prog-top"><span>Your progress</span><span><b id="tk-count">0</b> / <span id="tk-total">4</span> complete</span></div>
            <div class="tk-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="tk-bar"><span id="tk-fill"></span></div>
          </div>
          <div class="tk-list" id="tk-list"></div>
          <div class="tk-final" id="tk-final" hidden>
            <h3>🎉 All tasks complete!</h3>
            <p>You're entered for a share of the $VIBEZ airdrop. You can update your email or wallet any time above.</p>
          </div>
          <p class="tk-foot"><i class="fa-solid fa-shield-halved"></i>Only share your public wallet address. Never share your seed phrase or private key with anyone.</p>
        </div>
      </div>
    </section>
  </div>

  <!-- Join -->
  <div class="band band-lav">
    <section id="join">
      <div class="join">
        <h2>Join the $VIBEZ Movement</h2>
        <p>Don't miss out on the next big wave on Solana. Connect with our vibrant community on Telegram and X for real-time updates, memes, and alpha.</p>
        <div class="join-actions">
          <a class="btn-blue" href="https://t.me/vibecoinonsoll" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-telegram"></i> Official Telegram Channel</a>
          <a class="btn-dark" href="https://x.com/Vibez_coin" target="_blank" rel="noopener noreferrer">Official X Profile</a>
        </div>
      </div>
    </section>
  </div>

</main>

<footer>
  <div class="foot">
    <div class="logo">
      <div class="logo-box"><i class="fa-solid fa-bolt"></i></div>
      <div class="logo-name">$VIBEZ</div>
    </div>
    <p class="disc"><b>Disclaimer:</b> $VIBEZ is a meme coin with no intrinsic value or expectation of financial return. Cryptocurrency trading carries substantial risk of loss and is not suitable for everyone. Always DYOR.</p>
    <div class="foot-links">
      <a href="https://t.me/vibecoinonsoll" target="_blank" rel="noopener noreferrer">Telegram</a>
      <a href="https://x.com/Vibez_coin" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
    </div>
    <p>&copy; 2026 $VIBEZ. All rights reserved.</p>
  </div>
</footer>

<script>
  // Set this to the real contract address at launch. While empty, Copy CA tells people it isn't live yet.
  var CONTRACT_ADDRESS = '';

  var caText = document.getElementById('ca-text');
  if (CONTRACT_ADDRESS) caText.textContent = CONTRACT_ADDRESS;

  var toastTimer;

  /**
   * @param {string} message
   * @param {boolean} [isError]
   */
  function showToast(message, isError) {
    var toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = message;
    document.getElementById('toast-icon').textContent = isError ? '!' : '✓';
    toast.classList.toggle('error', !!isError);
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 3000);
  }

  function copyContractAddress() {
    if (!CONTRACT_ADDRESS) {
      showToast('Contract address is not live yet. Check Telegram and X at launch.', true);
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(CONTRACT_ADDRESS)
        .then(function () { showToast('Contract address copied!', false); })
        .catch(function () { showToast('Copy failed. Select the address manually.', true); });
    } else {
      showToast('Copy not supported here. Select the address manually.', true);
    }
  }
  document.getElementById('copy-btn').addEventListener('click', copyContractAddress);

  // Mobile menu
  var menuBtn = document.getElementById('menu-btn');
  var menu = document.getElementById('mobile-menu');
  menuBtn.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.firstElementChild.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      menu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.firstElementChild.className = 'fa-solid fa-bars';
    }
  });
</script>

<script>
(function () {
  // ---- SETTINGS ----
  var CONFIG = {
    VERIFY_ENDPOINT: '',   // optional: your backend URL that checks a task, replies {"verified": true}
    SUBMIT_ENDPOINT: '',   // optional: URL that receives the user's progress as JSON
    STORAGE_KEY: 'vibez_airdrop_v1'
  };

  // ---- TASK LIST: add, remove or edit tasks here ----
  var TASKS = [
    { id: 'x', type: 'link', icon: 'fa-brands fa-x-twitter', title: 'Follow us on X',
      desc: 'Follow @Vibez_coin, then press Verify.', url: 'https://x.com/Vibez_coin', cta: 'Follow on X' },
    { id: 'tg', type: 'link', icon: 'fa-brands fa-telegram', title: 'Join our Telegram',
      desc: 'Join the community channel, then press Verify.', url: 'https://t.me/vibecoinonsoll', cta: 'Join Telegram' },
    { id: 'email', type: 'email', icon: 'fa-solid fa-envelope', title: 'Drop your email',
      desc: 'Used for airdrop updates and announcements.', placeholder: 'you@example.com' },
    { id: 'wallet', type: 'address', icon: 'fa-solid fa-wallet', title: 'Submit your Solana address',
      desc: 'The public wallet address that will receive your share.', placeholder: 'Your Solana wallet address' }
  ];

  var listEl = document.getElementById('tk-list');
  if (!listEl) return;
  var editing = {};
  var state = load();

  function load() {
    try { return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || {}; } catch (e) { return {}; }
  }
  function save() {
    try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
    if (CONFIG.SUBMIT_ENDPOINT) {
      try {
        fetch(CONFIG.SUBMIT_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(state) });
      } catch (e) {}
    }
  }

  /** @param {string} id */
  function getTask(id) { return TASKS.filter(function (t) { return t.id === id; })[0]; }

  /** @param {any} t */
  function isDone(t) {
    var s = state[t.id] || {};
    return t.type === 'link' ? !!s.verified : !!s.saved;
  }

  /** @param {string} s */
  function isEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s); }

  /** Checks base58 format and that it decodes to exactly 32 bytes (a valid Solana public key). @param {string} s */
  function isSolAddress(s) {
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(s)) return false;
    var ALPHA = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    var bytes = [0], i, j, c;
    for (i = 0; i < s.length; i++) {
      c = ALPHA.indexOf(s[i]);
      for (j = 0; j < bytes.length; j++) { c += bytes[j] * 58; bytes[j] = c & 255; c >>= 8; }
      while (c > 0) { bytes.push(c & 255); c >>= 8; }
    }
    for (i = 0; i < s.length && s[i] === '1'; i++) bytes.push(0);
    return bytes.length === 32;
  }

  /** @param {any} t @param {number} i */
  function taskHTML(t, i) {
    var s = state[t.id] || {};
    var done = isDone(t);
    var label = t.type === 'link' ? 'Verified' : 'Saved';
    var h = '<div class="tk-task' + (done ? ' done' : '') + '" data-id="' + t.id + '">' +
      '<div class="tk-head"><div class="tk-icon"><i class="' + t.icon + '"></i></div>' +
      '<div class="tk-info"><div class="tk-title"><span class="tk-num">' + (i + 1) + '</span>' + t.title + '</div>' +
      '<p class="tk-desc">' + t.desc + '</p></div>' +
      '<span class="tk-pill' + (done ? ' ok' : '') + '">' + (done ? '<i class="fa-solid fa-check"></i> ' + label : 'Pending') + '</span></div>';

    if (t.type === 'link') {
      if (done) {
        h += '<div class="tk-actions"><button class="tk-btn success" type="button" disabled><i class="fa-solid fa-circle-check"></i> Completed</button></div>';
      } else {
        h += '<div class="tk-actions">' +
          '<a class="tk-btn primary" data-action="open" href="' + t.url + '" target="_blank" rel="noopener noreferrer"><i class="' + t.icon + '"></i> ' + t.cta + '</a>' +
          '<button class="tk-btn" type="button" data-action="verify"' + (s.visited ? '' : ' disabled') + '><i class="fa-solid fa-shield-halved"></i> Verify</button></div>';
      }
    } else {
      var locked = s.saved && !editing[t.id];
      h += '<form class="tk-form" data-id="' + t.id + '" novalidate>' +
        '<input class="tk-input" name="v" type="' + (t.type === 'email' ? 'email' : 'text') + '" placeholder="' + t.placeholder + '" ' +
        'aria-label="' + t.title + '" autocomplete="' + (t.type === 'email' ? 'email' : 'off') + '" spellcheck="false" autocapitalize="off"' + (locked ? ' readonly' : '') + '>';
      if (locked) {
        h += '<button class="tk-btn" type="button" data-action="edit"><i class="fa-solid fa-pen"></i> Edit</button>';
      } else {
        h += '<button class="tk-btn primary" type="submit"><i class="fa-solid fa-floppy-disk"></i> ' + (s.saved ? 'Update' : 'Save') + '</button>';
        if (s.saved) h += '<button class="tk-btn" type="button" data-action="cancel">Cancel</button>';
      }
      h += '</form>';
    }
    return h + '<div class="tk-msg" role="status" aria-live="polite"></div></div>';
  }

  function render() {
    listEl.innerHTML = TASKS.map(taskHTML).join('');
    var forms = listEl.querySelectorAll('form[data-id]');
    for (var i = 0; i < forms.length; i++) {
      var f = forms[i];
      f.elements['v'].value = (state[f.getAttribute('data-id')] || {}).value || '';
    }
    var count = TASKS.filter(isDone).length;
    var pct = Math.round((count / TASKS.length) * 100);
    document.getElementById('tk-count').textContent = String(count);
    document.getElementById('tk-total').textContent = String(TASKS.length);
    document.getElementById('tk-fill').style.width = pct + '%';
    document.getElementById('tk-bar').setAttribute('aria-valuenow', String(pct));
    document.getElementById('tk-final').hidden = count !== TASKS.length;
  }

  /** @param {Element} card @param {string} text @param {boolean} [ok] */
  function say(card, text, ok) {
    var m = card.querySelector('.tk-msg');
    if (!m) return;
    m.textContent = text;
    m.className = 'tk-msg' + (ok ? ' ok' : '');
  }

  /** @param {string} id @param {HTMLElement} btn @param {Element} card */
  function verify(id, btn, card) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Checking…';
    var check = CONFIG.VERIFY_ENDPOINT
      ? fetch(CONFIG.VERIFY_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ task: id }) })
          .then(function (r) { return r.json(); }).then(function (d) { return !!d.verified; })
      : new Promise(function (res) { setTimeout(function () { res(true); }, 1800); });
    check.then(function (ok) {
      if (ok) {
        state[id] = Object.assign({}, state[id], { verified: true });
        save(); render();
      } else {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Verify';
        say(card, "We couldn't verify this yet. Complete the task, then try again.");
      }
    }).catch(function () {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Verify';
      say(card, 'Something went wrong. Please try again.');
    });
  }

  listEl.addEventListener('click', function (e) {
    var el = /** @type {HTMLElement} */ (e.target).closest('[data-action]');
    if (!el) return;
    var card = el.closest('.tk-task');
    var id = card.getAttribute('data-id');
    var action = el.getAttribute('data-action');
    if (action === 'open') {
      state[id] = Object.assign({}, state[id], { visited: true });
      save();
      var vb = card.querySelector('[data-action="verify"]');
      if (vb) vb.removeAttribute('disabled');
    } else if (action === 'verify') {
      verify(id, /** @type {HTMLElement} */ (el), card);
    } else if (action === 'edit') {
      editing[id] = true; render();
      var inp = listEl.querySelector('[data-id="' + id + '"] .tk-input');
      if (inp) /** @type {HTMLInputElement} */ (inp).focus();
    } else if (action === 'cancel') {
      delete editing[id]; render();
    }
  });

  listEl.addEventListener('submit', function (e) {
    e.preventDefault();
    var form = /** @type {HTMLFormElement} */ (e.target);
    var id = form.getAttribute('data-id');
    var t = getTask(id);
    var card = form.closest('.tk-task');
    var value = form.elements['v'].value.trim();
    if (t.type === 'email' && !isEmail(value)) return say(card, 'Please enter a valid email address.');
    if (t.type === 'address' && !isSolAddress(value)) return say(card, "That doesn't look like a valid Solana address. Check it and try again.");
    state[id] = { value: value, saved: true };
    delete editing[id];
    save(); render();
    var fresh = listEl.querySelector('[data-id="' + id + '"]');
    if (fresh) say(fresh, 'Saved. You can update it any time.', true);
  });

  render();
})();
</script>
</body>
</html>

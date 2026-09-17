<!-- DESIGN.md -->
Design System Reference — Vitto Brand
Loan Repayment Service — MSME Lending
Project Loan Repayment Service (Vitto Full Stack SDE Assignment) Source Extracted from vitto.money screenshots (homepage, hero, feature sections, footer) Status Draft — colors are visually estimated from screenshots, not pixel-sampled. Treat hex values as close approximations; verify against Vitto's actual style guide/logo files if pixel-exact fidelity matters. Traces to PRD.md, SRS.md, Architecture.md
1. Brand Read
Vitto's public site is bold and energetic, not the muted navy/slate look typical of "serious fintech." The identity leans on one vivid, saturated brand color (a raspberry/crimson pink-red) used confidently and repeatedly — solid color blocks, gradient hero, pill-shaped buttons — contrasted against a near-black "ink" used for authority moments (primary nav CTA, footer). Illustration style is minimal, isometric, low-detail. Typography is a bold geometric/grotesk sans for headlines, lighter weight for body copy.
Correction to earlier assumption: this is not a subdued blue enterprise-SaaS palette — it's a confident single-accent brand. For our internal ops tool, we'll carry the accent color and typography faithfully, but use it more sparingly than the marketing site (one accent color dominating a data-dense internal dashboard would hurt scannability) — accent for primary actions and brand moments, neutral surfaces for the actual data.
2. Color Palette
2.1 Brand Colors
Token Approx. Hex Where seen on vitto.money --vitto-pink (primary) #E3195E Logo mark + wordmark, "Schedule a Demo" / "Get In Touch" buttons, numbered feature cards (1–4), social icons, hero gradient --vitto-pink-soft #F9C4D2 Hero background gradient (pink fading to white behind cloud imagery) --vitto-ink (dark) #0E0E17 "Get Started" nav button, footer background
2.2 Supporting / Data-Viz Colors
(seen inside Vitto's own product-dashboard mockup embedded in their hero — directly relevant since our project is a lending dashboard)
Token Approx. Hex Usage in their dashboard preview --status-blue #3B82F6 "Loans approved" --status-green #10B981 "Loans in progress" --status-amber #F2994A "Loans in transit" --status-pink #E3195E "Loans rejected" (reuses brand pink)
2.3 Neutrals
Token Approx. Hex Usage --surface #FFFFFF Page/card backgrounds --surface-muted #F7F7F9 Section backgrounds, table stripes --text-primary #12121A Headings --text-secondary #6B6B76 Body copy, helper text --border #E7E7EC Card borders, dividers
2.4 Mapping to Our App's Status Pills
Our schedule table (SRS §3.2) needs 4 states — mapped onto Vitto's own dashboard color logic rather than invented from scratch:
Our status Color Rationale PAID --status-green Matches their "in progress → good" association PARTIALLY_PAID --status-amber Matches their "in transit" (in-between state) PENDING Neutral gray (--text-secondary on --surface-muted) Not yet due — no color signal needed OVERDUE --vitto-pink Reuses the brand's own "rejected/alert" association — also keeps overdue visually tied to the brand color instead of a generic red, which reads as more "on-brand alert" than "system error"
3. Typography
Role Weight/Style Notes Display / Hero headline Bold–Black (800–900), tight letter-spacing e.g. "The Lending Infrastructure That Powers Growth" — large, high-contrast black text Section headings Bold (700) e.g. "The Reality of Today's Lending Technology" Body copy Regular (400), gray (--text-secondary) Comfortable line-height, smaller size than headings Oversized display numerals Black (900), white-on-pink Decorative numbering in the "1 2 3 4" feature cards — a distinctive Vitto flourish worth echoing sparingly (e.g. instalment sequence numbers in the schedule)
Font family: exact font file isn't extractable from screenshots — visually it's a modern geometric/grotesk sans at a bold weight for headings. Closest safe web-font substitutes: Inter, Manrope, or Sora (any works well at 700–900 for headings, 400 for body). Recommend Inter for our project — it's the most reliable across browsers and pairs cleanly with dense tabular data (good numeral alignment, which matters for the schedule table).
4. Logo & Iconography


Logo mark: a small 4-petal flower/pinwheel icon made of rounded squares, in --vitto-pink, paired immediately left of the "Vitto" wordmark (same color, bold sans).

Works on both light backgrounds (colored mark + dark wordmark or colored wordmark) and dark backgrounds (white/pink mark + wordmark on the black footer).

Icons throughout the site are simple line/duotone style, circular pink buttons for social links.
5. Components (as seen on vitto.money)
Component Style Buttons Fully rounded pill shape (border-radius: 9999px). Three variants seen: (1) solid --vitto-pink bg + white text — primary action; (2) white bg + dark border + pink icon/text — secondary on colored backgrounds; (3) solid --vitto-ink bg + white text — nav-level CTA Cards Rounded corners (~12–16px radius). Two styles: solid --vitto-pink fill with white text (feature/stat cards), or white fill with subtle border/shadow (testimonial cards) Nav White/transparent top bar, centered nav links, logo left, pill CTA button right Footer Solid --vitto-ink background, white/pink text, pink circular social icons, dark input field for email capture Illustrations Isometric, minimal, low-detail, using brand pink + white + ink — used for conceptual sections, not for data
6. Applying This to the Loan Repayment Service UI
This is an internal ops tool, not a marketing site — so the application below is deliberately more restrained than vitto.money itself: neutral surfaces carry the data, brand color is reserved for actions, identity, and the one place it earns its keep (overdue alerts).
Screen element Treatment Header bar White background, --vitto-pink logo mark + "Vitto" wordmark (small, top-left), user email + Sign Out (text button) top-right Primary buttons ("Sign In", "Submit Payment", "Record Payment") Pill-shaped, solid --vitto-pink, white text — matches their primary CTA exactly Secondary buttons ("Cancel", "Continue with Google") Pill-shaped, white bg, dark border, dark text Summary cards (Outstanding Principal / Next Due / Overdue) White cards, subtle border, rounded corners — not solid pink fill (that's reserved for marketing-style stat cards; here it would compete with the data). Overdue card's number renders in --vitto-pink when > 0. Schedule table status pills Per §2.4 mapping above Instalment sequence number (# column) Optional nod to their oversized-numeral flourish — bold, slightly larger weight than the rest of the row, in --text-primary Sign-in screen White card centered on --surface-muted background (skip the pink cloud-gradient hero treatment — too decorative for a utility sign-in screen), logo at top, pill-shaped buttons per above Footer (if any) Not needed for a single internal tool page — omit; this isn't a marketing site
7. Design Tokens (CSS Custom Properties)
Ready to drop into globals.css or a Tailwind theme extension:
:root {
  /* Brand */
  --vitto-pink: #E3195E;
  --vitto-pink-soft: #F9C4D2;
  --vitto-ink: #0E0E17;

  /* Status */
  --status-blue: #3B82F6;
  --status-green: #10B981;
  --status-amber: #F2994A;
  --status-pink: #E3195E;

  /* Neutrals */
  --surface: #FFFFFF;
  --surface-muted: #F7F7F9;
  --text-primary: #12121A;
  --text-secondary: #6B6B76;
  --border: #E7E7EC;

  /* Shape */
  --radius-pill: 9999px;
  --radius-card: 14px;

  /* Type */
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
}

8. Open Caveat
These values are read off screenshots by eye, not sampled from the live DOM/CSS or brand assets — close enough for a cohesive internal-tool UI, but if exact brand fidelity ever matters (e.g. this became a real customer-facing surface), pull the real hex values from Vitto's CSS (inspect element) or ask their design team for brand guidelines rather than relying on this document as ground truth.

<!-- Design System -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 40" fill="none">
  <g transform="translate(4, 4)">
    <!-- 4-petal pinwheel icon made of rounded squares -->
    <rect x="2" y="2" width="13" height="13" rx="4" fill="#E3195E" />
    <rect x="17" y="2" width="13" height="13" rx="4" fill="#E3195E" opacity="0.85" />
    <rect x="2" y="17" width="13" height="13" rx="4" fill="#E3195E" opacity="0.85" />
    <rect x="17" y="17" width="13" height="13" rx="4" fill="#E3195E" />
  </g>
  <text x="44" y="27" font-family="'Inter', -apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="800" fill="#0E0E17" letter-spacing="-0.5px">Vitto</text>
</svg>

<!-- Vitto Logo -->
<!DOCTYPE html>

<html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={darkMode:"class",theme:{extend:{colors:{"surface-container-high":"#e8e7f4","status-overdue-bg":"#FDF2F4","tertiary-fixed-dim":"#adc6ff","status-partially-paid":"#F2994A","status-overdue":"#E3195E","surface-container-low":"#f4f2ff","inverse-surface":"#2f3039","surface-subtle":"#F1F2F4","surface-container":"#eeecf9","on-error":"#ffffff","tertiary-fixed":"#d8e2ff","status-partially-paid-bg":"#FFF7ED","on-primary-fixed":"#400014","on-primary":"#ffffff","secondary":"#5e5d68","on-error-container":"#93000a","background":"#fbf8ff","surface-variant":"#e3e1ee","error-container":"#ffdad6","outline-variant":"#e4bdc1","inverse-primary":"#ffb2bd","surface-dim":"#dad9e5","on-surface":"#1a1b24","error":"#ba1a1a","on-primary-fixed-variant":"#900037","on-secondary-fixed-variant":"#464650","on-secondary":"#ffffff","on-surface-variant":"#5b3f43","border-default":"#E7E7EC","brand-pink-soft":"#F9C4D2","surface-container-lowest":"#ffffff","tertiary-container":"#2271e4","on-secondary-fixed":"#1b1b24","status-paid-bg":"#ECFDF5","status-paid":"#10B981","on-secondary-container":"#62616d","on-tertiary-container":"#fffdff","text-secondary":"#6B6B76","secondary-container":"#e1deeb","secondary-fixed":"#e4e1ee","surface-bright":"#fbf8ff","surface-muted":"#F7F7F9","on-primary-container":"#fffdff","tertiary":"#0058bf","secondary-fixed-dim":"#c7c5d2","status-pending":"#6B6B76","surface":"#fbf8ff","text-tertiary":"#9CA3AF","text-primary":"#12121A","outline":"#8f6f73","border-subtle":"#F0F0F3","surface-default":"#FFFFFF","on-tertiary-fixed-variant":"#004395","surface-container-highest":"#e3e1ee","primary-fixed":"#ffd9dd","on-tertiary-fixed":"#001a42","primary-fixed-dim":"#ffb2bd","surface-tint":"#bd004a","status-pending-bg":"#F3F4F6","on-background":"#1a1b24","on-tertiary":"#ffffff","primary":"#b90049","primary-container":"#e3195e","inverse-on-surface":"#f1effc"},borderRadius:{DEFAULT:"0.25rem",lg:"0.5rem",xl:"0.75rem",full:"9999px"},spacing:{"gutter":"1rem","space-xs":"0.5rem","margin-desktop":"2rem","space-md":"1rem","margin":"1rem","gutter-desktop":"1.5rem","space-2xs":"0.25rem","space-lg":"1.5rem","space-sm":"0.75rem","space-xl":"2rem","space-2xl":"3rem"},fontFamily:{"body-lg":["Inter"],"body-sm":["Inter"],"body-md":["Inter"],"numeral-hero":["Inter"],"headline-sm":["Inter"],"label-sm":["Inter"],"label-lg":["Inter"],"numeral-data":["Inter"],"headline-xl":["Inter"],"label-md":["Inter"],"headline-md":["Inter"],"headline-lg":["Inter"]},fontSize:{"body-lg":["16px",{lineHeight:"24px",letterSpacing:"-0.005em",fontWeight:"400"}],"body-sm":["12px",{lineHeight:"16px",letterSpacing:"0em",fontWeight:"400"}],"body-md":["14px",{lineHeight:"20px",letterSpacing:"0em",fontWeight:"400"}],"numeral-hero":["28px",{lineHeight:"36px",letterSpacing:"-0.02em",fontWeight:"700"}],"headline-sm":["16px",{lineHeight:"22px",letterSpacing:"-0.01em",fontWeight:"600"}],"label-sm":["11px",{lineHeight:"14px",letterSpacing:"0.04em",fontWeight:"600"}],"label-lg":["14px",{lineHeight:"20px",letterSpacing:"0.01em",fontWeight:"600"}],"numeral-data":["14px",{lineHeight:"20px",letterSpacing:"0em",fontWeight:"500"}],"headline-xl":["32px",{lineHeight:"40px",letterSpacing:"-0.025em",fontWeight:"800"}],"label-md":["12px",{lineHeight:"16px",letterSpacing:"0.02em",fontWeight:"600"}],"headline-md":["18px",{lineHeight:"24px",letterSpacing:"-0.015em",fontWeight:"600"}],"headline-lg":["24px",{lineHeight:"32px",letterSpacing:"-0.02em",fontWeight:"700"}]}}}}</script></head><body class="bg-surface-muted text-on-surface font-body-md"><main class="min-h-screen w-full flex items-center justify-center p-space-md bg-surface-muted"><div class="flex flex-col w-full items-center justify-center min-h-[calc(100vh-2rem)]">
<div class="w-full max-w-[440px] flex flex-col items-center">
<!-- System Status & Security Pill Indicator -->
<div class="mb-space-lg flex items-center gap-space-2xs bg-surface-container px-3 py-1 rounded-full shadow-sm">
<span class="w-2 h-2 rounded-full bg-status-paid"></span>
<span class="font-label-sm text-label-sm text-text-secondary tracking-wider uppercase">Production Gateway 04 • Operational</span>
</div>
<!-- Main Authentication Surface -->
<div class="w-full bg-surface-default rounded-xl shadow-md p-8 sm:p-10 transition-all duration-200">
<!-- Brand & Service Identifier Header -->
<div class="flex flex-col items-center text-center">
<!-- Vitto Monogram / Geometry Mark -->
<div class="w-12 h-12 rounded-xl bg-text-primary flex items-center justify-center mb-space-md shadow-sm">
<svg class="w-7 h-7 text-surface-default" fill="none" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M4 4L12 20L20 4H15.5L12 13L8.5 4H4Z" fill="currentColor"></path>
<path d="M12 14.5L14.2 19H9.8L12 14.5Z" fill="#E3195E"></path>
</svg>
</div>
<div class="flex items-center gap-space-xs mb-space-2xs">
<span class="font-headline-lg text-headline-lg text-text-primary tracking-tight">Vitto</span>
<span class="bg-status-overdue-bg text-status-overdue px-2 py-0.5 rounded-full font-label-sm text-label-sm">CORE</span>
</div>
<h1 class="font-headline-sm text-headline-sm text-text-primary tracking-tight">
          Loan Repayment Service
        </h1>
<p class="font-body-sm text-body-sm text-text-secondary mt-1">
          Internal Ops Portal <span class="mx-1">•</span> Authorized Personnel Only
        </p>
</div>
<!-- Credential Form -->
<form class="mt-8 space-y-4" onsubmit="event.preventDefault(); return false;">
<!-- Field: Work Email -->
<div class="flex flex-col space-y-1.5 text-left">
<label class="font-label-md text-label-md text-text-primary" for="work-email">
            Work Email
          </label>
<div class="relative flex items-center">
<input autocomplete="email" class="w-full h-10 px-3 bg-surface-muted rounded-lg font-body-md text-body-md text-text-primary placeholder:text-text-tertiary focus:outline-none focus:bg-surface-default focus:ring-2 focus:ring-primary-container transition-all" id="work-email" name="email" placeholder="officer@vitto.money" required="" type="email"/>
<span class="material-symbols-outlined absolute right-3 text-text-tertiary text-[20px] pointer-events-none">
              alternate_email
            </span>
</div>
</div>
<!-- Field: Password -->
<div class="flex flex-col space-y-1.5 text-left">
<div class="flex items-center justify-between">
<label class="font-label-md text-label-md text-text-primary" for="password">
              Password
            </label>
<a class="font-label-sm text-label-sm text-primary-container hover:underline transition-all" href="#recovery" tabindex="0">
              Forgot password?
            </a>
</div>
<div class="relative flex items-center">
<input autocomplete="current-password" class="w-full h-10 pl-3 pr-10 bg-surface-muted rounded-lg font-body-md text-body-md text-text-primary placeholder:text-text-tertiary focus:outline-none focus:bg-surface-default focus:ring-2 focus:ring-primary-container transition-all" id="password" name="password" placeholder="••••••••••••" required="" type="password"/>
<button aria-label="Toggle password visibility" class="absolute right-2.5 flex items-center justify-center p-1 text-text-tertiary hover:text-text-primary focus:outline-none" id="toggle-password" type="button">
<span class="material-symbols-outlined text-[20px]" id="password-visibility-icon">visibility</span>
</button>
</div>
</div>
<!-- Submission CTA -->
<div class="pt-2">
<button class="w-full h-10 bg-primary-container hover:bg-primary text-on-primary rounded-full font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]" id="btn-submit" type="submit">
<span>Sign In</span>
<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</div>
</form>
<!-- Clean Divider -->
<div class="relative my-6 flex items-center justify-center">
<div class="w-full h-px bg-surface-variant"></div>
<span class="absolute bg-surface-default px-3 font-label-sm text-label-sm text-text-tertiary uppercase">
          or
        </span>
</div>
<!-- Enterprise Google Identity Action -->
<div>
<button class="w-full h-10 bg-surface-default hover:bg-surface-muted text-text-primary rounded-full font-label-lg text-label-lg flex items-center justify-center gap-3 shadow-sm transition-all active:scale-[0.99]" type="button">
<svg class="w-4 h-4" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
</svg>
<span>Continue with Google</span>
</button>
</div>
</div>
<!-- Security & Compliance Footnote -->
<div class="mt-6 flex flex-col items-center text-center space-y-1.5 px-4">
<div class="flex items-center gap-1.5 text-text-secondary">
<span class="material-symbols-outlined text-[16px] text-text-secondary">lock</span>
<span class="font-label-sm text-label-sm tracking-wide">Protected by Vitto Enterprise SSO &amp; 2FA</span>
</div>
<p class="font-body-sm text-body-sm text-text-tertiary">
        Session activity, IP metrics, and records access are strictly audited.
      </p>
</div>
<!-- Direct Quick Links -->
<div class="mt-8 flex items-center justify-center gap-4 text-text-tertiary font-body-sm text-body-sm">
<a class="hover:text-text-secondary transition-colors" href="#help">IT Service Desk</a>
<span>•</span>
<a class="hover:text-text-secondary transition-colors" href="#compliance">Security Policy</a>
<span>•</span>
<span class="font-label-sm text-label-sm bg-surface-container px-2 py-0.5 rounded text-text-secondary">v2.4.1</span>
</div>
</div>
</div>
<script>
  (function() {
    const toggleBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    const visibilityIcon = document.getElementById('password-visibility-icon');

    if (toggleBtn && passwordInput && visibilityIcon) {
      toggleBtn.addEventListener('click', function() {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        visibilityIcon.textContent = isPassword ? 'visibility_off' : 'visibility';
      });
    }
  })();
</script></main></body></html>

<!-- Sign In - Loan Repayment Service -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Loan Repayment Service - Vitto Ops</title>
<!-- Google Fonts: Inter & Material Symbols -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          },
          colors: {
            brand: {
              50: '#FDF2F5',
              100: '#FCE7EE',
              500: '#E3195E',
              600: '#C71250',
              700: '#A30D40',
            },
            status: {
              paid: '#10B981',
              'paid-bg': '#ECFDF5',
              'paid-border': '#A7F3D0',
              overdue: '#E3195E',
              'overdue-bg': '#FFF1F4',
              'overdue-border': '#FECDD6',
              pending: '#64748B',
              'pending-bg': '#F1F5F9',
              'pending-border': '#E2E8F0',
              partial: '#F59E0B',
              'partial-bg': '#FFFBEB',
              'partial-border': '#FDE68A',
            }
          }
        }
      }
    };
  </script>
<style>
    body {
      font-feature-settings: "cv02", "cv03", "cv04", "cv11";
    }
    .tabular-nums {
      font-variant-numeric: tabular-nums;
    }
  </style>
</head>
<body class="bg-[#F8F9FA] text-[#0F172A] font-sans min-h-screen antialiased flex flex-col">
<!-- Fixed Top Header -->
<header class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 h-16">
<div class="h-full px-6 flex items-center justify-between">
<!-- Left: Logo & Ops System Tag -->
<div class="flex items-center gap-3.5">
<div class="flex items-center gap-2">
<!-- Vitto SVG Pinwheel / Brand Mark -->
<div class="w-8 h-8 rounded-lg bg-[#E3195E] flex items-center justify-center shadow-sm">
<svg class="w-5 h-5 text-white" fill="currentColor" viewbox="0 0 24 24">
<path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15.93V14a2 2 0 0 1 2-2h3.93a8 8 0 0 1-5.93 5.93zm0-7.93a2 2 0 0 1-2-2V4.07A8 8 0 0 1 17.93 10H14a2 2 0 0 1-1 0zM4.07 12A8 8 0 0 1 10 6.07V10a2 2 0 0 1-2 2H4.07zm5.93 2v3.93A8 8 0 0 1 6.07 14H10z"></path>
</svg>
</div>
<span class="font-bold text-xl tracking-tight text-slate-900">vitto</span>
</div>
<div class="h-4 w-px bg-slate-300 mx-1"></div>
<div class="flex items-center gap-2">
<span class="font-semibold text-sm text-slate-800 tracking-tight">Loan Repayment Service</span>
<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase bg-slate-100 text-slate-600 border border-slate-200">
            INTERNAL OPS
          </span>
</div>
</div>
<!-- Right: User Identity & Action -->
<div class="flex items-center gap-4">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
<span class="material-symbols-outlined text-[18px]">person</span>
</div>
<div class="flex flex-col">
<span class="text-xs font-semibold text-slate-700 leading-tight">officer@vitto.money</span>
<span class="text-[10px] text-slate-400 font-medium">Ops Level 2</span>
</div>
</div>
<div class="h-4 w-px bg-slate-200"></div>
<button class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#E3195E] transition-colors focus:outline-none" type="button">
<span class="material-symbols-outlined text-[16px]">logout</span>
<span>Sign Out</span>
</button>
</div>
</div>
</header>
<!-- Navigation Sidebar -->
<aside class="fixed left-0 top-16 bottom-0 w-60 bg-white border-r border-slate-200 z-40 flex flex-col justify-between py-4">
<div class="flex flex-col gap-5 px-3">
<!-- Group 1 -->
<div>
<div class="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Operations Core
        </div>
<nav class="space-y-1">
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold bg-[#FFF1F4] text-[#E3195E] border border-[#FECDD6]/50" href="#">
<span class="material-symbols-outlined text-[20px]">payments</span>
<span>Repayments</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
<span class="material-symbols-outlined text-[20px] text-slate-400">account_balance</span>
<span>Loan Accounts</span>
</a>
<a class="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-[20px] text-slate-400">warning</span>
<span>Delinquency Queue</span>
</div>
<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FFF1F4] text-[#E3195E]">1</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
<span class="material-symbols-outlined text-[20px] text-slate-400">receipt_long</span>
<span>Settlements</span>
</a>
</nav>
</div>
<!-- Group 2 -->
<div>
<div class="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Finance &amp; Audit
        </div>
<nav class="space-y-1">
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
<span class="material-symbols-outlined text-[20px] text-slate-400">sync_alt</span>
<span>Reconciliation</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
<span class="material-symbols-outlined text-[20px] text-slate-400">history</span>
<span>Audit Trail</span>
</a>
</nav>
</div>
</div>
<!-- Node Status Pill in Sidebar Footer -->
<div class="px-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
<span class="font-mono text-[11px]">Node v2.4.1</span>
<div class="flex items-center gap-1.5">
<span class="inline-block w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></span>
<span class="text-[11px] text-slate-500 font-medium">Synced</span>
</div>
</div>
</aside>
<!-- Main Content Stage -->
<div class="pl-60 pt-16 min-h-screen">
<main class="max-w-7xl mx-auto px-8 py-7">
<div class="flex flex-col gap-6">
<!-- 1. Active Account / Loan Selector Bar -->
<div class="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 lg:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
<div class="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
<div class="flex items-center gap-2 text-slate-400 shrink-0">
<span class="material-symbols-outlined text-[22px] text-[#E3195E]">real_estate_agent</span>
<span class="text-xs font-bold uppercase tracking-wider text-slate-500">Active Account</span>
</div>
<!-- Custom Clean Dropdown Select Area -->
<div class="relative flex-1 max-w-xl">
<button class="w-full h-12 px-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 rounded-lg flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-[#E3195E]/20 text-left" id="loanSelectorBtn" type="button">
<div class="flex items-center gap-3 min-w-0">
<div class="w-8 h-8 rounded-md bg-[#FFF1F4] border border-[#FECDD6] text-[#E3195E] flex items-center justify-center text-xs font-bold shrink-0">
                    LN
                  </div>
<div class="flex flex-col min-w-0 leading-tight">
<div class="flex items-center gap-2">
<span class="text-sm font-bold text-slate-900 tracking-tight">LN-2031 · ₹2,00,000</span>
<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
</div>
<span class="text-xs text-slate-500 truncate mt-0.5">Apex Retailers Pvt Ltd · Term Loan · 18 of 24 months completed</span>
</div>
</div>
<span class="material-symbols-outlined text-slate-400 ml-2 shrink-0">unfold_more</span>
</button>
<!-- Dropdown Content Box -->
<div class="hidden absolute top-full left-0 right-0 mt-1.5 z-30 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden" id="loanDropdownMenu">
<div class="p-2 border-b border-slate-100 bg-slate-50">
<div class="relative">
<span class="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[18px]">search</span>
<input class="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#E3195E]" placeholder="Search loan ID, business name, or GSTIN..." type="text"/>
</div>
</div>
<div class="max-h-56 overflow-y-auto divide-y divide-slate-100">
<div class="p-3 bg-[#FFF1F4]/40 flex items-center justify-between cursor-pointer hover:bg-[#FFF1F4]/70">
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="text-xs font-bold text-slate-900">LN-2031 · ₹2,00,000</span>
<span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#FFF1F4] text-[#E3195E] border border-[#FECDD6]">Overdue (1)</span>
</div>
<span class="text-[11px] text-slate-500">Apex Retailers Pvt Ltd · Mumbai, MH</span>
</div>
<span class="material-symbols-outlined text-[#E3195E] text-[18px]">check_circle</span>
</div>
<div class="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="text-xs font-medium text-slate-800">LN-1984 · ₹5,00,000</span>
<span class="px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700">Current</span>
</div>
<span class="text-[11px] text-slate-500">Bharat Logistics Hub · Pune, MH</span>
</div>
<span class="text-[11px] font-medium text-slate-400">#24/36</span>
</div>
</div>
</div>
</div>
</div>
<!-- Right: Mandate & ROI badges neatly spaced -->
<div class="flex items-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
<span class="material-symbols-outlined text-slate-500 text-[18px]">verified_user</span>
<span class="text-xs text-slate-600">Mandate: <strong class="text-slate-900 font-semibold">eNACH / Active</strong></span>
</div>
<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
<span class="material-symbols-outlined text-slate-500 text-[18px]">percent</span>
<span class="text-xs text-slate-600">ROI: <strong class="text-slate-900 font-semibold">16.5% p.a. Reducing</strong></span>
</div>
</div>
</div>
<!-- 2. KPI Summary Cards Strip (3 Cards Grid) -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-5">
<!-- Card 1: Outstanding Principal -->
<div class="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div class="flex items-start justify-between">
<div>
<span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Outstanding Principal</span>
<div class="text-2xl lg:text-[28px] leading-tight font-extrabold text-slate-900 tracking-tight mt-1.5 tabular-nums">
                  ₹84,500
                </div>
</div>
<div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
<span class="material-symbols-outlined text-[20px]">account_balance_wallet</span>
</div>
</div>
<div class="mt-5 pt-3.5 border-t border-slate-100 flex flex-col gap-2">
<div class="flex justify-between items-center text-xs">
<span class="text-slate-500 font-medium">Original ₹2,00,000</span>
<span class="font-bold text-slate-800 tabular-nums">57.7% Paid</span>
</div>
<!-- Progress Bar with accurate styling -->
<div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
<div class="bg-slate-900 h-full rounded-full" style="width: 57.7%"></div>
</div>
<span class="text-[11px] text-slate-400 font-medium">14 instalments remaining in tenure</span>
</div>
</div>
<!-- Card 2: Next Due -->
<div class="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div class="flex items-start justify-between">
<div>
<span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Next Due</span>
<div class="text-2xl lg:text-[28px] leading-tight font-extrabold text-slate-900 tracking-tight mt-1.5 tabular-nums">
                  10 Nov 2024 · ₹12,450
                </div>
</div>
<div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
<span class="material-symbols-outlined text-[20px]">event_upcoming</span>
</div>
</div>
<div class="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
<span class="text-xs font-semibold text-slate-700">Instalment #19</span>
</div>
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Due in 6 days
              </span>
</div>
</div>
<!-- Card 3: Overdue Amount (Highlighted in #E3195E) -->
<div class="bg-white rounded-xl p-5 border border-[#FECDD6] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between ring-1 ring-[#E3195E]/20">
<!-- Subtle rose ambient glow in top corner -->
<div class="absolute top-0 right-0 w-28 h-28 bg-[#FFF1F4] rounded-bl-full -z-0 pointer-events-none"></div>
<div class="flex items-start justify-between relative z-10">
<div>
<div class="flex items-center gap-2">
<span class="text-xs font-bold uppercase tracking-wider text-[#E3195E]">Overdue Amount</span>
<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#FFF1F4] text-[#E3195E] border border-[#FECDD6]">
                    ACTION REQUIRED
                  </span>
</div>
<div class="text-2xl lg:text-[28px] leading-tight font-extrabold text-[#E3195E] tracking-tight mt-1.5 tabular-nums">
                  ₹12,450
                </div>
</div>
<div class="w-10 h-10 rounded-xl bg-[#FFF1F4] border border-[#FECDD6] text-[#E3195E] flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-[20px]">error</span>
</div>
</div>
<div class="mt-5 pt-3.5 border-t border-rose-100/80 flex items-center justify-between relative z-10">
<div class="flex flex-col">
<span class="text-xs font-bold text-slate-900">1 instalment overdue (#18)</span>
<span class="text-[11px] text-slate-500">Due Oct 10, 2024 · 25 days late</span>
</div>
<button class="inline-flex items-center text-xs font-bold text-[#E3195E] hover:text-[#C71250] hover:underline" type="button">
<span>View Demand</span>
<span class="material-symbols-outlined text-[15px] ml-0.5">chevron_right</span>
</button>
</div>
</div>
</div>
<!-- 3. Repayment Schedule Table Section -->
<div class="bg-white rounded-xl border border-slate-200/90 shadow-sm flex flex-col overflow-hidden">
<!-- Schedule Controls Header -->
<div class="p-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
<!-- Left: Title & Status Filter Chips -->
<div class="flex flex-wrap items-center gap-4">
<div class="flex items-center gap-2.5">
<h2 class="text-lg font-bold text-slate-900 tracking-tight">Repayment Schedule</h2>
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  24 Instalments · <span class="text-[#E3195E] font-bold ml-1">1 Overdue</span>
</span>
</div>
<!-- Filter Tab Pills -->
<div class="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200/80 text-xs">
<button class="schedule-tab-btn px-3 py-1 rounded-md font-semibold bg-white text-slate-900 shadow-xs" data-filter="all" type="button">
                  All (24)
                </button>
<button class="schedule-tab-btn px-3 py-1 rounded-md font-medium text-slate-600 hover:text-slate-900" data-filter="overdue" type="button">
                  Overdue (1)
                </button>
<button class="schedule-tab-btn px-3 py-1 rounded-md font-medium text-slate-600 hover:text-slate-900" data-filter="pending" type="button">
                  Pending (6)
                </button>
<button class="schedule-tab-btn px-3 py-1 rounded-md font-medium text-slate-600 hover:text-slate-900" data-filter="paid" type="button">
                  Paid (17)
                </button>
</div>
</div>
<!-- Right: Action Buttons Group -->
<div class="flex items-center gap-2.5 flex-wrap">
<!-- Utility: Ledger PDF -->
<button class="h-9 px-3.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs" type="button">
<span class="material-symbols-outlined text-[16px] text-slate-500">download</span>
<span>Ledger PDF</span>
</button>
<!-- Utility: Export CSV -->
<button class="h-9 px-3.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs" type="button">
<span class="material-symbols-outlined text-[16px] text-slate-500">grid_on</span>
<span>Export CSV</span>
</button>
<!-- Primary Action Pill: Record Payment in Vitto Crimson #E3195E -->
<button class="h-9 px-4 rounded-full bg-[#E3195E] hover:bg-[#C71250] text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-98 focus:outline-none focus:ring-2 focus:ring-[#E3195E] focus:ring-offset-2" id="recordPaymentBtn" type="button">
<span class="material-symbols-outlined text-[17px]">add_circle</span>
<span>Record Payment</span>
</button>
</div>
</div>
<!-- Data Table with tabular numbers & clean padding -->
<div class="overflow-x-auto">
<table class="w-full border-collapse text-left text-xs">
<thead>
<tr class="bg-slate-50/80 h-10 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold select-none">
<th class="py-3 px-4 w-12 text-center">#</th>
<th class="py-3 px-4 min-w-[130px]">Due Date</th>
<th class="py-3 px-4 text-right min-w-[120px]">Principal</th>
<th class="py-3 px-4 text-right min-w-[110px]">Interest</th>
<th class="py-3 px-4 text-right min-w-[120px]">Total Due</th>
<th class="py-3 px-4 text-right min-w-[120px]">Amount Paid</th>
<th class="py-3 px-4 text-center min-w-[120px]">Status</th>
<th class="py-3 px-4 text-center w-24">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-slate-100 tabular-nums text-slate-900" id="scheduleTableBody">
<!-- Row 15: Paid -->
<tr class="h-12 hover:bg-slate-50 transition-colors">
<td class="px-4 text-center font-semibold text-slate-400">15</td>
<td class="px-4 whitespace-nowrap text-slate-600 font-medium">10 Jul 2024</td>
<td class="px-4 text-right text-slate-600">₹11,150.00</td>
<td class="px-4 text-right text-slate-500">₹1,300.00</td>
<td class="px-4 text-right font-semibold text-slate-800">₹12,450.00</td>
<td class="px-4 text-right font-semibold text-emerald-600">₹12,450.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Paid
                    </span>
</td>
<td class="px-4 text-center">
<button class="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors" title="View Receipt" type="button">
<span class="material-symbols-outlined text-[17px]">receipt</span>
</button>
</td>
</tr>
<!-- Row 16: Paid -->
<tr class="h-12 hover:bg-slate-50 transition-colors">
<td class="px-4 text-center font-semibold text-slate-400">16</td>
<td class="px-4 whitespace-nowrap text-slate-600 font-medium">10 Aug 2024</td>
<td class="px-4 text-right text-slate-600">₹11,300.00</td>
<td class="px-4 text-right text-slate-500">₹1,150.00</td>
<td class="px-4 text-right font-semibold text-slate-800">₹12,450.00</td>
<td class="px-4 text-right font-semibold text-emerald-600">₹12,450.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Paid
                    </span>
</td>
<td class="px-4 text-center">
<button class="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors" title="View Receipt" type="button">
<span class="material-symbols-outlined text-[17px]">receipt</span>
</button>
</td>
</tr>
<!-- Row 17: Paid -->
<tr class="h-12 hover:bg-slate-50 transition-colors">
<td class="px-4 text-center font-semibold text-slate-400">17</td>
<td class="px-4 whitespace-nowrap text-slate-600 font-medium">10 Sep 2024</td>
<td class="px-4 text-right text-slate-600">₹11,460.00</td>
<td class="px-4 text-right text-slate-500">₹990.00</td>
<td class="px-4 text-right font-semibold text-slate-800">₹12,450.00</td>
<td class="px-4 text-right font-semibold text-emerald-600">₹12,450.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Paid
                    </span>
</td>
<td class="px-4 text-center">
<button class="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors" title="View Receipt" type="button">
<span class="material-symbols-outlined text-[17px]">receipt</span>
</button>
</td>
</tr>
<!-- Row 18: OVERDUE HIGHLIGHTED ROW (Pink/Red border-l-4 and soft rose tint) -->
<tr class="h-12 border-l-4 border-l-[#E3195E] bg-[#FFF1F4]/60 hover:bg-[#FFF1F4] transition-colors">
<td class="px-4 text-center font-bold text-[#E3195E]">18</td>
<td class="px-4 whitespace-nowrap font-bold text-[#E3195E]">
<div class="flex items-center gap-1.5">
<span>10 Oct 2024</span>
<span class="material-symbols-outlined text-[16px]">warning</span>
</div>
</td>
<td class="px-4 text-right font-medium text-slate-800">₹11,620.00</td>
<td class="px-4 text-right font-medium text-slate-800">₹830.00</td>
<td class="px-4 text-right font-bold text-[#E3195E]">₹12,450.00</td>
<td class="px-4 text-right font-bold text-[#E3195E]">₹0.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF1F4] text-[#E3195E] border border-[#FECDD6]">
                      Overdue
                    </span>
</td>
<td class="px-4 text-center">
<div class="flex items-center justify-center gap-1">
<button class="text-[#E3195E] hover:text-[#A30D40] p-1.5 rounded hover:bg-rose-100/60 transition-colors" title="Send Demand Notice" type="button">
<span class="material-symbols-outlined text-[17px]">forward_to_inbox</span>
</button>
<button class="text-[#E3195E] hover:text-[#A30D40] p-1.5 rounded hover:bg-rose-100/60 transition-colors" title="Instant Settle" type="button">
<span class="material-symbols-outlined text-[17px]">payments</span>
</button>
</div>
</td>
</tr>
<!-- Row 19: Next Pending -->
<tr class="h-12 hover:bg-slate-50 transition-colors bg-blue-50/20">
<td class="px-4 text-center font-semibold text-slate-600">19</td>
<td class="px-4 whitespace-nowrap text-slate-900 font-semibold">
                    10 Nov 2024
                    <span class="ml-1 text-[11px] text-blue-600 font-bold">(Next)</span>
</td>
<td class="px-4 text-right text-slate-600">₹11,780.00</td>
<td class="px-4 text-right text-slate-500">₹670.00</td>
<td class="px-4 text-right font-semibold text-slate-800">₹12,450.00</td>
<td class="px-4 text-right text-slate-400">₹0.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      Pending
                    </span>
</td>
<td class="px-4 text-center">
<button class="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors" title="Schedule Auto-debit" type="button">
<span class="material-symbols-outlined text-[17px]">schedule</span>
</button>
</td>
</tr>
<!-- Row 20: Pending -->
<tr class="h-12 hover:bg-slate-50 transition-colors">
<td class="px-4 text-center font-semibold text-slate-400">20</td>
<td class="px-4 whitespace-nowrap text-slate-600">10 Dec 2024</td>
<td class="px-4 text-right text-slate-600">₹11,940.00</td>
<td class="px-4 text-right text-slate-500">₹510.00</td>
<td class="px-4 text-right font-medium text-slate-800">₹12,450.00</td>
<td class="px-4 text-right text-slate-400">₹0.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      Pending
                    </span>
</td>
<td class="px-4 text-center">
<button class="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors" title="Options" type="button">
<span class="material-symbols-outlined text-[17px]">more_horiz</span>
</button>
</td>
</tr>
<!-- Row 21: Pending -->
<tr class="h-12 hover:bg-slate-50 transition-colors">
<td class="px-4 text-center font-semibold text-slate-400">21</td>
<td class="px-4 whitespace-nowrap text-slate-600">10 Jan 2025</td>
<td class="px-4 text-right text-slate-600">₹12,100.00</td>
<td class="px-4 text-right text-slate-500">₹350.00</td>
<td class="px-4 text-right font-medium text-slate-800">₹12,450.00</td>
<td class="px-4 text-right text-slate-400">₹0.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      Pending
                    </span>
</td>
<td class="px-4 text-center">
<button class="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors" title="Options" type="button">
<span class="material-symbols-outlined text-[17px]">more_horiz</span>
</button>
</td>
</tr>
<!-- Row 22: Pending -->
<tr class="h-12 hover:bg-slate-50 transition-colors">
<td class="px-4 text-center font-semibold text-slate-400">22</td>
<td class="px-4 whitespace-nowrap text-slate-600">10 Feb 2025</td>
<td class="px-4 text-right text-slate-600">₹12,270.00</td>
<td class="px-4 text-right text-slate-500">₹180.00</td>
<td class="px-4 text-right font-medium text-slate-800">₹12,450.00</td>
<td class="px-4 text-right text-slate-400">₹0.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      Pending
                    </span>
</td>
<td class="px-4 text-center">
<button class="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors" title="Options" type="button">
<span class="material-symbols-outlined text-[17px]">more_horiz</span>
</button>
</td>
</tr>
<!-- Row 23: Pending -->
<tr class="h-12 hover:bg-slate-50 transition-colors">
<td class="px-4 text-center font-semibold text-slate-400">23</td>
<td class="px-4 whitespace-nowrap text-slate-600">10 Mar 2025</td>
<td class="px-4 text-right text-slate-600">₹12,360.00</td>
<td class="px-4 text-right text-slate-500">₹90.00</td>
<td class="px-4 text-right font-medium text-slate-800">₹12,450.00</td>
<td class="px-4 text-right text-slate-400">₹0.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      Pending
                    </span>
</td>
<td class="px-4 text-center">
<button class="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors" title="Options" type="button">
<span class="material-symbols-outlined text-[17px]">more_horiz</span>
</button>
</td>
</tr>
<!-- Row 24: Final Closure Pending -->
<tr class="h-12 hover:bg-slate-50 transition-colors">
<td class="px-4 text-center font-semibold text-slate-400">24</td>
<td class="px-4 whitespace-nowrap text-slate-600">
                    10 Apr 2025
                    <span class="ml-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">(Maturity)</span>
</td>
<td class="px-4 text-right text-slate-600">₹12,420.00</td>
<td class="px-4 text-right text-slate-500">₹30.00</td>
<td class="px-4 text-right font-medium text-slate-800">₹12,450.00</td>
<td class="px-4 text-right text-slate-400">₹0.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      Pending
                    </span>
</td>
<td class="px-4 text-center">
<button class="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors" title="Options" type="button">
<span class="material-symbols-outlined text-[17px]">more_horiz</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Table Pagination & Ledger Audit Footer -->
<div class="px-5 py-3.5 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
<div class="flex items-center gap-3 text-xs text-slate-500">
<span>Showing Instalments <strong class="text-slate-700">15 to 24</strong> of 24</span>
<div class="h-3 w-px bg-slate-300"></div>
<span class="inline-flex items-center gap-1.5 font-medium text-slate-600">
<span class="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                Ledger verified against RBI CBS Node
              </span>
</div>
<div class="flex items-center gap-2">
<button class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1 transition-colors shadow-xs" type="button">
<span class="material-symbols-outlined text-[15px]">chevron_left</span>
<span>Previous 10</span>
</button>
<span class="px-3 py-1 text-xs font-bold text-slate-800">Page 2 of 2</span>
<button class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white opacity-40 cursor-not-allowed text-slate-400 font-semibold text-xs flex items-center gap-1" disabled="" type="button">
<span>Next</span>
<span class="material-symbols-outlined text-[15px]">chevron_right</span>
</button>
</div>
</div>
</div>
</div>
</main>
</div>
<!-- Slide-over / Modal for Recording Payment -->
<div class="hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4" id="paymentModalBackdrop">
<div class="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
<!-- Modal Header -->
<div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded-lg bg-[#FFF1F4] text-[#E3195E] flex items-center justify-center border border-[#FECDD6]">
<span class="material-symbols-outlined text-[18px]">add_card</span>
</div>
<h3 class="font-bold text-base text-slate-900">Manual Repayment Entry</h3>
</div>
<button class="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors" id="closePaymentModal" type="button">
<span class="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<!-- Modal Form -->
<form class="p-6 flex flex-col gap-4" onsubmit="event.preventDefault(); alert('Repayment recorded &amp; queued for CBS clearing.'); document.getElementById('paymentModalBackdrop').classList.add('hidden');">
<div>
<label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Target Instalment</label>
<div class="p-3 bg-[#FFF1F4] border border-[#FECDD6] rounded-lg flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-[#E3195E]"></span>
<span class="text-xs font-bold text-slate-900">Instalment #18 (Overdue)</span>
</div>
<span class="text-xs font-bold text-[#E3195E] font-mono">₹12,450.00 Due</span>
</div>
</div>
<div class="grid grid-cols-2 gap-4">
<div>
<label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Amount (₹)</label>
<input class="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E3195E]/20 focus:border-[#E3195E]" type="text" value="12,450.00"/>
</div>
<div>
<label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Payment Date</label>
<input class="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E3195E]/20 focus:border-[#E3195E]" type="date" value="2024-11-04"/>
</div>
</div>
<div>
<label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Payment Mode</label>
<select class="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E3195E]/20 focus:border-[#E3195E]">
<option>NEFT / RTGS Bank Transfer</option>
<option>UPI Collect Transaction</option>
<option>Direct eNACH Clearing Retry</option>
<option>Cheque Deposit / OTC Cash</option>
</select>
</div>
<div>
<label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">UTR / CBS Transaction Ref</label>
<input class="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E3195E]/20 focus:border-[#E3195E]" placeholder="e.g. UTR-HDFC984210984" required="" type="text"/>
</div>
<div class="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 mt-2">
<button class="h-9 px-4 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors" id="cancelPaymentModal" type="button">
            Cancel
          </button>
<button class="h-9 px-5 rounded-full bg-[#E3195E] hover:bg-[#C71250] text-white font-semibold text-xs shadow-sm transition-all" type="submit">
            Commit Repayment
          </button>
</div>
</form>
</div>
</div>
<!-- Interactive Logic -->
<script>
    // Loan Dropdown toggle
    const loanSelectorBtn = document.getElementById('loanSelectorBtn');
    const loanDropdownMenu = document.getElementById('loanDropdownMenu');

    if (loanSelectorBtn && loanDropdownMenu) {
      loanSelectorBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        loanDropdownMenu.classList.toggle('hidden');
      });

      document.addEventListener('click', (e) => {
        if (!loanSelectorBtn.contains(e.target) && !loanDropdownMenu.contains(e.target)) {
          loanDropdownMenu.classList.add('hidden');
        }
      });
    }

    // Payment Recording Modal Controls
    const recordPaymentBtn = document.getElementById('recordPaymentBtn');
    const paymentModalBackdrop = document.getElementById('paymentModalBackdrop');
    const closePaymentModal = document.getElementById('closePaymentModal');
    const cancelPaymentModal = document.getElementById('cancelPaymentModal');

    if (recordPaymentBtn && paymentModalBackdrop) {
      recordPaymentBtn.addEventListener('click', () => {
        paymentModalBackdrop.classList.remove('hidden');
      });

      const closeModal = () => paymentModalBackdrop.classList.add('hidden');
      if (closePaymentModal) closePaymentModal.addEventListener('click', closeModal);
      if (cancelPaymentModal) cancelPaymentModal.addEventListener('click', closeModal);

      paymentModalBackdrop.addEventListener('click', (e) => {
        if (e.target === paymentModalBackdrop) closeModal();
      });
    }

    // Tab switcher styling
    const tabs = document.querySelectorAll('.schedule-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('bg-white', 'text-slate-900', 'font-semibold', 'shadow-xs');
          t.classList.add('text-slate-600', 'font-medium');
        });
        tab.classList.add('bg-white', 'text-slate-900', 'font-semibold', 'shadow-xs');
        tab.classList.remove('text-slate-600', 'font-medium');
      });
    });
  </script>
</body></html>

<!-- Loan Repayment Service - Dashboard (Fixed) -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&amp;display=swap" rel="stylesheet"/>
<style>
    @layer base {
      html, body { margin: 0; padding: 0; }
      body { overscroll-behavior: none; }
      main > :first-child { margin-top: 0 !important; }
      main > :last-child { margin-bottom: 0 !important; }
    }
    ::-webkit-scrollbar { display: none; }
  </style>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "surface-bright": "#fbf8ff",
            "brand-pink-soft": "#F9C4D2",
            "primary-fixed": "#ffd9dd",
            "secondary-fixed-dim": "#c7c5d2",
            "surface-container": "#eeecf9",
            "primary": "#b90049",
            "status-pending-bg": "#F3F4F6",
            "tertiary": "#0058bf",
            "surface-container-high": "#e8e7f4",
            "on-error-container": "#93000a",
            "surface-container-highest": "#e3e1ee",
            "surface-variant": "#e3e1ee",
            "secondary": "#5e5d68",
            "text-secondary": "#6B6B76",
            "status-pending": "#6B6B76",
            "on-secondary": "#ffffff",
            "outline": "#8f6f73",
            "surface-tint": "#bd004a",
            "on-tertiary-fixed-variant": "#004395",
            "on-primary": "#ffffff",
            "on-surface-variant": "#5b3f43",
            "tertiary-container": "#2271e4",
            "border-default": "#E7E7EC",
            "surface-container-lowest": "#ffffff",
            "status-partially-paid": "#F2994A",
            "on-secondary-container": "#62616d",
            "surface-muted": "#F7F7F9",
            "secondary-container": "#e1deeb",
            "surface": "#fbf8ff",
            "status-overdue": "#E3195E",
            "on-tertiary-container": "#fffdff",
            "on-error": "#ffffff",
            "on-secondary-fixed": "#1b1b24",
            "on-primary-fixed-variant": "#900037",
            "text-tertiary": "#9CA3AF",
            "inverse-on-surface": "#f1effc",
            "on-background": "#1a1b24",
            "primary-container": "#e3195e",
            "on-primary-fixed": "#400014",
            "status-paid": "#10B981",
            "primary-fixed-dim": "#ffb2bd",
            "on-tertiary-fixed": "#001a42",
            "on-secondary-fixed-variant": "#464650",
            "surface-dim": "#dad9e5",
            "surface-default": "#FFFFFF",
            "on-surface": "#1a1b24",
            "surface-subtle": "#F1F2F4",
            "error": "#ba1a1a",
            "text-primary": "#12121A",
            "on-tertiary": "#ffffff",
            "background": "#fbf8ff",
            "tertiary-fixed-dim": "#adc6ff",
            "inverse-primary": "#ffb2bd",
            "surface-container-low": "#f4f2ff",
            "status-overdue-bg": "#FDF2F4",
            "secondary-fixed": "#e4e1ee",
            "status-paid-bg": "#ECFDF5",
            "error-container": "#ffdad6",
            "inverse-surface": "#2f3039",
            "tertiary-fixed": "#d8e2ff",
            "border-subtle": "#F0F0F3",
            "outline-variant": "#e4bdc1",
            "on-primary-container": "#fffdff",
            "status-partially-paid-bg": "#FFF7ED"
          },
          borderRadius: {
            DEFAULT: "0.25rem",
            lg: "0.5rem",
            xl: "0.75rem",
            full: "9999px"
          },
          spacing: {
            "space-lg": "1.5rem",
            "space-2xl": "3rem",
            "gutter": "1rem",
            "gutter-desktop": "1.5rem",
            "margin-desktop": "2rem",
            "space-md": "1rem",
            "space-2xs": "0.25rem",
            "space-xl": "2rem",
            "margin": "1rem",
            "space-sm": "0.75rem",
            "space-xs": "0.5rem"
          },
          fontFamily: {
            "body-sm": ["Inter"],
            "label-sm": ["Inter"],
            "label-md": ["Inter"],
            "headline-lg": ["Inter"],
            "body-md": ["Inter"],
            "headline-sm": ["Inter"],
            "headline-md": ["Inter"],
            "numeral-data": ["Inter"],
            "numeral-hero": ["Inter"],
            "headline-xl": ["Inter"],
            "body-lg": ["Inter"],
            "label-lg": ["Inter"]
          },
          fontSize: {
            "body-sm": ["12px", { lineHeight: "16px", letterSpacing: "0em", fontWeight: "400" }],
            "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.04em", fontWeight: "600" }],
            "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "600" }],
            "headline-lg": ["24px", { lineHeight: "32px", letterSpacing: "-0.02em", fontWeight: "700" }],
            "body-md": ["14px", { lineHeight: "20px", letterSpacing: "0em", fontWeight: "400" }],
            "headline-sm": ["16px", { lineHeight: "22px", letterSpacing: "-0.01em", fontWeight: "600" }],
            "headline-md": ["18px", { lineHeight: "24px", letterSpacing: "-0.015em", fontWeight: "600" }],
            "numeral-data": ["14px", { lineHeight: "20px", letterSpacing: "0em", fontWeight: "500" }],
            "numeral-hero": ["28px", { lineHeight: "36px", letterSpacing: "-0.02em", fontWeight: "700" }],
            "headline-xl": ["32px", { lineHeight: "40px", letterSpacing: "-0.025em", fontWeight: "800" }],
            "body-lg": ["16px", { lineHeight: "24px", letterSpacing: "-0.005em", fontWeight: "400" }],
            "label-lg": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "600" }]
          }
        }
      }
    };
  </script>
</head>
<body class="bg-surface-muted font-body-md text-body-md text-text-primary min-h-screen antialiased">
<!-- Fixed Header -->
<header class="fixed top-0 left-0 right-0 z-40 bg-surface-default border-b border-border-default h-16">
<div class="h-16 w-full px-gutter-desktop flex items-center justify-between">
<div class="flex items-center gap-space-md">
<img alt="Vitto" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1WOKAhl3yGKwaiFtEnY50T2o5usEXmKzWOgash-FZaXrJTu4o8ehXaKsjqLGQNzT9C3EWlCroYsWkbBR2r1uEc_uIGVeR4o3HLoFKqZlUXZj3-kt6fNdUzlpNBPqyghQ99XhXbwO55xE8k-PkR9PQ4nz3XnZ2oAB3AghDVuAUWtg0ppWBrq-H0N_WezRcfMeCh7yhW8xEfsORxQ6gPAyi5G3B8MjOJUqDuiiSX2XoZQUD-JHlpCWXeaKKw"/>
<div class="h-5 w-px bg-border-default"></div>
<div class="flex items-center gap-space-xs">
<span class="font-headline-sm text-headline-sm text-text-primary tracking-tight">Loan Repayment Service</span>
<span class="inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm uppercase tracking-wider bg-surface-subtle text-text-secondary border border-border-default">Internal Ops</span>
</div>
</div>
<div class="flex items-center gap-space-lg">
<div class="flex items-center gap-space-sm">
<div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
<span class="material-symbols-outlined text-on-primary text-[18px]">person</span>
</div>
<span class="font-label-md text-label-md text-text-secondary">officer@vitto.money</span>
</div>
<div class="h-4 w-px bg-border-default"></div>
<button class="font-label-md text-label-md text-text-secondary hover:text-primary transition-colors inline-flex items-center gap-1.5 focus:outline-none" type="button">
<span class="material-symbols-outlined text-[16px]">logout</span>
<span>Sign Out</span>
</button>
</div>
</div>
</header>
<!-- Left Sidebar Navigation -->
<aside class="fixed left-0 top-16 bottom-0 w-64 bg-surface-default border-r border-border-default z-30 flex flex-col justify-between py-space-md">
<div class="flex flex-col gap-space-xs px-space-sm">
<div class="px-space-sm py-space-2xs text-text-tertiary font-label-sm text-label-sm uppercase tracking-wider">Operations Core</div>
<nav class="flex flex-col gap-1" data-active-classes="bg-primary-fixed text-on-primary-fixed font-semibold">
<a aria-current="page" class="flex items-center gap-space-sm px-space-sm py-2.5 rounded-lg transition-colors bg-primary-fixed text-on-primary-fixed font-semibold" data-path="repayment-overview" href="#">
<span class="material-symbols-outlined text-[20px]">payments</span>
          Repayments
        </a>
<a class="flex items-center gap-space-sm px-space-sm py-2.5 rounded-lg text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors font-label-lg text-label-lg" data-path="loan-accounts" href="#">
<span class="material-symbols-outlined text-[20px]">account_balance</span>
          Loan Accounts
        </a>
<a class="flex items-center gap-space-sm px-space-sm py-2.5 rounded-lg text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors font-label-lg text-label-lg" data-path="overdue-queues" href="#">
<span class="material-symbols-outlined text-[20px]">warning</span>
          Delinquency Queue
        </a>
<a class="flex items-center gap-space-sm px-space-sm py-2.5 rounded-lg text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors font-label-lg text-label-lg" data-path="settlement-records" href="#">
<span class="material-symbols-outlined text-[20px]">receipt_long</span>
          Settlements
        </a>
</nav>
<div class="mt-space-md pt-space-sm border-t border-border-subtle px-space-sm py-space-2xs text-text-tertiary font-label-sm text-label-sm uppercase tracking-wider">Finance &amp; Audit</div>
<nav class="flex flex-col gap-1" data-active-classes="bg-primary-fixed text-on-primary-fixed font-semibold">
<a class="flex items-center gap-space-sm px-space-sm py-2.5 rounded-lg text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors font-label-lg text-label-lg" data-path="reconciliation-ledger" href="#">
<span class="material-symbols-outlined text-[20px]">sync_alt</span>
          Reconciliation
        </a>
<a class="flex items-center gap-space-sm px-space-sm py-2.5 rounded-lg text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors font-label-lg text-label-lg" data-path="audit-logs" href="#">
<span class="material-symbols-outlined text-[20px]">history</span>
          Audit Trail
        </a>
</nav>
</div>
<div class="px-space-md pt-space-sm border-t border-border-subtle">
<div class="flex items-center justify-between text-text-tertiary font-label-sm text-label-sm">
<span>Node v2.4.1</span>
<span class="inline-block w-2 h-2 rounded-full bg-status-paid"></span>
</div>
</div>
</aside>
<!-- Main Content Dashboard Container -->
<div class="pl-64">
<main class="relative pt-16 min-h-screen bg-surface-muted">
<div class="max-w-7xl mx-auto px-margin-desktop py-space-xl">
<div class="flex flex-col w-full gap-space-lg">
<!-- Top Operational Control & Loan Context Bar -->
<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md p-space-lg bg-surface-default rounded-xl border border-border-default shadow-sm">
<div class="flex flex-col sm:flex-row sm:items-center gap-space-md flex-1">
<div class="flex items-center gap-space-sm text-text-tertiary">
<span class="material-symbols-outlined text-[24px]">real_estate_agent</span>
<label class="font-label-sm text-label-sm uppercase tracking-wider text-text-secondary whitespace-nowrap" for="loan-picker">Active Account</label>
</div>
<!-- Custom Interactive Loan Selector -->
<div class="relative flex-1 max-w-xl">
<button class="w-full h-11 px-space-md bg-surface-muted hover:bg-surface-subtle border border-border-default hover:border-text-secondary rounded-lg flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 text-left" id="loanSelectorBtn" type="button">
<div class="flex items-center gap-space-sm min-w-0">
<span class="inline-flex items-center justify-center w-7 h-7 rounded-md bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold">LN</span>
<div class="flex flex-col min-w-0">
<div class="flex items-center gap-2">
<span class="font-headline-sm text-headline-sm text-text-primary tracking-tight truncate font-bold">LN-2031 · ₹2,00,000</span>
<span class="px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-status-paid-bg text-status-paid border border-status-paid/20">Active</span>
</div>
<span class="font-body-sm text-body-sm text-text-secondary truncate">Apex Retailers Pvt Ltd · Term Loan · 18 of 24 months completed</span>
</div>
</div>
<span class="material-symbols-outlined text-text-secondary ml-2 flex-shrink-0">unfold_more</span>
</button>
<!-- Dropdown Menu -->
<div class="hidden absolute top-full left-0 right-0 mt-1 z-30 bg-surface-default border border-border-default rounded-xl shadow-xl overflow-hidden" id="loanDropdownMenu">
<div class="p-2 border-b border-border-subtle bg-surface-muted">
<div class="relative">
<span class="material-symbols-outlined absolute left-2.5 top-2 text-text-tertiary text-[18px]">search</span>
<input class="w-full pl-8 pr-3 py-1.5 bg-surface-default border border-border-default rounded-md text-body-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary" placeholder="Search loan ID, business name, or GSTIN..." type="text"/>
</div>
</div>
<div class="max-h-60 overflow-y-auto divide-y divide-border-subtle">
<div class="p-3 bg-primary-fixed/20 flex items-center justify-between cursor-pointer hover:bg-primary-fixed/30">
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="font-label-lg text-label-lg font-bold text-text-primary">LN-2031 · ₹2,00,000</span>
<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-status-overdue-bg text-status-overdue border border-brand-pink-soft">Delinquent (1)</span>
</div>
<span class="font-body-sm text-body-sm text-text-secondary">Apex Retailers Pvt Ltd · Mumbai, MH</span>
</div>
<span class="material-symbols-outlined text-primary text-[20px]">check_circle</span>
</div>
<div class="p-3 flex items-center justify-between cursor-pointer hover:bg-surface-subtle transition-colors">
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="font-label-lg text-label-lg text-text-primary">LN-1984 · ₹5,00,000</span>
<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-status-paid-bg text-status-paid border border-status-paid/20">Current</span>
</div>
<span class="font-body-sm text-body-sm text-text-secondary">Bharat Logistics Hub · Pune, MH</span>
</div>
<span class="font-label-sm text-label-sm text-text-tertiary">#24/36</span>
</div>
<div class="p-3 flex items-center justify-between cursor-pointer hover:bg-surface-subtle transition-colors">
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="font-label-lg text-label-lg text-text-primary">LN-2009 · ₹1,50,000</span>
<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-status-paid-bg text-status-paid border border-status-paid/20">Current</span>
</div>
<span class="font-body-sm text-body-sm text-text-secondary">Zeno Medical Supplies · Bengaluru, KA</span>
</div>
<span class="font-label-sm text-label-sm text-text-tertiary">#12/12</span>
</div>
</div>
</div>
</div>
</div>
<!-- Quick Meta Indicators -->
<div class="flex items-center gap-space-md border-t lg:border-t-0 pt-space-sm lg:pt-0 border-border-subtle flex-shrink-0">
<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-subtle border border-border-default">
<span class="material-symbols-outlined text-text-secondary text-[18px]">verified_user</span>
<span class="font-body-sm text-body-sm text-text-secondary">Mandate: <strong class="text-text-primary font-medium">eNACH / Active</strong></span>
</div>
<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-subtle border border-border-default">
<span class="material-symbols-outlined text-text-secondary text-[18px]">percent</span>
<span class="font-body-sm text-body-sm text-text-secondary">ROI: <strong class="text-text-primary font-medium">16.5% p.a. Reducing</strong></span>
</div>
</div>
</div>
<!-- Metric / Summary Cards Strip -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
<!-- Card 1: Outstanding Principal -->
<div class="bg-surface-default rounded-xl p-5 border border-border-default shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
<div class="flex items-start justify-between">
<div>
<span class="font-label-sm text-label-sm uppercase tracking-wider text-text-secondary">Outstanding Principal</span>
<div class="font-numeral-hero text-numeral-hero text-text-primary tracking-tight mt-1 font-bold">₹84,500</div>
</div>
<div class="w-10 h-10 rounded-full bg-surface-subtle flex items-center justify-center text-text-secondary border border-border-default">
<span class="material-symbols-outlined text-[22px]">account_balance_wallet</span>
</div>
</div>
<div class="mt-4 pt-3 border-t border-border-subtle flex flex-col gap-1.5">
<div class="flex justify-between items-center text-body-sm font-body-sm">
<span class="text-text-secondary">Original ₹2,00,000</span>
<span class="font-semibold text-text-primary">57.7% Paid</span>
</div>
<div class="w-full bg-surface-subtle h-1.5 rounded-full overflow-hidden">
<div class="bg-text-primary h-full rounded-full" style="width: 57.75%"></div>
</div>
<span class="font-label-sm text-label-sm text-text-tertiary">14 instalments remaining in tenure</span>
</div>
</div>
<!-- Card 2: Next Due -->
<div class="bg-surface-default rounded-xl p-5 border border-border-default shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
<div class="flex items-start justify-between">
<div>
<span class="font-label-sm text-label-sm uppercase tracking-wider text-text-secondary">Next Due</span>
<div class="font-numeral-hero text-numeral-hero text-text-primary tracking-tight mt-1 font-bold">10 Nov 2024 · ₹12,450</div>
</div>
<div class="w-10 h-10 rounded-full bg-blue-50 text-tertiary-container flex items-center justify-center border border-blue-100">
<span class="material-symbols-outlined text-[22px]">event_upcoming</span>
</div>
</div>
<div class="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
<div class="flex items-center gap-1.5">
<span class="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
<span class="font-label-md text-label-md text-text-secondary">Instalment #19</span>
</div>
<span class="inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-blue-50 text-tertiary font-medium border border-blue-200">Due in 6 days</span>
</div>
</div>
<!-- Card 3: Overdue Amount -->
<div class="bg-surface-default rounded-xl p-5 border border-border-default shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between ring-1 ring-status-overdue/20">
<div class="absolute top-0 right-0 w-24 h-24 bg-status-overdue/5 rounded-bl-full pointer-events-none"></div>
<div class="flex items-start justify-between">
<div>
<div class="flex items-center gap-2">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-status-overdue font-semibold">Overdue Amount</span>
<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-status-overdue-bg text-status-overdue border border-brand-pink-soft uppercase">Action Required</span>
</div>
<div class="font-numeral-hero text-numeral-hero text-status-overdue tracking-tight mt-1 font-bold">₹12,450</div>
</div>
<div class="w-10 h-10 rounded-full bg-status-overdue-bg text-status-overdue flex items-center justify-center border border-brand-pink-soft">
<span class="material-symbols-outlined text-[22px]">error</span>
</div>
</div>
<div class="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
<div class="flex flex-col">
<span class="font-label-md text-label-md text-status-overdue font-semibold">1 instalment overdue (#18)</span>
<span class="font-body-sm text-body-sm text-text-secondary">Due Oct 10, 2024 · 25 days late</span>
</div>
<button class="font-label-sm text-label-sm text-status-overdue hover:underline flex items-center font-bold" type="button">
                  View Demand <span class="material-symbols-outlined text-[14px] ml-0.5">chevron_right</span>
</button>
</div>
</div>
</div>
<!-- Repayment Schedule Main Section -->
<div class="bg-surface-default rounded-xl border border-border-default shadow-sm flex flex-col overflow-hidden">
<!-- Schedule Control Header -->
<div class="p-space-lg border-b border-border-default flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
<div class="flex flex-col sm:flex-row sm:items-center gap-space-md">
<div class="flex items-center gap-2.5">
<h2 class="font-headline-md text-headline-md text-text-primary tracking-tight font-bold">Repayment Schedule</h2>
<span class="inline-flex items-center px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-surface-subtle text-text-secondary border border-border-default font-semibold">
                    24 Instalments · <span class="text-status-overdue ml-1">1 Overdue</span>
</span>
</div>
<!-- Filter Status Tabs -->
<div class="inline-flex p-1 bg-surface-subtle rounded-lg border border-border-default text-text-secondary">
<button class="schedule-tab-btn active px-3 py-1 rounded-md font-label-sm text-label-sm font-semibold bg-surface-default text-text-primary shadow-xs" data-filter="all" type="button">All (24)</button>
<button class="schedule-tab-btn px-3 py-1 rounded-md font-label-sm text-label-sm text-text-secondary hover:text-text-primary" data-filter="overdue" type="button">Overdue (1)</button>
<button class="schedule-tab-btn px-3 py-1 rounded-md font-label-sm text-label-sm text-text-secondary hover:text-text-primary" data-filter="pending" type="button">Pending (6)</button>
<button class="schedule-tab-btn px-3 py-1 rounded-md font-label-sm text-label-sm text-text-secondary hover:text-text-primary" data-filter="paid" type="button">Paid (17)</button>
</div>
</div>
<!-- Action Cluster -->
<div class="flex items-center gap-space-sm flex-wrap">
<button class="h-10 px-4 rounded-full bg-surface-default border border-border-default hover:border-text-secondary text-text-primary hover:bg-surface-muted font-label-md text-label-md flex items-center gap-2 transition-colors" type="button">
<span class="material-symbols-outlined text-[18px] text-text-secondary">download</span>
<span>Ledger PDF</span>
</button>
<button class="h-10 px-4 rounded-full bg-surface-default border border-border-default hover:border-text-secondary text-text-primary hover:bg-surface-muted font-label-md text-label-md flex items-center gap-2 transition-colors" type="button">
<span class="material-symbols-outlined text-[18px] text-text-secondary">grid_on</span>
<span>Export CSV</span>
</button>
<button class="h-10 px-5 rounded-full bg-primary-container hover:bg-[#D01252] text-on-primary font-label-lg text-label-lg shadow-sm flex items-center gap-2 transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" id="recordPaymentBtn" type="button">
<span class="material-symbols-outlined text-[18px]">add_circle</span>
<span>Record Payment</span>
</button>
</div>
</div>
<!-- Data Table Container -->
<div class="overflow-x-auto">
<table class="w-full border-collapse text-left">
<thead>
<tr class="bg-surface-muted h-10 border-b border-border-default font-label-sm text-label-sm text-text-secondary uppercase tracking-wider select-none">
<th class="py-2.5 px-4 w-12 text-center">#</th>
<th class="py-2.5 px-4 min-w-[120px]">Due Date</th>
<th class="py-2.5 px-4 text-right min-w-[110px]">Principal</th>
<th class="py-2.5 px-4 text-right min-w-[100px]">Interest</th>
<th class="py-2.5 px-4 text-right min-w-[110px]">Total Due</th>
<th class="py-2.5 px-4 text-right min-w-[110px]">Amount Paid</th>
<th class="py-2.5 px-4 text-center min-w-[130px]">Status</th>
<th class="py-2.5 px-4 text-center w-24">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-border-subtle font-numeral-data text-numeral-data text-text-primary" id="scheduleTableBody">
<!-- Row 15 - Paid -->
<tr class="h-12 hover:bg-slate-50/75 transition-colors group">
<td class="px-4 text-center font-bold text-text-secondary">15</td>
<td class="px-4 whitespace-nowrap text-text-secondary font-medium">10 Jul 2024</td>
<td class="px-4 text-right font-mono text-text-secondary">₹11,150.00</td>
<td class="px-4 text-right font-mono text-text-secondary">₹1,300.00</td>
<td class="px-4 text-right font-mono font-medium">₹12,450.00</td>
<td class="px-4 text-right font-mono text-status-paid font-medium">₹12,450.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span>
</td>
<td class="px-4 text-center">
<button class="text-text-tertiary hover:text-text-primary p-1 rounded hover:bg-surface-subtle" title="View Receipt" type="button">
<span class="material-symbols-outlined text-[18px]">receipt</span>
</button>
</td>
</tr>
<!-- Row 16 - Paid -->
<tr class="h-12 hover:bg-slate-50/75 transition-colors group">
<td class="px-4 text-center font-bold text-text-secondary">16</td>
<td class="px-4 whitespace-nowrap text-text-secondary font-medium">10 Aug 2024</td>
<td class="px-4 text-right font-mono text-text-secondary">₹11,300.00</td>
<td class="px-4 text-right font-mono text-text-secondary">₹1,150.00</td>
<td class="px-4 text-right font-mono font-medium">₹12,450.00</td>
<td class="px-4 text-right font-mono text-status-paid font-medium">₹12,450.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span>
</td>
<td class="px-4 text-center">
<button class="text-text-tertiary hover:text-text-primary p-1 rounded hover:bg-surface-subtle" title="View Receipt" type="button">
<span class="material-symbols-outlined text-[18px]">receipt</span>
</button>
</td>
</tr>
<!-- Row 17 - Paid -->
<tr class="h-12 hover:bg-slate-50/75 transition-colors group">
<td class="px-4 text-center font-bold text-text-secondary">17</td>
<td class="px-4 whitespace-nowrap text-text-secondary font-medium">10 Sep 2024</td>
<td class="px-4 text-right font-mono text-text-secondary">₹11,460.00</td>
<td class="px-4 text-right font-mono text-text-secondary">₹990.00</td>
<td class="px-4 text-right font-mono font-medium">₹12,450.00</td>
<td class="px-4 text-right font-mono text-status-paid font-medium">₹12,450.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span>
</td>
<td class="px-4 text-center">
<button class="text-text-tertiary hover:text-text-primary p-1 rounded hover:bg-surface-subtle" title="View Receipt" type="button">
<span class="material-symbols-outlined text-[18px]">receipt</span>
</button>
</td>
</tr>
<!-- Row 18 - Overdue -->
<tr class="h-12 border-l-4 border-l-rose-500 bg-rose-50/20 hover:bg-rose-50/40 transition-colors group">
<td class="px-4 text-center font-bold text-status-overdue">18</td>
<td class="px-4 whitespace-nowrap font-medium text-status-overdue flex items-center gap-1.5 pt-3.5">
<span>10 Oct 2024</span>
<span class="material-symbols-outlined text-[16px]">warning</span>
</td>
<td class="px-4 text-right font-mono text-text-primary font-medium">₹11,620.00</td>
<td class="px-4 text-right font-mono text-text-primary font-medium">₹830.00</td>
<td class="px-4 text-right font-mono font-bold text-status-overdue">₹12,450.00</td>
<td class="px-4 text-right font-mono text-status-overdue font-bold">₹0.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-rose-50 text-rose-700 border border-rose-200 font-semibold">Overdue</span>
</td>
<td class="px-4 text-center">
<div class="flex items-center justify-center gap-1">
<button class="text-status-overdue hover:text-[#900037] p-1 rounded hover:bg-rose-100/50" title="Send Demand Notice" type="button">
<span class="material-symbols-outlined text-[18px]">forward_to_inbox</span>
</button>
<button class="text-primary hover:text-primary-container p-1 rounded hover:bg-primary-fixed" title="Instant Settle" type="button">
<span class="material-symbols-outlined text-[18px]">payments</span>
</button>
</div>
</td>
</tr>
<!-- Row 19 - Next Pending -->
<tr class="h-12 hover:bg-slate-50/75 transition-colors group bg-blue-50/10">
<td class="px-4 text-center font-bold text-text-primary">19</td>
<td class="px-4 whitespace-nowrap font-medium text-text-primary">
                      10 Nov 2024
                      <span class="ml-1 text-[11px] text-tertiary font-semibold">(Next)</span>
</td>
<td class="px-4 text-right font-mono text-text-secondary">₹11,780.00</td>
<td class="px-4 text-right font-mono text-text-secondary">₹670.00</td>
<td class="px-4 text-right font-mono font-medium">₹12,450.00</td>
<td class="px-4 text-right font-mono text-text-tertiary">₹0.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-slate-100 text-slate-600 border border-slate-200">Pending</span>
</td>
<td class="px-4 text-center">
<button class="text-text-tertiary hover:text-text-primary p-1 rounded hover:bg-surface-subtle" title="Schedule Auto-debit" type="button">
<span class="material-symbols-outlined text-[18px]">schedule</span>
</button>
</td>
</tr>
<!-- Row 20 - Pending -->
<tr class="h-12 hover:bg-slate-50/75 transition-colors group">
<td class="px-4 text-center font-bold text-text-secondary">20</td>
<td class="px-4 whitespace-nowrap text-text-secondary font-medium">10 Dec 2024</td>
<td class="px-4 text-right font-mono text-text-secondary">₹11,940.00</td>
<td class="px-4 text-right font-mono text-text-secondary">₹510.00</td>
<td class="px-4 text-right font-mono font-medium">₹12,450.00</td>
<td class="px-4 text-right font-mono text-text-tertiary">₹0.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-slate-100 text-slate-600 border border-slate-200">Pending</span>
</td>
<td class="px-4 text-center">
<button class="text-text-tertiary hover:text-text-primary p-1 rounded hover:bg-surface-subtle" type="button">
<span class="material-symbols-outlined text-[18px]">more_horiz</span>
</button>
</td>
</tr>
<!-- Row 21 - Pending -->
<tr class="h-12 hover:bg-slate-50/75 transition-colors group">
<td class="px-4 text-center font-bold text-text-secondary">21</td>
<td class="px-4 whitespace-nowrap text-text-secondary font-medium">10 Jan 2025</td>
<td class="px-4 text-right font-mono text-text-secondary">₹12,100.00</td>
<td class="px-4 text-right font-mono text-text-secondary">₹350.00</td>
<td class="px-4 text-right font-mono font-medium">₹12,450.00</td>
<td class="px-4 text-right font-mono text-text-tertiary">₹0.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-slate-100 text-slate-600 border border-slate-200">Pending</span>
</td>
<td class="px-4 text-center">
<button class="text-text-tertiary hover:text-text-primary p-1 rounded hover:bg-surface-subtle" type="button">
<span class="material-symbols-outlined text-[18px]">more_horiz</span>
</button>
</td>
</tr>
<!-- Row 22 - Pending -->
<tr class="h-12 hover:bg-slate-50/75 transition-colors group">
<td class="px-4 text-center font-bold text-text-secondary">22</td>
<td class="px-4 whitespace-nowrap text-text-secondary font-medium">10 Feb 2025</td>
<td class="px-4 text-right font-mono text-text-secondary">₹12,270.00</td>
<td class="px-4 text-right font-mono text-text-secondary">₹180.00</td>
<td class="px-4 text-right font-mono font-medium">₹12,450.00</td>
<td class="px-4 text-right font-mono text-text-tertiary">₹0.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-slate-100 text-slate-600 border border-slate-200">Pending</span>
</td>
<td class="px-4 text-center">
<button class="text-text-tertiary hover:text-text-primary p-1 rounded hover:bg-surface-subtle" type="button">
<span class="material-symbols-outlined text-[18px]">more_horiz</span>
</button>
</td>
</tr>
<!-- Row 23 - Pending -->
<tr class="h-12 hover:bg-slate-50/75 transition-colors group">
<td class="px-4 text-center font-bold text-text-secondary">23</td>
<td class="px-4 whitespace-nowrap text-text-secondary font-medium">10 Mar 2025</td>
<td class="px-4 text-right font-mono text-text-secondary">₹12,360.00</td>
<td class="px-4 text-right font-mono text-text-secondary">₹90.00</td>
<td class="px-4 text-right font-mono font-medium">₹12,450.00</td>
<td class="px-4 text-right font-mono text-text-tertiary">₹0.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-slate-100 text-slate-600 border border-slate-200">Pending</span>
</td>
<td class="px-4 text-center">
<button class="text-text-tertiary hover:text-text-primary p-1 rounded hover:bg-surface-subtle" type="button">
<span class="material-symbols-outlined text-[18px]">more_horiz</span>
</button>
</td>
</tr>
<!-- Row 24 - Final Closure Pending -->
<tr class="h-12 hover:bg-slate-50/75 transition-colors group">
<td class="px-4 text-center font-bold text-text-secondary">24</td>
<td class="px-4 whitespace-nowrap text-text-secondary font-medium">
                      10 Apr 2025
                      <span class="ml-1 text-[11px] text-text-tertiary uppercase font-bold">(Maturity)</span>
</td>
<td class="px-4 text-right font-mono text-text-secondary">₹12,420.00</td>
<td class="px-4 text-right font-mono text-text-secondary">₹30.00</td>
<td class="px-4 text-right font-mono font-medium">₹12,450.00</td>
<td class="px-4 text-right font-mono text-text-tertiary">₹0.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-slate-100 text-slate-600 border border-slate-200">Pending</span>
</td>
<td class="px-4 text-center">
<button class="text-text-tertiary hover:text-text-primary p-1 rounded hover:bg-surface-subtle" type="button">
<span class="material-symbols-outlined text-[18px]">more_horiz</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Table Pagination & Ledger Audit Footer -->
<div class="px-space-lg py-space-sm bg-surface-muted border-t border-border-default flex flex-col sm:flex-row items-center justify-between gap-space-sm">
<div class="flex items-center gap-space-md text-text-secondary font-body-sm text-body-sm">
<span>Showing Instalments <strong>15 to 24</strong> of 24</span>
<div class="h-3 w-px bg-border-default"></div>
<span class="inline-flex items-center gap-1">
<span class="inline-block w-2 h-2 rounded-full bg-status-paid"></span>
                  Ledger verified against RBI CBS Node
                </span>
</div>
<div class="flex items-center gap-space-xs">
<button class="px-3 py-1.5 rounded-lg border border-border-default bg-surface-default hover:bg-surface-subtle text-text-secondary font-label-sm text-label-sm flex items-center gap-1 transition-colors" type="button">
<span class="material-symbols-outlined text-[16px]">chevron_left</span>
<span>Previous 10</span>
</button>
<span class="px-3 py-1 font-label-sm text-label-sm font-semibold text-text-primary">Page 2 of 2</span>
<button class="px-3 py-1.5 rounded-lg border border-border-default bg-surface-default opacity-50 cursor-not-allowed text-text-tertiary font-label-sm text-label-sm flex items-center gap-1" disabled="" type="button">
<span>Next</span>
<span class="material-symbols-outlined text-[16px]">chevron_right</span>
</button>
</div>
</div>
</div>
</div>
</div>
</main>
</div>
<!-- Rebuilt Solid Opaque Record Payment Modal -->
<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" id="paymentModalBackdrop">
<div class="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
<!-- Modal Header -->
<div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
<div class="flex flex-col gap-1">
<h3 class="font-headline-md text-[20px] font-bold text-slate-900 tracking-tight">Record a Payment</h3>
<div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium w-fit">
<span class="w-2 h-2 rounded-full bg-[#E3195E]"></span>
<span>LN-2031 · Apex Retailers Pvt Ltd</span>
</div>
</div>
<button class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 hover:bg-slate-100 transition-colors focus:outline-none" id="closePaymentModal" type="button">
<span class="material-symbols-outlined text-[22px]">close</span>
</button>
</div>
<!-- Modal Form -->
<form class="p-6 flex flex-col space-y-5 bg-white" onsubmit="event.preventDefault(); alert('Repayment recorded successfully.'); document.getElementById('paymentModalBackdrop').classList.add('hidden');">
<!-- Amount Field -->
<div>
<label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" for="amountInput">Amount (₹)</label>
<div class="relative flex items-center">
<span class="absolute left-3.5 text-slate-500 font-semibold text-base pointer-events-none">₹</span>
<input class="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3.5 py-2.5 text-base font-semibold text-slate-900 focus:ring-2 focus:ring-[#E3195E] focus:border-[#E3195E] outline-none transition-shadow" id="amountInput" required="" type="text" value="12,450"/>
</div>
<p class="mt-1.5 text-xs text-slate-500 flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-[#E3195E]"></span>
            Overdue instalment #18 · Due ₹12,450
          </p>
</div>
<!-- Payment Date Field -->
<div>
<label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" for="paymentDate">Payment Date</label>
<input class="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-[#E3195E] focus:border-[#E3195E] outline-none transition-shadow" id="paymentDate" required="" type="date" value="2024-11-04"/>
</div>
<!-- Payment Mode Field -->
<div>
<label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" for="paymentMode">Payment Mode</label>
<select class="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-[#E3195E] focus:border-[#E3195E] outline-none transition-shadow cursor-pointer" id="paymentMode">
<option selected="">Netbanking / NEFT / RTGS</option>
<option>UPI</option>
<option>NACH Mandate</option>
<option>Cheque / DD</option>
<option>Cash Deposit</option>
</select>
</div>
<!-- Reference / UTR Field -->
<div>
<label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" for="utrNumber">Reference / UTR Number</label>
<input class="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#E3195E] focus:border-[#E3195E] outline-none transition-shadow" id="utrNumber" placeholder="e.g. UTR-HDFC984210984" type="text"/>
</div>
<!-- Notice Callout -->
<div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2.5">
<span class="material-symbols-outlined text-[18px] text-amber-600 flex-shrink-0 mt-0.5">info</span>
<span class="leading-relaxed">This payment will be allocated to the oldest unpaid instalment first (Instalment #18 Overdue).</span>
</div>
<!-- Modal Footer / Actions -->
<div class="border-t border-slate-100 pt-4 flex items-center justify-end gap-3">
<button class="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-full transition-colors focus:outline-none" id="cancelPaymentModal" type="button">
            Cancel
          </button>
<button class="px-6 py-2.5 text-sm font-semibold text-white bg-[#E3195E] hover:bg-[#c91450] shadow-sm rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E3195E] focus:ring-offset-2" type="submit">
            Submit Payment
          </button>
</div>
</form>
</div>
</div>
<script>
    // Dropdown toggle logic
    const loanSelectorBtn = document.getElementById('loanSelectorBtn');
    const loanDropdownMenu = document.getElementById('loanDropdownMenu');

    if (loanSelectorBtn && loanDropdownMenu) {
      loanSelectorBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        loanDropdownMenu.classList.toggle('hidden');
      });

      document.addEventListener('click', (e) => {
        if (!loanSelectorBtn.contains(e.target) && !loanDropdownMenu.contains(e.target)) {
          loanDropdownMenu.classList.add('hidden');
        }
      });
    }

    // Payment Recording Modal Controls
    const recordPaymentBtn = document.getElementById('recordPaymentBtn');
    const paymentModalBackdrop = document.getElementById('paymentModalBackdrop');
    const closePaymentModal = document.getElementById('closePaymentModal');
    const cancelPaymentModal = document.getElementById('cancelPaymentModal');

    if (recordPaymentBtn && paymentModalBackdrop) {
      recordPaymentBtn.addEventListener('click', () => {
        paymentModalBackdrop.classList.remove('hidden');
      });

      const closeModal = () => paymentModalBackdrop.classList.add('hidden');
      if (closePaymentModal) closePaymentModal.addEventListener('click', closeModal);
      if (cancelPaymentModal) cancelPaymentModal.addEventListener('click', closeModal);

      paymentModalBackdrop.addEventListener('click', (e) => {
        if (e.target === paymentModalBackdrop) closeModal();
      });
    }

    // Quick tabs interaction
    const tabs = document.querySelectorAll('.schedule-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active', 'bg-surface-default', 'text-text-primary', 'shadow-xs');
          t.classList.add('text-text-secondary');
        });
        tab.classList.add('active', 'bg-surface-default', 'text-text-primary', 'shadow-xs');
        tab.classList.remove('text-text-secondary');
      });
    });
  </script>
</body></html>

<!-- Loan Repayment Service - Record Payment Modal (Fixed) -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Loan Repayment Service - Vitto Ops</title>
<!-- Google Fonts: Inter & Material Symbols -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          },
          colors: {
            brand: {
              50: '#FDF2F5',
              100: '#FCE7EE',
              500: '#E3195E',
              600: '#C71250',
              700: '#A30D40',
            },
            status: {
              paid: '#10B981',
              'paid-bg': '#ECFDF5',
              'paid-border': '#A7F3D0',
              overdue: '#E3195E',
              'overdue-bg': '#FFF1F4',
              'overdue-border': '#FECDD6',
              pending: '#64748B',
              'pending-bg': '#F1F5F9',
              'pending-border': '#E2E8F0',
              partial: '#F59E0B',
              'partial-bg': '#FFFBEB',
              'partial-border': '#FDE68A',
            }
          }
        }
      }
    };
  </script>
<style>
    body {
      font-feature-settings: "cv02", "cv03", "cv04", "cv11";
    }
    .tabular-nums {
      font-variant-numeric: tabular-nums;
    }
  </style>
</head>
<body class="bg-[#F8F9FA] text-[#0F172A] font-sans min-h-screen antialiased flex flex-col">
<!-- Fixed Top Header -->
<header class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 h-16">
<div class="h-full px-6 flex items-center justify-between">
<!-- Left: Logo & Ops System Tag -->
<div class="flex items-center gap-3.5">
<div class="flex items-center gap-2">
<!-- Vitto SVG Pinwheel / Brand Mark -->
<div class="w-8 h-8 rounded-lg bg-[#E3195E] flex items-center justify-center shadow-sm">
<svg class="w-5 h-5 text-white" fill="currentColor" viewbox="0 0 24 24">
<path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15.93V14a2 2 0 0 1 2-2h3.93a8 8 0 0 1-5.93 5.93zm0-7.93a2 2 0 0 1-2-2V4.07A8 8 0 0 1 17.93 10H14a2 2 0 0 1-1 0zM4.07 12A8 8 0 0 1 10 6.07V10a2 2 0 0 1-2 2H4.07zm5.93 2v3.93A8 8 0 0 1 6.07 14H10z"></path>
</svg>
</div>
<span class="font-bold text-xl tracking-tight text-slate-900">vitto</span>
</div>
<div class="h-4 w-px bg-slate-300 mx-1"></div>
<div class="flex items-center gap-2">
<span class="font-semibold text-sm text-slate-800 tracking-tight">Loan Repayment Service</span>
<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase bg-slate-100 text-slate-600 border border-slate-200">
            INTERNAL OPS
          </span>
</div>
</div>
<!-- Right: User Identity & Action -->
<div class="flex items-center gap-4">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
<span class="material-symbols-outlined text-[18px]">person</span>
</div>
<div class="flex flex-col">
<span class="text-xs font-semibold text-slate-700 leading-tight">officer@vitto.money</span>
<span class="text-[10px] text-slate-400 font-medium">Ops Level 2</span>
</div>
</div>
<div class="h-4 w-px bg-slate-200"></div>
<button class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#E3195E] transition-colors focus:outline-none" type="button">
<span class="material-symbols-outlined text-[16px]">logout</span>
<span>Sign Out</span>
</button>
</div>
</div>
</header>
<!-- Navigation Sidebar -->
<aside class="fixed left-0 top-16 bottom-0 w-60 bg-white border-r border-slate-200 z-40 flex flex-col justify-between py-4">
<div class="flex flex-col gap-5 px-3">
<!-- Group 1 -->
<div>
<div class="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Operations Core
        </div>
<nav class="space-y-1">
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold bg-[#FFF1F4] text-[#E3195E] border border-[#FECDD6]/50" href="#">
<span class="material-symbols-outlined text-[20px]">payments</span>
<span>Repayments</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
<span class="material-symbols-outlined text-[20px] text-slate-400">account_balance</span>
<span>Loan Accounts</span>
</a>
<a class="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-[20px] text-slate-400">warning</span>
<span>Delinquency Queue</span>
</div>
<span class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">0</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
<span class="material-symbols-outlined text-[20px] text-slate-400">receipt_long</span>
<span>Settlements</span>
</a>
</nav>
</div>
<!-- Group 2 -->
<div>
<div class="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Finance &amp; Audit
        </div>
<nav class="space-y-1">
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
<span class="material-symbols-outlined text-[20px] text-slate-400">sync_alt</span>
<span>Reconciliation</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
<span class="material-symbols-outlined text-[20px] text-slate-400">history</span>
<span>Audit Trail</span>
</a>
</nav>
</div>
</div>
<!-- Node Status Pill in Sidebar Footer -->
<div class="px-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
<span class="font-mono text-[11px]">Node v2.4.1</span>
<div class="flex items-center gap-1.5">
<span class="inline-block w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></span>
<span class="text-[11px] text-slate-500 font-medium">Synced</span>
</div>
</div>
</aside>
<!-- Main Content Stage -->
<div class="pl-60 pt-16 min-h-screen">
<main class="max-w-7xl mx-auto px-8 py-7"><div class="fixed top-20 right-8 z-50 flex items-center justify-between gap-3 px-4 py-3 bg-white border border-emerald-200 rounded-xl shadow-lg ring-1 ring-emerald-100 transition-all" id="successToast"><div class="flex items-center gap-2.5"><div class="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[18px]">check_circle</span></div><div class="flex flex-col"><span class="text-xs font-semibold text-slate-800">Payment of ₹5,000 recorded — applied to instalment #2</span><span class="text-[11px] text-slate-500">Ledger updated &amp; transaction queued for CBS sync</span></div></div><button class="w-6 h-6 ml-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors" onclick="document.getElementById('successToast').style.display='none'" type="button"><span class="material-symbols-outlined text-[16px]">close</span></button></div>
<div class="flex flex-col gap-6">
<!-- 1. Active Account / Loan Selector Bar -->
<div class="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 lg:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
<div class="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
<div class="flex items-center gap-2 text-slate-400 shrink-0">
<span class="material-symbols-outlined text-[22px] text-[#E3195E]">real_estate_agent</span>
<span class="text-xs font-bold uppercase tracking-wider text-slate-500">Active Account</span>
</div>
<!-- Custom Clean Dropdown Select Area -->
<div class="relative flex-1 max-w-xl">
<button class="w-full h-12 px-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 rounded-lg flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-[#E3195E]/20 text-left" id="loanSelectorBtn" type="button">
<div class="flex items-center gap-3 min-w-0">
<div class="w-8 h-8 rounded-md bg-[#FFF1F4] border border-[#FECDD6] text-[#E3195E] flex items-center justify-center text-xs font-bold shrink-0">
                    LN
                  </div>
<div class="flex flex-col min-w-0 leading-tight">
<div class="flex items-center gap-2">
<span class="text-sm font-bold text-slate-900 tracking-tight">LN-2031 · ₹2,00,000</span>
<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
</div>
<span class="text-xs text-slate-500 truncate mt-0.5">Apex Retailers Pvt Ltd · Term Loan · 18 of 24 months completed</span>
</div>
</div>
<span class="material-symbols-outlined text-slate-400 ml-2 shrink-0">unfold_more</span>
</button>
<!-- Dropdown Content Box -->
<div class="hidden absolute top-full left-0 right-0 mt-1.5 z-30 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden" id="loanDropdownMenu">
<div class="p-2 border-b border-slate-100 bg-slate-50">
<div class="relative">
<span class="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[18px]">search</span>
<input class="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#E3195E]" placeholder="Search loan ID, business name, or GSTIN..." type="text"/>
</div>
</div>
<div class="max-h-56 overflow-y-auto divide-y divide-slate-100">
<div class="p-3 bg-[#FFF1F4]/40 flex items-center justify-between cursor-pointer hover:bg-[#FFF1F4]/70">
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="text-xs font-bold text-slate-900">LN-2031 · ₹2,00,000</span>
<span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#FFF1F4] text-[#E3195E] border border-[#FECDD6]">Overdue (1)</span>
</div>
<span class="text-[11px] text-slate-500">Apex Retailers Pvt Ltd · Mumbai, MH</span>
</div>
<span class="material-symbols-outlined text-[#E3195E] text-[18px]">check_circle</span>
</div>
<div class="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="text-xs font-medium text-slate-800">LN-1984 · ₹5,00,000</span>
<span class="px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700">Current</span>
</div>
<span class="text-[11px] text-slate-500">Bharat Logistics Hub · Pune, MH</span>
</div>
<span class="text-[11px] font-medium text-slate-400">#24/36</span>
</div>
</div>
</div>
</div>
</div>
<!-- Right: Mandate & ROI badges neatly spaced -->
<div class="flex items-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
<span class="material-symbols-outlined text-slate-500 text-[18px]">verified_user</span>
<span class="text-xs text-slate-600">Mandate: <strong class="text-slate-900 font-semibold">eNACH / Active</strong></span>
</div>
<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
<span class="material-symbols-outlined text-slate-500 text-[18px]">percent</span>
<span class="text-xs text-slate-600">ROI: <strong class="text-slate-900 font-semibold">16.5% p.a. Reducing</strong></span>
</div>
</div>
</div>
<!-- 2. KPI Summary Cards Strip (3 Cards Grid) -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-5">
<!-- Card 1: Outstanding Principal -->
<div class="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"><div class="flex items-start justify-between"><div><span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Outstanding Principal</span><div class="text-2xl lg:text-[28px] leading-tight font-extrabold text-slate-900 tracking-tight mt-1.5 tabular-nums">₹79,500</div></div><div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600"><span class="material-symbols-outlined text-[20px]">account_balance_wallet</span></div></div><div class="mt-5 pt-3.5 border-t border-slate-100 flex flex-col gap-2"><div class="flex justify-between items-center text-xs"><span class="text-slate-500 font-medium">Original ₹2,00,000</span><span class="font-bold text-slate-800 tabular-nums">60.2% Paid</span></div><div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div class="bg-slate-900 h-full rounded-full" style="width: 60.2%"></div></div><span class="text-[11px] text-slate-400 font-medium">13 instalments remaining in tenure</span></div></div>
<!-- Card 2: Next Due -->
<div class="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div class="flex items-start justify-between">
<div>
<span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Next Due</span>
<div class="text-2xl lg:text-[28px] leading-tight font-extrabold text-slate-900 tracking-tight mt-1.5 tabular-nums">
                  10 Nov 2024 · ₹12,450
                </div>
</div>
<div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
<span class="material-symbols-outlined text-[20px]">event_upcoming</span>
</div>
</div>
<div class="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
<span class="text-xs font-semibold text-slate-700">Instalment #19</span>
</div>
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Due in 6 days
              </span>
</div>
</div>
<!-- Card 3: Overdue Amount (Highlighted in #E3195E) -->
<div class="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"><div class="flex items-start justify-between relative z-10"><div><div class="flex items-center gap-2"><span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Overdue Amount</span><span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">ALL CLEAR</span></div><div class="text-2xl lg:text-[28px] leading-tight font-extrabold text-slate-700 tracking-tight mt-1.5 tabular-nums">₹0</div></div><div class="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[20px]">verified</span></div></div><div class="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between relative z-10"><div class="flex flex-col"><span class="text-xs font-semibold text-slate-700">0 overdue instalments</span><span class="text-[11px] text-slate-500">All payments are currently up to date</span></div><span class="inline-flex items-center text-xs font-medium text-emerald-600"><span class="material-symbols-outlined text-[16px] mr-0.5">check</span>Current</span></div></div>
</div>
<!-- 3. Repayment Schedule Table Section -->
<div class="bg-white rounded-xl border border-slate-200/90 shadow-sm flex flex-col overflow-hidden">
<!-- Schedule Controls Header -->
<div class="p-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
<!-- Left: Title & Status Filter Chips -->
<div class="flex flex-wrap items-center gap-4">
<div class="flex items-center gap-2.5"><h2 class="text-lg font-bold text-slate-900 tracking-tight">Repayment Schedule</h2><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">24 Instalments · <span class="text-emerald-600 font-bold ml-1">0 Overdue</span></span></div>
<!-- Filter Tab Pills -->
<div class="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200/80 text-xs"><button class="schedule-tab-btn px-3 py-1 rounded-md font-semibold bg-white text-slate-900 shadow-xs" data-filter="all" type="button">All (24)</button><button class="schedule-tab-btn px-3 py-1 rounded-md font-medium text-slate-600 hover:text-slate-900" data-filter="overdue" type="button">Overdue (0)</button><button class="schedule-tab-btn px-3 py-1 rounded-md font-medium text-slate-600 hover:text-slate-900" data-filter="pending" type="button">Pending (6)</button><button class="schedule-tab-btn px-3 py-1 rounded-md font-medium text-slate-600 hover:text-slate-900" data-filter="paid" type="button">Paid (18)</button></div>
</div>
<!-- Right: Action Buttons Group -->
<div class="flex items-center gap-2.5 flex-wrap">
<!-- Utility: Ledger PDF -->
<button class="h-9 px-3.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs" type="button">
<span class="material-symbols-outlined text-[16px] text-slate-500">download</span>
<span>Ledger PDF</span>
</button>
<!-- Utility: Export CSV -->
<button class="h-9 px-3.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs" type="button">
<span class="material-symbols-outlined text-[16px] text-slate-500">grid_on</span>
<span>Export CSV</span>
</button>
<!-- Primary Action Pill: Record Payment in Vitto Crimson #E3195E -->
<button class="h-9 px-4 rounded-full bg-[#E3195E] hover:bg-[#C71250] text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-98 focus:outline-none focus:ring-2 focus:ring-[#E3195E] focus:ring-offset-2" id="recordPaymentBtn" type="button">
<span class="material-symbols-outlined text-[17px]">add_circle</span>
<span>Record Payment</span>
</button>
</div>
</div>
<!-- Data Table with tabular numbers & clean padding -->
<div class="overflow-x-auto">
<table class="w-full border-collapse text-left text-xs">
<thead>
<tr class="bg-slate-50/80 h-10 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold select-none">
<th class="py-3 px-4 w-12 text-center">#</th>
<th class="py-3 px-4 min-w-[130px]">Due Date</th>
<th class="py-3 px-4 text-right min-w-[120px]">Principal</th>
<th class="py-3 px-4 text-right min-w-[110px]">Interest</th>
<th class="py-3 px-4 text-right min-w-[120px]">Total Due</th>
<th class="py-3 px-4 text-right min-w-[120px]">Amount Paid</th>
<th class="py-3 px-4 text-center min-w-[120px]">Status</th>
<th class="py-3 px-4 text-center w-24">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-slate-100 tabular-nums text-slate-900" id="scheduleTableBody"><tr class="h-12 hover:bg-slate-50 transition-colors"><td class="px-4 text-center font-semibold text-slate-400">1</td><td class="px-4 whitespace-nowrap text-slate-600 font-medium">10 May 2023</td><td class="px-4 text-right text-slate-600">₹10,500.00</td><td class="px-4 text-right text-slate-500">₹1,950.00</td><td class="px-4 text-right font-semibold text-slate-800">₹12,450.00</td><td class="px-4 text-right font-semibold text-emerald-600">₹12,450.00</td><td class="px-4 text-center"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span></td><td class="px-4 text-center"><button class="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors" title="View Receipt" type="button"><span class="material-symbols-outlined text-[17px]">receipt</span></button></td></tr><tr class="h-12 bg-emerald-50/50 hover:bg-emerald-50 transition-colors border-l-4 border-l-emerald-500"><td class="px-4 text-center font-bold text-emerald-700">2</td><td class="px-4 whitespace-nowrap font-bold text-slate-900"><div class="flex items-center gap-1.5"><span>10 Jun 2023</span><span class="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span></div></td><td class="px-4 text-right font-medium text-slate-700">₹4,200.00</td><td class="px-4 text-right font-medium text-slate-500">₹800.00</td><td class="px-4 text-right font-semibold text-slate-800">₹5,000.00</td><td class="px-4 text-right font-bold text-emerald-600">₹5,000.00</td><td class="px-4 text-center"><span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Paid</span></td><td class="px-4 text-center"><div class="flex items-center justify-center gap-1"><button class="text-emerald-700 hover:text-emerald-900 p-1.5 rounded-md hover:bg-emerald-100/60 transition-colors" title="Download Receipt" type="button"><span class="material-symbols-outlined text-[17px]">receipt_long</span></button></div></td></tr><tr class="h-12 hover:bg-slate-50 transition-colors"><td class="px-4 text-center font-semibold text-slate-400">3</td><td class="px-4 whitespace-nowrap text-slate-600 font-medium">10 Jul 2023</td><td class="px-4 text-right text-slate-600">₹10,620.00</td><td class="px-4 text-right text-slate-500">₹1,830.00</td><td class="px-4 text-right font-semibold text-slate-800">₹12,450.00</td><td class="px-4 text-right font-semibold text-emerald-600">₹12,450.00</td><td class="px-4 text-center"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span></td><td class="px-4 text-center"><button class="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors" title="View Receipt" type="button"><span class="material-symbols-outlined text-[17px]">receipt</span></button></td></tr><tr class="h-12 hover:bg-slate-50 transition-colors"><td class="px-4 text-center font-semibold text-slate-400">4</td><td class="px-4 whitespace-nowrap text-slate-600 font-medium">10 Aug 2023</td><td class="px-4 text-right text-slate-600">₹10,750.00</td><td class="px-4 text-right text-slate-500">₹1,700.00</td><td class="px-4 text-right font-semibold text-slate-800">₹12,450.00</td><td class="px-4 text-right font-semibold text-emerald-600">₹12,450.00</td><td class="px-4 text-center"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span></td><td class="px-4 text-center"><button class="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors" title="View Receipt" type="button"><span class="material-symbols-outlined text-[17px]">receipt</span></button></td></tr><tr class="h-12 hover:bg-slate-50 transition-colors"><td class="px-4 text-center font-semibold text-slate-400">5</td><td class="px-4 whitespace-nowrap text-slate-600 font-medium">10 Sep 2023</td><td class="px-4 text-right text-slate-600">₹10,880.00</td><td class="px-4 text-right text-slate-500">₹1,570.00</td><td class="px-4 text-right font-semibold text-slate-800">₹12,450.00</td><td class="px-4 text-right font-semibold text-emerald-600">₹12,450.00</td><td class="px-4 text-center"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span></td><td class="px-4 text-center"><button class="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors" title="View Receipt" type="button"><span class="material-symbols-outlined text-[17px]">receipt</span></button></td></tr><tr class="h-12 hover:bg-slate-50 transition-colors"><td class="px-4 text-center font-semibold text-slate-400">6</td><td class="px-4 whitespace-nowrap text-slate-600 font-medium">10 Oct 2023</td><td class="px-4 text-right text-slate-600">₹11,010.00</td><td class="px-4 text-right text-slate-500">₹1,440.00</td><td class="px-4 text-right font-semibold text-slate-800">₹12,450.00</td><td class="px-4 text-right font-semibold text-emerald-600">₹12,450.00</td><td class="px-4 text-center"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span></td><td class="px-4 text-center"><button class="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors" title="View Receipt" type="button"><span class="material-symbols-outlined text-[17px]">receipt</span></button></td></tr><tr class="h-12 hover:bg-slate-50 transition-colors"><td class="px-4 text-center font-semibold text-slate-400">7</td><td class="px-4 whitespace-nowrap text-slate-600 font-medium">10 Nov 2023</td><td class="px-4 text-right text-slate-600">₹11,140.00</td><td class="px-4 text-right text-slate-500">₹1,310.00</td><td class="px-4 text-right font-semibold text-slate-800">₹12,450.00</td><td class="px-4 text-right font-semibold text-emerald-600">₹12,450.00</td><td class="px-4 text-center"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span></td><td class="px-4 text-center"><button class="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors" title="View Receipt" type="button"><span class="material-symbols-outlined text-[17px]">receipt</span></button></td></tr><tr class="h-12 hover:bg-slate-50 transition-colors"><td class="px-4 text-center font-semibold text-slate-400">8</td><td class="px-4 whitespace-nowrap text-slate-600 font-medium">10 Dec 2023</td><td class="px-4 text-right text-slate-600">₹11,270.00</td><td class="px-4 text-right text-slate-500">₹1,180.00</td><td class="px-4 text-right font-semibold text-slate-800">₹12,450.00</td><td class="px-4 text-right font-semibold text-emerald-600">₹12,450.00</td><td class="px-4 text-center"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span></td><td class="px-4 text-center"><button class="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors" title="View Receipt" type="button"><span class="material-symbols-outlined text-[17px]">receipt</span></button></td></tr><tr class="h-12 hover:bg-slate-50 transition-colors"><td class="px-4 text-center font-semibold text-slate-400">9</td><td class="px-4 whitespace-nowrap text-slate-600 font-medium">10 Jan 2024</td><td class="px-4 text-right text-slate-600">₹11,400.00</td><td class="px-4 text-right text-slate-500">₹1,050.00</td><td class="px-4 text-right font-semibold text-slate-800">₹12,450.00</td><td class="px-4 text-right font-semibold text-emerald-600">₹12,450.00</td><td class="px-4 text-center"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span></td><td class="px-4 text-center"><button class="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors" title="View Receipt" type="button"><span class="material-symbols-outlined text-[17px]">receipt</span></button></td></tr><tr class="h-12 hover:bg-slate-50 transition-colors"><td class="px-4 text-center font-semibold text-slate-400">10</td><td class="px-4 whitespace-nowrap text-slate-600 font-medium">10 Feb 2024</td><td class="px-4 text-right text-slate-600">₹11,530.00</td><td class="px-4 text-right text-slate-500">₹920.00</td><td class="px-4 text-right font-semibold text-slate-800">₹12,450.00</td><td class="px-4 text-right font-semibold text-emerald-600">₹12,450.00</td><td class="px-4 text-center"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span></td><td class="px-4 text-center"><button class="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors" title="View Receipt" type="button"><span class="material-symbols-outlined text-[17px]">receipt</span></button></td></tr></tbody>
</table>
</div>
<!-- Table Pagination & Ledger Audit Footer -->
<div class="px-5 py-3.5 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3"><div class="flex items-center gap-3 text-xs text-slate-500"><span>Showing Instalments <strong class="text-slate-700">1 to 10</strong> of 24</span><div class="h-3 w-px bg-slate-300"></div><span class="inline-flex items-center gap-1.5 font-medium text-slate-600"><span class="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>Ledger verified against RBI CBS Node</span></div><div class="flex items-center gap-2"><button class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white opacity-40 cursor-not-allowed text-slate-400 font-semibold text-xs flex items-center gap-1" disabled="" type="button"><span class="material-symbols-outlined text-[15px]">chevron_left</span><span>Previous</span></button><span class="px-3 py-1 text-xs font-bold text-slate-800">Page 1 of 2</span><button class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1 transition-colors shadow-xs" type="button"><span>Next 10</span><span class="material-symbols-outlined text-[15px]">chevron_right</span></button></div></div>
</div>
</div>
</main>
</div>
<!-- Slide-over / Modal for Recording Payment -->
<div class="hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4" id="paymentModalBackdrop">
<div class="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
<!-- Modal Header -->
<div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded-lg bg-[#FFF1F4] text-[#E3195E] flex items-center justify-center border border-[#FECDD6]">
<span class="material-symbols-outlined text-[18px]">add_card</span>
</div>
<h3 class="font-bold text-base text-slate-900">Manual Repayment Entry</h3>
</div>
<button class="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors" id="closePaymentModal" type="button">
<span class="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<!-- Modal Form -->
<form class="p-6 flex flex-col gap-4" onsubmit="event.preventDefault(); alert('Repayment recorded &amp; queued for CBS clearing.'); document.getElementById('paymentModalBackdrop').classList.add('hidden');">
<div>
<label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Target Instalment</label>
<div class="p-3 bg-[#FFF1F4] border border-[#FECDD6] rounded-lg flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-[#E3195E]"></span>
<span class="text-xs font-bold text-slate-900">Instalment #18 (Overdue)</span>
</div>
<span class="text-xs font-bold text-[#E3195E] font-mono">₹12,450.00 Due</span>
</div>
</div>
<div class="grid grid-cols-2 gap-4">
<div>
<label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Amount (₹)</label>
<input class="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E3195E]/20 focus:border-[#E3195E]" type="text" value="12,450.00"/>
</div>
<div>
<label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Payment Date</label>
<input class="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E3195E]/20 focus:border-[#E3195E]" type="date" value="2024-11-04"/>
</div>
</div>
<div>
<label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Payment Mode</label>
<select class="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E3195E]/20 focus:border-[#E3195E]">
<option>NEFT / RTGS Bank Transfer</option>
<option>UPI Collect Transaction</option>
<option>Direct eNACH Clearing Retry</option>
<option>Cheque Deposit / OTC Cash</option>
</select>
</div>
<div>
<label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">UTR / CBS Transaction Ref</label>
<input class="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E3195E]/20 focus:border-[#E3195E]" placeholder="e.g. UTR-HDFC984210984" required="" type="text"/>
</div>
<div class="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 mt-2">
<button class="h-9 px-4 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors" id="cancelPaymentModal" type="button">
            Cancel
          </button>
<button class="h-9 px-5 rounded-full bg-[#E3195E] hover:bg-[#C71250] text-white font-semibold text-xs shadow-sm transition-all" type="submit">
            Commit Repayment
          </button>
</div>
</form>
</div>
</div>
<!-- Interactive Logic -->
<script>
    // Loan Dropdown toggle
    const loanSelectorBtn = document.getElementById('loanSelectorBtn');
    const loanDropdownMenu = document.getElementById('loanDropdownMenu');

    if (loanSelectorBtn && loanDropdownMenu) {
      loanSelectorBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        loanDropdownMenu.classList.toggle('hidden');
      });

      document.addEventListener('click', (e) => {
        if (!loanSelectorBtn.contains(e.target) && !loanDropdownMenu.contains(e.target)) {
          loanDropdownMenu.classList.add('hidden');
        }
      });
    }

    // Payment Recording Modal Controls
    const recordPaymentBtn = document.getElementById('recordPaymentBtn');
    const paymentModalBackdrop = document.getElementById('paymentModalBackdrop');
    const closePaymentModal = document.getElementById('closePaymentModal');
    const cancelPaymentModal = document.getElementById('cancelPaymentModal');

    if (recordPaymentBtn && paymentModalBackdrop) {
      recordPaymentBtn.addEventListener('click', () => {
        paymentModalBackdrop.classList.remove('hidden');
      });

      const closeModal = () => paymentModalBackdrop.classList.add('hidden');
      if (closePaymentModal) closePaymentModal.addEventListener('click', closeModal);
      if (cancelPaymentModal) cancelPaymentModal.addEventListener('click', closeModal);

      paymentModalBackdrop.addEventListener('click', (e) => {
        if (e.target === paymentModalBackdrop) closeModal();
      });
    }

    // Tab switcher styling
    const tabs = document.querySelectorAll('.schedule-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('bg-white', 'text-slate-900', 'font-semibold', 'shadow-xs');
          t.classList.add('text-slate-600', 'font-medium');
        });
        tab.classList.add('bg-white', 'text-slate-900', 'font-semibold', 'shadow-xs');
        tab.classList.remove('text-slate-600', 'font-medium');
      });
    });
  </script>
</body></html>

<!-- Loan Repayment Service - Dashboard (Payment Recorded) -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Loan Repayment Service - Vitto Ops</title>
<!-- Google Fonts: Inter & Material Symbols -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          },
          colors: {
            brand: {
              50: '#FDF2F5',
              100: '#FCE7EE',
              500: '#E3195E',
              600: '#C71250',
              700: '#A30D40',
            },
            status: {
              paid: '#10B981',
              'paid-bg': '#ECFDF5',
              'paid-border': '#A7F3D0',
              overdue: '#E3195E',
              'overdue-bg': '#FFF1F4',
              'overdue-border': '#FECDD6',
              pending: '#64748B',
              'pending-bg': '#F1F5F9',
              'pending-border': '#E2E8F0',
              partial: '#F59E0B',
              'partial-bg': '#FFFBEB',
              'partial-border': '#FDE68A',
            }
          }
        }
      }
    };
  </script>
<style>
    body {
      font-feature-settings: "cv02", "cv03", "cv04", "cv11";
    }
    .tabular-nums {
      font-variant-numeric: tabular-nums;
    }
  </style>
</head>
<body class="bg-[#F8F9FA] text-[#0F172A] font-sans min-h-screen antialiased flex flex-col">
<!-- Fixed Top Header -->
<header class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 h-16">
<div class="h-full px-6 flex items-center justify-between">
<!-- Left: Logo & Ops System Tag -->
<div class="flex items-center gap-3.5">
<div class="flex items-center gap-2">
<!-- Vitto SVG Pinwheel / Brand Mark -->
<div class="w-8 h-8 rounded-lg bg-[#E3195E] flex items-center justify-center shadow-sm">
<svg class="w-5 h-5 text-white" fill="currentColor" viewbox="0 0 24 24">
<path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15.93V14a2 2 0 0 1 2-2h3.93a8 8 0 0 1-5.93 5.93zm0-7.93a2 2 0 0 1-2-2V4.07A8 8 0 0 1 17.93 10H14a2 2 0 0 1-1 0zM4.07 12A8 8 0 0 1 10 6.07V10a2 2 0 0 1-2 2H4.07zm5.93 2v3.93A8 8 0 0 1 6.07 14H10z"></path>
</svg>
</div>
<span class="font-bold text-xl tracking-tight text-slate-900">vitto</span>
</div>
<div class="h-4 w-px bg-slate-300 mx-1"></div>
<div class="flex items-center gap-2">
<span class="font-semibold text-sm text-slate-800 tracking-tight">Loan Repayment Service</span>
<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase bg-slate-100 text-slate-600 border border-slate-200">
            INTERNAL OPS
          </span>
</div>
</div>
<!-- Right: User Identity & Action -->
<div class="flex items-center gap-4">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
<span class="material-symbols-outlined text-[18px]">person</span>
</div>
<div class="flex flex-col">
<span class="text-xs font-semibold text-slate-700 leading-tight">officer@vitto.money</span>
<span class="text-[10px] text-slate-400 font-medium">Ops Level 2</span>
</div>
</div>
<div class="h-4 w-px bg-slate-200"></div>
<button class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#E3195E] transition-colors focus:outline-none" type="button">
<span class="material-symbols-outlined text-[16px]">logout</span>
<span>Sign Out</span>
</button>
</div>
</div>
</header>
<!-- Navigation Sidebar -->
<aside class="fixed left-0 top-16 bottom-0 w-60 bg-white border-r border-slate-200 z-40 flex flex-col justify-between py-4">
<div class="flex flex-col gap-5 px-3">
<!-- Group 1 -->
<div>
<div class="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Operations Core
        </div>
<nav class="space-y-1">
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold bg-[#FFF1F4] text-[#E3195E] border border-[#FECDD6]/50" href="#">
<span class="material-symbols-outlined text-[20px]">payments</span>
<span>Repayments</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
<span class="material-symbols-outlined text-[20px] text-slate-400">account_balance</span>
<span>Loan Accounts</span>
</a>
<a class="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-[20px] text-slate-400">warning</span>
<span>Delinquency Queue</span>
</div>
<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FFF1F4] text-[#E3195E]">1</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
<span class="material-symbols-outlined text-[20px] text-slate-400">receipt_long</span>
<span>Settlements</span>
</a>
</nav>
</div>
<!-- Group 2 -->
<div>
<div class="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Finance &amp; Audit
        </div>
<nav class="space-y-1">
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
<span class="material-symbols-outlined text-[20px] text-slate-400">sync_alt</span>
<span>Reconciliation</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
<span class="material-symbols-outlined text-[20px] text-slate-400">history</span>
<span>Audit Trail</span>
</a>
</nav>
</div>
</div>
<!-- Node Status Pill in Sidebar Footer -->
<div class="px-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
<span class="font-mono text-[11px]">Node v2.4.1</span>
<div class="flex items-center gap-1.5">
<span class="inline-block w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></span>
<span class="text-[11px] text-slate-500 font-medium">Synced</span>
</div>
</div>
</aside>
<!-- Main Content Stage -->
<div class="pl-60 pt-16 min-h-screen">
<main class="max-w-7xl mx-auto px-8 py-7">
<div class="flex flex-col gap-6">
<!-- 1. Active Account / Loan Selector Bar -->
<div class="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 lg:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
<div class="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
<div class="flex items-center gap-2 text-slate-400 shrink-0">
<span class="material-symbols-outlined text-[22px] text-[#E3195E]">real_estate_agent</span>
<span class="text-xs font-bold uppercase tracking-wider text-slate-500">Active Account</span>
</div>
<!-- Custom Clean Dropdown Select Area -->
<div class="relative flex-1 max-w-xl">
<button class="w-full h-12 px-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 rounded-lg flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-[#E3195E]/20 text-left" id="loanSelectorBtn" type="button">
<div class="flex items-center gap-3 min-w-0">
<div class="w-8 h-8 rounded-md bg-[#FFF1F4] border border-[#FECDD6] text-[#E3195E] flex items-center justify-center text-xs font-bold shrink-0">
                    LN
                  </div>
<div class="flex flex-col min-w-0 leading-tight">
<div class="flex items-center gap-2">
<span class="text-sm font-bold text-slate-900 tracking-tight">LN-2031 · ₹2,00,000</span>
<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
</div>
<span class="text-xs text-slate-500 truncate mt-0.5">Apex Retailers Pvt Ltd · Term Loan · 18 of 24 months completed</span>
</div>
</div>
<span class="material-symbols-outlined text-slate-400 ml-2 shrink-0">unfold_more</span>
</button>
<!-- Dropdown Content Box -->
<div class="hidden absolute top-full left-0 right-0 mt-1.5 z-30 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden" id="loanDropdownMenu">
<div class="p-2 border-b border-slate-100 bg-slate-50">
<div class="relative">
<span class="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[18px]">search</span>
<input class="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#E3195E]" placeholder="Search loan ID, business name, or GSTIN..." type="text"/>
</div>
</div>
<div class="max-h-56 overflow-y-auto divide-y divide-slate-100">
<div class="p-3 bg-[#FFF1F4]/40 flex items-center justify-between cursor-pointer hover:bg-[#FFF1F4]/70">
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="text-xs font-bold text-slate-900">LN-2031 · ₹2,00,000</span>
<span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#FFF1F4] text-[#E3195E] border border-[#FECDD6]">Overdue (1)</span>
</div>
<span class="text-[11px] text-slate-500">Apex Retailers Pvt Ltd · Mumbai, MH</span>
</div>
<span class="material-symbols-outlined text-[#E3195E] text-[18px]">check_circle</span>
</div>
<div class="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="text-xs font-medium text-slate-800">LN-1984 · ₹5,00,000</span>
<span class="px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700">Current</span>
</div>
<span class="text-[11px] text-slate-500">Bharat Logistics Hub · Pune, MH</span>
</div>
<span class="text-[11px] font-medium text-slate-400">#24/36</span>
</div>
</div>
</div>
</div>
</div>
<!-- Right: Mandate & ROI badges neatly spaced -->
<div class="flex items-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
<span class="material-symbols-outlined text-slate-500 text-[18px]">verified_user</span>
<span class="text-xs text-slate-600">Mandate: <strong class="text-slate-900 font-semibold">eNACH / Active</strong></span>
</div>
<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
<span class="material-symbols-outlined text-slate-500 text-[18px]">percent</span>
<span class="text-xs text-slate-600">ROI: <strong class="text-slate-900 font-semibold">16.5% p.a. Reducing</strong></span>
</div>
</div>
</div>
<!-- 2. KPI Summary Cards Strip (3 Cards Grid) -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-5">
<!-- Card 1: Outstanding Principal -->
<div class="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div class="flex items-start justify-between">
<div>
<span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Outstanding Principal</span>
<div class="text-2xl lg:text-[28px] leading-tight font-extrabold text-slate-900 tracking-tight mt-1.5 tabular-nums">
                  ₹84,500
                </div>
</div>
<div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
<span class="material-symbols-outlined text-[20px]">account_balance_wallet</span>
</div>
</div>
<div class="mt-5 pt-3.5 border-t border-slate-100 flex flex-col gap-2">
<div class="flex justify-between items-center text-xs">
<span class="text-slate-500 font-medium">Original ₹2,00,000</span>
<span class="font-bold text-slate-800 tabular-nums">57.7% Paid</span>
</div>
<!-- Progress Bar with accurate styling -->
<div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
<div class="bg-slate-900 h-full rounded-full" style="width: 57.7%"></div>
</div>
<span class="text-[11px] text-slate-400 font-medium">14 instalments remaining in tenure</span>
</div>
</div>
<!-- Card 2: Next Due -->
<div class="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div class="flex items-start justify-between">
<div>
<span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Next Due</span>
<div class="text-2xl lg:text-[28px] leading-tight font-extrabold text-slate-900 tracking-tight mt-1.5 tabular-nums">
                  10 Nov 2024 · ₹12,450
                </div>
</div>
<div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
<span class="material-symbols-outlined text-[20px]">event_upcoming</span>
</div>
</div>
<div class="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
<span class="text-xs font-semibold text-slate-700">Instalment #19</span>
</div>
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Due in 6 days
              </span>
</div>
</div>
<!-- Card 3: Overdue Amount (Highlighted in #E3195E) -->
<div class="bg-white rounded-xl p-5 border border-[#FECDD6] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between ring-1 ring-[#E3195E]/20">
<!-- Subtle rose ambient glow in top corner -->
<div class="absolute top-0 right-0 w-28 h-28 bg-[#FFF1F4] rounded-bl-full -z-0 pointer-events-none"></div>
<div class="flex items-start justify-between relative z-10">
<div>
<div class="flex items-center gap-2">
<span class="text-xs font-bold uppercase tracking-wider text-[#E3195E]">Overdue Amount</span>
<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#FFF1F4] text-[#E3195E] border border-[#FECDD6]">
                    ACTION REQUIRED
                  </span>
</div>
<div class="text-2xl lg:text-[28px] leading-tight font-extrabold text-[#E3195E] tracking-tight mt-1.5 tabular-nums">
                  ₹12,450
                </div>
</div>
<div class="w-10 h-10 rounded-xl bg-[#FFF1F4] border border-[#FECDD6] text-[#E3195E] flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-[20px]">error</span>
</div>
</div>
<div class="mt-5 pt-3.5 border-t border-rose-100/80 flex items-center justify-between relative z-10">
<div class="flex flex-col">
<span class="text-xs font-bold text-slate-900">1 instalment overdue (#18)</span>
<span class="text-[11px] text-slate-500">Due Oct 10, 2024 · 25 days late</span>
</div>
<button class="inline-flex items-center text-xs font-bold text-[#E3195E] hover:text-[#C71250] hover:underline" type="button">
<span>View Demand</span>
<span class="material-symbols-outlined text-[15px] ml-0.5">chevron_right</span>
</button>
</div>
</div>
</div>
<!-- 3. Repayment Schedule Table Section -->
<div class="bg-white rounded-xl border border-slate-200/90 shadow-sm flex flex-col overflow-hidden">
<!-- Schedule Controls Header -->
<div class="p-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
<!-- Left: Title & Status Filter Chips -->
<div class="flex flex-wrap items-center gap-4">
<div class="flex items-center gap-2.5">
<h2 class="text-lg font-bold text-slate-900 tracking-tight">Repayment Schedule</h2>
<div class="inline-flex items-center gap-2"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">24 Instalments</span><span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF1F4] text-[#E3195E] border border-[#FECDD6]"><span class="inline-block w-1.5 h-1.5 rounded-full bg-[#E3195E] animate-pulse"></span>Fetching ledger...</span></div>
</div>
<!-- Filter Tab Pills -->
<div class="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200/80 text-xs">
<button class="schedule-tab-btn px-3 py-1 rounded-md font-semibold bg-white text-slate-900 shadow-xs" data-filter="all" type="button">
                  All (24)
                </button>
<button class="schedule-tab-btn px-3 py-1 rounded-md font-medium text-slate-600 hover:text-slate-900" data-filter="overdue" type="button">
                  Overdue (1)
                </button>
<button class="schedule-tab-btn px-3 py-1 rounded-md font-medium text-slate-600 hover:text-slate-900" data-filter="pending" type="button">
                  Pending (6)
                </button>
<button class="schedule-tab-btn px-3 py-1 rounded-md font-medium text-slate-600 hover:text-slate-900" data-filter="paid" type="button">
                  Paid (17)
                </button>
</div>
</div>
<!-- Right: Action Buttons Group -->
<div class="flex items-center gap-2.5 flex-wrap">
<!-- Utility: Ledger PDF -->
<button class="h-9 px-3.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs" type="button">
<span class="material-symbols-outlined text-[16px] text-slate-500">download</span>
<span>Ledger PDF</span>
</button>
<!-- Utility: Export CSV -->
<button class="h-9 px-3.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs" type="button">
<span class="material-symbols-outlined text-[16px] text-slate-500">grid_on</span>
<span>Export CSV</span>
</button>
<!-- Primary Action Pill: Record Payment in Vitto Crimson #E3195E -->
<button class="h-9 px-4 rounded-full bg-[#E3195E] hover:bg-[#C71250] text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-98 focus:outline-none focus:ring-2 focus:ring-[#E3195E] focus:ring-offset-2" id="recordPaymentBtn" type="button">
<span class="material-symbols-outlined text-[17px]">add_circle</span>
<span>Record Payment</span>
</button>
</div>
</div>
<!-- Data Table with tabular numbers & clean padding -->
<div class="overflow-x-auto">
<table class="w-full border-collapse text-left text-xs">
<thead>
<tr class="bg-slate-50/80 h-10 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold select-none">
<th class="py-3 px-4 w-12 text-center">#</th>
<th class="py-3 px-4 min-w-[130px]">Due Date</th>
<th class="py-3 px-4 text-right min-w-[120px]">Principal</th>
<th class="py-3 px-4 text-right min-w-[110px]">Interest</th>
<th class="py-3 px-4 text-right min-w-[120px]">Total Due</th>
<th class="py-3 px-4 text-right min-w-[120px]">Amount Paid</th>
<th class="py-3 px-4 text-center min-w-[120px]">Status</th>
<th class="py-3 px-4 text-center w-24">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-slate-100 tabular-nums text-slate-900" id="scheduleTableBody"><tr class="h-12 border-b border-slate-100 animate-pulse"><td class="px-4 text-center"><div class="h-4 w-5 bg-slate-200 rounded mx-auto"></div></td><td class="px-4"><div class="h-4 w-24 bg-slate-200 rounded"></div></td><td class="px-4 flex justify-end py-4"><div class="h-4 w-20 bg-slate-200 rounded"></div></td><td class="px-4 text-right"><div class="h-4 w-16 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-right"><div class="h-4 w-20 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-right"><div class="h-4 w-20 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-center"><div class="h-5 w-16 bg-slate-200 rounded-full mx-auto"></div></td><td class="px-4 text-center"><div class="h-6 w-6 bg-slate-200 rounded mx-auto"></div></td></tr><tr class="h-12 border-b border-slate-100 animate-pulse"><td class="px-4 text-center"><div class="h-4 w-5 bg-slate-200 rounded mx-auto"></div></td><td class="px-4"><div class="h-4 w-24 bg-slate-200 rounded"></div></td><td class="px-4 flex justify-end py-4"><div class="h-4 w-20 bg-slate-200 rounded"></div></td><td class="px-4 text-right"><div class="h-4 w-16 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-right"><div class="h-4 w-20 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-right"><div class="h-4 w-20 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-center"><div class="h-5 w-16 bg-slate-200 rounded-full mx-auto"></div></td><td class="px-4 text-center"><div class="h-6 w-6 bg-slate-200 rounded mx-auto"></div></td></tr><tr class="h-12 border-b border-slate-100 animate-pulse"><td class="px-4 text-center"><div class="h-4 w-5 bg-slate-200 rounded mx-auto"></div></td><td class="px-4"><div class="h-4 w-24 bg-slate-200 rounded"></div></td><td class="px-4 flex justify-end py-4"><div class="h-4 w-20 bg-slate-200 rounded"></div></td><td class="px-4 text-right"><div class="h-4 w-16 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-right"><div class="h-4 w-20 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-right"><div class="h-4 w-20 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-center"><div class="h-5 w-16 bg-slate-200 rounded-full mx-auto"></div></td><td class="px-4 text-center"><div class="h-6 w-6 bg-slate-200 rounded mx-auto"></div></td></tr><tr class="h-12 border-b border-slate-100 animate-pulse"><td class="px-4 text-center"><div class="h-4 w-5 bg-slate-200 rounded mx-auto"></div></td><td class="px-4"><div class="h-4 w-24 bg-slate-200 rounded"></div></td><td class="px-4 flex justify-end py-4"><div class="h-4 w-20 bg-slate-200 rounded"></div></td><td class="px-4 text-right"><div class="h-4 w-16 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-right"><div class="h-4 w-20 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-right"><div class="h-4 w-20 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-center"><div class="h-5 w-16 bg-slate-200 rounded-full mx-auto"></div></td><td class="px-4 text-center"><div class="h-6 w-6 bg-slate-200 rounded mx-auto"></div></td></tr><tr class="h-12 border-b border-slate-100 animate-pulse"><td class="px-4 text-center"><div class="h-4 w-5 bg-slate-200 rounded mx-auto"></div></td><td class="px-4"><div class="h-4 w-24 bg-slate-200 rounded"></div></td><td class="px-4 flex justify-end py-4"><div class="h-4 w-20 bg-slate-200 rounded"></div></td><td class="px-4 text-right"><div class="h-4 w-16 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-right"><div class="h-4 w-20 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-right"><div class="h-4 w-20 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-center"><div class="h-5 w-16 bg-slate-200 rounded-full mx-auto"></div></td><td class="px-4 text-center"><div class="h-6 w-6 bg-slate-200 rounded mx-auto"></div></td></tr><tr class="h-12 border-b border-slate-100 animate-pulse"><td class="px-4 text-center"><div class="h-4 w-5 bg-slate-200 rounded mx-auto"></div></td><td class="px-4"><div class="h-4 w-24 bg-slate-200 rounded"></div></td><td class="px-4 flex justify-end py-4"><div class="h-4 w-20 bg-slate-200 rounded"></div></td><td class="px-4 text-right"><div class="h-4 w-16 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-right"><div class="h-4 w-20 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-right"><div class="h-4 w-20 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-center"><div class="h-5 w-16 bg-slate-200 rounded-full mx-auto"></div></td><td class="px-4 text-center"><div class="h-6 w-6 bg-slate-200 rounded mx-auto"></div></td></tr><tr class="h-12 border-b border-slate-100 animate-pulse"><td class="px-4 text-center"><div class="h-4 w-5 bg-slate-200 rounded mx-auto"></div></td><td class="px-4"><div class="h-4 w-24 bg-slate-200 rounded"></div></td><td class="px-4 flex justify-end py-4"><div class="h-4 w-20 bg-slate-200 rounded"></div></td><td class="px-4 text-right"><div class="h-4 w-16 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-right"><div class="h-4 w-20 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-right"><div class="h-4 w-20 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-center"><div class="h-5 w-16 bg-slate-200 rounded-full mx-auto"></div></td><td class="px-4 text-center"><div class="h-6 w-6 bg-slate-200 rounded mx-auto"></div></td></tr><tr class="h-12 border-b border-slate-100 animate-pulse"><td class="px-4 text-center"><div class="h-4 w-5 bg-slate-200 rounded mx-auto"></div></td><td class="px-4"><div class="h-4 w-24 bg-slate-200 rounded"></div></td><td class="px-4 flex justify-end py-4"><div class="h-4 w-20 bg-slate-200 rounded"></div></td><td class="px-4 text-right"><div class="h-4 w-16 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-right"><div class="h-4 w-20 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-right"><div class="h-4 w-20 bg-slate-200 rounded ml-auto"></div></td><td class="px-4 text-center"><div class="h-5 w-16 bg-slate-200 rounded-full mx-auto"></div></td><td class="px-4 text-center"><div class="h-6 w-6 bg-slate-200 rounded mx-auto"></div></td></tr></tbody>
</table>
</div>
<!-- Table Pagination & Ledger Audit Footer -->
<div class="px-5 py-3.5 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3"><div class="flex items-center gap-3 text-xs text-slate-400"><div class="h-4 w-36 bg-slate-200 rounded animate-pulse"></div><div class="h-3 w-px bg-slate-200"></div><span class="inline-flex items-center gap-1.5 font-medium text-slate-500"><span class="inline-block w-2 h-2 rounded-full bg-slate-300 animate-pulse"></span>Loading records from CBS Node...</span></div><div class="flex items-center gap-2 opacity-50 cursor-not-allowed pointer-events-none"><div class="h-8 w-24 bg-slate-200 rounded-lg"></div><div class="h-4 w-20 bg-slate-200 rounded"></div><div class="h-8 w-16 bg-slate-200 rounded-lg"></div></div></div>
</div>
</div>
</main>
</div>
<!-- Slide-over / Modal for Recording Payment -->
<div class="hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4" id="paymentModalBackdrop">
<div class="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
<!-- Modal Header -->
<div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded-lg bg-[#FFF1F4] text-[#E3195E] flex items-center justify-center border border-[#FECDD6]">
<span class="material-symbols-outlined text-[18px]">add_card</span>
</div>
<h3 class="font-bold text-base text-slate-900">Manual Repayment Entry</h3>
</div>
<button class="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors" id="closePaymentModal" type="button">
<span class="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<!-- Modal Form -->
<form class="p-6 flex flex-col gap-4" onsubmit="event.preventDefault(); alert('Repayment recorded &amp; queued for CBS clearing.'); document.getElementById('paymentModalBackdrop').classList.add('hidden');">
<div>
<label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Target Instalment</label>
<div class="p-3 bg-[#FFF1F4] border border-[#FECDD6] rounded-lg flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-[#E3195E]"></span>
<span class="text-xs font-bold text-slate-900">Instalment #18 (Overdue)</span>
</div>
<span class="text-xs font-bold text-[#E3195E] font-mono">₹12,450.00 Due</span>
</div>
</div>
<div class="grid grid-cols-2 gap-4">
<div>
<label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Amount (₹)</label>
<input class="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E3195E]/20 focus:border-[#E3195E]" type="text" value="12,450.00"/>
</div>
<div>
<label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Payment Date</label>
<input class="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E3195E]/20 focus:border-[#E3195E]" type="date" value="2024-11-04"/>
</div>
</div>
<div>
<label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Payment Mode</label>
<select class="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E3195E]/20 focus:border-[#E3195E]">
<option>NEFT / RTGS Bank Transfer</option>
<option>UPI Collect Transaction</option>
<option>Direct eNACH Clearing Retry</option>
<option>Cheque Deposit / OTC Cash</option>
</select>
</div>
<div>
<label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">UTR / CBS Transaction Ref</label>
<input class="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E3195E]/20 focus:border-[#E3195E]" placeholder="e.g. UTR-HDFC984210984" required="" type="text"/>
</div>
<div class="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 mt-2">
<button class="h-9 px-4 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors" id="cancelPaymentModal" type="button">
            Cancel
          </button>
<button class="h-9 px-5 rounded-full bg-[#E3195E] hover:bg-[#C71250] text-white font-semibold text-xs shadow-sm transition-all" type="submit">
            Commit Repayment
          </button>
</div>
</form>
</div>
</div>
<!-- Interactive Logic -->
<script>
    // Loan Dropdown toggle
    const loanSelectorBtn = document.getElementById('loanSelectorBtn');
    const loanDropdownMenu = document.getElementById('loanDropdownMenu');

    if (loanSelectorBtn && loanDropdownMenu) {
      loanSelectorBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        loanDropdownMenu.classList.toggle('hidden');
      });

      document.addEventListener('click', (e) => {
        if (!loanSelectorBtn.contains(e.target) && !loanDropdownMenu.contains(e.target)) {
          loanDropdownMenu.classList.add('hidden');
        }
      });
    }

    // Payment Recording Modal Controls
    const recordPaymentBtn = document.getElementById('recordPaymentBtn');
    const paymentModalBackdrop = document.getElementById('paymentModalBackdrop');
    const closePaymentModal = document.getElementById('closePaymentModal');
    const cancelPaymentModal = document.getElementById('cancelPaymentModal');

    if (recordPaymentBtn && paymentModalBackdrop) {
      recordPaymentBtn.addEventListener('click', () => {
        paymentModalBackdrop.classList.remove('hidden');
      });

      const closeModal = () => paymentModalBackdrop.classList.add('hidden');
      if (closePaymentModal) closePaymentModal.addEventListener('click', closeModal);
      if (cancelPaymentModal) cancelPaymentModal.addEventListener('click', closeModal);

      paymentModalBackdrop.addEventListener('click', (e) => {
        if (e.target === paymentModalBackdrop) closeModal();
      });
    }

    // Tab switcher styling
    const tabs = document.querySelectorAll('.schedule-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('bg-white', 'text-slate-900', 'font-semibold', 'shadow-xs');
          t.classList.add('text-slate-600', 'font-medium');
        });
        tab.classList.add('bg-white', 'text-slate-900', 'font-semibold', 'shadow-xs');
        tab.classList.remove('text-slate-600', 'font-medium');
      });
    });
  </script>
</body></html>

<!-- Loan Repayment Service - Schedule Loading Skeleton -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Loan Repayment Service - Vitto Ops</title>
<!-- Google Fonts: Inter & Material Symbols -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          },
          colors: {
            brand: {
              50: '#FDF2F5',
              100: '#FCE7EE',
              500: '#E3195E',
              600: '#C71250',
              700: '#A30D40',
            },
            status: {
              paid: '#10B981',
              'paid-bg': '#ECFDF5',
              'paid-border': '#A7F3D0',
              overdue: '#E3195E',
              'overdue-bg': '#FFF1F4',
              'overdue-border': '#FECDD6',
              pending: '#64748B',
              'pending-bg': '#F1F5F9',
              'pending-border': '#E2E8F0',
              partial: '#F59E0B',
              'partial-bg': '#FFFBEB',
              'partial-border': '#FDE68A',
            }
          }
        }
      }
    };
  </script>
<style>
    body {
      font-feature-settings: "cv02", "cv03", "cv04", "cv11";
    }
    .tabular-nums {
      font-variant-numeric: tabular-nums;
    }
  </style>
</head>
<body class="bg-[#F8F9FA] text-[#0F172A] font-sans min-h-screen antialiased flex flex-col">
<!-- Fixed Top Header -->
<header class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 h-16">
<div class="h-full px-6 flex items-center justify-between">
<!-- Left: Logo & Ops System Tag -->
<div class="flex items-center gap-3.5">
<div class="flex items-center gap-2">
<!-- Vitto SVG Pinwheel / Brand Mark -->
<div class="w-8 h-8 rounded-lg bg-[#E3195E] flex items-center justify-center shadow-sm">
<svg class="w-5 h-5 text-white" fill="currentColor" viewbox="0 0 24 24">
<path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15.93V14a2 2 0 0 1 2-2h3.93a8 8 0 0 1-5.93 5.93zm0-7.93a2 2 0 0 1-2-2V4.07A8 8 0 0 1 17.93 10H14a2 2 0 0 1-1 0zM4.07 12A8 8 0 0 1 10 6.07V10a2 2 0 0 1-2 2H4.07zm5.93 2v3.93A8 8 0 0 1 6.07 14H10z"></path>
</svg>
</div>
<span class="font-bold text-xl tracking-tight text-slate-900">vitto</span>
</div>
<div class="h-4 w-px bg-slate-300 mx-1"></div>
<div class="flex items-center gap-2">
<span class="font-semibold text-sm text-slate-800 tracking-tight">Loan Repayment Service</span>
<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase bg-slate-100 text-slate-600 border border-slate-200">
            INTERNAL OPS
          </span>
</div>
</div>
<!-- Right: User Identity & Action -->
<div class="flex items-center gap-4">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
<span class="material-symbols-outlined text-[18px]">person</span>
</div>
<div class="flex flex-col">
<span class="text-xs font-semibold text-slate-700 leading-tight">officer@vitto.money</span>
<span class="text-[10px] text-slate-400 font-medium">Ops Level 2</span>
</div>
</div>
<div class="h-4 w-px bg-slate-200"></div>
<button class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#E3195E] transition-colors focus:outline-none" type="button">
<span class="material-symbols-outlined text-[16px]">logout</span>
<span>Sign Out</span>
</button>
</div>
</div>
</header>
<!-- Navigation Sidebar -->
<aside class="fixed left-0 top-16 bottom-0 w-60 bg-white border-r border-slate-200 z-40 flex flex-col justify-between py-4">
<div class="flex flex-col gap-5 px-3">
<!-- Group 1 -->
<div>
<div class="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Operations Core
        </div>
<nav class="space-y-1">
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold bg-[#FFF1F4] text-[#E3195E] border border-[#FECDD6]/50" href="#">
<span class="material-symbols-outlined text-[20px]">payments</span>
<span>Repayments</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
<span class="material-symbols-outlined text-[20px] text-slate-400">account_balance</span>
<span>Loan Accounts</span>
</a>
<a class="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-[20px] text-slate-400">warning</span>
<span>Delinquency Queue</span>
</div>
<span class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-400">0</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
<span class="material-symbols-outlined text-[20px] text-slate-400">receipt_long</span>
<span>Settlements</span>
</a>
</nav>
</div>
<!-- Group 2 -->
<div>
<div class="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Finance &amp; Audit
        </div>
<nav class="space-y-1">
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
<span class="material-symbols-outlined text-[20px] text-slate-400">sync_alt</span>
<span>Reconciliation</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" href="#">
<span class="material-symbols-outlined text-[20px] text-slate-400">history</span>
<span>Audit Trail</span>
</a>
</nav>
</div>
</div>
<!-- Node Status Pill in Sidebar Footer -->
<div class="px-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
<span class="font-mono text-[11px]">Node v2.4.1</span>
<div class="flex items-center gap-1.5">
<span class="inline-block w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></span>
<span class="text-[11px] text-slate-500 font-medium">Synced</span>
</div>
</div>
</aside>
<!-- Main Content Stage -->
<div class="pl-60 pt-16 min-h-screen">
<main class="max-w-7xl mx-auto px-8 py-7">
<div class="flex flex-col gap-6">
<!-- 1. Active Account / Loan Selector Bar -->
<div class="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 lg:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
<div class="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
<div class="flex items-center gap-2 text-slate-400 shrink-0">
<span class="material-symbols-outlined text-[22px] text-[#E3195E]">real_estate_agent</span>
<span class="text-xs font-bold uppercase tracking-wider text-slate-500">Active Account</span>
</div>
<!-- Custom Clean Dropdown Select Area -->
<div class="relative flex-1 max-w-xl">
<button class="w-full h-12 px-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 rounded-lg flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-[#E3195E]/20 text-left" id="loanSelectorBtn" type="button"><div class="flex items-center gap-3 min-w-0"><div class="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center text-xs font-semibold shrink-0"><span class="material-symbols-outlined text-[18px]">search</span></div><div class="flex flex-col min-w-0 leading-tight"><span class="text-sm font-medium text-slate-400 tracking-tight">Search borrower or Loan ID (e.g. LN-2031)...</span><span class="text-[11px] text-slate-400 mt-0.5">Type to find active, pending, or delinquent loans</span></div></div><span class="material-symbols-outlined text-slate-400 ml-2 shrink-0">unfold_more</span></button>
<!-- Dropdown Content Box -->
<div class="hidden absolute top-full left-0 right-0 mt-1.5 z-30 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden" id="loanDropdownMenu">
<div class="p-2 border-b border-slate-100 bg-slate-50">
<div class="relative">
<span class="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[18px]">search</span>
<input class="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#E3195E]" placeholder="Search loan ID, business name, or GSTIN..." type="text"/>
</div>
</div>
<div class="max-h-56 overflow-y-auto divide-y divide-slate-100">
<div class="p-3 bg-[#FFF1F4]/40 flex items-center justify-between cursor-pointer hover:bg-[#FFF1F4]/70">
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="text-xs font-bold text-slate-900">LN-2031 · ₹2,00,000</span>
<span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#FFF1F4] text-[#E3195E] border border-[#FECDD6]">Overdue (1)</span>
</div>
<span class="text-[11px] text-slate-500">Apex Retailers Pvt Ltd · Mumbai, MH</span>
</div>
<span class="material-symbols-outlined text-[#E3195E] text-[18px]">check_circle</span>
</div>
<div class="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="text-xs font-medium text-slate-800">LN-1984 · ₹5,00,000</span>
<span class="px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700">Current</span>
</div>
<span class="text-[11px] text-slate-500">Bharat Logistics Hub · Pune, MH</span>
</div>
<span class="text-[11px] font-medium text-slate-400">#24/36</span>
</div>
</div>
</div>
</div>
</div>
<!-- Right: Mandate & ROI badges neatly spaced -->
<div class="flex items-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100"><div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-400"><span class="material-symbols-outlined text-slate-400 text-[18px]">info</span><span class="text-xs text-slate-500">No active mandate selected</span></div></div>
</div>
<!-- 2. KPI Summary Cards Strip (3 Cards Grid) -->
<!-- 3. Repayment Schedule Table Section -->
<div class="bg-white rounded-xl border border-slate-200/90 shadow-sm p-12 flex flex-col items-center justify-center text-center min-h-[460px]"><div class="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-400 shadow-xs mb-5"><span class="material-symbols-outlined text-[40px] text-slate-400">folder_open</span></div><h2 class="text-xl font-bold text-slate-900 tracking-tight mb-2">No loan selected</h2><p class="text-base font-semibold text-slate-700 max-w-md mb-2">Select a loan to view its schedule</p><p class="text-xs text-slate-500 max-w-md leading-relaxed mb-6">Choose an active or delinquent loan account from the selector above to inspect repayments, tenure progress, and overdue demands.</p><button class="h-10 px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2" onclick="document.getElementById('loanDropdownMenu').classList.remove('hidden');" type="button"><span class="material-symbols-outlined text-[18px]">search</span><span>Select a Loan</span><span class="material-symbols-outlined text-[16px] text-slate-400">expand_more</span></button></div>
</div>
</main>
</div>
<!-- Slide-over / Modal for Recording Payment -->
<div class="hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4" id="paymentModalBackdrop">
<div class="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
<!-- Modal Header -->
<div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded-lg bg-[#FFF1F4] text-[#E3195E] flex items-center justify-center border border-[#FECDD6]">
<span class="material-symbols-outlined text-[18px]">add_card</span>
</div>
<h3 class="font-bold text-base text-slate-900">Manual Repayment Entry</h3>
</div>
<button class="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors" id="closePaymentModal" type="button">
<span class="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<!-- Modal Form -->
<form class="p-6 flex flex-col gap-4" onsubmit="event.preventDefault(); alert('Repayment recorded &amp; queued for CBS clearing.'); document.getElementById('paymentModalBackdrop').classList.add('hidden');">
<div>
<label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Target Instalment</label>
<div class="p-3 bg-[#FFF1F4] border border-[#FECDD6] rounded-lg flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-[#E3195E]"></span>
<span class="text-xs font-bold text-slate-900">Instalment #18 (Overdue)</span>
</div>
<span class="text-xs font-bold text-[#E3195E] font-mono">₹12,450.00 Due</span>
</div>
</div>
<div class="grid grid-cols-2 gap-4">
<div>
<label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Amount (₹)</label>
<input class="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E3195E]/20 focus:border-[#E3195E]" type="text" value="12,450.00"/>
</div>
<div>
<label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Payment Date</label>
<input class="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E3195E]/20 focus:border-[#E3195E]" type="date" value="2024-11-04"/>
</div>
</div>
<div>
<label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Payment Mode</label>
<select class="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E3195E]/20 focus:border-[#E3195E]">
<option>NEFT / RTGS Bank Transfer</option>
<option>UPI Collect Transaction</option>
<option>Direct eNACH Clearing Retry</option>
<option>Cheque Deposit / OTC Cash</option>
</select>
</div>
<div>
<label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">UTR / CBS Transaction Ref</label>
<input class="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E3195E]/20 focus:border-[#E3195E]" placeholder="e.g. UTR-HDFC984210984" required="" type="text"/>
</div>
<div class="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 mt-2">
<button class="h-9 px-4 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors" id="cancelPaymentModal" type="button">
            Cancel
          </button>
<button class="h-9 px-5 rounded-full bg-[#E3195E] hover:bg-[#C71250] text-white font-semibold text-xs shadow-sm transition-all" type="submit">
            Commit Repayment
          </button>
</div>
</form>
</div>
</div>
<!-- Interactive Logic -->
<script>
    // Loan Dropdown toggle
    const loanSelectorBtn = document.getElementById('loanSelectorBtn');
    const loanDropdownMenu = document.getElementById('loanDropdownMenu');

    if (loanSelectorBtn && loanDropdownMenu) {
      loanSelectorBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        loanDropdownMenu.classList.toggle('hidden');
      });

      document.addEventListener('click', (e) => {
        if (!loanSelectorBtn.contains(e.target) && !loanDropdownMenu.contains(e.target)) {
          loanDropdownMenu.classList.add('hidden');
        }
      });
    }

    // Payment Recording Modal Controls
    const recordPaymentBtn = document.getElementById('recordPaymentBtn');
    const paymentModalBackdrop = document.getElementById('paymentModalBackdrop');
    const closePaymentModal = document.getElementById('closePaymentModal');
    const cancelPaymentModal = document.getElementById('cancelPaymentModal');

    if (recordPaymentBtn && paymentModalBackdrop) {
      recordPaymentBtn.addEventListener('click', () => {
        paymentModalBackdrop.classList.remove('hidden');
      });

      const closeModal = () => paymentModalBackdrop.classList.add('hidden');
      if (closePaymentModal) closePaymentModal.addEventListener('click', closeModal);
      if (cancelPaymentModal) cancelPaymentModal.addEventListener('click', closeModal);

      paymentModalBackdrop.addEventListener('click', (e) => {
        if (e.target === paymentModalBackdrop) closeModal();
      });
    }

    // Tab switcher styling
    const tabs = document.querySelectorAll('.schedule-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('bg-white', 'text-slate-900', 'font-semibold', 'shadow-xs');
          t.classList.add('text-slate-600', 'font-medium');
        });
        tab.classList.add('bg-white', 'text-slate-900', 'font-semibold', 'shadow-xs');
        tab.classList.remove('text-slate-600', 'font-medium');
      });
    });
  </script>
</body></html>

<!-- Loan Repayment Service - Empty State (No Loan Selected) -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&amp;display=swap" rel="stylesheet"/>
<style>
    @layer base {
      html, body { margin: 0; padding: 0; }
      body { overscroll-behavior: none; }
      main > :first-child { margin-top: 0 !important; }
      main > :last-child { margin-bottom: 0 !important; }
    }
    ::-webkit-scrollbar { display: none; }
  </style>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "surface-bright": "#fbf8ff",
            "brand-pink-soft": "#F9C4D2",
            "primary-fixed": "#ffd9dd",
            "secondary-fixed-dim": "#c7c5d2",
            "surface-container": "#eeecf9",
            "primary": "#b90049",
            "status-pending-bg": "#F3F4F6",
            "tertiary": "#0058bf",
            "surface-container-high": "#e8e7f4",
            "on-error-container": "#93000a",
            "surface-container-highest": "#e3e1ee",
            "surface-variant": "#e3e1ee",
            "secondary": "#5e5d68",
            "text-secondary": "#6B6B76",
            "status-pending": "#6B6B76",
            "on-secondary": "#ffffff",
            "outline": "#8f6f73",
            "surface-tint": "#bd004a",
            "on-tertiary-fixed-variant": "#004395",
            "on-primary": "#ffffff",
            "on-surface-variant": "#5b3f43",
            "tertiary-container": "#2271e4",
            "border-default": "#E7E7EC",
            "surface-container-lowest": "#ffffff",
            "status-partially-paid": "#F2994A",
            "on-secondary-container": "#62616d",
            "surface-muted": "#F7F7F9",
            "secondary-container": "#e1deeb",
            "surface": "#fbf8ff",
            "status-overdue": "#E3195E",
            "on-tertiary-container": "#fffdff",
            "on-error": "#ffffff",
            "on-secondary-fixed": "#1b1b24",
            "on-primary-fixed-variant": "#900037",
            "text-tertiary": "#9CA3AF",
            "inverse-on-surface": "#f1effc",
            "on-background": "#1a1b24",
            "primary-container": "#e3195e",
            "on-primary-fixed": "#400014",
            "status-paid": "#10B981",
            "primary-fixed-dim": "#ffb2bd",
            "on-tertiary-fixed": "#001a42",
            "on-secondary-fixed-variant": "#464650",
            "surface-dim": "#dad9e5",
            "surface-default": "#FFFFFF",
            "on-surface": "#1a1b24",
            "surface-subtle": "#F1F2F4",
            "error": "#ba1a1a",
            "text-primary": "#12121A",
            "on-tertiary": "#ffffff",
            "background": "#fbf8ff",
            "tertiary-fixed-dim": "#adc6ff",
            "inverse-primary": "#ffb2bd",
            "surface-container-low": "#f4f2ff",
            "status-overdue-bg": "#FDF2F4",
            "secondary-fixed": "#e4e1ee",
            "status-paid-bg": "#ECFDF5",
            "error-container": "#ffdad6",
            "inverse-surface": "#2f3039",
            "tertiary-fixed": "#d8e2ff",
            "border-subtle": "#F0F0F3",
            "outline-variant": "#e4bdc1",
            "on-primary-container": "#fffdff",
            "status-partially-paid-bg": "#FFF7ED"
          },
          borderRadius: {
            DEFAULT: "0.25rem",
            lg: "0.5rem",
            xl: "0.75rem",
            full: "9999px"
          },
          spacing: {
            "space-lg": "1.5rem",
            "space-2xl": "3rem",
            "gutter": "1rem",
            "gutter-desktop": "1.5rem",
            "margin-desktop": "2rem",
            "space-md": "1rem",
            "space-2xs": "0.25rem",
            "space-xl": "2rem",
            "margin": "1rem",
            "space-sm": "0.75rem",
            "space-xs": "0.5rem"
          },
          fontFamily: {
            "body-sm": ["Inter"],
            "label-sm": ["Inter"],
            "label-md": ["Inter"],
            "headline-lg": ["Inter"],
            "body-md": ["Inter"],
            "headline-sm": ["Inter"],
            "headline-md": ["Inter"],
            "numeral-data": ["Inter"],
            "numeral-hero": ["Inter"],
            "headline-xl": ["Inter"],
            "body-lg": ["Inter"],
            "label-lg": ["Inter"]
          },
          fontSize: {
            "body-sm": ["12px", { lineHeight: "16px", letterSpacing: "0em", fontWeight: "400" }],
            "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.04em", fontWeight: "600" }],
            "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "600" }],
            "headline-lg": ["24px", { lineHeight: "32px", letterSpacing: "-0.02em", fontWeight: "700" }],
            "body-md": ["14px", { lineHeight: "20px", letterSpacing: "0em", fontWeight: "400" }],
            "headline-sm": ["16px", { lineHeight: "22px", letterSpacing: "-0.01em", fontWeight: "600" }],
            "headline-md": ["18px", { lineHeight: "24px", letterSpacing: "-0.015em", fontWeight: "600" }],
            "numeral-data": ["14px", { lineHeight: "20px", letterSpacing: "0em", fontWeight: "500" }],
            "numeral-hero": ["28px", { lineHeight: "36px", letterSpacing: "-0.02em", fontWeight: "700" }],
            "headline-xl": ["32px", { lineHeight: "40px", letterSpacing: "-0.025em", fontWeight: "800" }],
            "body-lg": ["16px", { lineHeight: "24px", letterSpacing: "-0.005em", fontWeight: "400" }],
            "label-lg": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "600" }]
          }
        }
      }
    };
  </script>
</head>
<body class="bg-surface-muted font-body-md text-body-md text-text-primary min-h-screen antialiased">
<!-- Fixed Header -->
<header class="fixed top-0 left-0 right-0 z-40 bg-surface-default border-b border-border-default h-16">
<div class="h-16 w-full px-gutter-desktop flex items-center justify-between">
<div class="flex items-center gap-space-md">
<img alt="Vitto" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1WOKAhl3yGKwaiFtEnY50T2o5usEXmKzWOgash-FZaXrJTu4o8ehXaKsjqLGQNzT9C3EWlCroYsWkbBR2r1uEc_uIGVeR4o3HLoFKqZlUXZj3-kt6fNdUzlpNBPqyghQ99XhXbwO55xE8k-PkR9PQ4nz3XnZ2oAB3AghDVuAUWtg0ppWBrq-H0N_WezRcfMeCh7yhW8xEfsORxQ6gPAyi5G3B8MjOJUqDuiiSX2XoZQUD-JHlpCWXeaKKw"/>
<div class="h-5 w-px bg-border-default"></div>
<div class="flex items-center gap-space-xs">
<span class="font-headline-sm text-headline-sm text-text-primary tracking-tight">Loan Repayment Service</span>
<span class="inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm uppercase tracking-wider bg-surface-subtle text-text-secondary border border-border-default">Internal Ops</span>
</div>
</div>
<div class="flex items-center gap-space-lg">
<div class="flex items-center gap-space-sm">
<div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
<span class="material-symbols-outlined text-on-primary text-[18px]">person</span>
</div>
<span class="font-label-md text-label-md text-text-secondary">officer@vitto.money</span>
</div>
<div class="h-4 w-px bg-border-default"></div>
<button class="font-label-md text-label-md text-text-secondary hover:text-primary transition-colors inline-flex items-center gap-1.5 focus:outline-none" type="button">
<span class="material-symbols-outlined text-[16px]">logout</span>
<span>Sign Out</span>
</button>
</div>
</div>
</header>
<!-- Left Sidebar Navigation -->
<aside class="fixed left-0 top-16 bottom-0 w-64 bg-surface-default border-r border-border-default z-30 flex flex-col justify-between py-space-md">
<div class="flex flex-col gap-space-xs px-space-sm">
<div class="px-space-sm py-space-2xs text-text-tertiary font-label-sm text-label-sm uppercase tracking-wider">Operations Core</div>
<nav class="flex flex-col gap-1" data-active-classes="bg-primary-fixed text-on-primary-fixed font-semibold">
<a aria-current="page" class="flex items-center gap-space-sm px-space-sm py-2.5 rounded-lg transition-colors bg-primary-fixed text-on-primary-fixed font-semibold" data-path="repayment-overview" href="#">
<span class="material-symbols-outlined text-[20px]">payments</span>
          Repayments
        </a>
<a class="flex items-center gap-space-sm px-space-sm py-2.5 rounded-lg text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors font-label-lg text-label-lg" data-path="loan-accounts" href="#">
<span class="material-symbols-outlined text-[20px]">account_balance</span>
          Loan Accounts
        </a>
<a class="flex items-center gap-space-sm px-space-sm py-2.5 rounded-lg text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors font-label-lg text-label-lg" data-path="overdue-queues" href="#">
<span class="material-symbols-outlined text-[20px]">warning</span>
          Delinquency Queue
        </a>
<a class="flex items-center gap-space-sm px-space-sm py-2.5 rounded-lg text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors font-label-lg text-label-lg" data-path="settlement-records" href="#">
<span class="material-symbols-outlined text-[20px]">receipt_long</span>
          Settlements
        </a>
</nav>
<div class="mt-space-md pt-space-sm border-t border-border-subtle px-space-sm py-space-2xs text-text-tertiary font-label-sm text-label-sm uppercase tracking-wider">Finance &amp; Audit</div>
<nav class="flex flex-col gap-1" data-active-classes="bg-primary-fixed text-on-primary-fixed font-semibold">
<a class="flex items-center gap-space-sm px-space-sm py-2.5 rounded-lg text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors font-label-lg text-label-lg" data-path="reconciliation-ledger" href="#">
<span class="material-symbols-outlined text-[20px]">sync_alt</span>
          Reconciliation
        </a>
<a class="flex items-center gap-space-sm px-space-sm py-2.5 rounded-lg text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors font-label-lg text-label-lg" data-path="audit-logs" href="#">
<span class="material-symbols-outlined text-[20px]">history</span>
          Audit Trail
        </a>
</nav>
</div>
<div class="px-space-md pt-space-sm border-t border-border-subtle">
<div class="flex items-center justify-between text-text-tertiary font-label-sm text-label-sm">
<span>Node v2.4.1</span>
<span class="inline-block w-2 h-2 rounded-full bg-status-paid"></span>
</div>
</div>
</aside>
<!-- Main Content Dashboard Container -->
<div class="pl-64">
<main class="relative pt-16 min-h-screen bg-surface-muted">
<div class="max-w-7xl mx-auto px-margin-desktop py-space-xl">
<div class="flex flex-col w-full gap-space-lg">
<!-- Top Operational Control & Loan Context Bar -->
<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md p-space-lg bg-surface-default rounded-xl border border-border-default shadow-sm">
<div class="flex flex-col sm:flex-row sm:items-center gap-space-md flex-1">
<div class="flex items-center gap-space-sm text-text-tertiary">
<span class="material-symbols-outlined text-[24px]">real_estate_agent</span>
<label class="font-label-sm text-label-sm uppercase tracking-wider text-text-secondary whitespace-nowrap" for="loan-picker">Active Account</label>
</div>
<!-- Custom Interactive Loan Selector -->
<div class="relative flex-1 max-w-xl">
<button class="w-full h-11 px-space-md bg-surface-muted hover:bg-surface-subtle border border-border-default hover:border-text-secondary rounded-lg flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 text-left" id="loanSelectorBtn" type="button">
<div class="flex items-center gap-space-sm min-w-0">
<span class="inline-flex items-center justify-center w-7 h-7 rounded-md bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold">LN</span>
<div class="flex flex-col min-w-0">
<div class="flex items-center gap-2">
<span class="font-headline-sm text-headline-sm text-text-primary tracking-tight truncate font-bold">LN-2031 · ₹2,00,000</span>
<span class="px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-status-paid-bg text-status-paid border border-status-paid/20">Active</span>
</div>
<span class="font-body-sm text-body-sm text-text-secondary truncate">Apex Retailers Pvt Ltd · Term Loan · 18 of 24 months completed</span>
</div>
</div>
<span class="material-symbols-outlined text-text-secondary ml-2 flex-shrink-0">unfold_more</span>
</button>
<!-- Dropdown Menu -->
<div class="hidden absolute top-full left-0 right-0 mt-1 z-30 bg-surface-default border border-border-default rounded-xl shadow-xl overflow-hidden" id="loanDropdownMenu">
<div class="p-2 border-b border-border-subtle bg-surface-muted">
<div class="relative">
<span class="material-symbols-outlined absolute left-2.5 top-2 text-text-tertiary text-[18px]">search</span>
<input class="w-full pl-8 pr-3 py-1.5 bg-surface-default border border-border-default rounded-md text-body-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary" placeholder="Search loan ID, business name, or GSTIN..." type="text"/>
</div>
</div>
<div class="max-h-60 overflow-y-auto divide-y divide-border-subtle">
<div class="p-3 bg-primary-fixed/20 flex items-center justify-between cursor-pointer hover:bg-primary-fixed/30">
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="font-label-lg text-label-lg font-bold text-text-primary">LN-2031 · ₹2,00,000</span>
<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-status-overdue-bg text-status-overdue border border-brand-pink-soft">Delinquent (1)</span>
</div>
<span class="font-body-sm text-body-sm text-text-secondary">Apex Retailers Pvt Ltd · Mumbai, MH</span>
</div>
<span class="material-symbols-outlined text-primary text-[20px]">check_circle</span>
</div>
<div class="p-3 flex items-center justify-between cursor-pointer hover:bg-surface-subtle transition-colors">
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="font-label-lg text-label-lg text-text-primary">LN-1984 · ₹5,00,000</span>
<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-status-paid-bg text-status-paid border border-status-paid/20">Current</span>
</div>
<span class="font-body-sm text-body-sm text-text-secondary">Bharat Logistics Hub · Pune, MH</span>
</div>
<span class="font-label-sm text-label-sm text-text-tertiary">#24/36</span>
</div>
<div class="p-3 flex items-center justify-between cursor-pointer hover:bg-surface-subtle transition-colors">
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="font-label-lg text-label-lg text-text-primary">LN-2009 · ₹1,50,000</span>
<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-status-paid-bg text-status-paid border border-status-paid/20">Current</span>
</div>
<span class="font-body-sm text-body-sm text-text-secondary">Zeno Medical Supplies · Bengaluru, KA</span>
</div>
<span class="font-label-sm text-label-sm text-text-tertiary">#12/12</span>
</div>
</div>
</div>
</div>
</div>
<!-- Quick Meta Indicators -->
<div class="flex items-center gap-space-md border-t lg:border-t-0 pt-space-sm lg:pt-0 border-border-subtle flex-shrink-0">
<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-subtle border border-border-default">
<span class="material-symbols-outlined text-text-secondary text-[18px]">verified_user</span>
<span class="font-body-sm text-body-sm text-text-secondary">Mandate: <strong class="text-text-primary font-medium">eNACH / Active</strong></span>
</div>
<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-subtle border border-border-default">
<span class="material-symbols-outlined text-text-secondary text-[18px]">percent</span>
<span class="font-body-sm text-body-sm text-text-secondary">ROI: <strong class="text-text-primary font-medium">16.5% p.a. Reducing</strong></span>
</div>
</div>
</div>
<!-- Metric / Summary Cards Strip -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
<!-- Card 1: Outstanding Principal -->
<div class="bg-surface-default rounded-xl p-5 border border-border-default shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
<div class="flex items-start justify-between">
<div>
<span class="font-label-sm text-label-sm uppercase tracking-wider text-text-secondary">Outstanding Principal</span>
<div class="font-numeral-hero text-numeral-hero text-text-primary tracking-tight mt-1 font-bold">₹84,500</div>
</div>
<div class="w-10 h-10 rounded-full bg-surface-subtle flex items-center justify-center text-text-secondary border border-border-default">
<span class="material-symbols-outlined text-[22px]">account_balance_wallet</span>
</div>
</div>
<div class="mt-4 pt-3 border-t border-border-subtle flex flex-col gap-1.5">
<div class="flex justify-between items-center text-body-sm font-body-sm">
<span class="text-text-secondary">Original ₹2,00,000</span>
<span class="font-semibold text-text-primary">57.7% Paid</span>
</div>
<div class="w-full bg-surface-subtle h-1.5 rounded-full overflow-hidden">
<div class="bg-text-primary h-full rounded-full" style="width: 57.75%"></div>
</div>
<span class="font-label-sm text-label-sm text-text-tertiary">14 instalments remaining in tenure</span>
</div>
</div>
<!-- Card 2: Next Due -->
<div class="bg-surface-default rounded-xl p-5 border border-border-default shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
<div class="flex items-start justify-between">
<div>
<span class="font-label-sm text-label-sm uppercase tracking-wider text-text-secondary">Next Due</span>
<div class="font-numeral-hero text-numeral-hero text-text-primary tracking-tight mt-1 font-bold">10 Nov 2024 · ₹12,450</div>
</div>
<div class="w-10 h-10 rounded-full bg-blue-50 text-tertiary-container flex items-center justify-center border border-blue-100">
<span class="material-symbols-outlined text-[22px]">event_upcoming</span>
</div>
</div>
<div class="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
<div class="flex items-center gap-1.5">
<span class="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
<span class="font-label-md text-label-md text-text-secondary">Instalment #19</span>
</div>
<span class="inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-blue-50 text-tertiary font-medium border border-blue-200">Due in 6 days</span>
</div>
</div>
<!-- Card 3: Overdue Amount -->
<div class="bg-surface-default rounded-xl p-5 border border-border-default shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between ring-1 ring-status-overdue/20">
<div class="absolute top-0 right-0 w-24 h-24 bg-status-overdue/5 rounded-bl-full pointer-events-none"></div>
<div class="flex items-start justify-between">
<div>
<div class="flex items-center gap-2">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-status-overdue font-semibold">Overdue Amount</span>
<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-status-overdue-bg text-status-overdue border border-brand-pink-soft uppercase">Action Required</span>
</div>
<div class="font-numeral-hero text-numeral-hero text-status-overdue tracking-tight mt-1 font-bold">₹12,450</div>
</div>
<div class="w-10 h-10 rounded-full bg-status-overdue-bg text-status-overdue flex items-center justify-center border border-brand-pink-soft">
<span class="material-symbols-outlined text-[22px]">error</span>
</div>
</div>
<div class="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
<div class="flex flex-col">
<span class="font-label-md text-label-md text-status-overdue font-semibold">1 instalment overdue (#18)</span>
<span class="font-body-sm text-body-sm text-text-secondary">Due Oct 10, 2024 · 25 days late</span>
</div>
<button class="font-label-sm text-label-sm text-status-overdue hover:underline flex items-center font-bold" type="button">
                  View Demand <span class="material-symbols-outlined text-[14px] ml-0.5">chevron_right</span>
</button>
</div>
</div>
</div>
<!-- Repayment Schedule Main Section -->
<div class="bg-surface-default rounded-xl border border-border-default shadow-sm flex flex-col overflow-hidden">
<!-- Schedule Control Header -->
<div class="p-space-lg border-b border-border-default flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
<div class="flex flex-col sm:flex-row sm:items-center gap-space-md">
<div class="flex items-center gap-2.5">
<h2 class="font-headline-md text-headline-md text-text-primary tracking-tight font-bold">Repayment Schedule</h2>
<span class="inline-flex items-center px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-surface-subtle text-text-secondary border border-border-default font-semibold">
                    24 Instalments · <span class="text-status-overdue ml-1">1 Overdue</span>
</span>
</div>
<!-- Filter Status Tabs -->
<div class="inline-flex p-1 bg-surface-subtle rounded-lg border border-border-default text-text-secondary">
<button class="schedule-tab-btn active px-3 py-1 rounded-md font-label-sm text-label-sm font-semibold bg-surface-default text-text-primary shadow-xs" data-filter="all" type="button">All (24)</button>
<button class="schedule-tab-btn px-3 py-1 rounded-md font-label-sm text-label-sm text-text-secondary hover:text-text-primary" data-filter="overdue" type="button">Overdue (1)</button>
<button class="schedule-tab-btn px-3 py-1 rounded-md font-label-sm text-label-sm text-text-secondary hover:text-text-primary" data-filter="pending" type="button">Pending (6)</button>
<button class="schedule-tab-btn px-3 py-1 rounded-md font-label-sm text-label-sm text-text-secondary hover:text-text-primary" data-filter="paid" type="button">Paid (17)</button>
</div>
</div>
<!-- Action Cluster -->
<div class="flex items-center gap-space-sm flex-wrap">
<button class="h-10 px-4 rounded-full bg-surface-default border border-border-default hover:border-text-secondary text-text-primary hover:bg-surface-muted font-label-md text-label-md flex items-center gap-2 transition-colors" type="button">
<span class="material-symbols-outlined text-[18px] text-text-secondary">download</span>
<span>Ledger PDF</span>
</button>
<button class="h-10 px-4 rounded-full bg-surface-default border border-border-default hover:border-text-secondary text-text-primary hover:bg-surface-muted font-label-md text-label-md flex items-center gap-2 transition-colors" type="button">
<span class="material-symbols-outlined text-[18px] text-text-secondary">grid_on</span>
<span>Export CSV</span>
</button>
<button class="h-10 px-5 rounded-full bg-primary-container hover:bg-[#D01252] text-on-primary font-label-lg text-label-lg shadow-sm flex items-center gap-2 transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" id="recordPaymentBtn" type="button">
<span class="material-symbols-outlined text-[18px]">add_circle</span>
<span>Record Payment</span>
</button>
</div>
</div>
<!-- Data Table Container -->
<div class="overflow-x-auto">
<table class="w-full border-collapse text-left">
<thead>
<tr class="bg-surface-muted h-10 border-b border-border-default font-label-sm text-label-sm text-text-secondary uppercase tracking-wider select-none">
<th class="py-2.5 px-4 w-12 text-center">#</th>
<th class="py-2.5 px-4 min-w-[120px]">Due Date</th>
<th class="py-2.5 px-4 text-right min-w-[110px]">Principal</th>
<th class="py-2.5 px-4 text-right min-w-[100px]">Interest</th>
<th class="py-2.5 px-4 text-right min-w-[110px]">Total Due</th>
<th class="py-2.5 px-4 text-right min-w-[110px]">Amount Paid</th>
<th class="py-2.5 px-4 text-center min-w-[130px]">Status</th>
<th class="py-2.5 px-4 text-center w-24">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-border-subtle font-numeral-data text-numeral-data text-text-primary" id="scheduleTableBody">
<!-- Row 15 - Paid -->
<tr class="h-12 hover:bg-slate-50/75 transition-colors group">
<td class="px-4 text-center font-bold text-text-secondary">15</td>
<td class="px-4 whitespace-nowrap text-text-secondary font-medium">10 Jul 2024</td>
<td class="px-4 text-right font-mono text-text-secondary">₹11,150.00</td>
<td class="px-4 text-right font-mono text-text-secondary">₹1,300.00</td>
<td class="px-4 text-right font-mono font-medium">₹12,450.00</td>
<td class="px-4 text-right font-mono text-status-paid font-medium">₹12,450.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span>
</td>
<td class="px-4 text-center">
<button class="text-text-tertiary hover:text-text-primary p-1 rounded hover:bg-surface-subtle" title="View Receipt" type="button">
<span class="material-symbols-outlined text-[18px]">receipt</span>
</button>
</td>
</tr>
<!-- Row 16 - Paid -->
<tr class="h-12 hover:bg-slate-50/75 transition-colors group">
<td class="px-4 text-center font-bold text-text-secondary">16</td>
<td class="px-4 whitespace-nowrap text-text-secondary font-medium">10 Aug 2024</td>
<td class="px-4 text-right font-mono text-text-secondary">₹11,300.00</td>
<td class="px-4 text-right font-mono text-text-secondary">₹1,150.00</td>
<td class="px-4 text-right font-mono font-medium">₹12,450.00</td>
<td class="px-4 text-right font-mono text-status-paid font-medium">₹12,450.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span>
</td>
<td class="px-4 text-center">
<button class="text-text-tertiary hover:text-text-primary p-1 rounded hover:bg-surface-subtle" title="View Receipt" type="button">
<span class="material-symbols-outlined text-[18px]">receipt</span>
</button>
</td>
</tr>
<!-- Row 17 - Paid -->
<tr class="h-12 hover:bg-slate-50/75 transition-colors group">
<td class="px-4 text-center font-bold text-text-secondary">17</td>
<td class="px-4 whitespace-nowrap text-text-secondary font-medium">10 Sep 2024</td>
<td class="px-4 text-right font-mono text-text-secondary">₹11,460.00</td>
<td class="px-4 text-right font-mono text-text-secondary">₹990.00</td>
<td class="px-4 text-right font-mono font-medium">₹12,450.00</td>
<td class="px-4 text-right font-mono text-status-paid font-medium">₹12,450.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span>
</td>
<td class="px-4 text-center">
<button class="text-text-tertiary hover:text-text-primary p-1 rounded hover:bg-surface-subtle" title="View Receipt" type="button">
<span class="material-symbols-outlined text-[18px]">receipt</span>
</button>
</td>
</tr>
<!-- Row 18 - Overdue -->
<tr class="h-12 border-l-4 border-l-rose-500 bg-rose-50/20 hover:bg-rose-50/40 transition-colors group">
<td class="px-4 text-center font-bold text-status-overdue">18</td>
<td class="px-4 whitespace-nowrap font-medium text-status-overdue flex items-center gap-1.5 pt-3.5">
<span>10 Oct 2024</span>
<span class="material-symbols-outlined text-[16px]">warning</span>
</td>
<td class="px-4 text-right font-mono text-text-primary font-medium">₹11,620.00</td>
<td class="px-4 text-right font-mono text-text-primary font-medium">₹830.00</td>
<td class="px-4 text-right font-mono font-bold text-status-overdue">₹12,450.00</td>
<td class="px-4 text-right font-mono text-status-overdue font-bold">₹0.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-rose-50 text-rose-700 border border-rose-200 font-semibold">Overdue</span>
</td>
<td class="px-4 text-center">
<div class="flex items-center justify-center gap-1">
<button class="text-status-overdue hover:text-[#900037] p-1 rounded hover:bg-rose-100/50" title="Send Demand Notice" type="button">
<span class="material-symbols-outlined text-[18px]">forward_to_inbox</span>
</button>
<button class="text-primary hover:text-primary-container p-1 rounded hover:bg-primary-fixed" title="Instant Settle" type="button">
<span class="material-symbols-outlined text-[18px]">payments</span>
</button>
</div>
</td>
</tr>
<!-- Row 19 - Next Pending -->
<tr class="h-12 hover:bg-slate-50/75 transition-colors group bg-blue-50/10">
<td class="px-4 text-center font-bold text-text-primary">19</td>
<td class="px-4 whitespace-nowrap font-medium text-text-primary">
                      10 Nov 2024
                      <span class="ml-1 text-[11px] text-tertiary font-semibold">(Next)</span>
</td>
<td class="px-4 text-right font-mono text-text-secondary">₹11,780.00</td>
<td class="px-4 text-right font-mono text-text-secondary">₹670.00</td>
<td class="px-4 text-right font-mono font-medium">₹12,450.00</td>
<td class="px-4 text-right font-mono text-text-tertiary">₹0.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-slate-100 text-slate-600 border border-slate-200">Pending</span>
</td>
<td class="px-4 text-center">
<button class="text-text-tertiary hover:text-text-primary p-1 rounded hover:bg-surface-subtle" title="Schedule Auto-debit" type="button">
<span class="material-symbols-outlined text-[18px]">schedule</span>
</button>
</td>
</tr>
<!-- Row 20 - Pending -->
<tr class="h-12 hover:bg-slate-50/75 transition-colors group">
<td class="px-4 text-center font-bold text-text-secondary">20</td>
<td class="px-4 whitespace-nowrap text-text-secondary font-medium">10 Dec 2024</td>
<td class="px-4 text-right font-mono text-text-secondary">₹11,940.00</td>
<td class="px-4 text-right font-mono text-text-secondary">₹510.00</td>
<td class="px-4 text-right font-mono font-medium">₹12,450.00</td>
<td class="px-4 text-right font-mono text-text-tertiary">₹0.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-slate-100 text-slate-600 border border-slate-200">Pending</span>
</td>
<td class="px-4 text-center">
<button class="text-text-tertiary hover:text-text-primary p-1 rounded hover:bg-surface-subtle" type="button">
<span class="material-symbols-outlined text-[18px]">more_horiz</span>
</button>
</td>
</tr>
<!-- Row 21 - Pending -->
<tr class="h-12 hover:bg-slate-50/75 transition-colors group">
<td class="px-4 text-center font-bold text-text-secondary">21</td>
<td class="px-4 whitespace-nowrap text-text-secondary font-medium">10 Jan 2025</td>
<td class="px-4 text-right font-mono text-text-secondary">₹12,100.00</td>
<td class="px-4 text-right font-mono text-text-secondary">₹350.00</td>
<td class="px-4 text-right font-mono font-medium">₹12,450.00</td>
<td class="px-4 text-right font-mono text-text-tertiary">₹0.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-slate-100 text-slate-600 border border-slate-200">Pending</span>
</td>
<td class="px-4 text-center">
<button class="text-text-tertiary hover:text-text-primary p-1 rounded hover:bg-surface-subtle" type="button">
<span class="material-symbols-outlined text-[18px]">more_horiz</span>
</button>
</td>
</tr>
<!-- Row 22 - Pending -->
<tr class="h-12 hover:bg-slate-50/75 transition-colors group">
<td class="px-4 text-center font-bold text-text-secondary">22</td>
<td class="px-4 whitespace-nowrap text-text-secondary font-medium">10 Feb 2025</td>
<td class="px-4 text-right font-mono text-text-secondary">₹12,270.00</td>
<td class="px-4 text-right font-mono text-text-secondary">₹180.00</td>
<td class="px-4 text-right font-mono font-medium">₹12,450.00</td>
<td class="px-4 text-right font-mono text-text-tertiary">₹0.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-slate-100 text-slate-600 border border-slate-200">Pending</span>
</td>
<td class="px-4 text-center">
<button class="text-text-tertiary hover:text-text-primary p-1 rounded hover:bg-surface-subtle" type="button">
<span class="material-symbols-outlined text-[18px]">more_horiz</span>
</button>
</td>
</tr>
<!-- Row 23 - Pending -->
<tr class="h-12 hover:bg-slate-50/75 transition-colors group">
<td class="px-4 text-center font-bold text-text-secondary">23</td>
<td class="px-4 whitespace-nowrap text-text-secondary font-medium">10 Mar 2025</td>
<td class="px-4 text-right font-mono text-text-secondary">₹12,360.00</td>
<td class="px-4 text-right font-mono text-text-secondary">₹90.00</td>
<td class="px-4 text-right font-mono font-medium">₹12,450.00</td>
<td class="px-4 text-right font-mono text-text-tertiary">₹0.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-slate-100 text-slate-600 border border-slate-200">Pending</span>
</td>
<td class="px-4 text-center">
<button class="text-text-tertiary hover:text-text-primary p-1 rounded hover:bg-surface-subtle" type="button">
<span class="material-symbols-outlined text-[18px]">more_horiz</span>
</button>
</td>
</tr>
<!-- Row 24 - Final Closure Pending -->
<tr class="h-12 hover:bg-slate-50/75 transition-colors group">
<td class="px-4 text-center font-bold text-text-secondary">24</td>
<td class="px-4 whitespace-nowrap text-text-secondary font-medium">
                      10 Apr 2025
                      <span class="ml-1 text-[11px] text-text-tertiary uppercase font-bold">(Maturity)</span>
</td>
<td class="px-4 text-right font-mono text-text-secondary">₹12,420.00</td>
<td class="px-4 text-right font-mono text-text-secondary">₹30.00</td>
<td class="px-4 text-right font-mono font-medium">₹12,450.00</td>
<td class="px-4 text-right font-mono text-text-tertiary">₹0.00</td>
<td class="px-4 text-center">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-slate-100 text-slate-600 border border-slate-200">Pending</span>
</td>
<td class="px-4 text-center">
<button class="text-text-tertiary hover:text-text-primary p-1 rounded hover:bg-surface-subtle" type="button">
<span class="material-symbols-outlined text-[18px]">more_horiz</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Table Pagination & Ledger Audit Footer -->
<div class="px-space-lg py-space-sm bg-surface-muted border-t border-border-default flex flex-col sm:flex-row items-center justify-between gap-space-sm">
<div class="flex items-center gap-space-md text-text-secondary font-body-sm text-body-sm">
<span>Showing Instalments <strong>15 to 24</strong> of 24</span>
<div class="h-3 w-px bg-border-default"></div>
<span class="inline-flex items-center gap-1">
<span class="inline-block w-2 h-2 rounded-full bg-status-paid"></span>
                  Ledger verified against RBI CBS Node
                </span>
</div>
<div class="flex items-center gap-space-xs">
<button class="px-3 py-1.5 rounded-lg border border-border-default bg-surface-default hover:bg-surface-subtle text-text-secondary font-label-sm text-label-sm flex items-center gap-1 transition-colors" type="button">
<span class="material-symbols-outlined text-[16px]">chevron_left</span>
<span>Previous 10</span>
</button>
<span class="px-3 py-1 font-label-sm text-label-sm font-semibold text-text-primary">Page 2 of 2</span>
<button class="px-3 py-1.5 rounded-lg border border-border-default bg-surface-default opacity-50 cursor-not-allowed text-text-tertiary font-label-sm text-label-sm flex items-center gap-1" disabled="" type="button">
<span>Next</span>
<span class="material-symbols-outlined text-[16px]">chevron_right</span>
</button>
</div>
</div>
</div>
</div>
</div>
</main>
</div>
<!-- Rebuilt Solid Opaque Record Payment Modal -->
<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" id="paymentModalBackdrop">
<div class="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
<!-- Modal Header -->
<div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
<div class="flex flex-col gap-1">
<h3 class="font-headline-md text-[20px] font-bold text-slate-900 tracking-tight">Record a Payment</h3>
<div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium w-fit">
<span class="w-2 h-2 rounded-full bg-[#E3195E]"></span>
<span>LN-2031 · Apex Retailers Pvt Ltd</span>
</div>
</div>
<button class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 hover:bg-slate-100 transition-colors focus:outline-none" id="closePaymentModal" type="button">
<span class="material-symbols-outlined text-[22px]">close</span>
</button>
</div>
<!-- Modal Form -->
<form class="p-6 flex flex-col space-y-5 bg-white" onsubmit="event.preventDefault(); alert('Repayment recorded successfully.'); document.getElementById('paymentModalBackdrop').classList.add('hidden');">
<!-- Amount Field -->
<div><label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" for="amountInput">Amount (₹)</label><div class="relative flex items-center"><span class="absolute left-3.5 text-rose-700 font-semibold text-base pointer-events-none">₹</span><input class="w-full bg-rose-50/20 border border-rose-200 rounded-lg pl-8 pr-10 py-2.5 text-base font-semibold text-slate-900 focus:ring-2 focus:ring-[#E3195E] focus:border-[#E3195E] outline-none transition-shadow" id="amountInput" required="" type="text" value="0"/><span class="material-symbols-outlined text-rose-700 text-[20px] absolute right-3 pointer-events-none">error</span></div><p class="mt-1.5 text-xs text-rose-700 font-medium flex items-center gap-1.5"><span class="material-symbols-outlined text-[16px]">warning</span><span>Amount must be greater than 0</span></p><p class="mt-1 text-xs text-slate-400 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Overdue instalment #18 · Due ₹12,450</p></div>
<!-- Payment Date Field -->
<div>
<label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" for="paymentDate">Payment Date</label>
<input class="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-[#E3195E] focus:border-[#E3195E] outline-none transition-shadow" id="paymentDate" required="" type="date" value="2024-11-04"/>
</div>
<!-- Payment Mode Field -->
<div>
<label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" for="paymentMode">Payment Mode</label>
<select class="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-[#E3195E] focus:border-[#E3195E] outline-none transition-shadow cursor-pointer" id="paymentMode">
<option selected="">Netbanking / NEFT / RTGS</option>
<option>UPI</option>
<option>NACH Mandate</option>
<option>Cheque / DD</option>
<option>Cash Deposit</option>
</select>
</div>
<!-- Reference / UTR Field -->
<div>
<label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" for="utrNumber">Reference / UTR Number</label>
<input class="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#E3195E] focus:border-[#E3195E] outline-none transition-shadow" id="utrNumber" placeholder="e.g. UTR-HDFC984210984" type="text"/>
</div>
<!-- Notice Callout -->
<div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2.5">
<span class="material-symbols-outlined text-[18px] text-amber-600 flex-shrink-0 mt-0.5">info</span>
<span class="leading-relaxed">This payment will be allocated to the oldest unpaid instalment first (Instalment #18 Overdue).</span>
</div>
<!-- Modal Footer / Actions -->
<div class="border-t border-slate-100 pt-4 flex items-center justify-end gap-3">
<button class="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-full transition-colors focus:outline-none" id="cancelPaymentModal" type="button">
            Cancel
          </button>
<button class="px-6 py-2.5 text-sm font-semibold text-white bg-[#E3195E] opacity-50 cursor-not-allowed shadow-sm rounded-full transition-colors focus:outline-none" disabled="" type="submit">Submit Payment</button>
</div>
</form>
</div>
</div>
<script>
    // Dropdown toggle logic
    const loanSelectorBtn = document.getElementById('loanSelectorBtn');
    const loanDropdownMenu = document.getElementById('loanDropdownMenu');

    if (loanSelectorBtn && loanDropdownMenu) {
      loanSelectorBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        loanDropdownMenu.classList.toggle('hidden');
      });

      document.addEventListener('click', (e) => {
        if (!loanSelectorBtn.contains(e.target) && !loanDropdownMenu.contains(e.target)) {
          loanDropdownMenu.classList.add('hidden');
        }
      });
    }

    // Payment Recording Modal Controls
    const recordPaymentBtn = document.getElementById('recordPaymentBtn');
    const paymentModalBackdrop = document.getElementById('paymentModalBackdrop');
    const closePaymentModal = document.getElementById('closePaymentModal');
    const cancelPaymentModal = document.getElementById('cancelPaymentModal');

    if (recordPaymentBtn && paymentModalBackdrop) {
      recordPaymentBtn.addEventListener('click', () => {
        paymentModalBackdrop.classList.remove('hidden');
      });

      const closeModal = () => paymentModalBackdrop.classList.add('hidden');
      if (closePaymentModal) closePaymentModal.addEventListener('click', closeModal);
      if (cancelPaymentModal) cancelPaymentModal.addEventListener('click', closeModal);

      paymentModalBackdrop.addEventListener('click', (e) => {
        if (e.target === paymentModalBackdrop) closeModal();
      });
    }

    // Quick tabs interaction
    const tabs = document.querySelectorAll('.schedule-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active', 'bg-surface-default', 'text-text-primary', 'shadow-xs');
          t.classList.add('text-text-secondary');
        });
        tab.classList.add('active', 'bg-surface-default', 'text-text-primary', 'shadow-xs');
        tab.classList.remove('text-text-secondary');
      });
    });
  </script>
</body></html>

<!-- Loan Repayment Service - Payment Modal (Validation Error) -->
<!DOCTYPE html>

<html class="h-full" lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" name="viewport"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{width:100%;min-height:100%;margin:0;padding:0;}body{overscroll-behavior-y:none;background-color:#fbf8ff;}.pb-safe{padding-bottom:env(safe-area-inset-bottom,0px);}.pt-safe{padding-top:env(safe-area-inset-top,0px);}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { colors: { "on-error": "#ffffff", "status-pending": "#6B6B76", "border-subtle": "#F0F0F3", "on-secondary-fixed": "#1b1b24", "on-tertiary-fixed": "#001a42", "surface-muted": "#F7F7F9", "surface-variant": "#e3e1ee", "surface-dim": "#dad9e5", "surface-container-high": "#e8e7f4", "on-tertiary": "#ffffff", "on-secondary-fixed-variant": "#464650", "outline-variant": "#e4bdc1", "on-primary": "#ffffff", "primary-container": "#e3195e", "on-error-container": "#93000a", "primary": "#b90049", "inverse-surface": "#2f3039", "primary-fixed-dim": "#ffb2bd", "status-partially-paid": "#F2994A", "primary-fixed": "#ffd9dd", "surface-container": "#eeecf9", "secondary-container": "#e1deeb", "status-overdue-bg": "#FDF2F4", "secondary-fixed-dim": "#c7c5d2", "on-surface-variant": "#5b3f43", "on-surface": "#1a1b24", "on-primary-fixed-variant": "#900037", "surface-container-highest": "#e3e1ee", "surface-subtle": "#F1F2F4", "background": "#fbf8ff", "surface-bright": "#fbf8ff", "on-tertiary-container": "#fffdff", "surface": "#fbf8ff", "outline": "#8f6f73", "tertiary-fixed-dim": "#adc6ff", "secondary": "#5e5d68", "surface-tint": "#bd004a", "status-pending-bg": "#F3F4F6", "tertiary-container": "#2271e4", "secondary-fixed": "#e4e1ee", "surface-container-lowest": "#ffffff", "status-partially-paid-bg": "#FFF7ED", "status-paid": "#10B981", "on-primary-container": "#fffdff", "status-paid-bg": "#ECFDF5", "inverse-on-surface": "#f1effc", "tertiary": "#0058bf", "surface-container-low": "#f4f2ff", "error-container": "#ffdad6", "text-primary": "#12121A", "text-tertiary": "#9CA3AF", "on-background": "#1a1b24", "surface-default": "#FFFFFF", "tertiary-fixed": "#d8e2ff", "on-tertiary-fixed-variant": "#004395", "brand-pink-soft": "#F9C4D2", "on-secondary": "#ffffff", "on-secondary-container": "#62616d", "status-overdue": "#E3195E", "error": "#ba1a1a", "inverse-primary": "#ffb2bd", "text-secondary": "#6B6B76", "on-primary-fixed": "#400014", "border-default": "#E7E7EC" }, borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" }, spacing: { "gutter": "1rem", "margin-desktop": "2rem", "space-sm": "0.75rem", "margin": "1rem", "space-2xs": "0.25rem", "space-xl": "2rem", "space-lg": "1.5rem", "space-md": "1rem", "gutter-desktop": "1.5rem", "space-2xl": "3rem", "space-xs": "0.5rem" }, fontFamily: { "headline-xl": ["Inter"], "body-sm": ["Inter"], "label-sm": ["Inter"], "headline-md": ["Inter"], "headline-lg": ["Inter"], "label-md": ["Inter"], "headline-sm": ["Inter"], "body-lg": ["Inter"], "numeral-hero": ["Inter"], "label-lg": ["Inter"], "numeral-data": ["Inter"], "body-md": ["Inter"] }, fontSize: { "headline-xl": ["32px", { lineHeight: "40px", letterSpacing: "-0.025em", fontWeight: "800" }], "body-sm": ["12px", { lineHeight: "16px", letterSpacing: "0em", fontWeight: "400" }], "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.04em", fontWeight: "600" }], "headline-md": ["18px", { lineHeight: "24px", letterSpacing: "-0.015em", fontWeight: "600" }], "headline-lg": ["24px", { lineHeight: "32px", letterSpacing: "-0.02em", fontWeight: "700" }], "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "600" }], "headline-sm": ["16px", { lineHeight: "22px", letterSpacing: "-0.01em", fontWeight: "600" }], "body-lg": ["16px", { lineHeight: "24px", letterSpacing: "-0.005em", fontWeight: "400" }], "numeral-hero": ["28px", { lineHeight: "36px", letterSpacing: "-0.02em", fontWeight: "700" }], "label-lg": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "600" }], "numeral-data": ["14px", { lineHeight: "20px", letterSpacing: "0em", fontWeight: "500" }], "body-md": ["14px", { lineHeight: "20px", letterSpacing: "0em", fontWeight: "400" }] } } } };</script></head><body class="bg-surface font-body-md text-text-primary min-h-screen flex flex-col antialiased selection:bg-brand-pink-soft selection:text-text-primary"><header class="fixed top-0 w-full z-50 pt-safe bg-surface-default/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(14,14,23,0.04)]"><div class="h-14 px-gutter flex items-center justify-between"><div class="flex items-center gap-space-xs"><img alt="Brand logo. - Primary color: #e3195e
- Font: inter
- Mode: light
- Roundness: rounded-md
" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1WOKAhl3yGKwaiFtEnY50T2o5usEXmKzWOgash-FZaXrJTu4o8ehXaKsjqLGQNzT9C3EWlCroYsWkbBR2r1uEc_uIGVeR4o3HLoFKqZlUXZj3-kt6fNdUzlpNBPqyghQ99XhXbwO55xE8k-PkR9PQ4nz3XnZ2oAB3AghDVuAUWtg0ppWBrq-H0N_WezRcfMeCh7yhW8xEfsORxQ6gPAyi5G3B8MjOJUqDuiiSX2XoZQUD-JHlpCWXeaKKw"/><div class="flex flex-col"><div class="flex items-center gap-space-2xs"><span class="font-headline-sm text-headline-sm text-text-primary">Vitto</span><span class="px-1.5 py-0.5 rounded-full bg-status-overdue-bg text-status-overdue font-label-sm text-[10px] uppercase tracking-wider">INTERNAL OPS</span></div><span class="font-label-sm text-label-sm text-text-secondary truncate max-w-[130px]">Repayments Hub</span></div></div><div class="flex items-center gap-space-xs"><button aria-label="Notifications" class="w-11 h-11 flex items-center justify-center rounded-full text-text-secondary hover:text-text-primary transition-colors active:bg-surface-muted" type="button"><span class="material-symbols-outlined text-[20px]">notifications</span></button><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center ring-2 ring-surface-default"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="flex-1 flex flex-col relative w-full pt-14 pb-24 bg-surface"><div class="flex flex-col w-full px-gutter gap-space-md">
<!-- Active Account Banner -->
<section class="w-full bg-surface-default rounded-xl shadow-sm p-space-md flex flex-col gap-space-xs">
<div class="flex items-center justify-between gap-space-xs">
<div class="flex items-center gap-space-xs min-w-0">
<span class="font-headline-sm text-headline-sm text-text-primary truncate">LN-2031 · ₹2,00,000</span>
</div>
<span class="inline-flex items-center px-2 py-0.5 rounded-full bg-status-paid-bg text-status-paid font-label-sm text-label-sm">
        ACTIVE
      </span>
</div>
<p class="font-body-sm text-body-sm text-text-secondary truncate">
      Apex Retailers Pvt Ltd · Term Loan · 18 of 24 mos completed
    </p>
<div class="flex flex-wrap items-center gap-space-xs pt-space-2xs">
<div class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-muted text-text-primary font-label-sm text-label-sm">
<span class="material-symbols-outlined text-[14px] text-status-paid">check_circle</span>
        eNACH / Active
      </div>
<div class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-muted text-text-secondary font-label-sm text-label-sm">
<span class="material-symbols-outlined text-[14px] text-text-tertiary">percent</span>
        ROI: 16.5% p.a.
      </div>
</div>
</section>
<!-- Summary Metric Cards (Stacked Vertically) -->
<section class="flex flex-col gap-space-sm w-full">
<!-- Card 3 (High Visual Priority Overdue Alert shifted to top of stack) -->
<div class="w-full bg-status-overdue-bg rounded-xl p-space-md shadow-sm flex flex-col gap-space-xs relative overflow-hidden">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-status-overdue">OVERDUE AMOUNT</span>
<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-[10px] tracking-wider">
<span class="material-symbols-outlined text-[12px]">warning</span>
          ACTION REQUIRED
        </span>
</div>
<div class="flex items-baseline justify-between mt-0.5">
<span class="font-numeral-hero text-numeral-hero text-status-overdue">₹12,450</span>
<a class="inline-flex items-center gap-0.5 font-label-md text-label-md text-status-overdue hover:underline" href="#">
          View Demand <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">
        1 instalment overdue (#18) · Due Oct 10, 2024 · <strong class="font-semibold text-status-overdue">25 days late</strong>
</p>
</div>
<!-- Card 1: Outstanding Principal -->
<div class="w-full bg-surface-default rounded-xl p-space-md shadow-sm flex flex-col gap-space-xs">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-text-secondary">OUTSTANDING PRINCIPAL</span>
<span class="font-label-sm text-label-sm text-text-secondary">14 instalments left</span>
</div>
<div class="flex items-baseline gap-space-xs mt-0.5">
<span class="font-numeral-hero text-numeral-hero text-text-primary">₹84,500</span>
</div>
<div class="w-full bg-surface-muted rounded-full h-2 overflow-hidden mt-1">
<div class="bg-primary-container h-full rounded-full" style="width: 57.7%;"></div>
</div>
<div class="flex justify-between items-center text-text-secondary font-label-sm text-label-sm pt-0.5">
<span>Original ₹2,00,000</span>
<span class="text-text-primary font-semibold">57.7% Paid</span>
</div>
</div>
<!-- Card 2: Next Due -->
<div class="w-full bg-surface-default rounded-xl p-space-md shadow-sm flex flex-col gap-space-xs">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-text-secondary">UPCOMING SCHEDULED DUE</span>
<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-partially-paid-bg text-status-partially-paid font-label-sm text-label-sm">
<span class="material-symbols-outlined text-[13px]">schedule</span>
          Due in 6 days
        </span>
</div>
<div class="flex items-baseline justify-between mt-0.5">
<span class="font-headline-lg text-headline-lg text-text-primary">10 Nov 2024</span>
<span class="font-headline-lg text-headline-lg text-text-primary">₹12,450</span>
</div>
<p class="font-body-sm text-body-sm text-text-secondary">
        Instalment #19 · Auto-debit via HDFC eNACH
      </p>
</div>
</section>
<!-- Action & Filter Bar -->
<section class="flex flex-col gap-space-sm w-full pt-space-xs">
<div class="flex items-center justify-between gap-space-xs">
<div class="flex flex-col min-w-0">
<h2 class="font-headline-sm text-headline-sm text-text-primary truncate">Repayment Schedule</h2>
<span class="font-body-sm text-body-sm text-text-secondary">24 Instalments · 1 Overdue</span>
</div>
<button class="inline-flex items-center justify-center gap-1.5 px-4 h-10 rounded-full bg-primary-container text-on-primary-container shadow-sm active:scale-95 transition-transform font-label-lg text-label-lg" type="button">
<span class="material-symbols-outlined text-[18px]">add_circle</span>
<span>Record</span>
</button>
</div>
<!-- Filters & Formats -->
<div class="flex items-center justify-between gap-space-xs">
<!-- Horizontal Scroll Filter Pills -->
<div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
<button class="px-3 py-1.5 rounded-full bg-surface-muted text-text-secondary font-label-sm text-label-sm whitespace-nowrap active:bg-surface-variant" type="button">
          All (24)
        </button>
<button class="px-3 py-1.5 rounded-full bg-status-overdue-bg text-status-overdue font-label-sm text-label-sm whitespace-nowrap shadow-sm" type="button">
          Overdue (1)
        </button>
<button class="px-3 py-1.5 rounded-full bg-surface-muted text-text-secondary font-label-sm text-label-sm whitespace-nowrap active:bg-surface-variant" type="button">
          Pending (6)
        </button>
<button class="px-3 py-1.5 rounded-full bg-surface-muted text-text-secondary font-label-sm text-label-sm whitespace-nowrap active:bg-surface-variant" type="button">
          Paid (17)
        </button>
</div>
<!-- Export Shortcuts -->
<div class="flex items-center gap-1 shrink-0">
<button aria-label="Export PDF" class="h-8 px-2.5 rounded-full bg-surface-muted hover:bg-surface-variant text-text-secondary flex items-center gap-1 font-label-sm text-label-sm" type="button">
<span class="material-symbols-outlined text-[14px]">picture_as_pdf</span>
          PDF
        </button>
<button aria-label="Export CSV" class="h-8 px-2 rounded-full bg-surface-muted hover:bg-surface-variant text-text-secondary flex items-center justify-center" type="button">
<span class="material-symbols-outlined text-[16px]">csv</span>
</button>
</div>
</div>
</section>
<!-- Repayment Schedule Stacked Cards -->
<section class="flex flex-col gap-space-sm w-full">
<!-- Card: Instalment #18 (Overdue) -->
<article class="w-full bg-surface-default rounded-xl shadow-sm p-space-md flex flex-col gap-space-sm relative">
<!-- Header -->
<div class="flex items-center justify-between">
<div class="flex items-center gap-1.5">
<span class="font-headline-sm text-headline-sm text-status-overdue">#18</span>
<span class="font-label-md text-label-md text-text-primary">· 10 Oct 2024</span>
<span class="material-symbols-outlined text-[16px] text-status-overdue" title="Overdue">error</span>
</div>
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-status-overdue-bg text-status-overdue font-label-sm text-label-sm">
          OVERDUE
        </span>
</div>
<!-- Key-Value Grid -->
<div class="grid grid-cols-2 gap-x-space-md gap-y-space-2xs bg-surface-muted/60 p-space-sm rounded-lg">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-text-secondary">Principal</span>
<span class="font-numeral-data text-numeral-data text-text-primary">₹11,620.00</span>
</div>
<div class="flex flex-col text-right">
<span class="font-label-sm text-label-sm text-text-secondary">Interest</span>
<span class="font-numeral-data text-numeral-data text-text-primary">₹830.00</span>
</div>
<div class="flex flex-col pt-1">
<span class="font-label-sm text-label-sm text-text-secondary">Total Due</span>
<span class="font-headline-sm text-headline-sm text-status-overdue">₹12,450.00</span>
</div>
<div class="flex flex-col text-right pt-1">
<span class="font-label-sm text-label-sm text-text-secondary">Amount Paid</span>
<span class="font-numeral-data text-numeral-data text-status-overdue font-bold">₹0.00</span>
</div>
</div>
<!-- Card Action Footer -->
<div class="flex items-center justify-between pt-space-2xs">
<span class="font-label-sm text-label-sm text-status-overdue flex items-center gap-1">
<span class="material-symbols-outlined text-[15px]">timer</span>
          25 days delayed
        </span>
<button class="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md shadow-sm active:scale-95 transition-transform" type="button">
<span>Pay Now</span>
<span class="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
</article>
<!-- Card: Instalment #19 (Pending / Next Due) -->
<article class="w-full bg-surface-default rounded-xl shadow-sm p-space-md flex flex-col gap-space-sm">
<!-- Header -->
<div class="flex items-center justify-between">
<div class="flex items-center gap-1.5">
<span class="font-headline-sm text-headline-sm text-text-primary">#19</span>
<span class="font-label-md text-label-md text-text-primary">· 10 Nov 2024</span>
</div>
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-status-pending-bg text-status-pending font-label-sm text-label-sm">
          PENDING
        </span>
</div>
<!-- Key-Value Grid -->
<div class="grid grid-cols-2 gap-x-space-md gap-y-space-2xs bg-surface-muted/60 p-space-sm rounded-lg">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-text-secondary">Principal</span>
<span class="font-numeral-data text-numeral-data text-text-primary">₹11,780.00</span>
</div>
<div class="flex flex-col text-right">
<span class="font-label-sm text-label-sm text-text-secondary">Interest</span>
<span class="font-numeral-data text-numeral-data text-text-primary">₹670.00</span>
</div>
<div class="flex flex-col pt-1">
<span class="font-label-sm text-label-sm text-text-secondary">Total Due</span>
<span class="font-headline-sm text-headline-sm text-text-primary">₹12,450.00</span>
</div>
<div class="flex flex-col text-right pt-1">
<span class="font-label-sm text-label-sm text-text-secondary">Amount Paid</span>
<span class="font-numeral-data text-numeral-data text-text-secondary">₹0.00</span>
</div>
</div>
<!-- Card Action Footer -->
<div class="flex items-center justify-between pt-space-2xs">
<span class="font-label-sm text-label-sm text-text-secondary flex items-center gap-1">
<span class="material-symbols-outlined text-[15px]">lock_clock</span>
          eNACH Scheduled (10 Nov)
        </span>
<button class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-muted text-text-primary font-label-md text-label-md hover:bg-surface-variant" type="button">
<span class="material-symbols-outlined text-[16px]">receipt</span>
          Details
        </button>
</div>
</article>
<!-- Card: Instalment #20 (Pending) -->
<article class="w-full bg-surface-default rounded-xl shadow-sm p-space-md flex flex-col gap-space-sm opacity-90">
<!-- Header -->
<div class="flex items-center justify-between">
<div class="flex items-center gap-1.5">
<span class="font-headline-sm text-headline-sm text-text-secondary">#20</span>
<span class="font-label-md text-label-md text-text-secondary">· 10 Dec 2024</span>
</div>
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-status-pending-bg text-status-pending font-label-sm text-label-sm">
          PENDING
        </span>
</div>
<!-- Key-Value Grid -->
<div class="grid grid-cols-2 gap-x-space-md gap-y-space-2xs bg-surface-muted/60 p-space-sm rounded-lg">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-text-secondary">Principal</span>
<span class="font-numeral-data text-numeral-data text-text-primary">₹11,940.00</span>
</div>
<div class="flex flex-col text-right">
<span class="font-label-sm text-label-sm text-text-secondary">Interest</span>
<span class="font-numeral-data text-numeral-data text-text-primary">₹510.00</span>
</div>
<div class="flex flex-col pt-1">
<span class="font-label-sm text-label-sm text-text-secondary">Total Due</span>
<span class="font-headline-sm text-headline-sm text-text-primary">₹12,450.00</span>
</div>
<div class="flex flex-col text-right pt-1">
<span class="font-label-sm text-label-sm text-text-secondary">Amount Paid</span>
<span class="font-numeral-data text-numeral-data text-text-secondary">₹0.00</span>
</div>
</div>
<!-- Card Action Footer -->
<div class="flex items-center justify-between pt-space-2xs">
<span class="font-body-sm text-body-sm text-text-tertiary">Due in 36 days</span>
<button class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-muted text-text-secondary font-label-md text-label-md hover:bg-surface-variant" type="button">
<span class="material-symbols-outlined text-[16px]">visibility</span>
          Breakup
        </button>
</div>
</article>
<!-- Card: Instalment #17 (Paid) -->
<article class="w-full bg-surface-default rounded-xl shadow-sm p-space-md flex flex-col gap-space-sm">
<!-- Header -->
<div class="flex items-center justify-between">
<div class="flex items-center gap-1.5">
<span class="font-headline-sm text-headline-sm text-text-primary">#17</span>
<span class="font-label-md text-label-md text-text-secondary">· 10 Sep 2024</span>
</div>
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-status-paid-bg text-status-paid font-label-sm text-label-sm">
          PAID
        </span>
</div>
<!-- Key-Value Grid -->
<div class="grid grid-cols-2 gap-x-space-md gap-y-space-2xs bg-surface-muted/60 p-space-sm rounded-lg">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-text-secondary">Principal</span>
<span class="font-numeral-data text-numeral-data text-text-primary">₹11,460.00</span>
</div>
<div class="flex flex-col text-right">
<span class="font-label-sm text-label-sm text-text-secondary">Interest</span>
<span class="font-numeral-data text-numeral-data text-text-primary">₹990.00</span>
</div>
<div class="flex flex-col pt-1">
<span class="font-label-sm text-label-sm text-text-secondary">Total Due</span>
<span class="font-headline-sm text-headline-sm text-text-primary">₹12,450.00</span>
</div>
<div class="flex flex-col text-right pt-1">
<span class="font-label-sm text-label-sm text-text-secondary">Amount Paid</span>
<span class="font-numeral-data text-numeral-data text-status-paid font-bold">₹12,450.00</span>
</div>
</div>
<!-- Card Action Footer -->
<div class="flex items-center justify-between pt-space-2xs">
<span class="font-label-sm text-label-sm text-status-paid flex items-center gap-1">
<span class="material-symbols-outlined text-[15px]">verified</span>
          Settled on Sep 09 · HDFC
        </span>
<button class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-muted text-text-primary font-label-md text-label-md hover:bg-surface-variant" type="button">
<span class="material-symbols-outlined text-[16px]">receipt_long</span>
          Receipt
        </button>
</div>
</article>
</section>
<!-- Footer / Verification & Pagination -->
<footer class="flex flex-col gap-space-md w-full pt-space-xs pb-space-lg">
<!-- RBI Verification Status -->
<div class="flex items-center justify-center gap-2 p-space-xs bg-surface-default rounded-lg shadow-sm">
<span class="w-2 h-2 rounded-full bg-status-paid animate-pulse"></span>
<span class="font-body-sm text-body-sm text-text-secondary">
        Ledger verified against RBI CBS Node
      </span>
</div>
<!-- Pagination Controls -->
<div class="flex items-center justify-between px-space-xs">
<button class="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-surface-default text-text-primary font-label-md text-label-md shadow-sm active:bg-surface-muted" type="button">
<span class="material-symbols-outlined text-[16px]">chevron_left</span>
        Previous
      </button>
<span class="font-label-sm text-label-sm text-text-secondary">
        Page <strong class="text-text-primary">2</strong> of 2
      </span>
<button class="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-surface-muted text-text-tertiary font-label-md text-label-md cursor-not-allowed" disabled="" type="button">
        Next
        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
</button>
</div>
</footer>
</div></main><nav class="fixed bottom-0 w-full z-50 pb-safe bg-surface-default/90 backdrop-blur-xl shadow-[0_-2px_10px_rgba(14,14,23,0.05)]" data-active-classes="text-status-overdue font-semibold"><div class="flex justify-around items-center h-16 px-space-2xs"><a aria-current="page" class="min-w-[44px] min-h-[44px] flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors text-status-overdue font-semibold" data-path="repayments-hub" href="#"><span class="material-symbols-outlined text-[22px]">payments</span><span class="font-label-sm text-[11px]">Repayments</span></a><a class="min-w-[44px] min-h-[44px] flex-1 flex flex-col items-center justify-center gap-0.5 text-text-secondary transition-colors hover:text-text-primary" data-path="loans-directory" href="#"><span class="material-symbols-outlined text-[22px]">account_balance_wallet</span><span class="font-label-sm text-[11px]">Loans</span></a><a class="min-w-[44px] min-h-[44px] flex-1 flex flex-col items-center justify-center gap-0.5 text-text-secondary transition-colors hover:text-text-primary" data-path="settlement-queue" href="#"><span class="material-symbols-outlined text-[22px]">receipt_long</span><span class="font-label-sm text-[11px]">Queue</span></a><a class="min-w-[44px] min-h-[44px] flex-1 flex flex-col items-center justify-center gap-0.5 text-text-secondary transition-colors hover:text-text-primary" data-path="ops-profile" href="#"><span class="material-symbols-outlined text-[22px]">manage_accounts</span><span class="font-label-sm text-[11px]">Profile</span></a></div></nav></body></html>
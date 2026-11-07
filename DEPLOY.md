# Putting almondtreemarket.com online with GitHub Pages (free)

**Live since 7 Nov 2026** at <https://almondtreemarket.com>, from the GitHub repository `Moses242-code/almondtreemarket` (branch `main`, root folder). GoDaddy DNS: four A records for `@` (185.199.108.153, .109.153, .110.153, .111.153) and `www` CNAME to `moses242-code.github.io`.

**To update the live site:** change files in this folder (or ask Claude), then in this folder run `git add -A && git commit -m "Update" && git push`. It is live about a minute later. The push uses the deploy key `~/.ssh/almondtreemarket_deploy` (set up only for this repository; remove it any time under the repository Settings > Deploy keys).

The steps below are kept for reference.

About 20 minutes, plus up to a few hours for the domain to switch over. Nothing here touches underthealmondtree.market.

> Note: underthealmondtree.market and pos.underthealmondtree.market are on **Cloudflare Pages**, not GitHub. This site works on either. If you'd rather keep everything in one place, the Cloudflare steps are at the bottom.

## 1. Make the repository

1. Sign in at <https://github.com> (or sign up, free).
2. Top right **+ → New repository**. Name it `almondtreemarket`. Set it to **Public** (free GitHub Pages needs public). Don't add a README. **Create repository**.
3. On the empty repo page, click **uploading an existing file**.
4. Open the `almond-tree-market-site` folder in Finder, select **everything inside it** (`index.html`, `css`, `js`, `img`, `CNAME` and the rest), and drag it all onto the page. Press **Cmd + Shift + .** in Finder first so the hidden `.nojekyll` file shows and gets included.
5. **Commit changes**.

## 2. Turn on GitHub Pages

1. In the repo: **Settings → Pages**.
2. Source: **Deploy from a branch**. Branch: **main**, folder **/ (root)**. **Save**.
3. Under **Custom domain** it should already say `almondtreemarket.com` (from the `CNAME` file). If not, type it and **Save**.
4. In a minute or two you'll see the site at `https://YOUR-USERNAME.github.io/almondtreemarket/`. Check it on your phone.

## 3. Point the domain at GitHub (in GoDaddy)

1. Sign in at <https://dcc.godaddy.com> → **almondtreemarket.com → DNS**.
2. Delete any existing **A** record for `@` and any **CNAME** for `www` (these point at GoDaddy's parking page or Website Builder). Leave MX and TXT records alone if you use email on this domain.
3. Add four **A** records, Name `@`, TTL 1 hour:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
4. Add one **CNAME** record: Name `www`, Value `YOUR-USERNAME.github.io`.
5. If GoDaddy has **Forwarding** turned on for this domain, turn it off.
6. Back in GitHub **Settings → Pages**: once the DNS check goes green (minutes to a few hours), tick **Enforce HTTPS**.

## Updating the site later

- **Small change (add a vendor):** in the repo open `js/data.js` → pencil icon → edit → **Commit changes**. Live in about a minute.
- **New photos:** open the `img` folder in the repo → **Add file → Upload files**.
- Or ask Claude to make the change in the folder, then drag the changed files into the repo again.

## Alternative: Cloudflare Pages (same as your other sites)

1. <https://dash.cloudflare.com> → **Workers & Pages → Create → Pages → Upload assets**.
2. Project name `almondtreemarket`, drag in the `almond-tree-market-site` folder, **Deploy**.
3. **Custom domains → Set up a custom domain** → `almondtreemarket.com`, then `www.almondtreemarket.com`. Cloudflare tells you which DNS records to add in GoDaddy.

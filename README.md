# Falycia — The Useless Internet Machine

A tiny, weird corner of the internet. A responsive static HTML/CSS/JavaScript landing page with 50 pieces of nonsense across nine categories, three interactive toys, category selection, and shuffled content that avoids immediate repeats within a category. No dependencies, tracking, storage, backend, or build step. The visit counter resets on reload.

## Local preview and checks

Serve this directory with any static server (for example `python3 -m http.server 8000`) and open http://localhost:8000. ES modules require HTTP rather than opening index.html directly.

With Node.js 20 or newer, run `npm test` (no install needed) for content coverage, shuffle behavior, category isolation, and interaction registration checks.

## Add more nonsense

- `js/catalog.js`: category registry and content. Add a category with a unique ID and at least two entries; the selector updates automatically. Each entry is `[title, body, optionalFooter, optionalInteractionName]`.
- `js/engine.js`: independent random selection using per-filter shuffle bags.
- `js/toys.js`: interaction registry. A handler receives an empty DOM container. Use textContent for copy. Keep handlers self-contained; avoid global event listeners or timers that outlive their card.
- `js/app.js`: connects the controls, receipt, and visit counter.
- `style.css`: responsive design, keyboard focus, and reduced-motion support.

Use relative asset paths so both the GitHub project URL and a future custom domain work. Fake warnings must remain clearly fictional; advice is comedy.

## Enable GitHub Pages (remaining step)

1. Open https://github.com/gingersnapz/nothing-burger/settings/pages.
2. Under Build and deployment, choose **Deploy from a branch**.
3. Select **main** and **/ (root)**, then Save. `.nojekyll` allows the static files to be served without Jekyll processing.
4. Wait for the Pages deployment to complete and test https://gingersnapz.github.io/nothing-burger/ (or the URL GitHub displays). Check the button and categories on desktop and phone.

The initial implementation does not enable Pages or configure a custom domain. There is deliberately no CNAME file yet.

## Connect falycia.com later — no DNS changes made

After the GitHub Pages URL works:

1. Verify ownership of falycia.com in your GitHub account's Pages settings using the TXT record GitHub supplies. Keep that verification record.
2. In this repository's Pages settings, set **Custom domain** to `falycia.com`. Branch-based publishing creates a CNAME file; pull that commit before further local work.
3. In the existing authoritative Route 53 hosted zone, create/update an **A record for falycia.com**, Alias **off**, with these four values in one record set (TTL 300 is reasonable):

   ```text
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

4. Create/update **www.falycia.com**, type **CNAME**, with value `gingersnapz.github.io` (no scheme, repository path, or slash).
5. Preserve unrelated mail, TXT, NS, and SOA records. Review any existing conflicting A/AAAA/www records before replacing them. No nameserver change is needed if this hosted zone already serves the domain.
6. Wait for DNS and certificate provisioning, enable **Enforce HTTPS** in Pages, then verify the apex site and www redirect. This can take up to 24 hours.

Optional IPv6 AAAA values: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.

Official references (checked September 18, 2026):
- [Publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Custom domain and DNS values](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

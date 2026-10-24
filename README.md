# Chaka to Chaka Volleyball Club

A frontend-only website for Chaka to Chaka Volleyball Club. It runs in the browser with React, Vite, and Tailwind CSS. There is no database, no API server, and no PHP.

## Run the site

Install dependencies, then start the dev server:

```bash
npm install
npm run dev
```

Open the local address Vite prints, usually `http://localhost:5173`.

Check the match mathematics:

```bash
npm test
```

Build a static site:

```bash
npm run build
npm run preview
```

The production files are written to `dist/`. Host that folder on any static host. Configure the host to serve `index.html` for unknown paths so React Router can open `/squad`, `/matches`, `/gallery`, `/request`, and `/admin` on refresh.

## Pages

- Home, with live totals and a sets chart
- Squad, with search, position filter, sort, and profiles
- Matches, with schedule, results, and set scores
- Gallery, with categories, a lightbox, video playback, and YouTube embeds
- Request a Match, which opens WhatsApp or the visitor’s email app
- Admin, for editing content in this browser

## Admin panel

Sign in at `/admin`. The password is not shown on the site. After you sign in, open **Password** to change it. The new password is saved in that browser.

Edits are saved in this browser. Other visitors see the records that were in the project when you last built the site. Use **Import / export** to download a JSON backup. **Restore original records** puts back the records shipped with the website.

## Host the site

1. From the project folder, run `npm run build`. This creates the `dist` folder.
2. Go to [Netlify Drop](https://app.netlify.com/drop).
3. Drag the `dist` folder onto the page.
4. Netlify gives you a public address. Open it and check Home, Squad, Matches, Gallery, Request a Match, and Admin.
5. Refresh a page such as `/squad`. It should stay on that page. The project includes `public/_redirects` so Netlify and Cloudflare Pages send unknown paths to `index.html`.
6. In the host’s site settings, add your domain when you have one.

To publish roster or fixture changes for every visitor, edit the records, export the JSON if you want a backup, then update `src/data` and run `npm run build` again. Upload the new `dist` folder. Changes made only in the admin panel stay on the computer where you made them.

## Photos and videos

`localStorage` is only for records and small files. It is usually limited to about 5 MB and is not a media library.

For a permanent image or video on the deployed site:

1. Copy the file into `public/images` or `public/videos`.
2. In the admin form, enter the public path, such as `/images/players/lena.jpg` or `/videos/rally.mp4`.
3. Rebuild and redeploy.

You can upload a small file for a local preview. That upload stays in this browser and can fill its storage. It will not be part of the deployed site unless the file is also copied into `public/`.

YouTube items store only the video id. The clip plays from YouTube.

Starting portraits and court graphics can be regenerated with:

```bash
node scripts/generate-placeholders.mjs
```

The club logo in `public/images/logo.jpg` is not replaced by that command.

## Match results

Administrators enter each set, for example 25–20. The winner is the side that wins more sets. Total points do not decide the match. Best of five is the default format. Best of three and best of one are also available.

Only completed matches with a set winner count toward matches played, wins, losses, win percentage, sets, and points.

## Match requests

**Send Request via WhatsApp** and **Send Request via Email** validate the form, create a reference such as `CTC-20261024-AB12`, and open a `wa.me` or `mailto:` link. The visitor must press Send. The site never claims the club has received the request before that.

Set the club WhatsApp number and email under Admin → Club settings, and put the same values in `src/data/clubSettings.js` before you build. Enter WhatsApp as digits with the country code and no plus sign, for example `254712345678`. Until you replace them, the footer hides the starting contact details, and the request form still opens the starting number.

## Project shape

```text
public/images/     logo, players, teams, gallery
public/videos/     put permanent video files here
src/components/    shared interface
src/pages/         routes
src/data/          players, matches, gallery, settings
src/utils/         storage, statistics, validation
src/hooks/         club data and page titles
```

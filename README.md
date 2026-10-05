# Invitation 51

A simple invitation page with RSVP. Responses are saved in a Google Sheet. Guests can update their response by using the same email again.

Files: `index.html` (the page) and `apps-script.gs` (saves responses to Google Sheets).

## Setup (about 10 minutes, free)

### 1. Create the Sheet and script
1. Go to [sheets.google.com](https://sheets.google.com) and create a blank sheet (name it e.g. "Invitation RSVPs").
2. Menu **Extensions → Apps Script**.
3. Delete the default code, paste the contents of `apps-script.gs`, and click **Save**.
4. Click **Deploy → New deployment**, choose type **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, approve the permissions, and copy the **Web app URL**.

### 2. Connect the page
Open `index.html`, find `SCRIPT_URL` near the bottom, and paste your Web app URL there. Also edit the event title, date and place at the top.

### 3. Host the page (GitHub Pages)
1. Merge this branch to `main` on GitHub.
2. Repo **Settings → Pages → Source: Deploy from a branch → main / (root)**.
3. After a minute your site is live at `https://<your-username>.github.io/invitation51/`. Share that link.

(Alternative: drag the folder onto [netlify.com/drop](https://app.netlify.com/drop).)

## Viewing responses
Open your Google Sheet. The `RSVPs` tab has one row per guest, with a last-updated time. You can sort, filter or download it as CSV/Excel.

## Editing a response
A guest enters the same email and presses **Already responded? Load my response**, changes anything, and submits. Their row is updated rather than duplicated.

## Notes
- If you change `apps-script.gs` later, use **Deploy → Manage deployments → Edit → New version** so the same URL keeps working.
- Anyone who knows a guest's email can load or change that guest's response. This is fine for a casual invite; don't put sensitive information in the message field.

# MAA AI Video Studio — free starter

A mobile-friendly static web prototype for creating branded slideshow-style promotional videos.

## What it currently does
- Editable business name, website, address and presenter name
- Upload multiple product/shop images and an optional presenter image
- Script field and 15/30/60-second duration selector
- Vertical 9:16 canvas preview
- Browser-based WebM video export where the browser supports `canvas.captureStream()` and `MediaRecorder`

## Important limitations
This is **not yet an AI video-generation engine**. It does not generate realistic talking-avatar footage, clone voices, or synthesize Kannada speech. The presenter photo is static. The subtitles are a simple script preview, not professionally timed captions. Export support differs by browser; test on the target iPhone before publishing.

## Open locally
Open `index.html` in a modern browser. For best results, serve the folder over HTTPS or through a local development server. Some browsers restrict local-file features.

## Deploy to Cloudflare Pages
1. Create a new GitHub repository and upload these files to its root.
2. In Cloudflare, open Workers & Pages and create a Pages project connected to that repository.
3. Choose no build command and set the output directory to `/` if the deployment setup allows it; otherwise place the files in a simple static site repository and follow the current Pages wizard.
4. Test on iPhone Safari. Browser video export may vary; Chrome desktop is a useful fallback for the prototype.

## Before public launch
Add a backend for user accounts, quotas, secure file uploads, storage expiration and abuse protection. Never expose private API keys in `app.js` or other frontend files. AI avatar and text-to-speech APIs usually have free quotas or usage charges. Do not advertise unlimited AI generation until you have a backend and a reliable cost model.

## Brand defaults
- MAA ASHAPURA NOVELTIES
- Gandhi Bazar, Main Road, Near Basaweshwara Temple, Shivamogga
- https://maa-glam.pages.dev/

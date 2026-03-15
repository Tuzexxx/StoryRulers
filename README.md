# StoryRulers — AI Adventure Game for Kids 🎮

A magical, kid-friendly AI story game where children act as rulers making decisions about fairy-tale petitioners. Powered by Google Gemini AI for dynamic storytelling and AI-generated storybook illustrations.

## Features

- 🌐 **4 Languages**: English, Deutsch, Español, Čeština
- 🎨 **5 Themed Worlds**: Royal Court, Space Station, Wizard Academy, Underwater Kingdom, Enchanted Forest
- 🎂 **Age-Adaptive**: Stories adjust complexity based on youngest player's age
- 🎤 **Voice + Text**: Speech recognition & TTS narrator
- 🖼️ **AI Illustrations**: Chronicle gallery with AI-generated storybook images
- ⏳ **Fun Loading Screens**: Themed animations with rotating fun facts
- 💾 **Cloud Save**: Optional Supabase auth + cloud persistence
- 🚀 **Vercel Deploy**: Ready for one-click deployment

## Quick Start

```bash
npm install
npm run dev
```

1. Open http://localhost:5173
2. Go to ⚙️ **Settings** and paste your [Gemini API key](https://aistudio.google.com/apikey)
3. Pick a language → theme → age → introduce players → play!

## Deployment (Vercel)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables:
   - `GEMINI_API_KEY` — Your Gemini API key (server-side, users don't need their own)
   - `VITE_SUPABASE_URL` — Your Supabase project URL (optional, for auth)
   - `VITE_SUPABASE_ANON_KEY` — Your Supabase anon key (optional, for auth)

## Supabase Setup (Optional)

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL in `supabase/schema.sql` in the SQL Editor
3. Copy your project URL and anon key to `.env.local`
4. Users can now sign up and save their game progress to the cloud

## Tech Stack

- **Frontend**: React 19 + Vite 6
- **Auth & Data**: Supabase (optional)
- **Hosting**: Vercel with serverless API proxy

## AI Models & Prompts

StoryRulers uses Google Gemini AI for its brain and eyes. Here is the technical breakdown:

### Models Used
- **Text & JSON**: `gemini-3.1-flash-lite-preview` (Used for generating petitioners, stories, and chronicle entries)
- **Images**: `gemini-3.1-flash-image-preview` (Used for creating the storybook illustrations in the Chronicle)

### Prompt Logic
The app sends structured prompts wrapped in specific **System Instructions**:
1. **Storyteller Role**: "You are a master fairy-tale storyteller for children. Create fun, creative, non-violent stories."
2. **Contextual Data**: Every prompt includes:
   - ✨ **Theme**: Current world (e.g., Space Station, Wizard Academy)
   - 🎂 **Age context**: Stories are simplified for ages 0-5, 6-8, or 9+.
   - 🧠 **World Memory**: A brief summary of previous cases so the AI remembers past events.
3. **Structured Output**: Information is returned as JSON to ensure the app can display names, emojis, and story parts separately.
4. **Image Generation**: Descriptions are translated into visual prompts like "children storybook illustration style, colorful, cheerful" with the specific story ending.

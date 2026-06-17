export const UNIVERSAL_CSS = `/* =========================================
   1. OBS RESET & HIDE UNWANTED ELEMENTS
   ========================================= */
body, 
yt-live-chat-app, 
yt-live-chat-renderer { 
  background-color: transparent !important; 
  overflow: hidden;
}

::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

* {
  -ms-overflow-style: none !important;  /* IE and Edge */
  scrollbar-width: none !important;  /* Firefox */
}

/* Sembunyikan pesan sistem YouTube */
yt-live-chat-viewer-engagement-message-renderer, yt-live-chat-header-renderer, #action-panel, #input-panel, yt-button-view-model, yt-live-chat-author-badge-renderer {
  display: none !important;
}

/* =========================================
   2. WRAPPER PESAN UTAMA
   ========================================= */
yt-live-chat-text-message-renderer,
.chat-line__message {
  background: rgba(30, 30, 30, 0.85) !important;
  color: white;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  border-left: 4px solid #444; 
  font-family: 'Segoe UI', sans-serif;
  animation: slideIn 0.3s ease forwards;
  
  /* Diubah menjadi block agar text wrapping konsisten dan natural */
  display: block !important; 
  word-wrap: break-word;
  line-height: 1.5;
}

/* =========================================
   3. KUSTOMISASI TIER MEMBERSHIP & ROLE
   ========================================= */
yt-live-chat-text-message-renderer[author-type="member"],
.chat-line__message:has(.twitch-badge-subscriber) {
  border-left-color: #2ba640; 
  background: rgba(43, 166, 64, 0.15) !important;
}

yt-live-chat-text-message-renderer[author-type="moderator"],
.chat-line__message:has(.twitch-badge-moderator) {
  border-left-color: #ff4500; 
  background: rgba(255, 69, 0, 0.15) !important;
}

yt-live-chat-text-message-renderer[author-type="owner"],
.chat-line__message:has(.twitch-badge-broadcaster) {
  border-left-color: #ffd700;
  background: rgba(255, 215, 0, 0.15) !important;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.1); 
}

/* =========================================
   4. NORMALIZE KONSISTENSI TWITCH & YOUTUBE
   ========================================= */
yt-live-chat-text-message-renderer #author-photo {
  display: none !important;
}

.chat-line__message > span[aria-hidden="true"] {
  display: none !important;
}

/* Memaksa wrapper internal YouTube agar bersikap seperti span Twitch */
yt-live-chat-text-message-renderer #content,
yt-live-chat-author-chip {
  display: inline !important; 
  margin: 0 !important;
  padding: 0 !important;
}

/* =========================================
   5. NAMA PENONTON & ISI PESAN
   ========================================= */
#chat-badges,
.chat-line__message--badges {
  display: inline-block;
  vertical-align: middle;
  margin-right: 4px;
}

#author-name,
.chat-line__username {
  font-weight: bold;
  color: #EFEFEF; 
  font-size: 1.05em;
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px; /* Jarak tunggal yang seragam antara nama dan pesan */
}

yt-live-chat-text-message-renderer[author-type="owner"] #author-name,
.chat-line__message:has(.twitch-badge-broadcaster) .chat-line__username {
  color: #ffd700 !important;
}

#message,
.text-fragment {
  font-size: 1em;
  color: #D3D3D3;
  display: inline;
  vertical-align: middle;
}

@keyframes slideIn {
  0% { transform: translateX(-20px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

/* Mock Styling untuk visual preview lokal */
.mock-badge {
  display: inline-block; padding: 2px 6px; border-radius: 4px;
  font-size: 0.7em; font-weight: bold; margin-right: 2px;
  vertical-align: middle;
}
.twitch-badge-subscriber { background: #2ba640; color: white; }
.twitch-badge-moderator { background: #ff4500; color: white; }
.twitch-badge-broadcaster { background: #ffd700; color: black; }
`;
import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import './App.css';

const MOCK_USERS = ['PixelNinja', 'CodeMaverick', 'StreamBot', 'NightOwl'];
const MOCK_MESSAGES = ['Halo!', 'Test overlay tier', 'Wah animasinya mulus', 'POGGERS', 'Jangan lupa subscribe ya!'];
const MOCK_ROLES = ['viewer', 'viewer', 'member', 'moderator', 'owner']; 

const UNIVERSAL_CSS = `/* =========================================
   1. OBS RESET & HIDE UNWANTED ELEMENTS
   ========================================= */
body, 
yt-live-chat-app, 
yt-live-chat-renderer { 
  background-color: transparent !important; 
  overflow: hidden;
}

/* Sembunyikan pesan sistem YouTube (Community Guidelines, dll) */
yt-live-chat-viewer-engagement-message-renderer {
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
  display: flex !important; 
  align-items: flex-start;
}

/* =========================================
   3. KUSTOMISASI TIER MEMBERSHIP & ROLE
   ========================================= */

/* TIER: MEMBER (YouTube) / SUBSCRIBER (Twitch) */
yt-live-chat-text-message-renderer[author-type="member"],
.chat-line__message:has(.twitch-badge-subscriber) {
  border-left-color: #2ba640; 
  background: rgba(43, 166, 64, 0.15) !important;
}

/* TIER: MODERATOR */
yt-live-chat-text-message-renderer[author-type="moderator"],
.chat-line__message:has(.twitch-badge-moderator) {
  border-left-color: #ff4500; 
  background: rgba(255, 69, 0, 0.15) !important;
}

/* TIER: STREAMER / OWNER */
yt-live-chat-text-message-renderer[author-type="owner"],
.chat-line__message:has(.twitch-badge-broadcaster) {
  border-left-color: #ffd700;
  background: rgba(255, 215, 0, 0.15) !important;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.1); 
}

/* =========================================
   4. AVATAR
   ========================================= */
yt-live-chat-text-message-renderer #author-photo {
  width: 28px;
  height: 28px;
  margin-right: 12px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}
yt-img-shadow img { width: 100%; height: 100%; object-fit: cover; }

/* =========================================
   5. NAMA PENONTON & ISI PESAN
   ========================================= */
yt-live-chat-author-chip {
  display: inline-flex;
  align-items: center;
  margin-right: 6px;
}

#author-name,
.chat-line__username {
  font-weight: bold;
  color: #EFEFEF; 
  font-size: 1.05em;
}

yt-live-chat-text-message-renderer[author-type="owner"] #author-name,
.chat-line__message:has(.twitch-badge-broadcaster) .chat-line__username {
  color: #ffd700 !important;
}

#message,
.text-fragment {
  font-size: 1em;
  color: #D3D3D3;
  line-height: 1.4;
  display: inline;
}

/* Animasi OBS */
@keyframes slideIn {
  0% { transform: translateX(-20px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

/* Mock Styling untuk visual preview lokal */
.mock-badge {
  display: inline-block; padding: 2px 6px; border-radius: 4px;
  font-size: 0.7em; font-weight: bold; margin-right: 6px;
}
.twitch-badge-subscriber { background: #2ba640; color: white; }
.twitch-badge-moderator { background: #ff4500; color: white; }
.twitch-badge-broadcaster { background: #ffd700; color: black; }
`;

function App() {
  const [platform, setPlatform] = useState('youtube');
  const [cssCode, setCssCode] = useState(UNIVERSAL_CSS);
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newRole = MOCK_ROLES[Math.floor(Math.random() * MOCK_ROLES.length)];
      
      const newUser = newRole === 'owner' 
        ? 'Dida Prasetyo' 
        : MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
        
      const newMsg = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
      const newId = Date.now();

      setMessages((prev) => {
        const updated = [...prev, { id: newId, user: newUser, text: newMsg, role: newRole }];
        return updated.length > 15 ? updated.slice(updated.length - 15) : updated;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="app-container">
      <style>{cssCode}</style>

      <div className="editor-panel">
        <div className="toolbar">
          <h2>CSS Editor (OBS Accurate)</h2>
          <select 
            value={platform} 
            onChange={(e) => setPlatform(e.target.value)}
            className="platform-select"
          >
            <option value="youtube">Live Preview: YouTube</option>
            <option value="twitch">Live Preview: Twitch</option>
          </select>
        </div>
        
        <Editor
          height="calc(100vh - 60px)"
          defaultLanguage="css"
          theme="vs-dark"
          value={cssCode}
          onChange={(value) => setCssCode(value || '')}
          options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on' }}
        />
      </div>

      <div className="preview-panel">
        <div className="preview-header">Simulasi DOM: {platform.toUpperCase()}</div>
        
        <div className="chat-container" ref={chatContainerRef}>
          {messages.map((msg) => (
            platform === 'youtube' ? (
              <yt-live-chat-text-message-renderer 
                key={msg.id} 
                author-type={msg.role === 'viewer' ? '' : msg.role}
              >
                <yt-img-shadow id="author-photo">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${msg.user}&background=random&color=fff&size=28`} 
                    alt="avatar" 
                  />
                </yt-img-shadow>

                <div id="content">
                  <yt-live-chat-author-chip>
                    <span id="chat-badges">
                      {msg.role === 'member' && <span className="mock-badge" style={{background: '#2ba640'}}>M</span>}
                      {msg.role === 'moderator' && <span className="mock-badge" style={{background: '#ff4500'}}>Mod</span>}
                      {msg.role === 'owner' && <span className="mock-badge" style={{background: '#ffd700', color: 'black'}}>Owner</span>}
                    </span>
                    <span id="author-name" className={msg.role}>{msg.user}</span>
                  </yt-live-chat-author-chip>
                  
                  <span id="message" dir="auto">{msg.text}</span>
                </div>
              </yt-live-chat-text-message-renderer>
            ) : (
              <div key={msg.id} className="chat-line__message">
                <span className="chat-line__message--badges">
                  {msg.role === 'member' && <span className="twitch-badge-subscriber mock-badge">Sub</span>}
                  {msg.role === 'moderator' && <span className="twitch-badge-moderator mock-badge">Mod</span>}
                  {msg.role === 'owner' && <span className="twitch-badge-broadcaster mock-badge">Broadcaster</span>}
                </span>
                <span className="chat-line__username">{msg.user}</span>
                <span aria-hidden="true">: </span>
                <span className="text-fragment">{msg.text}</span>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
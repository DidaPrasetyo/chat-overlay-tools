import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

import './App.css';

import { UNIVERSAL_CSS } from './defaultCss';
import { MOCK_USERS, MOCK_MESSAGES, MOCK_ROLES } from './mockData';

function App() {
  // app initiate
  const [cssCode, setCssCode] = useState(UNIVERSAL_CSS);
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);
  
  // option config
  const [platform, setPlatform] = useState('youtube');
  const [previewBg, setPreviewBg] = useState('#000000');
  const [showMockBadges, setShowMockBadges] = useState(true);
  const [editorWidth, setEditorWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  // resize panel function
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      let newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth < 20) newWidth = 20;
      if (newWidth > 80) newWidth = 80;
      setEditorWidth(newWidth);
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // mock chat generator
  useEffect(() => {
    const interval = setInterval(() => {
      const newRole = MOCK_ROLES[Math.floor(Math.random() * MOCK_ROLES.length)];
      const newUser = newRole === 'owner' ? 'Dida Prasetyo' : MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
      const newMsg = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
      const newId = Date.now();

      setMessages((prev) => {
        const updated = [...prev, { id: newId, user: newUser, text: newMsg, role: newRole }];
        return updated.length > 15 ? updated.slice(updated.length - 15) : updated;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // auto scroll chat function
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`app-container ${isDragging ? 'is-dragging' : ''}`}>
      <style>{cssCode}</style>

      {/* PANEL KIRI: Editor CSS */}
      <div className="editor-panel" style={{ width: `${editorWidth}%` }}>
        <div className="toolbar">
          <h2>CSS Editor</h2>
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
          options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on', automaticLayout: true }}
        />
      </div>

      {/* Pembatas Resizer */}
      <div className="resizer" onMouseDown={(e) => { e.preventDefault(); setIsDragging(true); }} />

      {/* PANEL KANAN: Live Preview */}
      <div className="preview-panel" style={{ width: `${100 - editorWidth}%` }}>
        <div className="preview-header">
          <span>Simulasi DOM: {platform.toUpperCase()}</span>
          
          <div className="preview-controls">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={showMockBadges} 
                onChange={(e) => setShowMockBadges(e.target.checked)} 
              />
              Mock Badges
            </label>
            
            <div className="bg-picker">
              <label htmlFor="bg-color">Bg Color: </label>
              <input 
                id="bg-color"
                type="color" 
                value={previewBg} 
                onChange={(e) => setPreviewBg(e.target.value)} 
              />
            </div>
          </div>
        </div>
        
        <div className="chat-container" ref={chatContainerRef} style={{ backgroundColor: previewBg }}>
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
                    {/* Menggunakan inline-style 'display: none' jika showMockBadges false */}
                    <span id="chat-badges">
                      {msg.role === 'member' && <span className="mock-badge" style={{background: '#2ba640', display: showMockBadges ? 'inline-block' : 'none'}}>M</span>}
                      {msg.role === 'moderator' && <span className="mock-badge" style={{background: '#ff4500', display: showMockBadges ? 'inline-block' : 'none'}}>Mod</span>}
                      {msg.role === 'owner' && <span className="mock-badge" style={{background: '#ffd700', color: 'black', display: showMockBadges ? 'inline-block' : 'none'}}>Owner</span>}
                    </span>
                    <span id="author-name" className={msg.role}>{msg.user}</span>
                  </yt-live-chat-author-chip>
                  
                  <span id="message" dir="auto">{msg.text}</span>
                </div>
              </yt-live-chat-text-message-renderer>
            ) : (
              <div key={msg.id} className="chat-line__message">
                <span className="chat-line__message--badges">
                  {/* Menggunakan inline-style 'display: none' agar elemen tetap ada untuk CSS :has() Twitch */}
                  {msg.role === 'member' && <span className="twitch-badge-subscriber mock-badge" style={{display: showMockBadges ? 'inline-block' : 'none'}}>Sub</span>}
                  {msg.role === 'moderator' && <span className="twitch-badge-moderator mock-badge" style={{display: showMockBadges ? 'inline-block' : 'none'}}>Mod</span>}
                  {msg.role === 'owner' && <span className="twitch-badge-broadcaster mock-badge" style={{display: showMockBadges ? 'inline-block' : 'none'}}>Broadcaster</span>}
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
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import ChatHeader from "../components/ChatHeader";
import { useSocket } from "../context/SocketContext";
import "./ChatPage.css"; // Add this CSS file

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const { socket } = useSocket();

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768 && activeChat) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [activeChat]);

  useEffect(() => {
    if (!socket || !activeChat) return;

    socket.emit("join_chat", activeChat.id);

    return () => {
      socket.emit("leave_chat", activeChat.id);
    };
  }, [socket, activeChat]);

  const handleBackToChats = () => {
    setActiveChat(null);
    if (isMobile) {
      setShowSidebar(true);
    }
  };

  return (
    <div className="chat-page-container">
      {/* Mobile Menu Toggle Button */}
      {isMobile && activeChat && (
        <button 
          className="mobile-menu-toggle"
          onClick={() => {
            setShowSidebar(true);
            setActiveChat(null);
          }}
        >
          ← Chats
        </button>
      )}

      {/* Sidebar - Hidden on mobile when chat is open */}
      <div className={`sidebar-container ${showSidebar ? 'show' : 'hide'}`}>
        <Sidebar 
          setActiveChat={(chat) => {
            setActiveChat(chat);
            if (isMobile) {
              setShowSidebar(false);
            }
          }} 
        />
      </div>

      {/* Chat Area */}
      <div className={`chat-area ${activeChat ? 'active' : ''} ${isMobile ? 'mobile-chat' : ''}`}>
        {activeChat ? (
          <>
            <div className="chat-header-wrapper">
              <ChatHeader chat={activeChat} />
            </div>
            
            <MessageList chatId={activeChat.id} />
            <MessageInput chatId={activeChat.id} />
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="no-chat-content">
              <div className="no-chat-icon">💬</div>
              <h3>Select a chat to start messaging</h3>
              <p>Choose a conversation from the sidebar</p>
              {isMobile && (
                <button 
                  className="browse-chats-button"
                  onClick={() => setShowSidebar(true)}
                >
                  Browse Chats
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
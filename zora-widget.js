// Zora AI Assistant - Mintlify Integration Script
// Add this script to your Mintlify mint.json to embed Zora

;(() => {
  // Configuration
  const ZORA_CONFIG = {
    apiEndpoint: window.ZORA_API_ENDPOINT || "https://v0-osb-agent.vercel.app/api/zora/chat",
    theme: window.ZORA_THEME || "light", // Default to light theme for OS:Belgrade
    position: window.ZORA_POSITION || "bottom-right",
    primaryColor: window.ZORA_PRIMARY_COLOR || "#FF8C42", // Orange accent matching OS:Belgrade
  }

  // Inject styles
  const styles = `
    .zora-widget-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      background: ${ZORA_CONFIG.primaryColor};
      color: white;
      border: none;
      border-radius: 9999px;
      padding: 10px 40px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .zora-widget-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }
    
    .zora-widget-button.minimized {
      width: 56px;
      height: 56px;
      padding: 0;
      justify-content: center;
      background: #f3f4f6;
      color: #1f2937;
    }
    
    .zora-widget-panel {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 400px;
      height: 600px;
      z-index: 9998;
      background: white;
      border-radius: 12px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      display: none;
      flex-direction: column;
      overflow: hidden;
      border: 2px solid #e5e7eb;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .zora-widget-panel.dark {
      background: #1f2937;
      border-color: #374151;
      color: #f9fafb;
    }
    
    .zora-widget-panel.open {
      display: flex;
    }
    
    .zora-header {
      padding: 16px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .zora-widget-panel.dark .zora-header {
      border-bottom-color: #374151;
    }
    
    .zora-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: ${ZORA_CONFIG.primaryColor}20;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${ZORA_CONFIG.primaryColor};
    }
    
    .zora-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .zora-message {
      display: flex;
      gap: 12px;
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .zora-message.user {
      flex-direction: row-reverse;
    }
    
    .zora-message-content {
      background: #f3f4f6;
      padding: 12px;
      border-radius: 8px;
      max-width: 85%;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .zora-widget-panel.dark .zora-message-content {
      background: #374151;
    }
    
    .zora-message.user .zora-message-content {
      background: ${ZORA_CONFIG.primaryColor};
      color: white;
    }
    
    .zora-input-area {
      padding: 16px;
      border-top: 1px solid #e5e7eb;
    }
    
    .zora-widget-panel.dark .zora-input-area {
      border-top-color: #374151;
    }
    
    .zora-input-form {
      display: flex;
      gap: 8px;
    }
    
    .zora-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      background: white;
    }
    
    .zora-widget-panel.dark .zora-input {
      background: #374151;
      border-color: #4b5563;
      color: #f9fafb;
    }
    
    .zora-input:focus {
      border-color: ${ZORA_CONFIG.primaryColor};
      box-shadow: 0 0 0 3px ${ZORA_CONFIG.primaryColor}20;
    }
    
    .zora-send-button {
      padding: 8px 12px;
      background: ${ZORA_CONFIG.primaryColor};
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
    }
    
    .zora-citation {
      margin-top: 8px;
      padding: 8px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 12px;
    }
    
    .zora-widget-panel.dark .zora-citation {
      background: #1f2937;
      border-color: #4b5563;
    }
    
    .zora-code-block {
      margin-top: 8px;
      background: #1f2937;
      color: #f9fafb;
      padding: 12px;
      border-radius: 6px;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 12px;
      overflow-x: auto;
    }
    
    @media (max-width: 640px) {
      .zora-widget-panel {
        width: calc(100vw - 32px);
        height: calc(100vh - 120px);
        right: 16px;
        bottom: 80px;
      }
      
      .zora-widget-button {
        right: 16px;
        bottom: 16px;
      }
    }
  `

  const styleSheet = document.createElement("style")
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)

  // Create widget HTML
  const widgetHTML = `
    <button class="zora-widget-button" id="zora-toggle">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
      <span id="zora-button-text">Ask Zora</span>
    </button>
    
    <div class="zora-widget-panel ${ZORA_CONFIG.theme}" id="zora-panel">
      <div class="zora-header">
        <div class="zora-avatar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div>
          <div style="font-weight: 600; font-size: 16px;">Zora</div>
          <div style="font-size: 12px; opacity: 0.7;">C.O.S Documentation Assistant</div>
        </div>
      </div>
      
      <div class="zora-messages" id="zora-messages">
        <div class="zora-message">
          <div class="zora-avatar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div class="zora-message-content">
            Hi! I'm Zora, your guide to Belgrade's Cultural Operating System. I can help you navigate OS:B modules, search cultural documentation, and understand the system architecture. What would you like to explore?
          </div>
        </div>
      </div>
      
      <div class="zora-input-area">
        <form class="zora-input-form" id="zora-form">
          <input 
            type="text" 
            class="zora-input" 
            id="zora-input" 
            placeholder="Ask about OS:Belgrade..."
            autocomplete="off"
          />
          <button type="submit" class="zora-send-button">Send</button>
        </form>
        <div style="text-align: center; font-size: 11px; opacity: 0.6; margin-top: 8px;">
          Powered by Claude Sonnet 4
        </div>
      </div>
    </div>
  `

  // Inject widget into page
  const container = document.createElement("div")
  container.innerHTML = widgetHTML
  document.body.appendChild(container)

  // Widget functionality
  const toggleButton = document.getElementById("zora-toggle")
  const panel = document.getElementById("zora-panel")
  const buttonText = document.getElementById("zora-button-text")
  const form = document.getElementById("zora-form")
  const input = document.getElementById("zora-input")
  const messagesContainer = document.getElementById("zora-messages")

  let isOpen = false

  toggleButton.addEventListener("click", () => {
    isOpen = !isOpen
    panel.classList.toggle("open", isOpen)
    toggleButton.classList.toggle("minimized", isOpen)
    buttonText.style.display = isOpen ? "none" : "inline"

    if (isOpen) {
      input.focus()
    }
  })

  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const message = input.value.trim()
    if (!message) return

    console.log("[v0] Zora: Sending message:", message)

    // Add user message
    addMessage(message, "user")
    input.value = ""

    // Add loading indicator
    const loadingId = addLoadingMessage()

    try {
      const requestBody = {
        messages: [{ role: "user", content: message }],
      }

      console.log("[v0] Zora: Request body:", requestBody)
      console.log("[v0] Zora: API endpoint:", ZORA_CONFIG.apiEndpoint)

      // Call Zora API
      const response = await fetch(ZORA_CONFIG.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      console.log("[v0] Zora: Response status:", response.status)

      removeMessage(loadingId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Zora: API error:", errorText)
        throw new Error(`Failed to get response: ${response.status}`)
      }

      // Handle streaming response
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""
      let messageId = null

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6))
              console.log("[v0] Zora: Stream data:", data)
              if (data.type === "text-delta") {
                assistantMessage += data.textDelta
                if (messageId) {
                  updateMessage(messageId, assistantMessage)
                } else {
                  messageId = addMessage(assistantMessage, "assistant")
                }
              }
            } catch (e) {
              console.error("[v0] Zora: Parse error:", e)
            }
          }
        }
      }
    } catch (error) {
      console.error("[v0] Zora: Error:", error)
      removeMessage(loadingId)
      addMessage("Sorry, I encountered an error. Please try again.", "assistant")
    }
  })

  function addMessage(content, role) {
    const messageId = "msg-" + Date.now()
    const messageDiv = document.createElement("div")
    messageDiv.className = `zora-message ${role}`
    messageDiv.id = messageId

    if (role === "assistant") {
      messageDiv.innerHTML = `
        <div class="zora-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div class="zora-message-content">${content}</div>
      `
    } else {
      messageDiv.innerHTML = `
        <div class="zora-message-content">${content}</div>
      `
    }

    messagesContainer.appendChild(messageDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
    return messageId
  }

  function updateMessage(messageId, content) {
    const messageDiv = document.getElementById(messageId)
    if (messageDiv) {
      const contentDiv = messageDiv.querySelector(".zora-message-content")
      if (contentDiv) {
        contentDiv.textContent = content
      }
    }
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  function addLoadingMessage() {
    const messageId = "loading-" + Date.now()
    const messageDiv = document.createElement("div")
    messageDiv.className = "zora-message assistant"
    messageDiv.id = messageId
    messageDiv.innerHTML = `
      <div class="zora-avatar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      </div>
      <div class="zora-message-content">
        <div style="display: flex; gap: 4px;">
          <div style="width: 8px; height: 8px; background: currentColor; border-radius: 50%; animation: bounce 1s infinite;"></div>
          <div style="width: 8px; height: 8px; background: currentColor; border-radius: 50%; animation: bounce 1s infinite 0.15s;"></div>
          <div style="width: 8px; height: 8px; background: currentColor; border-radius: 50%; animation: bounce 1s infinite 0.3s;"></div>
        </div>
      </div>
    `
    messagesContainer.appendChild(messageDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
    return messageId
  }

  function removeMessage(messageId) {
    const messageDiv = document.getElementById(messageId)
    if (messageDiv) {
      messageDiv.remove()
    }
  }

  // Add bounce animation
  const bounceAnimation = document.createElement("style")
  bounceAnimation.textContent = `
    @keyframes bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-8px); }
    }
  `
  document.head.appendChild(bounceAnimation)

  console.log("Zora AI Assistant loaded successfully")
})()

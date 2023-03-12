// Get DOM elements
const chatBody = document.getElementById("chat-body");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

// Add event listener to send button
sendButton.addEventListener("click", () => {
  // Get user's message from input field
  const userMessage = messageInput.value.trim();

  // Only send message if it's not empty
  if (userMessage) {
    // Add user's message to chat window
    addMessage(userMessage, "outgoing");

    // Clear input field
    messageInput.value = "";

    // Get response from OpenAI API
    receiveMessage(userMessage)
      .then((botMessage) => {
        // Add bot's message to chat window
        addMessage(botMessage, "incoming");
      })
      .catch((error) => {
        console.error(error);
        // If there's an error, show error message in chat window
        addMessage(
          "Oops, something went wrong. Please try again later.",
          "incoming"
        );
      });
  }
});

// Function to send message to OpenAI API
async function receiveMessage(userMessage) {
  // Make POST request to OpenAI API
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer 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",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
      temperature: 0.5,
      max_tokens: 200,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
      stop: ["You:"],
    }),
  });

  // Parse response and return bot's message
  const { choices } = await response.json();
  return choices[0].message.content.trim();
}

// Function to add message to chat window
function addMessage(text, className) {
  // Create message element
  const messageElement = document.createElement("div");
  messageElement.textContent = text;
  messageElement.classList.add("chat-message", className);

  // Append message element to chat body
  chatBody.appendChild(messageElement);

  // Scroll to bottom of chat window
  chatBody.scrollTop = chatBody.scrollHeight;
}

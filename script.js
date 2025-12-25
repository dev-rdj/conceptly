document.addEventListener("DOMContentLoaded", () => {

  // Remove intro
  setTimeout(() => {
    const intro = document.getElementById("intro");
    if (intro) intro.remove();
  }, 6000);

  const API_KEY = "a7f22572-4f0f-4bc5-b137-782a90e50c5e";
  const API_URL = "https://api.sambanova.ai/v1/chat/completions";

  const typeSelect = document.getElementById("idea-type");
  const contextInput = document.getElementById("idea-context");
  const button = document.getElementById("generate-btn");
  const resultBox = document.getElementById("result");

  button.addEventListener("click", async () => {
    const type = typeSelect.value;
    const context = contextInput.value.trim();

    resultBox.classList.add("hidden");
    resultBox.innerHTML = "Generating idea...";

    const prompt = `
Generate ONE ${type} idea.
${context ? "Context: " + context : ""}
Return the response in this format:

Title:
Description:
Why it works:
`;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "Meta-Llama-3.1-8B-Instruct",
          messages: [
            {
              role: "system",
              content: "You are Conceptly, an AI idea generator created by Jeff. You generate concise, practical, and realistic ideas."
            },
            { role: "user", content: prompt }
          ]
        })
      });

      const data = await res.json();
      const text = data.choices[0].message.content;

      const parts = text.split("\n").filter(Boolean);

      resultBox.innerHTML = `
        <h3>${parts[0].replace("Title:", "").trim()}</h3>
        <p><b>Description:</b> ${parts[1]?.replace("Description:", "").trim()}</p>
        <p><b>Why it works:</b> ${parts[2]?.replace("Why it works:", "").trim()}</p>
      `;
      resultBox.classList.remove("hidden");

    } catch {
      resultBox.innerHTML = "Something went wrong. Please try again.";
      resultBox.classList.remove("hidden");
    }
  });

});

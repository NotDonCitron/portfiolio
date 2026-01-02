"""
verify_portfolio_ai.py - AI-Driven Browser Verification
Uses 'browser-use' to perform human-like testing of the portfolio.

Requires: 
- pip install browser-use playwright langchain-openai
- OPENAI_API_KEY environment variable
"""

import asyncio
import os
from browser_use import Agent
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

async def main():
    load_dotenv()
    
    # 1. Initialize the LLM (OpenAI, Anthropic, Gemini, etc.)
    # Make sure your API key is in the .env file
    llm = ChatOpenAI(model="gpt-4o")
    
    # 2. Define the 'Human-like' task
    task = (
        "1. Open http://localhost:5173. Verify the Hero section renders correctly with Pascal's name. "
        "2. Scroll down to see the Enterprise Projects and Der Werdegang sections. "
        "3. Find the AI Chatbot and ask it: 'Was sind deine Top 3 Tech Skills?'. Wait for a response. "
        "4. Switch to the 'Windows 95' theme using the palette icon and verify the UI changes drastically. "
        "5. Go to the 'AI Bildvergleich' project and click the check button to see if it responds. "
        "6. Provide a final summary of whether the site feels polished and functional."
    )
    
    # 3. Initialize the Agent
    agent = Agent(
        task=task,
        llm=llm,
        # Set to False to watch the AI work in real-time!
        # headless=False 
    )
    
    # 4. Run the verification
    result = await agent.run()
    print("\n--- AI VERIFICATION RESULT ---")
    print(result)

if __name__ == "__main__":
    asyncio.run(main())

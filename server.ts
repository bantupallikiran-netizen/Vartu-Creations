import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize the Google Gemini GenAI SDK
const geminiApiKey = process.env.GEMINI_API_KEY || "";
let aiClient: GoogleGenAI | null = null;

if (geminiApiKey) {
  aiClient = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
  console.log("🚀 Server-side Gemini AI client initialized successfully.");
} else {
  console.warn("⚠️ Warning: GEMINI_API_KEY is not defined in environment variables. AI operations will fall back to simulated results.");
}

async function startAppServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  const PORT = 3000;

  // Helper inside wrapped scope
  const getAiResponse = async (promptText: string, sysInstruction?: string) => {
    if (!aiClient) {
      throw new Error("Gemini AI client is not initialized. Please configure the API Key in key settings.");
    }
    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: sysInstruction ? { systemInstruction: sysInstruction } : undefined,
    });
    return response.text;
  };

  // 1. AI Instagram Caption Generator
  app.post("/api/gemini/caption", async (req, res) => {
    try {
      const { productName, category, audience, mood } = req.body;
      if (!productName) {
        return res.status(400).json({ error: "Product Name is required" });
      }

      const promptText = `Generate 3 distinct, creative Instagram options of caption for a handmade product named "${productName}" (Category: ${category || "General Arts"}).
- Target Audience: ${audience || "Homeowners, gifts seekes"}
- Intended Brand/Visual Mood: ${mood || "Warm and boutique"}
- The brand vibe is artisanal, caring, and thoughtful ("VartU Creations - Art for Every Heart"). 
Include visual/emoji @layout directions, spaces, hook lines, and aesthetic calls to action. Let each option flow organically. Do not use generic markdown headers if possible.`;

      const result = await getAiResponse(promptText, "You are a professional luxury digital marketing strategist and boutique copywriter specialized in handcrafted lifestyle e-commerce products.");
      res.json({ caption: result });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Something went wrong in AI generation." });
    }
  });

  // 2. AI Hashtag Optimizer
  app.post("/api/gemini/hashtags", async (req, res) => {
    try {
      const { productTags, category } = req.body;
      const promptText = `Generate a set of 25 optimized, high-performing Instagram and Pinterest hashtags for handcrafted "${category || "Resin and Home Décor"}" products.
Included indicators: ${productTags || "handmade, custom resin, floral preservation"}
Segregate them into:
1. High-volume general hashtags (5-8)
2. Mid-volume artisan specific hashtags (8-10)
3. Boutique/Niche brand tags (5)
Provide copyable spacing.`;

      const result = await getAiResponse(promptText, "You are a social media growth expert for luxury handmade and artisanal accessories brands.");
      res.json({ hashtags: result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. AI Instagram Reel Storyboard and Pacing
  app.post("/api/gemini/reel-ideas", async (req, res) => {
    try {
      const { category, targetFeature } = req.body;
      const promptText = `Suggest a complete high-converting, aesthetic Instagram Reel concept and structure for the handmade category: "${category || "Resin Flowers preservation / custom gifts"}".
Hook focus: Showcase the unique process and raw emotions behind this.
Highlight: ${targetFeature || "Turning real wedding flowers into lifetime resin keepsakes"}
Include:
1. Audio vibe recommendations (acoustic, lo-fi, trending instrumental, etc.)
2. Frame-by-frame visual directions with timestamps (0s-15s total)
3. Suggested on-screen text overlays
4. Practical tip for filmed angles (operations by Dharani / Lokeswari).`;

      const result = await getAiResponse(promptText, "You are a short-form video marketing director specialized in viral artisan, lifestyle, and clay/resin crafting processes.");
      res.json({ storyboard: result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 4. AI sensory Artisanal Product Description Writer
  app.post("/api/gemini/description", async (req, res) => {
    try {
      const { productName, materials, category, coreStory } = req.body;
      if (!productName) {
        return res.status(400).json({ error: "Product name is required" });
      }
      const promptText = `Write a beautiful, rich sensory e-commerce product description for: "${productName}"
- Category: ${category || "Artisan Craft"}
- Materials Used: ${materials || "Premium Epoxy Resin, Real Pressed Hydrangeas, Gold Foil Accents"}
- Core Story / Emotion: ${coreStory || "Preserving beautiful real graduation flowers as everlasting memory bookmarks"}

Deliver:
1. A captivating display Hook sentence (bold and emotional).
2. A sensory narrative description (2 paragraphs describing touch, light play, and craftsmanship).
3. A bulleted list of aesthetic, premium specifications.
4. Care instructions tailored to this category (e.g. keep away from prolonged direct heat for resin/candles).`;

      const result = await getAiResponse(promptText, "You are an elite Shopify copywriter and luxury home décor product catalog designer for VartU Creations.");
      res.json({ description: result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. AI Editorial Blog Writer for Craft Guides
  app.post("/api/gemini/blog-write", async (req, res) => {
    try {
      const { topic, keywords } = req.body;
      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }
      const promptText = `Synthesize an authoritative, beautifully drafted newsletter and SEO blog post for our brand VartU Creations.
Topic: "${topic}"
Target SEO Keywords: "${keywords || "handmade gifts, personalized resin art, candle care tutorial, DIY home decor tips"}"

Guidelines:
- Length: Around 300 to 500 words.
- Tone: Warm, highly educational, organic, professional.
- Include elegant subheadings.
- Feature a closing reflection about "Art for Every Heart" and prompt customers to browse custom gift commissions.`;

      const result = await getAiResponse(promptText, "You are a chief lifestyle editor and digital marketing content strategist specializing in handcrafted decor, festive gifting, and artisan crafts.");
      res.json({ blogContent: result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 6. AI Sales & Inventory Forecasting Insights
  app.post("/api/gemini/insights", async (req, res) => {
    try {
      const { inventoryData, orderData, rawMaterialsData } = req.body;
      const promptText = `Perform a high-level Business Intelligence analysis and future forecasting for our handmade brand "VartU Creations":
Inventory Value and low stock alerts: ${JSON.stringify(rawMaterialsData || [])}
Recent orders history trends: ${JSON.stringify(orderData || [])}
Products stock grid: ${JSON.stringify(inventoryData || [])}

Generate:
1. **Inventory Low-Stock Warnings**: Identify raw materials or items near exhaustion based on thresholds.
2. **Predictive Material Requirements**: Given recent order categories, which materials (such as Resin, Pigments, Wax, or Packaging) will face peak demand?
3. **Best Performing Channels & Gifting Categories**: Highlight key sales opportunities.
4. **Operations Advisory**: One-sentence, bulleted growth hacks or operational alerts for Kiran Kumar (Operations & BD) or Lokeswari (Creative Head) to execute next week.`;

      const result = await getAiResponse(promptText, "You are a Senior Retail Architect, Inventory Forecaster, and Shopify Business Consultant.");
      res.json({ insights: result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Serve Vite client application
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Start full-stack Node server
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running in ${process.env.NODE_ENV || "development"} mode on http://0.0.0.0:${PORT}`);
  });
}

startAppServer().catch((err) => {
  console.error("FATAL: Failed to launch VartU Creations master server:", err);
});

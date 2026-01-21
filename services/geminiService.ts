
import { GoogleGenAI, Type } from "@google/genai";
import { DashboardData, StatusLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const dashboardSchema = {
  type: Type.OBJECT,
  properties: {
    projectName: { type: Type.STRING },
    summary: { type: Type.STRING },
    overallStatus: { type: Type.STRING, enum: ["On Track", "At Risk", "Off Track"] },
    health: {
      type: Type.OBJECT,
      properties: {
        schedule: { type: Type.STRING, enum: ["On Track", "At Risk", "Off Track"] },
        scope: { type: Type.STRING, enum: ["On Track", "At Risk", "Off Track"] },
        quality: { type: Type.STRING, enum: ["On Track", "At Risk", "Off Track"] },
        resource: { type: Type.STRING, enum: ["On Track", "At Risk", "Off Track"] }
      },
      required: ["schedule", "scope", "quality", "resource"]
    },
    highlights: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    upcomingWork: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    risks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
          mitigation: { type: Type.STRING }
        },
        required: ["description", "severity", "mitigation"]
      }
    },
    actionItems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          task: { type: Type.STRING },
          owner: { type: Type.STRING },
          dueDate: { type: Type.STRING },
          status: { type: Type.STRING, enum: ["Open", "Closed", "Blocked"] }
        },
        required: ["task", "owner", "dueDate", "status"]
      }
    }
  },
  required: ["projectName", "summary", "overallStatus", "health", "highlights", "upcomingWork", "risks", "actionItems"]
};

export async function processProjectData(csvContent: string): Promise<Partial<DashboardData>> {
  const prompt = `
    Act as a Senior Project Management Consultant. 
    Analyze the following raw project data (CSV/Tabular format). 
    Generate a high-level executive weekly status report. 
    Translate technical issue-level data into business value and clear insights.
    
    Raw Data:
    ${csvContent}
    
    Please provide the output in the specified JSON structure.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: dashboardSchema,
      },
    });

    const data = JSON.parse(response.text || "{}");
    
    // Add unique IDs to items that need them
    if (data.risks) {
      data.risks = data.risks.map((r: any, i: number) => ({ ...r, id: `risk-${Date.now()}-${i}` }));
    }
    if (data.actionItems) {
      data.actionItems = data.actionItems.map((a: any, i: number) => ({ ...a, id: `action-${Date.now()}-${i}` }));
    }

    return data;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to process data with AI. Please check your file content.");
  }
}

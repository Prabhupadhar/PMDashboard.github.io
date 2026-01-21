
import { GoogleGenAI, Type } from "@google/genai";
import { DashboardData } from "../types";

// Always use process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const dashboardSchema = {
  type: Type.OBJECT,
  properties: {
    projectName: { type: Type.STRING },
    summary: { type: Type.STRING },
    overallStatus: { type: Type.STRING, enum: ["On Track", "At Risk", "Off Track"] },
    deliverySentiment: { type: Type.NUMBER, description: "A confidence score from 0-100 on project success." },
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
    workload: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          owner: { type: Type.STRING },
          loadPercentage: { type: Type.NUMBER },
          taskCount: { type: Type.NUMBER }
        },
        required: ["owner", "loadPercentage", "taskCount"]
      }
    },
    dependencies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dependency: { type: Type.STRING },
          impact: { type: Type.STRING },
          status: { type: Type.STRING, enum: ["Waiting", "Resolved", "Critical"] }
        },
        required: ["dependency", "impact", "status"]
      }
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
  required: [
    "projectName", "summary", "overallStatus", "deliverySentiment", "health", 
    "highlights", "upcomingWork", "workload", "dependencies", "risks", "actionItems"
  ]
};

export async function processProjectData(csvContent: string): Promise<Partial<DashboardData>> {
  const prompt = `
    Act as a Senior AI Project Analyst for ClickUp Brain. 
    Analyze the following raw project data (Jira Export / Tabular format). 
    
    Tasks:
    1. Identify the Project Name and overall phase.
    2. Write a concise executive summary.
    3. Calculate 'Workload' by analyzing Assignee frequency and task volume.
    4. Identify 'Dependencies' - look for blocked tasks or mentions of external teams.
    5. Flag 'Risks' based on priority, due dates, and blockers.
    6. Generate 3-5 'Action Items' for the PM to address next week.
    7. Assign a 'Delivery Sentiment' score (0-100) based on velocity vs due dates.
    
    Raw Data:
    ${csvContent}
    
    Provide a professional, executive-ready response in JSON format.
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

    // Use .text property directly as per guidelines
    const data = JSON.parse(response.text || "{}");
    
    // Enrich with IDs
    data.risks = data.risks?.map((r: any, i: number) => ({ ...r, id: `risk-${Date.now()}-${i}` })) || [];
    data.actionItems = data.actionItems?.map((a: any, i: number) => ({ ...a, id: `action-${Date.now()}-${i}` })) || [];
    data.dependencies = data.dependencies?.map((d: any, i: number) => ({ ...d, id: `dep-${Date.now()}-${i}` })) || [];

    return data;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to process data with AI Intelligence.");
  }
}

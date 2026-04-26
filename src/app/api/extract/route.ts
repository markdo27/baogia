import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import * as xlsx from 'xlsx';
import PDFParser from 'pdf2json';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

export const maxDuration = 300; // Allow up to 5 minutes on Vercel Pro (60s on Hobby)

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = '';

    // 1. Extract Raw Text based on file type
    if (file.name.endsWith('.pdf')) {
      extractedText = await new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, true);
        
        pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
          resolve(pdfParser.getRawTextContent());
        });
        
        pdfParser.parseBuffer(buffer);
      });
    } else if (file.name.match(/\.(xlsx|xls|csv)$/)) {
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      // Get the first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      // Convert to CSV for LLM parsing
      extractedText = xlsx.utils.sheet_to_csv(worksheet);
    } else {
      return NextResponse.json({ error: 'Unsupported file format. Please upload PDF, XLSX, or CSV.' }, { status: 400 });
    }

    // If file is too large, we might need chunking, but for now we send up to ~20k chars
    const promptText = extractedText.substring(0, 30000); 

    // 2. Use LLM to structure the text into our schema
    console.log(`Starting AI extraction on ${promptText.length} characters...`);
    const startTime = Date.now();
    
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are an expert construction quotation auditor. 
Extract all line items from the provided quotation text and format them as a JSON array of objects.
Do not include category headers as items, but DO assign the correct 'category' to each item based on the headers.
Categories usually start with Roman numerals (e.g., "I. Phần Điện").

Return ONLY a raw JSON array matching this schema:
[
  {
    "category": "String (e.g. I. Điện - Nước)",
    "itemNo": "Number (original order/STT)",
    "name": "String",
    "unit": "String (e.g. m2, bộ, cái)",
    "quantity": "Number",
    "unitPrice": "Number",
    "totalPrice": "Number",
    "brand": "String (Extract brand name if mentioned, otherwise empty string)",
    "note": "String (Any additional specs or notes)"
  }
]

IMPORTANT: Return ONLY valid JSON. No markdown backticks, no explanations. Just the [ ... ].`
        },
        {
          role: 'user',
          content: `Extract data from this quotation:\n\n${promptText}`
        }
      ],
      temperature: 0.1,
    });

    const aiContent = response.choices[0]?.message?.content || '[]';
    
    // Clean up potential markdown code blocks returned by AI
    const cleanedJson = aiContent.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    
    let parsedData = [];
    try {
      parsedData = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error("AI returned invalid JSON:", cleanedJson);
      return NextResponse.json({ error: 'AI failed to return valid JSON format', raw: cleanedJson }, { status: 500 });
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`AI extraction completed in ${duration} seconds.`);
    
    return NextResponse.json({ success: true, data: parsedData });

  } catch (error: any) {
    console.error('Extraction error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process file' }, { status: 500 });
  }
}

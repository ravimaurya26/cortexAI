import { getModel } from "../config/llmModels.js"
import generatePdf from "../utils/generatePdf.js"
import { getFromS3 } from "../utils/getFroms3.js"
import { uploadToS3 } from "../utils/uploadToS3.js"
import { deductCredits } from "../utils/deductCredits.js";

export const pdfAgent = async (state) => {
  try {
    const llm = await getModel("pdf")
    const prompt = `
You are an expert document writer.

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return explanations.

Structure:

{
"title":"",
"subtitle":"",
"sections":[
{
"heading":"",
"points":[]
}
]
}

Generate 4-8 sections.

Each section should have 3-6 concise bullet points.

Topic:

${state.prompt}
`

    const res = await llm.invoke(prompt)

    // Remove ```json fences in case the model adds them
    const clean = res.content.replace(/```json|```/g, "").trim()
    const data = JSON.parse(clean)
    await deductCredits(state.userId , "pdf")

    const pdfBuffer = await generatePdf(data)

    const filename = `pdf-${Date.now()}.pdf`
    await uploadToS3(filename, pdfBuffer, "application/pdf")

    const expirySeconds = 10 * 60 // 10 minutes
    const downloadUrl = await getFromS3(filename, expirySeconds)

    // No indentation, otherwise markdown shows it as a code block
    const aiResponse = [
      "# PDF Generated",
      "",
      `**${data.title}**`,
      "",
      `📩 [Download PDF](${downloadUrl})`,
      "",
      "_Link expires in 10 minutes._",
    ].join("\n")

    return { ...state, aiResponse }
  } catch (error) {
    console.log(error)
    return {
      ...state,
      aiResponse: "❌ Failed to generate PDF",
    }
  }
}
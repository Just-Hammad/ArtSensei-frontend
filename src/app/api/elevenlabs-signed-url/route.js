import { getElevenLabsSignedUrl } from "@/actions/elevenlabs";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const textMode = searchParams.get("text_mode") === "true";
  const result = await getElevenLabsSignedUrl(textMode);
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

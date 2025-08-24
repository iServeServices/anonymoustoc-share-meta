// lib/og.js
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

// rough clamp by characters so we don’t overflow the card
function clampText(str, maxChars = 220) {
  const t = (str || "").trim();
  if (t.length <= maxChars) return t;
  return t.slice(0, maxChars).trimEnd() + "…";
}

export async function renderOGImage({ text, domain = "share.anonymoustoc.com" }) {
  const quote = clampText(text, 220); // ~3–6 lines depending on words

  // gradient + centered layout. satori supports flex and textAlign.
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "stretch",
          background: "linear-gradient(180deg, #E8C9F0 0%, #EAC7D8 35%, #F0D9A6 100%)",
          padding: 64,
          boxSizing: "border-box",
          fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto",
        },
        children: [
          // top spacer
          { type: "div", props: { style: { height: 12 } } },
          // centered quote block
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                padding: "0 24px",
              },
              children: {
                type: "div",
                props: {
                  style: {
                    width: "100%",
                    textAlign: "center",
                    fontSize: 64,          // adjust if your quotes tend long
                    lineHeight: 1.2,
                    color: "#0F1B2B",
                    fontWeight: 600,
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  },
                  children: quote || "A whisper from AnonymousToc",
                },
              },
            },
          },
          // footer row
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#0F1B2B",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: { fontSize: 28, fontWeight: 600, opacity: 0.9 },
                    children: "AnonymousToc",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: { fontSize: 24, opacity: 0.75 },
                    children: domain,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [], // optional: embed a font if you want exact look
    }
  );

  const png = new Resvg(svg, {
    background: "rgba(0,0,0,0)",
    fitTo: { mode: "width", value: 1200 },
  }).render().asPng();

  return new Response(png, {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000, immutable" },
  });
}

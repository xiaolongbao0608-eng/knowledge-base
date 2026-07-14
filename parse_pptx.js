const JSZip = require("jszip");
const fs = require("fs");
async function main() {
  const pptxPath = "C:\\Users\\Administrator\\xwechat_files\\titicoolyu_af4b\\msg\\file\\2026-07\\星期宝企业介绍_v8_最新版.pptx";
  const data = fs.readFileSync(pptxPath);
  const zip = await JSZip.loadAsync(data);
  const slideFiles = Object.keys(zip.files)
    .filter(f => f.startsWith("ppt/slides/slide") && f.endsWith(".xml"))
    .sort();
  console.log("=== Total slides:", slideFiles.length);
  for (const slideFile of slideFiles) {
    const content = await zip.files[slideFile].async("text");
    const texts = [];
    const regex = /<a:t[^>]*>([^<]+)<\/a:t>/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      texts.push(match[1].trim());
    }
    console.log("\n--- " + slideFile + " ---");
    console.log(texts.filter(t => t.length > 0).join("\n"));
  }
}
main().catch(console.error);

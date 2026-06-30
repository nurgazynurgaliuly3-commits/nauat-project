import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { uploadSupabaseImage } from "@/lib/supabase";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл табылмады" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Тек сурет файлын жүктеуге болады" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Фото көлемі 5 МБ-тан аспауы керек" }, { status: 400 });
  }

  const extension = path.extname(file.name).toLowerCase() || ".png";
  const safeName = path.basename(file.name, extension).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const name = `uploads/${Date.now()}-${safeName || "image"}${extension}`;
  const supabasePath = await uploadSupabaseImage(file, name);

  if (supabasePath) {
    return NextResponse.json({ path: supabasePath });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public", "images", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const localName = path.basename(name);
  await fs.writeFile(path.join(uploadDir, localName), bytes);

  return NextResponse.json({ path: `/images/uploads/${localName}` });
}

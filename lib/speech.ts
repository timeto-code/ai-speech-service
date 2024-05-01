import prisma from "./prisma";
import fs from "fs/promises";
import path from "path";

export const saveSpeechAndXml = async (
  filename: string,
  voice: string,
  sectionPreview: boolean
) => {
  await prisma.speech.create({
    data: {
      title: filename,
      voice,
      speech_url: `/speech${sectionPreview ? "/temp" : ""}/${filename}.wav`,
      text_url: `/speech${sectionPreview ? "/temp" : ""}/${filename}.xml`,
    },
  });
};

export const createLocalTextFile = async (title: string, content: string) => {
  const filePath = path.join(process.cwd(), "public/speech", `${title}.txt`);
  await fs.writeFile(filePath, content);
};

export const getLatestSpeech = async () => {
  return await prisma.speech.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });
};

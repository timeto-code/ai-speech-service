import prisma from "./prisma";

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

export const getLatestSpeech = async () => {
  return await prisma.speech.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });
};

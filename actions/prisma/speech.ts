import prisma from "../../util/prisma";

export const createSpeech = async (filename: string, voice: string, sectionPreview: boolean) => {
  try {
    await prisma.speech.create({
      data: {
        title: filename,
        voice,
        speech_url: `/speech${sectionPreview ? "/section" : "/chapter"}/${filename}.wav`,
        text_url: `/speech${sectionPreview ? "/section" : "/chapter"}/${filename}.xml`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getLatestSpeech = async () => {
  try {
    const speech = await prisma.speech.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return speech;
  } catch (error) {
    throw error;
  }
};
